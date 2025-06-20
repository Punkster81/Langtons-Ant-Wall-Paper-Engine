






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
        newSimulation();

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

    return { colors: tempColors, rules: tempRules };

}


function exportJSON() {

    let data = [];

    if (ants.length === 0) {
        showError("No ants to export.");
        return;
    }


    ants.forEach(ant => {
        data.push({ rules: ant.rules, colors: ant.colors });
    });


    const jsonStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
        showSuccess("Configuration copied to clipboard!");
    });
}


function openFileDialog() {
    const input = document.getElementById('jsonFileInput');
    // Clear the value BEFORE opening the dialog
    input.value = '';
    input.click();
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) {
        // User cancelled - clear the input to ensure next click works
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            let data = JSON.parse(e.target.result);

            if (!Array.isArray(data)) {
                //data is not object
                if (typeof data !== 'object' || data.rules === undefined || data.colors === undefined) {
                    showError("Invalid JSON structure. Expected an array of objects with 'rules' and 'colors' properties.");
                    // Clear input even on error
                    event.target.value = '';
                    return;
                }


                let tempData = [];
                tempData.push({
                    rules: data.rules,
                    colors: data.colors
                });

                data = tempData;
            }

            //check to make sure each ant has apporiate number of colors, if not give them colors, using the colors already given plus new colors
            data.forEach((item) => {
                // Initialize colors array if it doesn't exist
                if (!item.colors) {
                    item.colors = [];
                }

                if (item.colors.length != item.rules["0"].length) {
                    let tempColors = generateDistinctColors(item.rules["0"].length);

                    // Merge existing colors with new ones
                    let mergedColors = [...item.colors]; // Start with existing colors

                    // Add remaining colors from tempColors (skip the first item.colors.length)
                    for (let i = item.colors.length; i < tempColors.length; i++) {
                        mergedColors.push(tempColors[i]);
                    }

                    item.colors = mergedColors;
                }
            });

            newSimulation(data);

        } catch (error) {
            showError("Invalid JSON file: " + error.message);
        } finally {
            // Always clear the input after processing (success or error)
            event.target.value = '';
        }
    };

    reader.onerror = function () {
        showError("Error reading file");
        event.target.value = '';
    };

    reader.readAsText(file);
}




