// Game configuration data
const games = [
    {
        id: 'classic-2048',
        title: 'Classic 2048',
        description: 'Original 2048 game, simple and easy to learn for beginners',
        icon: '🔢',
        url: '/classic-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'flower-field',
        title: '2048 Flower Field',
        description: 'Merge seeds into blooms and collect gentle flower messages',
        icon: '🌼',
        url: '/flower-field/',
        iframe: true,
        isNew: true
    },
    {
        id: 'taylor-swift-2048',
        title: 'Taylor Swift 2048',
        description: 'Taylor Swift 2048 game with Taylor Swift theme, perfect for all ages',
        icon: '🎤',
        url: '/taylor-swift-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-cupcakes',
        title: '2048 Cupcakes',
        description: 'Classic 2048 game with adorable cupcake theme, perfect for all ages',
        icon: '🧁',
        url: '/2048-cupcakes/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-cupcakes-christmas',
        title: '2048 Cupcakes Christmas',
        description: '2048 Cupcakes Christmas game with Christmas theme, perfect for all ages',
        icon: '🎄',
        url: '/2048cupcakes-christmas/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-princess',
        title: '2048 Princess',
        description: 'Merge tiles to reveal Disney princesses in a rose pink theme',
        icon: '👸',
        url: '/2048-princess/',
        iframe: true,
        isNew: true
    },
    {
        id: '2048-cats',
        title: '2048 Cats',
        description: 'Merge cats by nobility from alley kitten to Royal Cat',
        icon: '🐱',
        url: '/2048-cats/',
        iframe: true,
        isNew: true
    },
    {
        id: '2048-minecraft',
        title: '2048 Minecraft',
        description: 'Combine Minecraft blocks in this themed 2048 game to reach 2048',
        icon: '🟩',
        url: '/2048-minecraft/',
        iframe: true,
        isNew: true
    },
    {
        id: 'couch-2048',
        title: 'Couch 2048',
        description: 'Couch 2048 game with couch theme, perfect for all ages',
        icon: '🛋️',
        url: '/couch-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'card-2048',
        title: 'Card 2048',
        description: 'Card 2048 game with card numbers, perfect for all ages',
        icon: '🃏',
        url: '/card-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-byd-cars',
        title: '2048 BYD Cars',
        description: '2048 Cars Game with BYD Cars theme, perfect for all ages',
        icon: '🚗',
        url: '/byd-cars/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'flappy-2048',
        title: 'Flappy 2048',
        description: 'Flappy Bird meets 2048—fly through pipes while merging numbered tiles',
        icon: '🐦',
        url: '/flappy-2048/',
        iframe: true,
        isNew: true
    },
    {
        id: 'doge-2048',
        title: 'Doge 2048',
        description: 'Doge 2048 game with Doge meme tiles, perfect for all ages',
        icon: '🐶',
        url: '/doge-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-remastered',
        title: '2048 Remastered',
        description: '2048 Remastered game with 2048 theme, perfect for all ages',
        icon: '🎮',
        url: '/2048-remastered/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'hex-2048',
        title: 'Hex 2048',
        description: 'Hexagonal grid 2048 variant with more strategic gameplay',
        icon: '⬡',
        url: '/hex-2048/',
        iframe: true
    },
    {
        id: 'schulte-grid',
        title: 'Schulte Grid',
        description: 'Focus training — tap numbers in order as fast as you can',
        icon: '🧠',
        url: '/schulte-grid/',
        iframe: true
    },
    {
        id: 'parity',
        title: 'Parity',
        description: 'Puzzle game of flipping tiles to match parity',
        icon: '◐',
        url: '/parity/',
        iframe: true
    },
    {
        id: '8-puzzle',
        title: '8 Puzzle',
        description: 'Classic sliding tile puzzle',
        icon: '🧩',
        url: '/8-puzzle/',
        iframe: true
    },
    {
        id: 'astro-math',
        title: 'Astro Math',
        description: 'Math & space shooting game',
        icon: '🚀',
        url: '/astro-math/',
        iframe: true,
        isNew: true
    },
    {
        id: 'breakout',
        title: 'Breakout',
        description: 'Classic brick-breaker arcade',
        icon: '🧱',
        url: '/breakout/',
        iframe: true
    },
    {
        id: 'chromedino',
        title: 'Chrome Dino',
        description: 'Offline dinosaur runner',
        icon: '🦖',
        url: '/chromedino/',
        iframe: true
    },
    {
        id: 'geometrydash',
        title: 'Geometry Dash',
        description: 'Rhythm platform jumper',
        icon: '📐',
        url: '/geometrydash/',
        iframe: true
    },
    {
        id: 'captaincallisto',
        title: 'Captain Callisto',
        description: 'Space adventure platformer',
        icon: '🚀',
        url: '/captaincallisto/',
        iframe: true
    },
    {
        id: 'blackholesquare',
        title: 'Black Hole Square',
        description: 'Gravity puzzle with black holes',
        icon: '🕳️',
        url: '/blackholesquare/',
        iframe: true
    },
    {
        id: 'xx142-b2exe',
        title: 'xx142-b2.exe',
        description: 'Retro puzzle / adventure',
        icon: '💾',
        url: '/xx142-b2exe/',
        iframe: true
    },
    {
        id: 'out-of-control-ark',
        title: 'Out of Control Ark',
        description: 'Chaotic ark action game',
        icon: '🚢',
        url: '/out-of-control-ark/',
        iframe: false,
        isNew: true
    },
    {
        id: 'pacman-3d',
        title: 'Pac-Man 3D',
        description: '3D Pac-Man arcade',
        icon: '👻',
        url: '/pacman-3d/',
        iframe: false,
        isNew: true
    },
    {
        id: 'volley-random-unblocked',
        title: 'Volley Random Unblocked',
        description: 'Physics volleyball game',
        icon: '🏐',
        url: '/volley-random-unblocked/',
        iframe: false,
        isNew: true
    },
    {
        id: 'basket-random-unblocked',
        title: 'Basket Random Unblocked',
        description: 'Physics basketball game',
        icon: '🏀',
        url: '/basket-random-unblocked/',
        iframe: false,
        isNew: true
    },
    {
        id: 'basketball-legends-unblocked',
        title: 'Basketball Legends Unblocked',
        description: 'Arcade basketball legends',
        icon: '🏀',
        url: '/basketball-legends-unblocked/',
        iframe: false,
        isNew: true
    },
    {
        id: 'boxing-random-unblocked',
        title: 'Boxing Random Unblocked',
        description: 'Physics boxing game',
        icon: '🥊',
        url: '/boxing-random-unblocked/',
        iframe: false,
        isNew: true
    },
    {
        id: 'monkey-mart',
        title: 'Monkey Mart Unblocked',
        description: 'Supermarket tycoon — plant, stock, serve',
        icon: '🐵',
        url: '/monkey-mart/',
        iframe: false,
        isNew: true
    }
];

