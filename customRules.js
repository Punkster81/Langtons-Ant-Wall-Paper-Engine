



let rules = {
    "0": [
        { "writeColor": 1, "move": "R", "nextState": 0 },
        { "writeColor": 0, "move": "L", "nextState": 0 }
    ]
};
let colors = ["#000000", "#ffffff"];


function exportCustomRulesToJSON() {
    // Prepare export object
    const exportObj = {
        colors: colors,
        rules: rules
    };

    return JSON.stringify(exportObj, null, 2);
}



function applyCustomRuleSet() {
    const input = document.getElementById('customStates').value;
    try {
        const parsed = JSON.parse(input);

        if ((parsed.colors && !Array.isArray(parsed.colors)) || typeof parsed.rules !== 'object') {
            throw new Error("Invalid JSON structure.");
        }

        const maxColorIndex = getMaxColorIndex(parsed.rules);

        let length = parsed.colors ? parsed.colors.length : 0
        // Generate colors if we need more than what's provided
        if (length <= maxColorIndex) {
            const requiredColors = maxColorIndex + 1;
            colors = generateDistinctColors(requiredColors);
            // Preserve any existing custom colors from the parsed input
            for (let i = 0; i < Math.min(length, colors.length); i++) {
                colors[i] = parsed.colors[i];
            }
        } else {
            colors = [...parsed.colors];
        }


        const hueStart = Math.floor(Math.random() * 360); // random starting hue
        const hueStep = 360 / maxColorIndex;
        const saturation = 90;
        const lightness = 50;
        // Generate additional colors if needed
        for (let i = colors.length; i < maxColorIndex; i++) {
            const hue = (hueStart + i * hueStep) % 360;
            colors.push(hslToHex(hue, saturation, lightness));
        }

        rules = parsed.rules;
        resetSimulation();

    } catch (err) {
        showError("JSON error: " + err.message);
    }
}

function getMaxColorIndex(rules) {
    let max = 0;
    for (const state in rules) {
        for (const color in rules[state]) {
            const c = parseInt(color);
            const writeColor = rules[state][color].writeColor;
            if (!isNaN(c)) max = Math.max(max, c);
            if (!isNaN(writeColor)) max = Math.max(max, writeColor);
        }
    }
    return max;
}




function generateDistinctColors(numColors) {
    numColors = Math.max(2, numColors);
    const colors = ['#000000', '#ffffff']; // First two fixed

    if (numColors > 2) {
        const additionalCount = numColors - 2;

        const hueStart = Math.floor(Math.random() * 360); // random starting hue
        const hueStep = 360 / additionalCount;
        const saturation = 90;
        const lightness = 50;

        for (let i = 0; i < additionalCount; i++) {
            const hue = (hueStart + i * hueStep) % 360;
            colors.push(hslToHex(hue, saturation, lightness));
        }
    }

    return colors;
}


// Convert HSL to hex string
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Then generate rules with this color array:
function generateRandomRules(numColors, numStates) {
    numColors = Math.max(2, numColors);
    numStates = Math.max(1, numStates);

    const tempColors = generateDistinctColors(numColors);

    const tempRules = {};
    for (let state = 0; state < numStates; state++) {
        tempRules[state] = [];
        for (let colorIndex = 0; colorIndex < numColors; colorIndex++) {
            tempRules[state].push({
                writeColor: Math.floor(Math.random() * numColors),
                move: moves[Math.floor(Math.random() * moves.length)],
                nextState: Math.floor(Math.random() * numStates)
            });
        }
    }

    colors = tempColors;
    rules = tempRules
}


function exportJSON() {
    const data = {
        rules,
        colors,
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "langtons-ant-config.json";
    a.click();

    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            // Apply settings from imported JSON
            if (data.rules) rules = data.rules;
            if (data.colors) colors = data.colors;

            // Optionally reinitialize

            resizeCanvas();
            updateRulesBox();
            const input = document.getElementById('jsonFileInput');
            input.value = ''; // Clear the previously selected file
        } catch (error) {
            showError("Invalid JSON file: " + error.message);
        }
    };

    reader.readAsText(file);
}




