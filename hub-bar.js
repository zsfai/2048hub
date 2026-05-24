(function () {
    if (window.self !== window.top) return;

    var script = document.currentScript;
    if (!script) {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src && scripts[i].src.indexOf('hub-bar.js') !== -1) {
                script = scripts[i];
                break;
            }
        }
    }
    if (!script) return;

    var cssHref = script.src.replace(/hub-bar\.js(\?.*)?$/, 'hub-bar.css');
    if (!document.querySelector('link[data-hub-bar]')) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        link.setAttribute('data-hub-bar', '');
        document.head.appendChild(link);
    }

    var title = script.getAttribute('data-hub-title') || '';
    if (!title) {
        title = document.title.replace(/\s*\|\s*2048Hub\s*$/i, '').trim();
    }

    function escapeHtml(text) {
        var node = document.createElement('span');
        node.textContent = text;
        return node.innerHTML;
    }

    function init() {
        if (document.getElementById('hub-bar')) return;

        document.documentElement.classList.add('hub-bar-active');

        var bar = document.createElement('header');
        bar.id = 'hub-bar';
        bar.className = 'hub-bar';
        bar.innerHTML =
            '<div class="hub-bar-inner">' +
                '<a href="https://2048hub.com/" class="hub-bar-logo" aria-label="Back to 2048 Hub">' +
                    '<span class="hub-bar-logo-num">2048</span><span class="hub-bar-logo-text">Hub</span>' +
                '</a>' +
                (title ? '<span class="hub-bar-divider"></span><span class="hub-bar-title">' + escapeHtml(title) + '</span>' : '') +
            '</div>';

        document.body.appendChild(bar);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