var DEFAULT_GAME_ID = 'classic-2048';

// DOM elements (will be initialized after DOM loads)
let gameList, gameContainer, gameHeader, currentGameTitle, backBtn, gameFrameContainer;

let currentGame = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    gameList = document.getElementById('gameList');
    gameContainer = document.getElementById('gameContainer');
    gameHeader = document.getElementById('gameHeader');
    currentGameTitle = document.getElementById('currentGameTitle');
    backBtn = document.getElementById('backBtn');
    gameFrameContainer = document.getElementById('gameFrameContainer');
    
    try {
        renderGameList();
    } catch (e) {
        console.error('renderGameList failed', e);
    }
    try {
        if (typeof renderHubGuides === 'function') {
            renderHubGuides(document.getElementById('guideArticlesList'));
        }
    } catch (e) {
        console.error('renderHubGuides failed', e);
    }
    setupEventListeners();
    setupSidebarCollapse();
    setupKeyboardNavigation();

    // Play immediately — do not wait on unrelated UI
    handleHashChange();
});

// Render game list in sidebar
function renderGameList() {
    if (!gameList) return;
    gameList.innerHTML = '';
    
    games.forEach(game => {
        const gameItem = document.createElement('li');
        gameItem.className = 'game-item';
        gameItem.dataset.gameId = game.id;
        
        const newBadge = game.isNew ? '<span class="new-badge">NEW</span>' : '';
        gameItem.innerHTML = `
            ${newBadge}
            <span class="game-icon">${game.icon}</span>
            <div class="game-info">
                <div class="game-title">${game.title}</div>
                <div class="game-description">${game.description}</div>
            </div>
        `;
        
        gameItem.addEventListener('click', () => selectGame(game.id));
        gameList.appendChild(gameItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            selectGame(DEFAULT_GAME_ID);
        });
    }
}

function setupSidebarCollapse() {
    var btn = document.getElementById('sidebarCollapseBtn');
    var app = document.querySelector('.app-container');
    if (!btn || !app) return;

    if (localStorage.getItem('hubSidebarCollapsed') === '1') {
        app.classList.add('sidebar-collapsed');
    }
    syncSidebarCollapseUI(btn, app);

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        app.classList.toggle('sidebar-collapsed');
        localStorage.setItem('hubSidebarCollapsed', app.classList.contains('sidebar-collapsed') ? '1' : '0');
        syncSidebarCollapseUI(btn, app);
    });
}

function syncSidebarCollapseUI(btn, app) {
    var collapsed = app.classList.contains('sidebar-collapsed');
    var expandLabel = btn.getAttribute('data-label-expand') || 'Expand game menu';
    var collapseLabel = btn.getAttribute('data-label-collapse') || 'Collapse game menu';

    btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    btn.setAttribute('aria-label', collapsed ? expandLabel : collapseLabel);
    btn.title = collapsed ? expandLabel : collapseLabel;
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentGame && currentGame.id !== DEFAULT_GAME_ID) {
            selectGame(DEFAULT_GAME_ID);
        }
    });
}

