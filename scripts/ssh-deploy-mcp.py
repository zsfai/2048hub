#!/usr/bin/env python3
"""MCP server for remote SSH deployment.

Provides tools: ssh_run, ssh_check, ssh_upload, ssh_deploy, ssh_systemd, ssh_info.

Configuration (priority order):
  1. .ssh-deploy.json in project root
  2. environment variables: SSH_DEPLOY_HOST, SSH_DEPLOY_USER, SSH_DEPLOY_PORT,
     SSH_DEPLOY_KEY, SSH_DEPLOY_PASSWORD

Example .ssh-deploy.json:
  {
      "default_host": "your-server-ip",
      "user": "deploy",
      "port": 22,
      "key_file": "/home/user/.ssh/id_rsa"
  }
"""

import asyncio
import json
import os
import sys
import tarfile
import tempfile
from pathlib import Path

import paramiko
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

server = Server("ssh-deploy")


def _load_config() -> dict:
    cfg_path = Path(os.environ.get(
        "SSH_DEPLOY_CFG",
        str(Path(__file__).resolve().parents[1] / ".ssh-deploy.json"),
    ))
    if cfg_path.is_file():
        return json.loads(cfg_path.read_text(encoding="utf-8"))
    return {}


def _default_conn(cfg: dict, host: str = "") -> tuple[str, str, int, str, str]:
    host = host or cfg.get("default_host", os.environ.get("SSH_DEPLOY_HOST", ""))
    user = cfg.get("user") or os.environ.get("SSH_DEPLOY_USER", "")
    port = int(cfg.get("port", os.environ.get("SSH_DEPLOY_PORT", "22")))
    key = cfg.get("key_file") or os.environ.get("SSH_DEPLOY_KEY", "")
    pwd = cfg.get("password") or os.environ.get("SSH_DEPLOY_PASSWORD", "")
    if not host or not user:
        raise ValueError(
            "Missing host/user – set SSH_DEPLOY_HOST / SSH_DEPLOY_USER "
            "or create a .ssh-deploy.json file in the project root"
        )
    return host, user, port, key, pwd


def _connect(cfg: dict, host: str = "") -> paramiko.SSHClient:
    h, u, p, k, pw = _default_conn(cfg, host)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    if k:
        client.connect(h, port=p, username=u, key_filename=k, timeout=30)
    else:
        client.connect(h, port=p, username=u, password=pw, timeout=30)
    return client


def _cmd(cfg, host, command, timeout=60):
    client = _connect(cfg, host)
    try:
        _, stdout, stderr = client.exec_command(command, timeout=timeout)
        out = stdout.read().decode("utf-8", errors="replace")
        err = stderr.read().decode("utf-8", errors="replace")
        return out, err
    finally:
        client.close()


def _upload_via_sftp(cfg, local, remote, host=""):
    client = _connect(cfg, host)
    try:
        sftp = client.open_sftp()
        sftp.put(str(local), str(remote))
        sftp.close()
    finally:
        client.close()


# ---- MCP tools ---------------------------------------------------------

@server.tool()
async def ssh_check(host: str = "") -> str:
    """Test SSH connectivity to the remote server. Returns connection info or error."""
    cfg = _load_config()
    h, u, p, k, _ = _default_conn(cfg, host)
    client = _connect(cfg, host)
    client.exec_command("true")
    client.close()
    uname_out, _ = _cmd(cfg, host, "uname -nrs", 5)
    return f"Connected to {h}:{p} as {u}\nServer: {uname_out.strip()}"


@server.tool()
async def ssh_run(command: str, host: str = "", timeout: int = 60) -> str:
    """Execute a shell command on the remote server via SSH. Returns stdout and stderr."""
    cfg = _load_config()
    out, err = _cmd(cfg, host, command, timeout)
    return json.dumps({"stdout": out, "stderr": err}, ensure_ascii=False)


@server.tool()
async def ssh_upload(local: str, remote: str, host: str = "") -> str:
    """Upload a local file to the remote server via SFTP. Create parent dirs first with ssh_run mkdir."""
    cfg = _load_config()
    _upload_via_sftp(cfg, local, remote, host)
    return f"Uploaded {local} -> {remote}"


