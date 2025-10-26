// Game configuration data
const games = [
    {
        id: '2048-cupcakes',
        title: '2048 Cupcakes',
        description: 'Classic 2048 game with adorable cupcake theme, perfect for all ages',
        icon: '🧁',
        url: 'https://2048hub.com', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'taylor-swift-2048',
        title: 'Taylor Swift 2048',
        description: 'Taylor Swift 2048 game with Taylor Swift theme, perfect for all ages',
        icon: '🎤',
        url: 'https://2048hub.com/taylor-swift-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'classic-2048',
        title: 'Classic 2048',
        description: 'Original 2048 game, simple and easy to learn for beginners',
        icon: '🔢',
        url: 'https://2048hub.com/classic-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-cupcakes-christmas',
        title: '2048 Cupcakes Christmas',
        description: '2048 Cupcakes Christmas game with Christmas theme, perfect for all ages',
        icon: '🎄',
        url: 'https://2048hub.com/2048cupcakes-christmas/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'doge-2048',
        title: 'Doge 2048',
        description: 'Doge 2048 game with Doge meme tiles, perfect for all ages',
        icon: '🐶',
        url: 'https://2048hub.com/doge-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'card-2048',
        title: 'Card 2048',
        description: 'Card 2048 game with card numbers, perfect for all ages',
        icon: '🃏',
        url: 'https://2048hub.com/card-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: '2048-remastered',
        title: '2048 Remastered',
        description: '2048 Remastered game with 2048 theme, perfect for all ages',
        icon: '🎮',
        url: 'https://2048hub.com/2048-remastered/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'couch-2048',
        title: 'Couch 2048',
        description: 'Couch 2048 game with couch theme, perfect for all ages',
        icon: '🛋️',
        url: 'https://2048hub.com/couch-2048/', // Replace with actual game URL
        iframe: true
    },
    {
        id: 'hex-2048',
        title: 'Hex 2048',
        description: 'Hexagonal grid 2048 variant with more strategic gameplay',
        icon: '⬡',
        url: 'https://2048hub.com/hex-2048/', // Replace with actual game URL
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
    setupEventListeners();
    setupKeyboardNavigation();
});

// Render game list in sidebar
function renderGameList() {
    if (!gameList) return;
    gameList.innerHTML = '';
    
    games.forEach(game => {
        const gameItem = document.createElement('li');
        gameItem.className = 'game-item';
        gameItem.dataset.gameId = game.id;
        
        gameItem.innerHTML = `
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
        // Show loading animation
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="spinner"></div>';
        gameFrameContainer.appendChild(loading);
        
        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'game-iframe';
        iframe.src = game.url;
        iframe.title = game.title;
        iframe.allow = 'fullscreen';
        
        // iframe load event
        iframe.onload = function() {
            loading.remove();
            
            // Hide sidebar on mobile when game loads
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            if (window.innerWidth <= 768) {
                if (sidebar) {
                    sidebar.style.transform = 'translateY(100%)';
                    sidebar.style.transition = 'transform 0.3s ease';
                }
                if (mainContent) {
                    mainContent.style.paddingBottom = '0';
                }
            }
        };
        
        // iframe error handling
        iframe.onerror = function() {
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
function showWelcome() {
    currentGame = null;
    gameHeader.style.display = 'none';
    
    // Show welcome message and guide content
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'flex';
    }
    if (guideContent) {
        guideContent.style.display = 'block';
    }
    
    // Remove any existing iframe content
    const existingIframe = gameFrameContainer.querySelector('.game-iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    const existingLoading = gameFrameContainer.querySelector('.loading');
    if (existingLoading) {
        existingLoading.remove();
    }
    
    // Remove active state from all game items
    document.querySelectorAll('.game-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show sidebar on mobile when returning to home
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (window.innerWidth <= 768) {
        if (sidebar) {
            sidebar.style.transform = 'translateY(0)';
            sidebar.style.transition = 'transform 0.3s ease';
        }
        if (mainContent) {
            if (window.innerWidth <= 480) {
                mainContent.style.paddingBottom = '85px';
            } else {
                mainContent.style.paddingBottom = '90px';
            }
        }
    }
    
    // Setup quick game links again (in case content was recreated)
    setupQuickGameLinks();
    
    // Clear URL hash
    window.history.replaceState(null, null, window.location.pathname);
}

// Handle URL hash changes for direct game access
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && games.find(g => g.id === hash)) {
        selectGame(hash);
    } else {
        showWelcome();
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Check initial hash on page load
if (window.location.hash) {
    handleHashChange();
}

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
