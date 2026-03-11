const PRICE_PER_TICKET = 149.99;
const USER_ID = "45";
let selectedSeats = [];
let experimentStartTime = null;

const ACTIVE_CONFIG = {
    //case: 'MODAL', 
    case: 'BANNER', 
    category: 'Intrusive'
};

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
    let timer = duration;
    const display = document.getElementById('clock');
    const interval = setInterval(() => {
        let mins = Math.floor(timer / 60);
        let secs = timer % 60;
        if (display) {
            display.innerText = `${mins}:${secs < 10 ? '0' + secs : secs}`;
        }
        if (--timer < 0) {
            clearInterval(interval);
            if (display) display.innerText = "EXPIRED";
        }
    }, 1000);
}

function startMission() {
    experimentStartTime = Date.now();
    document.getElementById('mission-overlay').classList.add('hidden');
    
    const banner = document.getElementById('cookie-banner');
    const backdrop = document.getElementById('modal-backdrop');

    if (ACTIVE_CONFIG.case === 'MODAL') {
        banner.className = 'type-modal';
        backdrop.classList.remove('hidden');
    } else {
        banner.className = 'type-banner';
        backdrop.classList.add('hidden');
    }

    startTimer(300);
}

async function logCookie(action) {
    const reactionTime = Date.now() - (experimentStartTime || Date.now());
    
    // Hide both banner and backdrop
    document.getElementById('cookie-banner').classList.add('hidden');
    document.getElementById('modal-backdrop').classList.add('hidden');

    const payload = {
        user_id: USER_ID,
        scenario_name: "Ticket Stress Scenario",
        category_name: ACTIVE_CONFIG.category,
        case_name: ACTIVE_CONFIG.case,
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

window.onload = init;