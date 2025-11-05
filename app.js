// ===================================
// 🃏 RAMI FAMILIAL CLOUD - APP LOGIC
// ===================================

// Global State
let APP_STATE = {
    familyCode: null,
    players: [],
    currentGame: null,
    selectedPlayers: [],
    manches: [],
    statistics: {},
    history: []
};

// ===================================
// INITIALIZATION
// ===================================

window.onload = function() {
    console.log('🚀 Application Rami démarrée');
    loadFamilyCodeFromStorage();
    
    // Event listeners
    document.getElementById('newPlayerName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addPlayer();
    });
    
    document.getElementById('familyCodeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') setFamilyCode();
    });
};

// ===================================
// FAMILY CODE MANAGEMENT
// ===================================

function loadFamilyCodeFromStorage() {
    const savedCode = localStorage.getItem('ramiCloudFamilyCode');
    if (savedCode) {
        APP_STATE.familyCode = savedCode;
        showFamilyCodeDisplay();
        loadAllData();
    }
}

function setFamilyCode() {
    const input = document.getElementById('familyCodeInput');
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        showAlert('Veuillez entrer un code famille', 'warning');
        return;
    }
    
    if (code.length < 4) {
        showAlert('Le code doit contenir au moins 4 caractères', 'warning');
        return;
    }
    
    APP_STATE.familyCode = code;
    localStorage.setItem('ramiCloudFamilyCode', code);
    
    showFamilyCodeDisplay();
    loadAllData();
    showAlert('Code famille configuré avec succès ! 🎉', 'success');
}

function showFamilyCodeDisplay() {
    document.getElementById('familyCodeSection').classList.add('hidden');
    document.getElementById('currentFamilyCode').classList.remove('hidden');
    document.getElementById('familyCodeDisplay').textContent = APP_STATE.familyCode;
}

function changeFamilyCode() {
    if (confirm('Changer de code famille ? Vous perdrez l\'accès aux données actuelles.')) {
        APP_STATE.familyCode = null;
        localStorage.removeItem('ramiCloudFamilyCode');
        document.getElementById('familyCodeSection').classList.remove('hidden');
        document.getElementById('currentFamilyCode').classList.add('hidden');
        document.getElementById('familyCodeInput').value = '';
        
        // Reset state
        APP_STATE.players = [];
        APP_STATE.currentGame = null;
        APP_STATE.selectedPlayers = [];
        APP_STATE.manches = [];
        
        updatePlayersDisplay();
    }
}

// ===================================
// DATA LOADING
// ===================================

async function loadAllData() {
    if (!APP_STATE.familyCode) return;
    
    try {
        await Promise.all([
            loadPlayers(),
            loadCurrentGame(),
            loadStatistics(),
            loadHistory()
        ]);
        console.log('✅ Toutes les données chargées');
    } catch (error) {
        console.error('❌ Erreur de chargement:', error);
        showAlert('Erreur lors du chargement des données', 'danger');
    }
}

async function loadPlayers() {
    try {
        const response = await fetch(`tables/famille?search=${APP_STATE.familyCode}&limit=100`);
        const data = await response.json();
        
        APP_STATE.players = data.data.filter(p => p.code_famille === APP_STATE.familyCode);
        updatePlayersDisplay();
        console.log(`✅ ${APP_STATE.players.length} joueurs chargés`);
    } catch (error) {
        console.error('❌ Erreur chargement joueurs:', error);
        APP_STATE.players = [];
        updatePlayersDisplay();
    }
}

async function loadCurrentGame() {
    try {
        const response = await fetch(`tables/parties?search=${APP_STATE.familyCode}&limit=1&sort=-created_at`);
        const data = await response.json();
        
        const games = data.data.filter(g => 
            g.code_famille === APP_STATE.familyCode && 
            g.status === 'en_cours'
        );
        
        if (games.length > 0) {
            APP_STATE.currentGame = games[0];
            await loadManches();
            updateGameDisplay();
            console.log('✅ Partie en cours chargée');
        } else {
            APP_STATE.currentGame = null;
            APP_STATE.manches = [];
            updateGameDisplay();
        }
    } catch (error) {
        console.error('❌ Erreur chargement partie:', error);
    }
}

