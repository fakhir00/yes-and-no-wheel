document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Engine
    const diceEngine = new window.DiceEngine('canvas-container');

    // 2. State & History
    let state = {
        totalRolls: 0,
        yesCount: 0,
        noCount: 0,
        currentStreak: 0,
        streakType: null, // 'YES' or 'NO'
        history: []
    };

    // Load state
    const savedState = localStorage.getItem('yesno_state');
    if (savedState) {
        state = JSON.parse(savedState);
    }

    let rollMode = 1; // 1, 3, 5
    let currentSeries = [];

    // 3. UI Elements
    const elements = {
        slider: document.getElementById('probability-slider'),
        lblYes: document.getElementById('prob-yes'),
        lblNo: document.getElementById('prob-no'),
        btnRoll: document.getElementById('roll-btn'),
        autoRoll: document.getElementById('auto-roll-toggle'),
        themeBtn: document.getElementById('theme-btn'),
        soundBtn: document.getElementById('sound-btn'),
        modeBtns: document.querySelectorAll('.seg-btn'),

        resultDisplay: document.getElementById('result-display'),
        resultText: document.getElementById('result-text'),
        seriesTracker: document.getElementById('series-tracker'),

        statTotal: document.getElementById('stat-total-rolls'),
        statStreak: document.getElementById('stat-streak'),

        psychModal: document.getElementById('psychology-modal'),
        psychYes: document.getElementById('psych-yes'),
        psychNo: document.getElementById('psych-no'),
        psychConclusion: document.getElementById('psych-conclusion'),

        chartCanvas: document.getElementById('ratio-chart')
    };

    // 4. Audio (Synth)
    let soundEnabled = true;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(type) {
        if (!soundEnabled || audioCtx.state === 'suspended') return;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);

        if (type === 'roll') {
            o.type = 'sine';
            o.frequency.setValueAtTime(300, audioCtx.currentTime);
            o.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
            g.gain.setValueAtTime(0.5, audioCtx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            o.start();
            o.stop(audioCtx.currentTime + 0.2);
        } else if (type === 'result-yes') {
            o.type = 'triangle';
            o.frequency.setValueAtTime(440, audioCtx.currentTime);
            o.frequency.setValueAtTime(660, audioCtx.currentTime + 0.1);
            g.gain.setValueAtTime(0.5, audioCtx.currentTime);
            g.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            o.start();
            o.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'result-no') {
            o.type = 'triangle';
            o.frequency.setValueAtTime(400, audioCtx.currentTime);
            o.frequency.setValueAtTime(200, audioCtx.currentTime + 0.2);
            g.gain.setValueAtTime(0.5, audioCtx.currentTime);
            g.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            o.start();
            o.stop(audioCtx.currentTime + 0.3);
        }
    }

    // 5. Chart.js init
    let biasChart;
    function initChart() {
        const ctx = elements.chartCanvas.getContext('2d');
        biasChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Yes', 'No'],
                datasets: [{
                    data: [state.yesCount || 1, state.noCount || 1], // fallback 1 to show empty ring
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: 'var(--c-text-main)' }
                    }
                }
            }
        });
    }

    function updateStatsUI() {
        elements.statTotal.innerText = state.totalRolls;
        elements.statStreak.innerText = state.currentStreak;
        if (state.streakType === 'YES') {
            elements.statStreak.style.color = 'var(--c-yes)';
        } else if (state.streakType === 'NO') {
            elements.statStreak.style.color = 'var(--c-no)';
        } else {
            elements.statStreak.style.color = 'var(--c-text-main)';
        }

        // Update Chart
        if (biasChart) {
            biasChart.data.datasets[0].data = [state.yesCount, state.noCount];
            if (state.yesCount === 0 && state.noCount === 0) {
                biasChart.data.datasets[0].data = [1, 1]; // neutral
            }
            biasChart.update();
        }

        localStorage.setItem('yesno_state', JSON.stringify(state));
    }

    function triggerConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#ffffff'] // Yes colors
        });
    }

    // 6. Interaction logic
    elements.slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        elements.lblYes.innerText = `${val}% Yes`;
        elements.lblNo.innerText = `${100 - val}% No`;
    });

    elements.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            rollMode = parseInt(btn.dataset.val);
            currentSeries = []; // reset
            renderSeriesTracker();
            elements.resultDisplay.classList.add('hidden');
        });
    });

    elements.themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');
    });

    elements.soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        elements.soundBtn.innerText = soundEnabled ? '🔊' : '🔇';
        if (soundEnabled && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    });

    function renderSeriesTracker() {
        elements.seriesTracker.innerHTML = '';
        if (rollMode === 1) return;

        // Render slots
        for (let i = 0; i < rollMode; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i < currentSeries.length) {
                dot.classList.add(`filled-${currentSeries[i].toLowerCase()}`);
            }
            elements.seriesTracker.appendChild(dot);
        }
    }

    function showPsychologyMode(result) {
        elements.psychModal.classList.remove('hidden');
        elements.psychConclusion.classList.add('hidden');

        // Remove old listeners
        const handleYes = () => finishPsych(true, result);
        const handleNo = () => finishPsych(false, result);

        elements.psychYes.onclick = handleYes;
        elements.psychNo.onclick = handleNo;
    }

    function finishPsych(happy, result) {
        elements.psychConclusion.classList.remove('hidden');
        if (happy) {
            elements.psychConclusion.innerText = "Awesome! Your intuition agrees with the dice. Proceed with confidence!";
        } else {
            const opposite = result === 'YES' ? 'NO' : 'YES';
            elements.psychConclusion.innerHTML = `You secretly wanted <strong>${opposite}</strong>! Ignore the dice and follow your heart.`;
        }

        setTimeout(() => {
            elements.psychModal.classList.add('hidden');
        }, 4000);
    }

    // 7. Core Roll hook
    function doRoll() {
        if (diceEngine.isRolling) return;

        if (audioCtx.state === 'suspended' && soundEnabled) {
            audioCtx.resume();
        }

        elements.resultDisplay.classList.add('hidden');
        elements.psychModal.classList.add('hidden');

        playSound('roll');

        if (navigator.vibrate) {
            navigator.vibrate(50); // Haptic
        }

        const probYes = parseInt(elements.slider.value) / 100;

        diceEngine.roll(probYes, (result) => {
            handleResult(result);
        });
    }

    function handleResult(result) {
        // Haptic
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        // Sound
        if (result === 'YES') playSound('result-yes');
        else playSound('result-no');

        // Series logic
        if (rollMode > 1) {
            currentSeries.push(result);
            renderSeriesTracker();

            elements.resultDisplay.classList.remove('hidden');
            elements.resultText.innerText = result;
            elements.resultText.className = `pop-in result-${result.toLowerCase()}`;

            // Check if series is won
            const winsNeeded = Math.ceil(rollMode / 2);
            let yesC = currentSeries.filter(x => x === 'YES').length;
            let noC = currentSeries.filter(x => x === 'NO').length;

            if (yesC >= winsNeeded || noC >= winsNeeded) {
                const finalWinner = yesC > noC ? 'YES' : 'NO';
                setTimeout(() => {
                    elements.resultText.innerText = finalWinner + " WINS!";
                    currentSeries = [];
                    processFinalResult(finalWinner);
                }, 1000);
            } else {
                // Next roll in series
                setTimeout(doRoll, 1000);
            }
        } else {
            // Single Roll
            elements.resultDisplay.classList.remove('hidden');
            elements.resultText.innerText = result;
            elements.resultText.className = `pop-in result-${result.toLowerCase()}`;
            processFinalResult(result);
        }
    }

    function processFinalResult(result) {
        state.totalRolls++;
        if (result === 'YES') state.yesCount++;
        else state.noCount++;

        if (state.streakType === result) {
            state.currentStreak++;
        } else {
            state.streakType = result;
            state.currentStreak = 1;
        }

        updateStatsUI();

        if (result === 'YES') {
            triggerConfetti();
        }

        // Psychology check (20% chance on single rolls)
        if (rollMode === 1 && Math.random() < 0.2) {
            setTimeout(() => {
                showPsychologyMode(result);
            }, 1500);
        } else {
            // Auto roll check
            if (elements.autoRoll.checked && !elements.psychModal.classList.contains('hidden') === false) {
                setTimeout(doRoll, 2500);
            }
        }
    }

    elements.btnRoll.addEventListener('click', doRoll);

    // Init
    initChart();
    updateStatsUI();
    renderSeriesTracker();
});
