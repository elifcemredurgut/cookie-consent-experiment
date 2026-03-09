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
    },
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
    },
];

const mindsetScenarios = [
    { id: "Unsafe", instruction: "IMAGINE: This is your friend's laptop. You are about to log into your BANK account. You are very concerned about privacy and security." },
    { id: "Neutral", instruction: "IMAGINE: You are browsing a public news website to check the weather. You have no specific concerns." },
    { id: "Safe", instruction: "IMAGINE: You are on your own personal, encrypted computer at home, browsing a site you have trusted for years." }
];

function buildExperimentFlow() {
    finalScenarioList = baseScenarios.filter(s => s.isStroop);

    mindsetScenarios.forEach(mindset => {
        finalScenarioList.push({
            name: `Context_${mindset.id}`,
            isContextPrompt: true,
            text: mindset.instruction
        });

        const cookieCases = baseScenarios.filter(s => !s.isStroop).map(s => ({
            ...s,
            name: s.name,
            mindsetLabel: mindset.id
        }));
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
        document.getElementById('completion-phase').classList.remove('hidden');
    }
}