async function loadManches() {
    if (!APP_STATE.currentGame) return;
    
    try {
        const response = await fetch(`tables/manches?search=${APP_STATE.currentGame.id}&limit=100`);
        const data = await response.json();
        
        APP_STATE.manches = data.data
            .filter(m => m.partie_id === APP_STATE.currentGame.id)
            .sort((a, b) => a.numero_manche - b.numero_manche);
        
        console.log(`✅ ${APP_STATE.manches.length} manches chargées`);
    } catch (error) {
        console.error('❌ Erreur chargement manches:', error);
        APP_STATE.manches = [];
    }
}

async function loadStatistics() {
    try {
        const response = await fetch(`tables/statistiques?search=${APP_STATE.familyCode}&limit=100`);
        const data = await response.json();
        
        APP_STATE.statistics = {};
        data.data
            .filter(s => s.code_famille === APP_STATE.familyCode)
            .forEach(stat => {
                APP_STATE.statistics[stat.joueur] = stat;
            });
        
        console.log('✅ Statistiques chargées');
    } catch (error) {
        console.error('❌ Erreur chargement stats:', error);
    }
}

async function loadHistory() {
    try {
        const response = await fetch(`tables/parties?search=${APP_STATE.familyCode}&limit=50&sort=-created_at`);
        const data = await response.json();
        
        APP_STATE.history = data.data
            .filter(p => p.code_famille === APP_STATE.familyCode && p.status === 'termine')
            .sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin));
        
        console.log(`✅ ${APP_STATE.history.length} parties dans l'historique`);
    } catch (error) {
        console.error('❌ Erreur chargement historique:', error);
        APP_STATE.history = [];
    }
}

// ===================================
// PLAYERS MANAGEMENT
// ===================================

async function addPlayer() {
    if (!APP_STATE.familyCode) {
        showAlert('Configurez d\'abord un code famille', 'warning');
        return;
    }
    
    const input = document.getElementById('newPlayerName');
    const name = input.value.trim();
    
    if (!name) {
        showAlert('Entrez un nom de joueur', 'warning');
        return;
    }
    
    if (APP_STATE.players.some(p => p.nom.toLowerCase() === name.toLowerCase())) {
        showAlert('Ce joueur existe déjà', 'warning');
        return;
    }
    
    if (APP_STATE.players.length >= 8) {
        showAlert('Maximum 8 joueurs par famille', 'warning');
        return;
    }
    
    try {
        const response = await fetch('tables/famille', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nom: name,
                code_famille: APP_STATE.familyCode,
                actif: true
            })
        });
        
        if (response.ok) {
            input.value = '';
            await loadPlayers();
            showAlert(`${name} ajouté avec succès ! 🎉`, 'success');
            
            // Initialize statistics
            await initializePlayerStats(name);
        } else {
            showAlert('Erreur lors de l\'ajout du joueur', 'danger');
        }
    } catch (error) {
        console.error('❌ Erreur ajout joueur:', error);
        showAlert('Erreur lors de l\'ajout du joueur', 'danger');
    }
}

async function initializePlayerStats(playerName) {
    try {
        await fetch('tables/statistiques', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code_famille: APP_STATE.familyCode,
                joueur: playerName,
                parties_jouees: 0,
                parties_gagnees: 0,
                manches_gagnees: 0,
                total_points: 0,
                meilleur_score: 0,
                pire_score: 0
            })
        });
        console.log(`✅ Stats initialisées pour ${playerName}`);
    } catch (error) {
        console.error('❌ Erreur init stats:', error);
    }
}

