const PRICE_PER_TICKET = 149.99;
const USER_ID = "45";
let selectedSeats = [];
let experimentStartTime = null;
let timerInterval = null;

const CASES = ['BANNER', 'MODAL', 'CUSTOMIZE'];
let currentCaseIndex = 0;

function getActiveConfig() {
    return {
        case: CASES[currentCaseIndex],
        category: 'Intrusive'
    };
}

function init() {
    setupGrid('grid-floor', 36, 0.15);
    setupGrid('grid-bowl', 72, 0.45);
}

function setupGrid(elementId, count, soldRate) {
    const grid = document.getElementById(elementId);
    if (!grid) return;
    for (let i = 0; i < count; i++) {
        const seat = document.createElement('div');
        const isSold = Math.random() < soldRate;
        
        seat.className = isSold ? 'seat sold' : 'seat available';
        if (!isSold) {
            seat.onclick = () => toggleSeat(seat, elementId + '-' + i);
        }
        grid.appendChild(seat);
    }
}

function toggleSeat(el, id) {
    el.classList.toggle('selected');
    if (el.classList.contains('selected')) {
        selectedSeats.push(id);
    } else {
        selectedSeats = selectedSeats.filter(s => s !== id);
    }
    updateUI();
}

function updateUI() {
    const list = document.getElementById('ticket-list');
    const total = document.getElementById('display-total');
    const btn = document.getElementById('main-buy-btn');

    if (selectedSeats.length === 0) {
        list.innerHTML = '<p style="color: #999;">Select seats to continue</p>';
        total.innerText = '$0.00';
        btn.disabled = true;
    } else {
        list.innerHTML = selectedSeats.map(s => `
            <div class="order-row">
                <span>Standard Admission</span>
                <span>$${PRICE_PER_TICKET}</span>
            </div>
        `).join('');
        total.innerText = `$${(selectedSeats.length * PRICE_PER_TICKET).toFixed(2)}`;
        btn.disabled = false;
    }
}

function startTimer(duration) {
    if (timerInterval) clearInterval(timerInterval);
    
    let timer = duration;
    const display = document.getElementById('clock');
    
    timerInterval = setInterval(() => {
        let mins = Math.floor(timer / 60);
        let secs = timer % 60;
        if (display) {
            display.innerText = `${mins}:${secs < 10 ? '0' + secs : secs}`;
        }
        if (--timer < 0) {
            clearInterval(timerInterval);
            if (display) display.innerText = "EXPIRED";
        }
    }, 1000);
}

function startMission() {
    experimentStartTime = Date.now();
    document.getElementById('mission-overlay').classList.add('hidden');
    
    const banner = document.getElementById('cookie-banner');
    const backdrop = document.getElementById('modal-backdrop');
    const rejectBtn = document.getElementById('btn-reject-option');
    const customizeBtn = document.getElementById('btn-customize-option');
    const config = getActiveConfig();
    banner.classList.remove('hidden');

    if (config.case === 'CUSTOMIZE') {
        rejectBtn.classList.add('hidden');
        customizeBtn.classList.remove('hidden');
        banner.className = 'type-modal';
        backdrop.classList.remove('hidden');
    } else if (config.case === 'MODAL') {
        rejectBtn.classList.remove('hidden');
        customizeBtn.classList.add('hidden');
        banner.className = 'type-modal';
        backdrop.classList.remove('hidden');
    } else {
        rejectBtn.classList.remove('hidden');
        customizeBtn.classList.add('hidden');
        banner.className = 'type-banner';
        backdrop.classList.add('hidden');
    }

    startTimer(300);
}

function openCustomize() {
    document.getElementById('cookie-banner').classList.add('hidden');
    document.getElementById('customize-modal').classList.remove('hidden');
}

function closeCustomize() {
    document.getElementById('customize-modal').classList.add('hidden');
    document.getElementById('cookie-banner').classList.remove('hidden');
}

async function logCookie(action) {
    const reactionTime = Date.now() - (experimentStartTime || Date.now());
    const config = getActiveConfig();
    document.getElementById('cookie-banner').classList.add('hidden');
    document.getElementById('customize-modal').classList.add('hidden');
    document.getElementById('modal-backdrop').classList.add('hidden');

    const payload = {
        user_id: USER_ID,
        scenario_name: "Ticket Stress Scenario",
        category_name: config.category,
        case_name: config.case,
        button_clicked: action,
        reaction_time_ms: reactionTime
    };

    try {
        await fetch('/log_click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.error("Error logging cookie click:", e);
    }
}

function showCheckoutForm() {
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('checkout-screen').classList.remove('hidden');
    window.scrollTo(0, 0);
}

async function completePurchase() {
    const payload = {
        user_id: USER_ID,
        scenario_name: "Ticket Stress Scenario",
        category_name: "Checkout",
        case_name: "Final Purchase",
        button_clicked: "Confirm & Pay",
        reaction_time_ms: Date.now() - (experimentStartTime || Date.now())
    };

    try {
        await fetch('/log_click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) { 
        console.error("Error logging purchase:", e); 
    }

    document.getElementById('checkout-screen').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');
    
    const timerBox = document.querySelector('.timer-box');
    if (timerBox) {
        timerBox.style.background = "#10b981";
        timerBox.innerText = "Transaction Complete";
    }
}

function nextScenario() {
    currentCaseIndex++;
    
    if (currentCaseIndex < CASES.length) {
        selectedSeats = [];        
        document.getElementById('grid-floor').innerHTML = '';
        document.getElementById('grid-bowl').innerHTML = '';
        init(); 

        document.getElementById('success-screen').classList.add('hidden');
        document.getElementById('selection-screen').classList.remove('hidden');
        document.getElementById('mission-overlay').classList.remove('hidden');
        
        const timerBox = document.querySelector('.timer-box');
        timerBox.style.background = "#ef4444";
        timerBox.innerHTML = 'Time Left: <span id="clock">05:00</span>';        
        document.querySelector('.mission-card h2').innerText = `SCENARIO ${currentCaseIndex + 1}`;
        
        updateUI();
    } else {
        window.location.href = '/';
    }
}

window.onload = init;