let currentScenario = 0;
let startTime;
let finalScenarioList = [];
let countdownInterval;
let isTimerRunning = false;

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
    const current = finalScenarioList[currentScenario] || { mindsetLabel: "intro", name: "initial" };
    const payload = {
        user_id: USER_ID,
        scenario_name: current.mindsetLabel || "stroop",
        case_name: current.name || "N/A",
        page_name: pageName,
        scroll_y: Math.round(scrollY),
        timestamp: Date.now() / 1000
    };

    try {
        await fetch('http://127.0.0.1:8000/log_state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) { console.error("Error logging state:", e); }
}

const baseScenarios = [
    // PART 1: STROOP EFFECT
    // Case 1: Congruent - Choose red text
    {
        name: "001_congruent_text",
        isStroop: true,
        instruction: "Select the button where the text says red",
        category_name: "Stroop",
        buttons: [
            { id: "target", text: "RED", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "distractor", text: "GREEN", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // Case 2: Congruent - Choose red color
    {
        name: "002_congruent_color",
        isStroop: true,
        instruction: "Select the button with the color red",
        category_name: "Stroop",
        buttons: [
            { id: "target", text: "RED", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "distractor", text: "GREEN", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // Case 3: Incongruent - Choose red text
    {
        name: "003_incongruent_text",
        isStroop: true,
        instruction: "Select the button where the text says red",
        category_name: "Stroop",
        buttons: [
            { id: "distractor", text: "GREEN", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "target", text: "RED", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // Case 4: Incongruent - Choose red color
    {
        name: "004_incongruent_color",
        isStroop: true,
        instruction: "Select the button with the color red",
        category_name: "Stroop",
        buttons: [
            { id: "target", text: "GREEN", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "distractor", text: "RED", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // Case 5: Incongruent - Choose green color
    {
        name: "005_incongruent_color",
        isStroop: true,
        instruction: "Select the button with the color green",
        category_name: "Stroop",
        buttons: [
            { id: "distractor", text: "GREEN", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "target", text: "RED", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // PART 2: LINK VS BUTTON (Accept is on the right)
    // Case 1: Button: Reject | Button: Accept
    {
        name: "101_btnReject_btnAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "reject", text: "Reject All", class: "btn-neutral" },
            { id: "accept", text: "Accept All", class: "btn-neutral" }
        ]
    },
    // Case 2: Link: Reject | Link: Accept
    {
        name: "102_linkReject_linkAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "reject", text: "Reject All", class: "link-muted" },
            { id: "accept", text: "Accept All", class: "link-muted" }
        ]
    },
    // Case 3: Button: Accept Essential | Button: Accept
    {
        name: "103_btnEssential_btnAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "reject", text: "Accept Essential", class: "btn-neutral" },
            { id: "accept", text: "Accept All", class: "btn-neutral" }
        ]
    },
    // Case 4: Link: Accept Essential | Link: Accept
    {
        name: "104_linkEssential_linkAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "reject", text: "Accept Essential", class: "link-muted" },
            { id: "accept", text: "Accept All", class: "link-muted" }
        ]
    },
    // Case 5: Button: Reject | Link: Accept
    {
        name: "105_btnReject_linkAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "reject", text: "Reject All", class: "btn-neutral" },
            { id: "accept", text: "Accept All", class: "link-muted" }
        ]
    },
    // Case 6: Button: Accept Essential | Link: Accept
    {
        name: "106_btnEssential_linkAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "essential", text: "Accept Essential", class: "btn-neutral" },
            { id: "accept", text: "Accept All", class: "link-muted" }
        ]
    },
    // Case 7: Link: Reject | Button: Accept
    {
        name: "107_linkReject_btnAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "reject", text: "Reject All", class: "link-muted" },
            { id: "accept", text: "Accept All", class: "btn-neutral" }
        ]
    },
    // Case 8: Link: Accept Essential | Button: Accept
    {
        name: "108_linkEssential_btnAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "essential", text: "Accept Essential", class: "link-muted" },
            { id: "accept", text: "Accept All", class: "btn-neutral" }
        ]
    },
    // PART 3: LINK VS BUTTON (Accept is on the left)
    // Case 1: Button: Accept | Button: Reject
    {
        name: "109_btnAccept_btnReject",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "accept", text: "Accept All", class: "btn-neutral" },
            { id: "reject", text: "Reject All", class: "btn-neutral" }
            
        ]
    },
    // Case 2: Link: Accept | Link: Reject
    {
        name: "110_linkAccept_linkReject",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "reject", text: "Reject All", class: "link-muted" },
            { id: "accept", text: "Accept All", class: "link-muted" }
        ]
    },
    // Case 3: Button: Accept | Button: Accept Essential
    {
        name: "111_btnAccept_btnEssential",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "accept", text: "Accept All", class: "btn-neutral" },
            { id: "reject", text: "Accept Essential", class: "btn-neutral" }
        ]
    },
    // Case 4: Link: Accept | Link: Accept Essential
    {
        name: "112_linkAccept_linkEssential",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "accept", text: "Accept All", class: "link-muted" },
            { id: "reject", text: "Accept Essential", class: "link-muted" }
        ]
    },
    // Case 5: Link: Accept | Button: Reject
    {
        name: "113_linkAccept_btnReject",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "accept", text: "Accept All", class: "link-muted" },
            { id: "reject", text: "Reject All", class: "btn-neutral" }
        ]
    },
    // Case 6: Link: Accept | Button: Accept Essential
    {
        name: "114_linkAccept_btnEssential",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "accept", text: "Accept All", class: "link-muted" },
            { id: "essential", text: "Accept Essential", class: "btn-neutral" }
        ]
    },
    // Case 7: Button: Accept | Link: Reject
    {
        name: "115_btnAccept_linkReject",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "accept", text: "Accept All", class: "btn-neutral" },
            { id: "reject", text: "Reject All", class: "link-muted" }
        ]
    },
    // Case 8: Link: Button: Accept | Accept Essential
    {
        name: "116_btnAccept_linkEssential",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "accept", text: "Accept All", class: "btn-neutral" },
            { id: "essential", text: "Accept Essential", class: "link-muted" }
        ]
    },
    // PART 4: SALIENT VS NEUTRAL BUTTON
    // Case 1: Salient: Reject | Salient: Accept
    {
        name: "117_salientReject_salientAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "SalientNeutral",
        buttons: [
            { id: "reject", text: "Reject All", class: "btn-salient" },
            { id: "accept", text: "Accept All", class: "btn-salient" }
        ]
    },
    // Case 2: Neutral: Reject | Salient: Accept
    {
        name: "118_neutralReject_salientAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "SalientNeutral",
        buttons: [
            { id: "reject", text: "Reject All", class: "btn-neutral" },
            { id: "accept", text: "Accept All", class: "btn-salient" }
        ]
    },
    // Case 3: Salient: Reject | Neutral: Accept
    {
        name: "119_salientReject_neutralAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "SalientNeutral",
        buttons: [
            { id: "reject", text: "Reject All", class: "btn-salient" },
            { id: "accept", text: "Accept All", class: "btn-neutral" }
        ]
    },
    // Case 4: Salient: Accept | Salient: Reject
    {
        name: "120_salientAccept_salientReject",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "SalientNeutral",
        buttons: [
            { id: "accept", text: "Accept All", class: "btn-salient" },
            { id: "reject", text: "Reject All", class: "btn-salient" }
        ]
    },
    // Case 5: Salient: Accept | Neutral: Reject
    {
        name: "121_salientAccept_neutralReject",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "SalientNeutral",
        buttons: [
            { id: "accept", text: "Accept All", class: "btn-salient" },
            { id: "reject", text: "Reject All", class: "btn-neutral" },
        ]
    },
    // Case 6: Neutral: Accept | Salient: Reject
    {
        name: "122_neutralAccept_salientReject",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "SalientNeutral",
        buttons: [
            { id: "accept", text: "Accept All", class: "btn-neutral" },
            { id: "reject", text: "Reject All", class: "btn-salient" },
        ]
    },
];