async function removePlayer(playerId, playerName) {
    if (!confirm(`Supprimer ${playerName} ? Cette action est irréversible.`)) {
        return;
    }
    
    try {
        await fetch(`tables/famille/${playerId}`, {
            method: 'DELETE'
        });
        
        await loadPlayers();
        showAlert(`${playerName} supprimé`, 'success');
    } catch (error) {
        console.error('❌ Erreur suppression joueur:', error);
        showAlert('Erreur lors de la suppression', 'danger');
    }
}

function togglePlayerSelection(playerName) {
    const index = APP_STATE.selectedPlayers.indexOf(playerName);
    
    if (index > -1) {
        APP_STATE.selectedPlayers.splice(index, 1);
    } else {
        if (APP_STATE.selectedPlayers.length >= 6) {
            showAlert('Maximum 6 joueurs par partie', 'warning');
            return;
        }
        APP_STATE.selectedPlayers.push(playerName);
    }
    
    updatePlayersDisplay();
}

function updatePlayersDisplay() {
    const container = document.getElementById('playersListContainer');
    
    if (APP_STATE.players.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3>Aucun joueur</h3>
                <p>Ajoutez les membres de votre famille pour commencer</p>
            </div>
        `;
        updateSelectedPlayersInfo();
        return;
    }
    
    const playersHTML = `
        <div class="players-list">
            ${APP_STATE.players.map(player => {
                const stats = APP_STATE.statistics[player.nom] || {};
                const isSelected = APP_STATE.selectedPlayers.includes(player.nom);
                const winRate = stats.parties_jouees > 0 
                    ? Math.round((stats.parties_gagnees / stats.parties_jouees) * 100) 
                    : 0;
                
                return `
                    <div class="player-card ${isSelected ? 'selected' : ''}" 
                         onclick="togglePlayerSelection('${player.nom}')">
                        <div class="name">${player.nom}</div>
                        <div class="stats">
                            ${stats.parties_jouees || 0}p • ${stats.parties_gagnees || 0}v • ${winRate}%
                        </div>
                        <button class="remove-btn" 
                                onclick="event.stopPropagation(); removePlayer('${player.id}', '${player.nom}')">
                            Supprimer
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = playersHTML;
    updateSelectedPlayersInfo();
}

function updateSelectedPlayersInfo() {
    const infoDiv = document.getElementById('selectedPlayersInfo');
    
    if (APP_STATE.selectedPlayers.length === 0) {
        infoDiv.innerHTML = '<strong>Aucun joueur sélectionné</strong>';
    } else {
        infoDiv.innerHTML = `
            <strong>Sélectionnés (${APP_STATE.selectedPlayers.length}/6):</strong><br>
            ${APP_STATE.selectedPlayers.join(', ')}
        `;
    }
}

// ===================================
// GAME MANAGEMENT
// ===================================

async function startNewGame() {
    if (!APP_STATE.familyCode) {
        showAlert('Configurez d\'abord un code famille', 'warning');
        return;
    }
    
    if (APP_STATE.selectedPlayers.length < 2) {
        showAlert('Sélectionnez au moins 2 joueurs', 'warning');
        return;
    }
    
    if (APP_STATE.selectedPlayers.length > 6) {
        showAlert('Maximum 6 joueurs par partie', 'warning');
        return;
    }
    
    if (APP_STATE.currentGame) {
        if (!confirm('Une partie est déjà en cours. La terminer et en commencer une nouvelle ?')) {
            return;
        }
        await endCurrentGame();
    }
    
    try {
        const response = await fetch('tables/parties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code_famille: APP_STATE.familyCode,
                date_debut: new Date().toISOString(),
                date_fin: null,
                joueurs: APP_STATE.selectedPlayers,
                status: 'en_cours',
                gagnant: null
            })
        });
        
        if (response.ok) {
            const newGame = await response.json();
            APP_STATE.currentGame = newGame;
            APP_STATE.manches = [];
            
            showAlert('Partie démarrée ! 🎮', 'success');
            showTab('partie');
            updateGameDisplay();
        } else {
            showAlert('Erreur lors de la création de la partie', 'danger');
        }
    } catch (error) {
        console.error('❌ Erreur création partie:', error);
        showAlert('Erreur lors de la création de la partie', 'danger');
    }
}

function updateGameDisplay() {
    const noGameMsg = document.getElementById('noGameMessage');
    const gameInterface = document.getElementById('gameInterface');
    
    if (!APP_STATE.currentGame) {
        noGameMsg.style.display = 'block';
        gameInterface.style.display = 'none';
        return;
    }
    
    noGameMsg.style.display = 'none';
    gameInterface.style.display = 'block';
    
    // Update game info
    document.getElementById('gamePlayersCount').textContent = 
        `${APP_STATE.currentGame.joueurs.length} (${APP_STATE.currentGame.joueurs.join(', ')})`;
    
    // Update winner dropdown
    updateWinnerDropdown();
    
    // Update losers score inputs
    updateLosersScoreInputs();
    
    // Update scores table
    updateScoresTable();
}

function updateWinnerDropdown() {
    const select = document.getElementById('mancheWinner');
    select.innerHTML = '<option value="">-- Sélectionner --</option>';
    
    if (APP_STATE.currentGame) {
        APP_STATE.currentGame.joueurs.forEach(player => {
            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            select.appendChild(option);
        });
    }
}

function updateLosersScoreInputs() {
    const container = document.getElementById('losersScoresGrid');
    
    if (!APP_STATE.currentGame) {
        container.innerHTML = '';
        return;
    }
    
    const selectedWinner = document.getElementById('mancheWinner').value;
    const losers = APP_STATE.currentGame.joueurs.filter(p => p !== selectedWinner);
    
    container.innerHTML = losers.map(player => `
        <div class="score-input-group">
            <label>${player}</label>
            <input type="number" 
                   id="loserScore_${player}" 
                   placeholder="Points"
                   min="0"
                   value="0">
        </div>
    `).join('');
}

// Update losers inputs when winner changes
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const winnerSelect = document.getElementById('mancheWinner');
        if (winnerSelect) {
            winnerSelect.addEventListener('change', updateLosersScoreInputs);
        }
    }, 500);
});

function updateScoresTable() {
    const tbody = document.getElementById('scoresTableBody');
    const tfoot = document.getElementById('scoresTableFoot');
    
    if (!APP_STATE.currentGame || APP_STATE.manches.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 30px; color: #6c757d;">Aucune manche jouée</td></tr>';
        tfoot.innerHTML = '';
        return;
    }
    
    // Build manches rows
    const manchesHTML = APP_STATE.manches.map(manche => {
        const typeLabel = manche.type_victoire === 'un_coup' ? '-50' : '-20';
        const specialIcons = [];
        if (manche.avec_joker) specialIcons.push('🃏');
        if (manche.friche) specialIcons.push('🔥');
        
        return `
            <tr>
                <td><strong>M${manche.numero_manche}</strong></td>
                <td>${manche.gagnant} ${specialIcons.join(' ')}</td>
                <td>${typeLabel}</td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = manchesHTML;
    
    // Calculate totals
    const totals = calculateTotals();
    const sortedTotals = Object.entries(totals).sort((a, b) => a[1] - b[1]);
    const winner = sortedTotals[0];
    const loser = sortedTotals[sortedTotals.length - 1];
    const ecart = Math.abs(loser[1] - winner[1]);
    
    // Build totals row
    const totalsHTML = `
        <tr>
            <th colspan="3" style="background: #495057;">TOTAUX</th>
        </tr>
        ${sortedTotals.map(([player, score]) => {
            let rowClass = 'total-row';
            if (player === winner[0]) rowClass += ' winner';
            if (player === loser[0]) rowClass += ' loser';
            
            return `
                <tr class="${rowClass}">
                    <td colspan="2"><strong>${player}</strong></td>
                    <td><strong>${score}</strong></td>
                </tr>
            `;
        }).join('')}
        <tr>
            <td colspan="3" style="text-align: center; padding: 10px; background: #f8f9fa; font-size: 13px;">
                <strong>Écart:</strong> ${ecart} / 350 points
                ${ecart >= 350 ? '<br><span style="color: #ff6b6b;">⚠️ Partie terminée !</span>' : ''}
            </td>
        </tr>
    `;
    
    tfoot.innerHTML = totalsHTML;
    
    // Check if game should end
    if (ecart >= 350) {
        showWinnerAnnouncement(winner[0], totals);
    }
}

function calculateTotals() {
    const totals = {};
    
    // Initialize totals for all players
    if (APP_STATE.currentGame) {
        APP_STATE.currentGame.joueurs.forEach(player => {
            totals[player] = 0;
        });
    }
    
    // Calculate scores from manches
    APP_STATE.manches.forEach(manche => {
        const scores = JSON.parse(manche.scores);
        
        Object.keys(scores).forEach(player => {
            if (totals.hasOwnProperty(player)) {
                totals[player] += scores[player];
            }
        });
    });
    
    return totals;
}

function showWinnerAnnouncement(winnerName, totals) {
    const container = document.getElementById('winnerAnnouncement');
    
    const sortedPlayers = Object.entries(totals)
        .sort((a, b) => a[1] - b[1])
        .map(([name, score], index) => `${index + 1}. ${name}: ${score} pts`)
        .join('<br>');
    
    container.innerHTML = `
        <div class="winner-announcement">
            <h2>🏆 Partie Terminée !</h2>
            <div class="winner-name">${winnerName}</div>
            <p style="margin-top: 15px; color: #343a40;">
                <strong>Classement Final:</strong><br>
                ${sortedPlayers}
            </p>
            <p style="margin-top: 15px; font-size: 14px; color: #6c757d;">
                Écart atteint: 350 points
            </p>
        </div>
    `;
    container.style.display = 'block';
}

// ===================================
// MANCHE MANAGEMENT
// ===================================

async function saveManche() {
    if (!APP_STATE.currentGame) {
        showAlert('Aucune partie en cours', 'warning');
        return;
    }
    
    const winner = document.getElementById('mancheWinner').value;
    const victoryType = document.getElementById('mancheVictoryType').value;
    const withJoker = document.getElementById('mancheJoker').checked;
    const isFriche = document.getElementById('mancheFriche').checked;
    
    if (!winner) {
        showAlert('Sélectionnez un gagnant', 'warning');
        return;
    }
    
    // Calculate scores
    const scores = {};
    let hasError = false;
    
    APP_STATE.currentGame.joueurs.forEach(player => {
        if (player === winner) {
            // Winner score
            let winnerScore = victoryType === 'un_coup' ? -50 : -20;
            if (withJoker) winnerScore *= 2; // Double if with joker
            if (isFriche) winnerScore *= 2; // Double if friche
            scores[player] = winnerScore;
        } else {
            // Loser score
            const input = document.getElementById(`loserScore_${player}`);
            if (!input) return;
            
            let loserScore = parseInt(input.value) || 0;
            if (loserScore < 0) {
                showAlert(`Le score de ${player} ne peut pas être négatif`, 'warning');
                hasError = true;
                return;
            }
            if (isFriche) loserScore *= 2; // Double if friche
            scores[player] = loserScore;
        }
    });
    
    if (hasError) return;
    
    try {
        const mancheNumber = APP_STATE.manches.length + 1;
        
        const response = await fetch('tables/manches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                partie_id: APP_STATE.currentGame.id,
                numero_manche: mancheNumber,
                gagnant: winner,
                type_victoire: victoryType,
                avec_joker: withJoker,
                friche: isFriche,
                scores: JSON.stringify(scores)
            })
        });
        
        if (response.ok) {
            await loadManches();
            updateScoresTable();
            
            // Reset form
            document.getElementById('mancheWinner').value = '';
            document.getElementById('mancheVictoryType').value = 'deux_fois';
            document.getElementById('mancheJoker').checked = false;
            document.getElementById('mancheFriche').checked = false;
            updateLosersScoreInputs();
            
            showAlert(`Manche ${mancheNumber} enregistrée ! 🎯`, 'success');
            
            // Check if game should end
            const totals = calculateTotals();
            const sortedTotals = Object.entries(totals).sort((a, b) => a[1] - b[1]);
            const ecart = Math.abs(sortedTotals[sortedTotals.length - 1][1] - sortedTotals[0][1]);
            
            if (ecart >= 350) {
                setTimeout(() => {
                    if (confirm('La partie est terminée ! Voulez-vous l\'enregistrer maintenant ?')) {
                        finalizeGame();
                    }
                }, 1000);
            }
        } else {
            showAlert('Erreur lors de l\'enregistrement de la manche', 'danger');
        }
    } catch (error) {
        console.error('❌ Erreur enregistrement manche:', error);
        showAlert('Erreur lors de l\'enregistrement de la manche', 'danger');
    }
}

async function endCurrentGame() {
    if (!APP_STATE.currentGame) return;
    
    if (!confirm('Terminer la partie en cours ?')) return;
    
    await finalizeGame();
}

async function finalizeGame() {
    if (!APP_STATE.currentGame) return;
    
    const totals = calculateTotals();
    const sortedTotals = Object.entries(totals).sort((a, b) => a[1] - b[1]);
    const winner = sortedTotals[0][0];
    
    try {
        // Update game status
        await fetch(`tables/parties/${APP_STATE.currentGame.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...APP_STATE.currentGame,
                status: 'termine',
                date_fin: new Date().toISOString(),
                gagnant: winner
            })
        });
        
        // Update statistics
        await updateStatistics(totals);
        
        showAlert('Partie terminée et enregistrée ! 🎉', 'success');
        
        // Reset current game
        APP_STATE.currentGame = null;
        APP_STATE.manches = [];
        APP_STATE.selectedPlayers = [];
        
        updateGameDisplay();
        updatePlayersDisplay();
        
        // Reload data
        await loadAllData();
        
        showTab('stats');
    } catch (error) {
        console.error('❌ Erreur finalisation partie:', error);
        showAlert('Erreur lors de la finalisation', 'danger');
    }
}

async function updateStatistics(totals) {
    const sortedPlayers = Object.entries(totals).sort((a, b) => a[1] - b[1]);
    const winner = sortedPlayers[0][0];
    
    for (const [playerName, finalScore] of sortedPlayers) {
        try {
            // Get current stats
            const response = await fetch(`tables/statistiques?search=${APP_STATE.familyCode}&limit=100`);
            const data = await response.json();
            
            const playerStats = data.data.find(s => 
                s.code_famille === APP_STATE.familyCode && 
                s.joueur === playerName
            );
            
            if (!playerStats) continue;
            
            // Update stats
            const manchesGagnees = APP_STATE.manches.filter(m => m.gagnant === playerName).length;
            const isWinner = playerName === winner;
            
            const updatedStats = {
                ...playerStats,
                parties_jouees: playerStats.parties_jouees + 1,
                parties_gagnees: playerStats.parties_gagnees + (isWinner ? 1 : 0),
                manches_gagnees: playerStats.manches_gagnees + manchesGagnees,
                total_points: playerStats.total_points + finalScore,
                meilleur_score: Math.min(playerStats.meilleur_score, finalScore),
                pire_score: Math.max(playerStats.pire_score, finalScore)
            };
            
            await fetch(`tables/statistiques/${playerStats.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStats)
            });
            
            console.log(`✅ Stats mises à jour pour ${playerName}`);
        } catch (error) {
            console.error(`❌ Erreur update stats pour ${playerName}:`, error);
        }
    }
}

