let experimentStartTime = null;

const CASES = [
    '401_banner_reject_accept', 
    '402_banner_accept_reject', 
    '403_banner_customize_accept', 
    '404_banner_accept_customize',
    '405_modal_reject_accept', 
    '406_modal_accept_reject', 
    '407_modal_customize_accept', 
    '408_modal_accept_customize'
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

function getActiveConfig() {
    return {
        case: CASES[currentCaseIndex],
        category: 'Cookie'
    };
}

function startMission() {
    experimentStartTime = Date.now();
    document.getElementById('mission-overlay').classList.add('hidden');
    
    const banner = document.getElementById('cookie-banner');
    const backdrop = document.getElementById('modal-backdrop');
    const btnContainer = document.querySelector('.cookie-btns');
    
    const config = getActiveConfig();
    
    const [num, displayType, leftBtnType, rightBtnType] = config.case.split('_');

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
}

function openCustomize() {
    document.getElementById('cookie-banner').classList.add('hidden');
    document.getElementById('customize-modal').classList.remove('hidden');
    document.querySelector('.customize-body').scrollTop = 0;
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
    } catch (e) {
    }
}

async function performConversion() {
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
    } catch (e) { 
    }

    document.getElementById('converter-form').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');
}

function nextScenario() {
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
        
        document.querySelector('.mission-card h2').innerText = `SCENARIO ${currentCaseIndex + 1}`;
    } else {
        window.location.href = '/'; 
    }
}