@server.tool()
async def ssh_deploy(
    src: str,
    dest: str,
    host: str = "",
    exclude: str = ".git,node_modules,.cache,__pycache__",
) -> str:
    """Deploy a local directory to the remote server via tarball upload + extract.
    Creates dest dir with sudo; deletes tarball after extract.
    Default excluded patterns: .git, node_modules, .cache, __pycache__"""
    cfg = _load_config()
    src_path = Path(src).resolve()
    if not src_path.is_dir():
        return f"Error: {src} is not a directory"

    tmp_name = f"_sshdeploy_{src_path.name}.tar.gz"
    remote_tmp = f"/tmp/{tmp_name}"

    # Create local tar
    exclude_list = [x.strip() for x in exclude.split(",") if x.strip()]

    def _filter(info):
        for pat in exclude_list:
            if info.name == pat or any(p == pat for p in Path(info.name).parts):
                return None
        return info

    with tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False) as f:
        local_tmp = f.name
    try:
        with tarfile.open(local_tmp, "w:gz") as tar:
            tar.add(src_path, arcname=src_path.name, filter=_filter)
        _upload_via_sftp(cfg, local_tmp, remote_tmp, host)
        out, err = _cmd(
            cfg,
            host,
            f"sudo mkdir -p {dest} && "
            f"sudo tar -xzf {remote_tmp} -C {dest} --strip-components=1 && "
            f"sudo rm -f {remote_tmp}",
        )
        return json.dumps({"stdout": out.strip(), "stderr": err.strip()}, ensure_ascii=False)
    finally:
        try:
            os.remove(local_tmp)
        except OSError:
            pass


@server.tool()
async def ssh_systemd(action: str, service: str, host: str = "") -> str:
    """Manage a systemd service on the remote server.
    action: start, stop, restart, enable, disable, status, reload"""
    cfg = _load_config()
    valid = {"start", "stop", "restart", "enable", "disable", "status", "reload"}
    if action not in valid:
        return f"Invalid action '{action}'. Choose: {', '.join(sorted(valid))}"
    out, err = _cmd(cfg, host, f"sudo systemctl {action} {service}", timeout=30)
    return json.dumps({"stdout": out, "stderr": err}, ensure_ascii=False)


@server.tool()
async def ssh_info(host: str = "") -> str:
    """Fetch system info from remote: OS, memory, disk, docker, nginx, uptime."""
    cfg = _load_config()
    queries = {
        "os": "cat /etc/os-release 2>/dev/null | head -4",
        "memory": "free -h 2>/dev/null | head -2",
        "disk": "df -h / 2>/dev/null",
        "docker": "docker ps --format 'table {{.Names}}\t{{.Status}}' 2>/dev/null | head -10",
        "nginx": "systemctl is-active nginx 2>/dev/null; nginx -v 2>&1",
        "uptime": "uptime",
    }
    info = {}
    for key, cmd in queries.items():
        out, err = _cmd(cfg, host, cmd, 15)
        info[key] = (out.strip() or err.strip()).strip() or "N/A"
    return json.dumps(info, indent=2, ensure_ascii=False)


@server.tool()
async def ssh_install(packages: str, host: str = "") -> str:
    """Install packages on the remote server via apt (Debian/Ubuntu). Runs sudo apt update && sudo apt install -y."""
    cfg = _load_config()
    pkg_list = packages.replace(",", " ").strip()
    out, err = _cmd(cfg, host, f"sudo apt-get update -qq && sudo apt-get install -y {pkg_list}", timeout=300)
    return json.dumps({"stdout": out, "stderr": err}, ensure_ascii=False)


@server.tool()
async def ssh_nginx_site(
    domain: str,
    root: str,
    host: str = "",
    action: str = "create",
) -> str:
    """Create or remove a simple static-site nginx config on the remote server.
    Writes to /etc/nginx/sites-available/{domain} and symlinks to sites-enabled.
    action: create | remove"""
    cfg = _load_config()
    conf = (f"/etc/nginx/sites-available/{domain}", f"/etc/nginx/sites-enabled/{domain}")
    if action == "remove":
        out, err = _cmd(
            cfg, host,
            f"sudo rm -f {conf[0]} {conf[1]} && sudo nginx -t && sudo systemctl reload nginx",
        )
        return json.dumps({"stdout": out, "stderr": err}, ensure_ascii=False)

    nginx_conf = (
        f"server {{\n"
        f"    listen 80;\n"
        f"    server_name {domain};\n"
        f"    root {root};\n"
        f"    index index.html;\n"
        f"    location / {{\n"
        f"        try_files $uri $uri/ =404;\n"
        f"    }}\n"
        f"    location ~* \\.(js|css|png|jpg|svg|ico|woff2?)$ {{\n"
        f"        expires 30d;\n"
        f"        add_header Cache-Control \"public, immutable\";\n"
        f"    }}\n"
        f"}}\n"
    )
    out, err = _cmd(
        cfg, host,
        f"echo '{nginx_conf}' | sudo tee {conf[0]} > /dev/null && "
        f"sudo ln -sf {conf[0]} {conf[1]} && "
        f"sudo nginx -t && sudo systemctl reload nginx",
    )
    return json.dumps({"stdout": out, "stderr": err}, ensure_ascii=False)


async def main():
    async with stdio_server(server) as (read_stream, write_stream):
        await server.run(read_stream, write_stream, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
