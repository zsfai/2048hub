// Game configuration data
const games = [
    {
        id: 'classic-2048',
        title: '2048 Classique',
        description: 'Le 2048 original, facile pour débutants',
        icon: '🔢',
        url: 'https://2048hub.com/fr/classic-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'taylor-swift-2048',
        title: 'Taylor Swift 2048',
        description: '2048 thème Taylor Swift, pour tous les âges',
        icon: '🎤',
        url: 'https://2048hub.com/fr/taylor-swift-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-cupcakes',
        title: '2048 Cupcakes',
        description: '2048 cupcakes adorables',
        icon: '🧁',
        url: 'https://2048hub.com/fr/2048-cupcakes/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-cupcakes-christmas',
        title: '2048 Cupcakes Noël',
        description: 'Cupcakes de Noël en 2048',
        icon: '🎄',
        url: 'https://2048hub.com/fr/2048cupcakes-christmas/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-princess',
        title: '2048 Princess',
        description: 'Fusionnez pour révéler les princesses Disney',
        icon: '👸',
        url: 'https://2048hub.com/fr/2048-princess/',
        iframe: true,
        isNew: true
    },
    {
        id: '2048-cats',
        title: '2048 Cats',
        description: 'Chats par noblesse jusqu\'au Chat Royal',
        icon: '🐱',
        url: 'https://2048hub.com/fr/2048-cats/',
        iframe: true,
        isNew: true
    },
    {
        id: '2048-minecraft',
        title: '2048 Minecraft',
        description: 'Blocs Minecraft jusqu a 2048',
        icon: '🟩',
        url: 'https://2048hub.com/fr/2048-minecraft/',
        iframe: true,
        isNew: true
    },
    {
        id: 'couch-2048',
        title: 'Couch 2048',
        description: '2048 relaxant par glisser-déposer',
        icon: '🛋️',
        url: 'https://2048hub.com/fr/couch-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'card-2048',
        title: 'Card 2048',
        description: '2048 avec cartes à jouer',
        icon: '🃏',
        url: 'https://2048hub.com/fr/card-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-byd-cars',
        title: '2048 BYD Cars',
        description: 'Voitures BYD en 2048',
        icon: '🚗',
        url: 'https://2048hub.com/fr/byd-cars/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'flappy-2048',
        title: 'Flappy 2048',
        description: 'Flappy Bird rencontre 2048',
        icon: '🐦',
        url: 'https://2048hub.com/fr/flappy-2048/',
        iframe: true,
        isNew: true
    },
    {
        id: 'doge-2048',
        title: 'Doge 2048',
        description: 'Mèmes Doge en 2048',
        icon: '🐶',
        url: 'https://2048hub.com/fr/doge-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-remastered',
        title: '2048 Remastered',
        description: '2048 remasterisé, meilleurs graphismes',
        icon: '🎮',
        url: 'https://2048hub.com/fr/2048-remastered/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'hex-2048',
        title: 'Hex 2048',
        description: '2048 sur grille hexagonale',
        icon: '⬡',
        url: 'https://2048hub.com/fr/hex-2048/', // Replace with actual game URL
        iframe: true
    }
];

// DOM elements (will be initialized after DOM loads)
let gameList, gameContainer, gameHeader, currentGameTitle, backBtn, gameFrameContainer, guideContent;

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
    guideContent = document.getElementById('guideContent');
    
    renderGameList();
    renderHubGuides(document.getElementById('guideArticlesList'));
    setupEventListeners();
    setupSidebarCollapse();
    setupKeyboardNavigation();
    
    // Check initial hash on page load (after DOM is ready)
    // Use setTimeout to ensure all DOM elements are fully initialized
    setTimeout(function() {
        handleHashChange();
    }, 100);
});

// Render game list in sidebar
function renderGameList() {
    if (!gameList) return;
    gameList.innerHTML = '';
    
    games.forEach(game => {
        const gameItem = document.createElement('li');
        gameItem.className = 'game-item';
        gameItem.dataset.gameId = game.id;
        
        const newBadge = game.isNew ? '<span class="new-badge">NOUVEAU</span>' : '';
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
        backBtn.addEventListener('click', showWelcome);
    }
    
    // Setup quick game links
    setupQuickGameLinks();
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

// Setup quick game links event listeners
function setupQuickGameLinks() {
    const gameLinkItems = document.querySelectorAll('.game-link-item');
    gameLinkItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const gameId = this.dataset.gameId;
            if (gameId) {
                selectGame(gameId);
            } else {
                location.href = this.href;
            }
        });
    });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentGame) {
            showWelcome();
        }
    });
}

