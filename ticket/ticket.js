const PRICE_PER_TICKET = 149.99;
let selectedSeats = [];
let experimentStartTime = null;
let timerInterval = null;
let currentCaseIndex = 0;
const CASES = [
    'banner_reject_accept', 
    'banner_accept_reject', 
    'banner_customize_accept', 
    'banner_accept_customize',
    'modal_reject_accept', 
    'modal_accept_reject', 
    'modal_customize_accept', 
    'modal_accept_customize'
];

function getParticipantId() {
    let id = localStorage.getItem('participant_id');
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('participant_id', id);
    }
    return id;
}
const USER_ID = getParticipantId();

function getActiveConfig() {
    return {
        case: CASES[currentCaseIndex],
        category: 'Cookie'
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
    const btnContainer = document.querySelector('.cookie-btns');
    const config = getActiveConfig();
    const [displayType, leftBtnType, rightBtnType] = config.case.split('_');

    banner.classList.remove('hidden');

    if (displayType === 'modal') {
        banner.className = 'type-modal';
        backdrop.classList.remove('hidden');
    } else {
        banner.className = 'type-banner';
        backdrop.classList.add('hidden');
    }

    btnContainer.innerHTML = '';

    function createButton(type) {
        const btn = document.createElement('button');
        if (type === 'reject') {
            btn.className = 'btn-reject';
            btn.innerText = 'Reject All';
            btn.onclick = () => logCookie('Reject All');
        } else if (type === 'accept') {
            btn.className = 'btn-accept';
            btn.innerText = 'Accept All';
            btn.onclick = () => logCookie('Accept All');
        } else if (type === 'customize') {
            btn.className = 'btn-reject';
            btn.innerText = 'Customize';
            btn.onclick = openCustomize;
        }
        return btn;
    }

    btnContainer.appendChild(createButton(leftBtnType));
    btnContainer.appendChild(createButton(rightBtnType));

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

    let preferences = {};
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((box, index) => {
        let name = box.id || `toggle_${index + 1}`;
        preferences[name] = box.checked; 
    });
    
    const payload = {
        user_id: USER_ID,
        scenario_name: "concert_ticket",
        category_name: config.category,
        case_name: config.case,
        button_clicked: action,
        reaction_time_ms: reactionTime,
        preferences: JSON.stringify(preferences)
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
        case_name: CASES[currentCaseIndex],
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

document.getElementById('card-num').addEventListener('input', function (e) {
    let rawValue = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = rawValue.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = formattedValue.toUpperCase();
});