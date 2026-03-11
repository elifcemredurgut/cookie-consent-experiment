let participantId = "";
let currentScenario = 0;
let startTime;
let finalScenarioList = [];

const baseScenarios = [
    // PART 1: STROOP EFFECT
    // Case 1: Congruent - Choose red text
    {
        name: "Stroop_1_Congruent",
        isStroop: true,
        instruction: "Select the button where the text says red",
        buttons: [
            { id: "target", text: "RED", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "distractor", text: "GREEN", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // Case 2: Congruent - Choose red color
    {
        name: "Stroop_2_Congruent",
        isStroop: true,
        instruction: "Select the button with the color red",
        buttons: [
            { id: "target", text: "RED", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "distractor", text: "GREEN", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // Case 3: Incongruent - Choose red text
    {
        name: "Stroop_3_Incongruent_Text",
        isStroop: true,
        instruction: "Select the button where the text says red",
        buttons: [
            { id: "distractor", text: "GREEN", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "target", text: "RED", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // Case 4: Incongruent - Choose red color
    {
        name: "Stroop_4_Incongruent_Color",
        isStroop: true,
        instruction: "Select the button with the color red",
        buttons: [
            { id: "target", text: "GREEN", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "distractor", text: "RED", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // Case 5: Incongruent - Choose green color
    {
        name: "Stroop_5_Incongruent_Color_Green",
        isStroop: true,
        instruction: "Select the button with the color green",
        buttons: [
            { id: "distractor", text: "GREEN", class: "btn-stroop", inlineStyle: "color: red;" },
            { id: "target", text: "RED", class: "btn-stroop", inlineStyle: "color: green;" }
        ]
    },
    // PART 2: LINK VS BUTTON (Accept is on the right)
    // Case 1: Button: Reject | Button: Accept
    {
        name: "Cookie_1_BtnReject_BtnAccept",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "ButtonLink",
        buttons: [
            { id: "reject", text: "Reject All", class: "btn-neutral" },
            { id: "accept", text: "Accept All", class: "btn-neutral" }
        ]
    },/*
    // Case 2: Link: Reject | Link: Accept
    {
        name: "Cookie_2_LinkReject_LinkAccept",
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
        name: "Cookie_3_BtnEssential_BtnAccept",
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
        name: "Cookie_4_LinkEssential_LinkAccept",
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
        name: "Cookie_5_BtnReject_LinkAccept",
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
        name: "Cookie_6_BtnEssential_LinkAccept",
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
        name: "Cookie_7_LinkReject_BtnAccept",
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
        name: "Cookie_8_LinkEssential_BtnAccept",
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
        name: "Cookie_1_BtnAccept_BtnReject",
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
        name: "Cookie_2_LinkAccept_LinkReject",
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
        name: "Cookie_3_BtnAccept_BtnEssential",
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
        name: "Cookie_4_LinkAccept_LinkEssential",
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
        name: "Cookie_5_LinkAccept_BtnReject",
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
        name: "Cookie_6_LinkAccept_BtnEssential_",
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
        name: "Cookie_7_BtnAccept_LinkReject",
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
        name: "Cookie_8_BtnAccept_LinkEssential",
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
        name: "Cookie_1_SalientReject_SalientAccept",
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
        name: "Cookie_2_NeutralReject_SalientAccept",
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
        name: "Cookie_3_SalientReject_NeutralAccept",
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
        name: "Cookie_4_SalientAccept_SalientReject",
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
        name: "Cookie_5_SalientAccept_NeutralReject",
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
        name: "Cookie_6_NeutralAccept_SalientReject",
        isStroop: false,
        title: "Cookie Preferences",
        text: "We use cookies to ensure you get the best experience on our website.",
        category_name: "SalientNeutral",
        buttons: [
            { id: "accept", text: "Accept All", class: "btn-neutral" },
            { id: "reject", text: "Reject All", class: "btn-salient" },
        ]
    },*/
];

const mindsetScenarios = [
    { id: "unsafe_no_pressure", instruction: "Imagine that you are at Aalto University library and using a public computer found in the library. You need to log in to your bank account to make a money transfer. Tonight is the deadline to make the transfer but you do not have time pressure." },
    { id: "neutral", instruction: "Imagine that you are at home on a Sunday morning using your personal laptop. You are browsing a local news website to check the weekend weather forecast and read a few headlines. You have no specific time pressure" },
    { id: "unsafe_pressure", instruction: "Imagine that you are on your own personal laptop at home. You have been waiting for months to buy tickets for your favorite band’s farewell tour. The tickets are sold out on TicketMaster but your friend has just found a website \
        which sells extra tickets with the same price. You just want to finish the transaction before the tickets sell out." }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let countdownInterval;

function startTimer(durationSeconds) {
    clearInterval(countdownInterval);
    let timer = durationSeconds;
    const display = document.getElementById('time-left');
    const timerDiv = document.getElementById('timer-display');
    
    timerDiv.classList.remove('hidden');

    countdownInterval = setInterval(() => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdownInterval);
            display.textContent = "00:00";
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdownInterval);
    document.getElementById('timer-display').classList.add('hidden');
}

function buildExperimentFlow() {
    finalScenarioList = baseScenarios.filter(s => s.isStroop);

    mindsetScenarios.forEach(mindset => {
        finalScenarioList.push({
            name: `Context_${mindset.id}`,
            isContextPrompt: true,
            text: mindset.instruction
        });

        let cookieCases = baseScenarios.filter(s => !s.isStroop).map(s => ({
            ...s,
            name: s.name,
            mindsetLabel: mindset.id
        }));
        cookieCases = shuffleArray(cookieCases);
        finalScenarioList.push(...cookieCases);
    });
}

function startExperiment() {
    const idInput = document.getElementById('participant-id');
    if (idInput.value.trim() === "") {
        alert("Please enter a Participant ID.");
        return;
    }
    participantId = idInput.value;
    
    buildExperimentFlow();
    document.getElementById('setup-phase').classList.add('hidden');
    loadScenario();
}

function loadScenario() {
    document.getElementById('context-phase').classList.add('hidden');
    document.getElementById('experiment-phase').classList.add('hidden');
    document.getElementById('fixation-phase').classList.remove('hidden');
}

function renderBanner() {
    document.getElementById('fixation-phase').classList.add('hidden');
    document.getElementById('context-phase').classList.add('hidden');
    document.getElementById('experiment-phase').classList.add('hidden');

    const scenario = finalScenarioList[currentScenario];

    if (scenario.mindsetLabel === "unsafe_pressure" && !scenario.isContextPrompt) {
        startTimer(120);
    } else {
        stopTimer();
    }
    
    if (scenario.isContextPrompt) {
        const contextPhase = document.getElementById('context-phase');
        document.getElementById('context-instruction').innerText = scenario.text;
        contextPhase.classList.remove('hidden');
    } else {
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
        user_id: participantId,
        scenario_name: current.mindsetLabel || "Stroop",
        category_name: current.category_name || "Stroop",
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
        document.getElementById('experiment-phase').classList.add('hidden');        
        const completionPhase = document.getElementById('completion-phase');
        completionPhase.classList.remove('hidden');
        
        console.log("Experiment finished. Showing completion screen.");
    }
}