

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const connectionStatusEl = document.getElementById('connection-status');
    const playerListEl = document.getElementById('player-list');
    const diceRollLogEl = document.getElementById('dice-roll-log');
    const rpgMapCanvas = document.getElementById('rpg-map-canvas');
    const leaveSessionBtn = document.getElementById('leave-session-btn');
    const ctx = rpgMapCanvas.getContext('2d');

    socket.on('connect', () => {
        console.log('Conectado ao servidor. ID:', socket.id);
        if (connectionStatusEl) {
            connectionStatusEl.innerHTML = '<i class="fas fa-circle text-green-500"></i> Conectado';
        }

        CHARACTER = JSON.parse(CHARACTER); // Parse JSON string to object
        USER = JSON.parse(USER); // Parse JSON string to object
        console.log('Dados do personagem:', CHARACTER);

        socket.emit('joinSession', { campaignId: CAMPAIGN_ID, character: CHARACTER, user: USER });
    });

    socket.on('disconnect', () => {
        console.log('Desconectado do servidor Socket.IO.');
        if (connectionStatusEl) {
            connectionStatusEl.innerHTML = '<i class="fas fa-circle text-red-500 animate-pulse"></i> Desconectado';
        }
    });

    socket.on('connect_error', (err) => {
        console.error('Erro de conexão com Socket.IO:', err);
        if (connectionStatusEl) {
            connectionStatusEl.innerHTML = '<i class="fas fa-circle text-yellow-500"></i> Erro de Conexão';
        }
    });

    socket.on('updatePlayerList', (players) => {
        console.log('Lista de jogadores recebida:', players);
        renderPlayerList(players);
    });

    function renderPlayerList(players) {
        if (!playerListEl) return;
        playerListEl.innerHTML = ''; // Limpa a lista atual

        if (Object.keys(players).length === 0) {
            playerListEl.innerHTML = '<p class="text-xs text-darkTextSecondary text-center italic">Nenhum jogador online.</p>';
            return;
        }

        for (const playerId in players) {
            const char = players[playerId];
            const playerEl = document.createElement('div');
            playerEl.className = 'player-item bg-cardLight p-2 rounded-md border border-darkBorder';
            playerEl.dataset.playerId = playerId;

            playerEl.innerHTML = `
                <div class="flex items-center">
                    ${char.info.portraitUrl ? `<img src="${char.info.portraitUrl}" class="w-10 h-10 rounded-full mr-2 object-cover border-2 border-primary">` :
                    `<i class="fas fa-user fa-2x text-primary mr-4"></i>`}
                    <div>
                        <p class="text-xs font-semibold text-darkTextPrimary truncate" title="${char.info.name}">${char.info.name}</p>
                        <div class="text-health text-[10px] leading-tight">
                            Vida: <span class="font-medium">${char.pv || 0}</span> / <span class="font-medium">${char.maxPv || 0}</span>
                        </div>
                        <div class="text-sanity text-[10px] leading-tight mt-1">
                            Sanidade: <span class="font-medium">${char.ps || 0}</span> / <span class="font-medium">${char.maxPs || 0}</span>
                        </div>
                    </div>
                </div>
            `;
            playerListEl.appendChild(playerEl);
        }
    }

    // --- Log de Rolagens de Dados ---
    socket.on('newDiceRoll', (rollData) => {
        console.log('Nova rolagem recebida:', rollData);
        addRollToLog(rollData);
    });

    function addRollToLog(data) {
        if (!diceRollLogEl) return;
        const rollEl = document.createElement('div');
        rollEl.className = 'roll-item text-darkTextSecondary';

        // Exemplo: { rollerName: "JogadorX", dice: "1d20", rolls: [15], modifier: 5, total: 20, description: "Ataque" }
        // Personalize a formatação da mensagem conforme necessário
        let rollDetails = data.rolls ? `(${data.rolls.join(', ')})` : '';
        let modifierText = data.modifier ? (data.modifier > 0 ? ` + ${data.modifier}` : ` - ${Math.abs(data.modifier)}`) : '';
        let descriptionText = data.description ? ` para <span class="italic">${data.description}</span>` : '';

        rollEl.innerHTML = `
            <span class="text-blue-400 font-medium">${data.rollerName || 'Sistema'}:</span> 
            rolou ${data.dice} ${rollDetails}${modifierText} = <span class="text-lg text-green-400 font-bold">${data.total}</span>${descriptionText}.
        `;
        diceRollLogEl.appendChild(rollEl);
        diceRollLogEl.scrollTop = diceRollLogEl.scrollHeight; // Auto-scroll
    }

    // --- Canvas do Mapa (MVP - Desenho Básico) ---
    function resizeCanvas() {
        const parent = rpgMapCanvas.parentElement;
        if (parent) {
            // Manter aspect ratio (ex: 16:9) ou preencher, ajuste conforme necessidade
            const parentWidth = parent.clientWidth - 2; // -2 para padding/border
            const parentHeight = parent.clientHeight - 2;

            // Para preencher:
            rpgMapCanvas.width = parentWidth;
            rpgMapCanvas.height = parentHeight;
        }
        drawMap(); // Redesenha ao redimensionar
    }

    function drawMap() {
        if (!ctx) return;
        ctx.clearRect(0, 0, rpgMapCanvas.width, rpgMapCanvas.height);

        // Desenho de placeholder
        ctx.fillStyle = '#1e293b'; // card
        ctx.fillRect(0, 0, rpgMapCanvas.width, rpgMapCanvas.height);

        ctx.strokeStyle = '#334155'; // darkBorder
        ctx.lineWidth = 1;

        // Grid simples (opcional)
        const gridSize = 30;
        for (let x = 0; x < rpgMapCanvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, rpgMapCanvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < rpgMapCanvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(rpgMapCanvas.width, y);
            ctx.stroke();
        }

        ctx.fillStyle = '#e2e8f0'; // darkTextPrimary
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Carregando assets...', rpgMapCanvas.width / 2, rpgMapCanvas.height / 2);
    }

    // Event listeners
    if (leaveSessionBtn) {
        leaveSessionBtn.addEventListener('click', () => {
            // Adicionar confirmação se desejar
            socket.disconnect();
            window.location.href = '/dashboard'; // Ou página de campanhas
        });
    }

    // Inicialização
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Desenha o canvas inicialmente

    // --- Exemplo de envio de rolagem de dados (para teste) ---
    // Você pode adicionar um botão ou input para o jogador rolar dados
    // document.getElementById('roll-test-btn').addEventListener('click', () => {
    //     socket.emit('diceRoll', {
    //         campaignId: CAMPAIGN_ID,
    //         rollerId: USER_ID,
    //         rollerName: USER_NAME,
    //         dice: "1d20",
    //         modifier: 5,
    //         description: "Teste de Percepção"
    //     });
    // });
});