// Select game
function selectGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    // Full-page games (Defold / fullscreen shells) leave the hub shell
    if (game.iframe === false) {
        window.location.href = game.url;
        return;
    }
    
    currentGame = game;
    
    // Update game item states
    document.querySelectorAll('.game-item').forEach(item => {
        item.classList.remove('active');
    });
    const targetGameItem = document.querySelector(`[data-game-id="${gameId}"]`);
    if (targetGameItem) {
        targetGameItem.classList.add('active');
    }
    
    // Show game
    showGame(game);
    
    if (window.location.hash.substring(1) !== gameId) {
        window.location.hash = gameId;
    }
}

// Show game
function showGame(game) {
    if (!currentGameTitle || !gameHeader || !gameFrameContainer) return;
    
    currentGameTitle.textContent = game.title;
    gameHeader.style.display = 'flex';
    
    // Reset frame (remove placeholder / previous iframe / spinner)
    gameFrameContainer.innerHTML = '';

    var sidebar = document.querySelector('.sidebar');
    var mainContent = document.querySelector('.main-content');
    if (window.innerWidth <= 768) {
        if (sidebar) {
            sidebar.classList.add('sidebar-game-hidden');
        }
        if (mainContent) {
            mainContent.style.paddingBottom = '0';
        }
    }
    
    // Show loading animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="spinner"></div>';
    gameFrameContainer.appendChild(loading);
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'game-iframe';
    iframe.title = game.title;
    iframe.allow = 'fullscreen';
    
    let loadingHidden = false;
    let loadCheckInterval = null;
    
    function hideLoading() {
        if (!loadingHidden && loading.parentNode) {
            loadingHidden = true;
            if (loadCheckInterval) {
                clearInterval(loadCheckInterval);
                loadCheckInterval = null;
            }
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.2s ease';
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.remove();
                }
            }, 200);
        }
    }
    
    iframe.onload = function() {
        hideLoading();
    };
    
    let checkCount = 0;
    const maxChecks = 30;
    loadCheckInterval = setInterval(function() {
        checkCount++;
        try {
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                hideLoading();
                return;
            }
        } catch (e) {
            if (checkCount >= 15) {
                hideLoading();
                return;
            }
        }
        if (checkCount >= maxChecks) {
            hideLoading();
        }
    }, 100);
    
    iframe.onerror = function() {
        if (loadCheckInterval) {
            clearInterval(loadCheckInterval);
            loadCheckInterval = null;
        }
        loading.innerHTML = `
            <div style="text-align: center; color: #666; padding: 40px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
                <h3 style="color: #2c3e50; margin-bottom: 15px;">Game Loading Failed</h3>
                <p style="margin-bottom: 25px; color: #7f8c8d;">Unable to connect to the game server. Please try again later.</p>
                <button onclick="window.open('${game.url}', '_blank')" 
                        style="padding: 12px 24px; background: linear-gradient(135deg, #4ecdc4, #44a08d); color: white; border: none; border-radius: 25px; font-size: 1rem; cursor: pointer; transition: transform 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'">
                    Open in New Window
                </button>
            </div>
        `;
    };
    
    iframe.src = game.url;
    gameFrameContainer.appendChild(iframe);
}

// Home / fallback: always play the default game
function showWelcome() {
    selectGame(DEFAULT_GAME_ID);
}

// Handle URL hash changes for direct game access
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && games.find(g => g.id === hash && g.iframe !== false)) {
        selectGame(hash);
    } else if (hash && games.find(g => g.id === hash && g.iframe === false)) {
        // Full-page game deep link: go straight to its page
        window.location.href = games.find(g => g.id === hash).url;
    } else {
        selectGame(DEFAULT_GAME_ID);
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Add new game function (for future expansion)
function addGame(gameData) {
    // Validate game data
    if (!gameData.id || !gameData.title || !gameData.url) {
        console.error('Incomplete game data');
        return false;
    }
    
    // Check if game with same ID already exists
    if (games.find(g => g.id === gameData.id)) {
        console.error('Game ID already exists');
        return false;
    }
    
    // Add default values
    const newGame = {
        icon: gameData.icon || '🎮',
        description: gameData.description || 'An interesting 2048 game',
        iframe: gameData.iframe !== false, // Default to true
        ...gameData
    };
    
    games.push(newGame);
    renderGameList();
    return true;
}

// Remove game function
function removeGame(gameId) {
    const index = games.findIndex(g => g.id === gameId);
    if (index > -1) {
        games.splice(index, 1);
        renderGameList();
        
        // If currently showing the removed game, return to welcome
        if (currentGame && currentGame.id === gameId) {
            showWelcome();
        }
        return true;
    }
    return false;
}

// Get all games
function getAllGames() {
    return [...games];
}

// Get game by ID
function getGameById(gameId) {
    return games.find(g => g.id === gameId);
}

// Analytics tracking (placeholder for future implementation)
function trackGameSelection(gameId) {
    // Placeholder for analytics tracking
    console.log('Game selected:', gameId);
}

// Enhanced game selection with analytics
function selectGameWithTracking(gameId) {
    trackGameSelection(gameId);
    selectGame(gameId);
}

// Export functions for external use
window.GameHub = {
    addGame,
    removeGame,
    getAllGames,
    getGameById,
    selectGame: selectGameWithTracking,
    showWelcome
};