// Select game
function selectGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    
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
    
    window.location.hash = gameId;
}

// Show game
function showGame(game) {
    if (!currentGameTitle || !gameHeader || !gameFrameContainer) return;
    
    currentGameTitle.textContent = game.title;
    gameHeader.style.display = 'flex';
    
    // Hide welcome message and guide content
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    if (guideContent) {
        guideContent.style.display = 'none';
    }
    
    // Clear any existing iframe content
    const existingIframe = gameFrameContainer.querySelector('.game-iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    const existingLoading = gameFrameContainer.querySelector('.loading');
    if (existingLoading) {
        existingLoading.remove();
    }
    
    if (game.iframe) {
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
        
        // Function to hide loading
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
        
        // Set iframe src after setting up event handlers
        // This ensures onload can fire properly
        iframe.onload = function() {
            // onload fires when iframe document is loaded
            hideLoading();
        };
        
        // Fallback: Check iframe periodically (for cases where onload might not fire immediately)
        // This is especially useful for cross-origin iframes
        let checkCount = 0;
        const maxChecks = 30; // 3 seconds max wait
        loadCheckInterval = setInterval(function() {
            checkCount++;
            
            // Try to detect if iframe has loaded
            try {
                // For same-origin: check document readyState
                if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                    hideLoading();
                    return;
                }
            } catch (e) {
                // Cross-origin: can't access, but onload should fire
                // If onload hasn't fired after reasonable time, assume loaded
                if (checkCount >= 15) { // 1.5 seconds
                    hideLoading();
                    return;
                }
            }
            
            // Safety timeout: hide loading after max time
            if (checkCount >= maxChecks) {
                hideLoading();
            }
        }, 100);
        
        // iframe error handling
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
        
        // Set src after all handlers are set up
        iframe.src = game.url;
        gameFrameContainer.appendChild(iframe);
    } else {
        // External link mode
        gameFrameContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 30px; color: #666;">
                <div style="font-size: 4rem; margin-bottom: 20px;">${game.icon}</div>
                <h3 style="color: #2c3e50; margin-bottom: 15px;">${game.title}</h3>
                <p style="margin-bottom: 30px; color: #7f8c8d;">${game.description}</p>
                <button onclick="window.open('${game.url}', '_blank')" 
                        style="padding: 15px 30px; background: linear-gradient(135deg, #4ecdc4, #44a08d); color: white; border: none; border-radius: 25px; font-size: 1.1rem; cursor: pointer; transition: transform 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'">
                    Start Game →
                </button>
            </div>
        `;
    }
}

// Show welcome message
function showWelcome(clearHash = true) {
    currentGame = null;
    if (gameHeader) {
        gameHeader.style.display = 'none';
    }
    
    // Show welcome message and guide content
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'flex';
    }
    if (guideContent) {
        guideContent.style.display = 'block';
    }
    
    // Remove any existing iframe content
    if (gameFrameContainer) {
        const existingIframe = gameFrameContainer.querySelector('.game-iframe');
        if (existingIframe) {
            existingIframe.remove();
        }
        const existingLoading = gameFrameContainer.querySelector('.loading');
        if (existingLoading) {
            existingLoading.remove();
        }
    }
    
    // Remove active state from all game items
    document.querySelectorAll('.game-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show sidebar on mobile when returning to home
    var sidebar = document.querySelector('.sidebar');
    var mainContent = document.querySelector('.main-content');
    if (window.innerWidth <= 768) {
        if (sidebar) {
            sidebar.classList.remove('sidebar-game-hidden');
        }
        if (mainContent) {
            var app = document.querySelector('.app-container');
            if (app && app.classList.contains('sidebar-collapsed')) {
                mainContent.style.paddingBottom = '52px';
            } else if (window.innerWidth <= 480) {
                mainContent.style.paddingBottom = '85px';
            } else {
                mainContent.style.paddingBottom = '90px';
            }
        }
    }
    
    // Setup quick game links again (in case content was recreated)
    setupQuickGameLinks();
    
    // Clear URL hash only if explicitly requested (e.g., when user clicks Home button)
    if (clearHash) {
        window.history.replaceState(null, null, window.location.pathname);
    }
}

// Handle URL hash changes for direct game access
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && games.find(g => g.id === hash)) {
        // Game found, select it
        selectGame(hash);
    } else if (hash) {
        // If hash exists but game not found, show welcome without clearing hash
        console.warn('Game not found for hash:', hash);
        showWelcome(false);
    } else {
        // No hash, show welcome and clear any existing hash
        showWelcome(true);
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