const mindsetScenarios = [
    { id: "unsafe_no_pressure", instruction: "Imagine that you are at Aalto University library and using a public computer found in the library. You need to log in to your bank account to make a money transfer. Tonight is the deadline to make the transfer but you do not have time pressure." },
    { id: "neutral", instruction: "Imagine that you are at home on a Sunday morning using your personal laptop. You are browsing a local news website to check the weekend weather forecast and read a few headlines. You have no specific time pressure" },
    { id: "unsafe_pressure", instruction: "Imagine that you are on your own personal laptop at home. You have been waiting for months to buy tickets for your favorite band’s farewell tour. The tickets are sold out on TicketMaster but your friend has just found a website which sells extra tickets with the same price. You just want to finish the transaction before the tickets sell out." }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer(durationSeconds) {
    if (isTimerRunning) return; 

    clearInterval(countdownInterval);
    isTimerRunning = true; 
    let timer = durationSeconds;
    const display = document.getElementById('time-left');
    const timerDiv = document.getElementById('timer-display');
    
    function updateDisplay() {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
    }

    updateDisplay(); 
    timerDiv.classList.remove('hidden');

    countdownInterval = setInterval(() => {
        if (--timer < 0) {
            clearInterval(countdownInterval);
            display.textContent = "00:00";
            isTimerRunning = false; 
        } else {
            updateDisplay(); 
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdownInterval);
    document.getElementById('timer-display').classList.add('hidden');
    isTimerRunning = false;
}

function buildExperimentFlow() {
    finalScenarioList = baseScenarios.filter(s => s.isStroop);

    mindsetScenarios.forEach(mindset => {
        finalScenarioList.push({
            name: `Context_${mindset.id}`,
            isContextPrompt: true,
            mindsetLabel: mindset.id,
            text: mindset.instruction
        });

        let cookieCases = baseScenarios.filter(s => !s.isStroop).map(s => ({
            ...s,
            mindsetLabel: mindset.id
        }));
        cookieCases = shuffleArray(cookieCases);
        finalScenarioList.push(...cookieCases);
    });
}

function startExperiment() {    
    buildExperimentFlow();
    // Log once for the very first intro overlay
    logState("Mission Overlay", 0);
}

function closeOverlay() {
    document.getElementById('mission-overlay').classList.add('hidden');
    // Moving to the next step logs the Next Button only after user action
    loadScenario();
}

function loadScenario() {
    document.getElementById('context-phase').classList.add('hidden');
    document.getElementById('experiment-phase').classList.add('hidden');
    document.getElementById('fixation-phase').classList.remove('hidden');
    
    // Logs intermediate state only when this specific view is rendered
    logState("Next Button", 0);
}

function renderBanner() {
    document.getElementById('fixation-phase').classList.add('hidden');
    const scenario = finalScenarioList[currentScenario];

    if (scenario.mindsetLabel === "unsafe_pressure" && !scenario.isContextPrompt) {
        startTimer(120);
    } else {
        stopTimer();
    }
    
    if (scenario.isContextPrompt) {
        logState("Mission Overlay", 0);
        const contextPhase = document.getElementById('context-phase');
        document.getElementById('context-instruction').innerText = scenario.text;
        contextPhase.classList.remove('hidden');
    } else {
        logState("Case", 0);
        const experimentPhase = document.getElementById('experiment-phase');
        const buttonArea = document.getElementById('button-area');
        const instructionEl = document.getElementById('task-instruction');
        const titleEl = document.getElementById('banner-title');
        const textEl = document.getElementById('banner-text');

        buttonArea.innerHTML = '';

        if (scenario.isStroop) {
            instructionEl.innerText = scenario.instruction;
            instructionEl.classList.remove('hidden');
            titleEl.classList.add('hidden');
            textEl.classList.add('hidden');
        } else {
            instructionEl.classList.add('hidden');
            titleEl.classList.remove('hidden');
            textEl.classList.remove('hidden');
            titleEl.innerText = scenario.title;
            textEl.innerText = scenario.text;
        }

        scenario.buttons.forEach(btn => {
            const el = document.createElement('button');
            el.innerText = btn.text;
            if (btn.class) el.className = btn.class;
            if (btn.inlineStyle) el.style.cssText += btn.inlineStyle;
            el.onclick = () => handleChoice(btn.id);
            buttonArea.appendChild(el);
        });

        experimentPhase.classList.remove('hidden');
        startTime = performance.now(); 
    }
}

function proceedFromContext() {
    currentScenario++;
    loadScenario();
}

async function handleChoice(choice) {
    const reactionTime = performance.now() - startTime;
    const current = finalScenarioList[currentScenario];
    
    const payload = {
        user_id: USER_ID,
        scenario_name: current.mindsetLabel || "stroop",
        category_name: current.category_name,
        case_name: current.name,
        button_clicked: choice,
        reaction_time_ms: parseFloat(reactionTime.toFixed(2))
    };

    try {
        await fetch('http://127.0.0.1:8000/log_click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.error("Database save failed.", e);
    }

    currentScenario++;
    if (currentScenario < finalScenarioList.length) {
        loadScenario();
    } else {
        logState("Completion Phase", 0);
        document.getElementById('experiment-phase').classList.add('hidden');        
        const completionPhase = document.getElementById('completion-phase');
        completionPhase.classList.remove('hidden');
    }
}

window.onload = startExperiment;