// ===================================
// TABS NAVIGATION
// ===================================

function showTab(tabName) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Load specific tab data
    if (tabName === 'stats') {
        updateStatsDisplay();
    } else if (tabName === 'historique') {
        updateHistoryDisplay();
    }
}

// ===================================
// STATISTICS DISPLAY
// ===================================

function updateStatsDisplay() {
    updateGeneralStats();
    updateRankingDisplay();
}

function updateGeneralStats() {
    const container = document.getElementById('generalStats');
    
    const totalGames = APP_STATE.history.length;
    const activePlayers = Object.keys(APP_STATE.statistics).length;
    const totalManches = APP_STATE.history.reduce((sum, game) => {
        return sum + (game.manches_count || 0);
    }, 0);
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${totalGames}</div>
            <div class="stat-label">Parties jouées</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${activePlayers}</div>
            <div class="stat-label">Joueurs actifs</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${APP_STATE.manches.length}</div>
            <div class="stat-label">Manches (partie actuelle)</div>
        </div>
    `;
}

function updateRankingDisplay() {
    const container = document.getElementById('rankingList');
    
    const playersWithStats = Object.entries(APP_STATE.statistics)
        .filter(([_, stats]) => stats.parties_jouees > 0)
        .sort((a, b) => {
            // Sort by total points (lower is better)
            const avgA = a[1].total_points / a[1].parties_jouees;
            const avgB = b[1].total_points / b[1].parties_jouees;
            return avgA - avgB;
        });
    
    if (playersWithStats.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <h3>Aucune statistique</h3>
                <p>Jouez des parties pour voir le classement</p>
            </div>
        `;
        return;
    }
    
    const rankingHTML = playersWithStats.map(([playerName, stats], index) => {
        const winRate = Math.round((stats.parties_gagnees / stats.parties_jouees) * 100);
        const avgScore = Math.round(stats.total_points / stats.parties_jouees);
        
        let rankClass = '';
        if (index === 0) rankClass = 'first';
        else if (index === 1) rankClass = 'second';
        else if (index === 2) rankClass = 'third';
        
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        
        return `
            <div class="ranking-item ${rankClass}">
                <div class="rank-position">${medal || (index + 1)}</div>
                <div class="rank-info">
                    <div class="rank-name">${playerName}</div>
                    <div class="rank-details">
                        ${stats.parties_jouees}p • ${stats.parties_gagnees}v • ${winRate}% victoires
                    </div>
                </div>
                <div class="rank-score">
                    ${avgScore}<br>
                    <small style="font-size: 11px; opacity: 0.8;">moy/partie</small>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = rankingHTML;
}

// ===================================
// HISTORY DISPLAY
// ===================================

function updateHistoryDisplay() {
    const container = document.getElementById('historyList');
    
    if (APP_STATE.history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3>Aucun historique</h3>
                <p>Les parties terminées apparaîtront ici</p>
            </div>
        `;
        return;
    }
    
    const historyHTML = APP_STATE.history.map(game => {
        const date = new Date(game.date_fin).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-date">📅 ${date}</div>
                    <div class="history-winner">🏆 ${game.gagnant}</div>
                </div>
                <div class="history-details">
                    <strong>Joueurs:</strong> ${game.joueurs.join(', ')}<br>
                    <strong>Parties:</strong> ${game.joueurs.length} joueurs
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = historyHTML;
}

// ===================================
// UTILITIES
// ===================================

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.zIndex = '10000';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.textAlign = 'center';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

async function refreshData() {
    const btn = document.querySelector('.refresh-btn');
    btn.classList.add('spinning');
    
    try {
        await loadAllData();
        
        // Update current tab display
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            const tabName = activeTab.getAttribute('onclick').match(/'([^']+)'/)[1];
            if (tabName === 'stats') updateStatsDisplay();
            else if (tabName === 'historique') updateHistoryDisplay();
            else if (tabName === 'partie') updateGameDisplay();
            else if (tabName === 'famille') updatePlayersDisplay();
        }
        
        showAlert('Données rafraîchies ! 🔄', 'success');
    } catch (error) {
        showAlert('Erreur lors du rafraîchissement', 'danger');
    } finally {
        setTimeout(() => {
            btn.classList.remove('spinning');
        }, 500);
    }
}

// Auto-refresh every 30 seconds
setInterval(() => {
    if (APP_STATE.familyCode) {
        console.log('🔄 Rafraîchissement automatique...');
        refreshData();
    }
}, 30000);
