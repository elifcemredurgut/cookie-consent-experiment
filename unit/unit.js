let experimentStartTime = null;

const CASES = [
    '401_banner_reject-neutral_accept-salient', 
    '402_banner_accept-salient_reject-neutral', 
    '403_banner_customize-neutral_accept-salient', 
    '404_banner_accept-salient_customize-neutral',
    '405_banner_accept-salient_customize-salient',
    '406_banner_accept-salient_reject-salient',
    '407_banner_customizetextlink_accept-salient',
    '408_banner_customizelink_accept-salient',
    '409_modal_reject-neutral_accept-salient', 
    '410_modal_accept-salient_reject-neutral', 
    '411_modal_customize-neutral_accept-salient', 
    '412_modal_accept-salient_customize-neutral',
    '413_banner_essential-salient_accept-salient_leginterest',
    '414_banner_essential-salient_accept-salient',
    '415_banner_customize-salient_accept-salient_leginterest'
];

let currentCaseIndex = 0;

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
        scenario_name: "unit_converter",
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
        scenario_name: "unit_converter",
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
    logState("Converter Form", 0);
    experimentStartTime = Date.now();
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

    if (num === '413') {
        cookieText.innerHTML = defaultText + ' Some of our partners process your data on the basis of legitimate interest. You have a right to object by clicking the customize link. <a onclick="openCustomize()">Customize your cookies</a>';
    } else if (num === '414') {
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

        if (style === 'salient') {
            btn.className = 'btn-salient';
        } else if (style === 'neutral') {
            btn.className = 'btn-neutral';
        }

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

    if (num === '413' || num === '414') {
        btnContainer.appendChild(createButton('essential-salient'));
        btnContainer.appendChild(createButton('accept-salient'));
    } else if (num === '415') {
        btnContainer.appendChild(createButton('customize-salient'));
        btnContainer.appendChild(createButton('accept-salient'));
    } else if (num === '407') {
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
    const titles = document.querySelectorAll('.purpose-title');
    const details = document.querySelectorAll('.purpose-details');
    const legRows = document.querySelectorAll('.leg-interest');

    if (config.case.startsWith('416')) {
        titles.forEach(t => t.classList.remove('active'));
        details.forEach(d => d.classList.remove('active'));
        legRows.forEach(r => r.style.display = 'flex');
    } else if (config.case.startsWith('415')) {
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
    logState("Converter Form", 0);
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
        scenario_name: "unit_converter",
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
    } catch (e) {}
}

async function performConversion() {
    logState("Success Screen", 0);
    const amountInput = document.getElementById('conv-amount').value;

    if(!amountInput) {
        alert("Please enter a value to convert.");
        return;
    }

    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    const amount = parseFloat(amountInput);
    let resultAmount = amount;

    if (fromUnit === 'F' && toUnit === 'C') {
        resultAmount = (amount - 32) * 5/9;
    } else if (fromUnit === 'C' && toUnit === 'F') {
        resultAmount = (amount * 9/5) + 32;
    }

    const fromLabel = fromUnit === 'F' ? 'Fahrenheit' : 'Celsius';
    const toLabel = toUnit === 'C' ? 'Celsius' : 'Fahrenheit';
    document.getElementById('conversion-result').innerText = `${amount} ${fromLabel} = ${resultAmount.toFixed(2)} ${toLabel}`;

    const payload = {
        user_id: USER_ID,
        scenario_name: "unit_converter",
        category_name: "Checkout",
        case_name: CASES[currentCaseIndex],
        button_clicked: "Convert",
        reaction_time_ms: Date.now() - (experimentStartTime || Date.now())
    };

    try {
        await fetch('/log_click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {}

    document.getElementById('converter-form').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');
}

function nextScenario() {
    logState("Mission Overlay", 0);
    currentCaseIndex++;
    
    if (currentCaseIndex < CASES.length) {
        document.getElementById('conv-amount').value = '';
        
        const checkboxes = document.querySelectorAll('#customize-modal input[type="checkbox"]');
        checkboxes.forEach(box => {
            if (box.id && box.id.includes('legitimate')) {
                box.checked = true;
            } else {
                box.checked = false;
            }
        });        
        document.getElementById('success-screen').classList.add('hidden');
        document.getElementById('converter-form').classList.remove('hidden');
        document.getElementById('mission-overlay').classList.remove('hidden');
        document.querySelector('.mission-card h2').innerText = `SCENARIO ${currentCaseIndex + 4}`;
    } else {
        window.location.href = '/'; 
    }
}