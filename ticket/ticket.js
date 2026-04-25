const PRICE_PER_TICKET = 149.99;
let selectedSeats = [];
let experimentStartTime = null;
let timerInterval = null;
let currentCaseIndex = 0;
let currentPage = "";

let CASES = [
    '201_banner_reject-neutral_accept-salient', 
    '202_banner_accept-salient_reject-neutral',
    '203_banner_customize-neutral_accept-salient', 
    '204_banner_accept-salient_customize-neutral',
    '205_banner_accept-salient_customize-salient',
    '206_banner_accept-salient_reject-salient',
    '207_banner_customizetextlink_accept-salient',
    '208_banner_customizelink_accept-salient',
    '209_modal_reject-neutral_accept-salient', 
    '210_modal_accept-salient_reject-neutral', 
    '211_modal_customize-neutral_accept-salient', 
    '212_modal_accept-salient_customize-neutral',
    '213_banner_essential-salient_accept-salient_leginterest',
    '214_banner_essential-salient_accept-salient',
    '215_banner_customize-salient_accept-salient_leginterest'
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
shuffleArray(CASES);

function getParticipantId() {
    let id = localStorage.getItem('participant_id');
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('participant_id', id);
    }
    return id;
}
const USER_ID = getParticipantId();

async function logState(pageName, scrollY = 0) {
    const config = getActiveConfig();
    const payload = {
        user_id: USER_ID,
        scenario_name: "concert_ticket",
        case_name: config.case,
        page_name: pageName,
        scroll_y: Math.round(scrollY),
        timestamp: Date.now() / 1000
    };

    try {
        await fetch('/log_state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) { console.error("Error logging state:", e); }
}

document.querySelector('.customize-body').addEventListener('scroll', function(e) {
    logState("Customize Modal", e.target.scrollTop);
});

async function logCustomizeClicks(elementId, type) {
    const config = getActiveConfig();
    const payload = {
        user_id: USER_ID,
        scenario_name: "concert_ticket",
        case_name: config.case,
        element_id: elementId,
        interaction_type: type,
        timestamp: Date.now() / 1000
    };

    try {
        await fetch('/log_customize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) { console.error("Error logging customize clicks:", e); }
}

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

function togglePurpose(btn) {
    const details = btn.nextElementSibling;
    btn.classList.toggle('active');
    details.classList.toggle('active');

    const isExpanded = btn.classList.contains('active');
    logCustomizeClicks(btn.id, isExpanded ? "expanded" : "collapsed");
}

document.querySelectorAll('#customize-modal input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const action = this.checked ? "toggle_on" : "toggle_off";
        logCustomizeClicks(this.id, action);
    });
});

function startMission() {
    currentPage = "Seat Selection";
    logState(currentPage, 0);
    experimentStartTime = Date.now();
    document.getElementById('mission-overlay').classList.add('hidden');
    
    const banner = document.getElementById('cookie-banner');
    const backdrop = document.getElementById('modal-backdrop');
    const btnContainer = document.querySelector('.cookie-btns');
    const cookieP = document.getElementById('cookie-p-text');
    const config = getActiveConfig();
    const parts = config.case.split('_');
    const num = parts[0];
    const displayType = parts[1];
    const leftBtnType = parts[2];
    const rightBtnType = parts[3];

    const defaultText = 'We and our trusted partners use cookies and similar technologies to process data on this device. This helps us ensure security and personalize your experience.';

    if (num === '213') {
        cookieP.innerHTML = defaultText + ' Some of our partners process your data on the basis of legitimate interest. You have a right to object by clicking the customize link. <a onclick="openCustomize()">Customize your cookies</a>';
    } else if (num === '214') {
        cookieP.innerHTML = defaultText + ' <a onclick="openCustomize()">Customize your cookies</a>';
    } else if (leftBtnType.includes('customizetextlink') || rightBtnType.includes('customizetextlink')) {
        cookieP.innerHTML = defaultText + ' <a onclick="openCustomize()">Customize your cookies</a>';
    } else {
        cookieP.innerHTML = defaultText + ' Please choose your preferences.';
    }

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
        
        if (type.includes('reject')) {
            btn.innerText = 'Reject All';
            btn.onclick = () => logCookie('Reject All');
        } else if (type.includes('accept')) {
            btn.innerText = 'Accept All';
            btn.onclick = () => logCookie('Accept All');
        } else if (type.includes('customize')) {
            btn.innerText = 'Customize';
            btn.onclick = openCustomize;
        } else if (type.includes('essential')) {
            btn.innerText = 'Accept Essential';
            btn.onclick = () => logCookie('Accept Essential');
        }

        if (type.includes('-salient')) {
            btn.className = 'btn-salient';
        } else if (type.includes('-neutral')) {
            btn.className = 'btn-neutral';
        } else if (type.includes('link')) {
            btn.className = 'btn-link';
        } else {
            if (type === 'accept') btn.className = 'btn-accept';
            else btn.className = 'btn-reject';
        }
        
        return btn;
    }

    if (num === '213' || num === '214') {
        btnContainer.appendChild(createButton('essential-salient'));
        btnContainer.appendChild(createButton('accept-salient'));
    } else if (num === '215') {
        btnContainer.appendChild(createButton('customize-salient'));
        btnContainer.appendChild(createButton('accept-salient'));
    } else if (num === '207') {
        btnContainer.appendChild(createButton(rightBtnType));
    } else {
        btnContainer.appendChild(createButton(leftBtnType));
        btnContainer.appendChild(createButton(rightBtnType));
    }

    startTimer(300);
}

function openCustomize() {
    logState("Customize Modal", 0);
    document.getElementById('cookie-banner').classList.add('hidden');
    document.getElementById('customize-modal').classList.remove('hidden');
    document.querySelector('.customize-body').scrollTop = 0;

    const config = getActiveConfig();
    const titles = document.querySelectorAll('.purpose-title');
    const details = document.querySelectorAll('.purpose-details');
    const legRows = document.querySelectorAll('.leg-interest');

    if (config.case.startsWith('215')) {
        titles.forEach(t => t.classList.remove('active'));
        details.forEach(d => d.classList.remove('active'));
        legRows.forEach(r => r.style.display = 'flex');
    } else {
        titles.forEach(t => t.classList.add('active'));
        details.forEach(d => d.classList.add('active'));
        legRows.forEach(r => r.style.display = 'flex');
    }
}

function closeCustomize() {
    logState(currentPage, 0);
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
    currentPage = "Checkout Form";
    logState(currentPage, 0);
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('checkout-screen').classList.remove('hidden');
    window.scrollTo(0, 0);
}

async function completePurchase() {
    currentPage = "Success Screen";
    logState(currentPage, 0);
    const payload = {
        user_id: USER_ID,
        scenario_name: "concert_ticket",
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
    currentPage = "Mission Overlay";
    logState(currentPage, 0);
    currentCaseIndex++;
    
    if (currentCaseIndex < CASES.length) {
        selectedSeats = [];        
        document.getElementById('grid-floor').innerHTML = '';
        document.getElementById('grid-bowl').innerHTML = '';
        init(); 
        document.getElementById('form-email').value = '';
        document.getElementById('form-phone').value = '';
        document.getElementById('card-num').value = '';
        document.getElementById('expiry').value = '';
        document.getElementById('cvc').value = '';
        
        const checkboxes = document.querySelectorAll('#customize-modal input[type="checkbox"]');
        checkboxes.forEach(box => {
            if (box.id && box.id.includes('legitimate')) {
                box.checked = true;
            } else {
                box.checked = false;
            }
        }); 

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