let experimentStartTime = null;

let CASES = [
    '301_banner_reject-neutral_accept-salient', 
    '302_banner_accept-salient_reject-neutral', 
    '303_banner_customize-neutral_accept-salient', 
    '304_banner_accept-salient_customize-neutral',
    '305_banner_accept-salient_customize-salient',
    '306_banner_accept-salient_reject-salient',
    '307_banner_customizetextlink_accept-salient',
    '308_banner_customizelink_accept-salient',
    '309_modal_reject-neutral_accept-salient', 
    '310_modal_accept-salient_reject-neutral', 
    '311_modal_customize-neutral_accept-salient', 
    '312_modal_accept-salient_customize-neutral',
    '313_banner_essential-salient_accept-salient_leginterest',
    '314_banner_essential-salient_accept-salient',
    '315_banner_customize-salient_accept-salient_leginterest'
];

let currentCaseIndex = 0;

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
        scenario_name: "bank_transfer",
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
        scenario_name: "bank_transfer",
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
    experimentStartTime = Date.now();
    logState("IBAN Form", 0);
    document.getElementById('mission-overlay').classList.add('hidden');
    
    const banner = document.getElementById('cookie-banner');
    const backdrop = document.getElementById('modal-backdrop');
    const btnContainer = document.querySelector('.cookie-btns');
    const cookieText = document.querySelector('.cookie-content p');
    
    const config = getActiveConfig();
    const parts = config.case.split('_');
    const num = parts[0];
    const displayType = parts[1];
    const leftBtnType = parts[2];
    const rightBtnType = parts[3];

    const defaultText = 'We and our trusted partners use cookies and similar technologies to process data on this device. This helps us ensure security and personalize your experience.';

    if (num === '313') {
        cookieText.innerHTML = defaultText + ' Some of our partners process your data on the basis of legitimate interest. You have a right to object by clicking the customize link. <a onclick="openCustomize()">Customize your cookies</a>';
    } else if (num === '314') {
        cookieText.innerHTML = defaultText + ' <a onclick="openCustomize()">Customize your cookies</a>';
    } else if (leftBtnType.includes('customizetextlink') || rightBtnType.includes('customizetextlink')) {
        cookieText.innerHTML = defaultText + ' <a onclick="openCustomize()">Customize your cookies</a>';
    } else {
        cookieText.innerHTML = defaultText + ' Please choose your preferences.';
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

    function createButton(typeString) {
        if (!typeString || typeString === 'customizetextlink') return null;
        const btn = document.createElement('button');
        if (typeString === 'customizelink') {
            btn.className = 'btn-link';
            btn.innerText = 'Customize';
            btn.onclick = openCustomize;
            return btn;
        }
        const bParts = typeString.split('-');
        const action = bParts[0];
        const style = bParts[1];
        if (style === 'salient') btn.className = 'btn-salient';
        else if (style === 'neutral') btn.className = 'btn-neutral';

        if (action === 'reject') {
            btn.innerText = 'Reject All';
            btn.id = 'cookie-reject';
            btn.onclick = () => logCookie('Reject All');
        } else if (action === 'accept') {
            btn.innerText = 'Accept All';
            btn.id = 'cookie-acceptall';
            btn.onclick = () => logCookie('Accept All');
        } else if (action === 'customize') {
            btn.innerText = 'Customize';
            btn.id = 'cookie-customize';
            btn.onclick = openCustomize;
        } else if (action === 'essential') {
            btn.innerText = 'Accept Essential';
            btn.id = 'cookie-essential';
            btn.onclick = () => logCookie('Accept Essential');
        }
        return btn;
    }

    if (num === '313' || num === '314') {
        btnContainer.appendChild(createButton('essential-salient'));
        btnContainer.appendChild(createButton('accept-salient'));
    } else if (num === '315') {
        btnContainer.appendChild(createButton('customize-salient'));
        btnContainer.appendChild(createButton('accept-salient'));
    } else if (num === '307') {
        btnContainer.appendChild(createButton(rightBtnType));
    } else {
        const leftBtn = createButton(leftBtnType);
        if (leftBtn) btnContainer.appendChild(leftBtn);
        const rightBtn = createButton(rightBtnType);
        if (rightBtn) btnContainer.appendChild(rightBtn);
    }
}

function openCustomize() {
    logState("Customize Modal", 0);
    document.getElementById('cookie-banner').classList.add('hidden');
    document.getElementById('customize-modal').classList.remove('hidden');
    document.querySelector('.customize-body').scrollTop = 0;
    
    const config = getActiveConfig();
    const details = document.querySelectorAll('.purpose-details');
    const titles = document.querySelectorAll('.purpose-title');
    const legRows = document.querySelectorAll('.leg-interest');

    if (config.case.startsWith('315')) {
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
    logState("IBAN Form", 0);
    document.getElementById('cookie-banner').classList.remove('hidden');
    document.getElementById('customize-modal').classList.add('hidden');
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
        scenario_name: "bank_transfer",
        category_name: config.category,
        case_name: config.case,
        button_clicked: action,
        reaction_time_ms: reactionTime,
        preferences: JSON.stringify(preferences),
        timestamp: Date.now() / 1000
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

async function completeTransfer() {
    logState("Success Screen", 0);
    const payload = {
        user_id: USER_ID,
        scenario_name: "bank_transfer",
        category_name: "Checkout",
        case_name: CASES[currentCaseIndex],
        button_clicked: "Authorize Transfer",
        reaction_time_ms: Date.now() - (experimentStartTime || Date.now()),
        timestamp: Date.now() / 1000
    };

    try {
        await fetch('/log_click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) { 
        console.error("Error logging transfer:", e); 
    }

    document.getElementById('transfer-form').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');
}

function nextScenario() {
    logState("Mission Overlay", 0);
    currentCaseIndex++;
    if (currentCaseIndex < CASES.length) {
        document.getElementById('rec-name').value = '';
        document.getElementById('rec-iban').value = '';
        document.getElementById('rec-amount').value = '';
        document.getElementById('rec-text').value = '';
        const checkboxes = document.querySelectorAll('#customize-modal input[type="checkbox"]');
        checkboxes.forEach(box => {
            if (box.id && box.id.includes('legitimate')) box.checked = true;
            else box.checked = false;
        }); 
        document.getElementById('success-screen').classList.add('hidden');
        document.getElementById('transfer-form').classList.remove('hidden');
        document.getElementById('mission-overlay').classList.remove('hidden');
        document.querySelector('.mission-card h2').innerText = `SCENARIO ${currentCaseIndex + 1}`;
    } else {
        window.location.href = '/'; 
    }
}

document.getElementById('rec-iban').addEventListener('input', function (e) {
    let rawValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    let formattedValue = rawValue.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = formattedValue.toUpperCase();
});