let g_display = document.querySelector(".display");
let g_history = document.querySelector(".history");
let g_opButtons = document.querySelectorAll(".op");
let g_clearButton = document.querySelector(".clear");
let g_backButton = document.querySelector(".back");
let g_displayStr = "";

initListeners();

function initListeners() {
    // Buttons
    g_opButtons.forEach(_elem => {
        _elem.addEventListener("click", function () {
            console.log(_elem.textContent);
            g_displayStr += _elem.textContent;
            updateDisplay();
        });
    });
    g_clearButton.addEventListener("click", function () {
        g_displayStr = "";
        updateDisplay();
    });
    g_backButton.addEventListener("click", function () {
        g_displayStr = g_displayStr.slice(0, g_displayStr.length - 1);
        updateDisplay();
    });
}
// while (true) {
//     let input = parseInput("1 + 2");
//     g_display.textContent = getDisplayStr(input);
// }

function updateDisplay() {
    g_display.textContent = getDisplayStr(parseInput(g_displayStr));
    g_history.textContent = g_displayStr;
}

function getDisplayStr(_inputObj) {
   let displayStr = "";

    if (_inputObj.num1.length) {
        displayStr += _inputObj.num1;
    }

    if (_inputObj.opStr && _inputObj.opStr.length) {
        //displayStr += `${ _inputObj.opStr }`;
        displayStr += " " + _inputObj.opStr + " ";
    }

    if (_inputObj.num2 && _inputObj.num2.length) {
        displayStr += _inputObj.num2;
    }

    return displayStr;
}

// Converts the input string into tokens that the code can work with.
function parseInput(_str) {
    _str = _str.trim();
    let nums = [""];
    let opStr = ""
    let decFound = false;
    let runOp = false;

    for (let i = 0; i < _str.length; i++) {
        if (_str[i] == "=") {
            if (nums.length >= 2 && opStr.length && nums[0].length && nums[1].length) {
                runOp = true;
            } else {
                console.log("Error (equals)");
            }
        } else if (_str[i] >= "0" && _str[i] <= "9") {
            nums[nums.length - 1] += _str[i];
        } else if (_str[i] == "." && !decFound) {
            nums[nums.length - 1] += _str[i];
            decFound = true;
        } else if (_str[i] == " " || _str[i] == String.fromCharCode(9)) {
            decFound = false;
            //if (nums.length >= 2 && nums[1].length) runOp = true;
        } else if (_str[i] == "+" || _str[i] == "-" || _str[i] == "*" 
                || _str[i] == "\/") {
            if (nums.length >= 2 && nums[1].length) {
                runOp = true;
                i--;
                //break;
            } else if (opStr == "" && nums[0].length) {
                opStr = _str[i];
                nums.push("");
                decFound = false;
            } else if (_str[i] == "-") {
                if (nums.length > 1) {
                    nums[nums.length - 1] += "-";
                } else {
                    nums[0] += "-";
                }
            } else if (_str[i] != "+") {
                console.log("Error (opStr != +)");
                break;
            }
        } else {
            // Error
            console.log("Error");
            break;
        }

        if (nums.length >= 2 && opStr.length && nums[0].length && nums[1].length 
                && (i >= _str.length - 1 || runOp)) {
            //console.log(nums[0] + " " + nums[1] + " " + opStr);
            //let result = operate(Number(nums[0]), Number(nums[1]), opStr);
            //console.log(result);
            nums[0] = operate(Number(nums[0]), Number(nums[1]), opStr);
            nums.pop();
            opStr = "";
            runOp = false;
            //break;
        }
    }

    return { num1: nums[0], num2: nums[1] || null, opStr };
}

function operate(_num1, _num2, _opStr) {
    let result = "Error (operate)";
    
    if (_opStr === "+") {
        result = _num1 + _num2;
    } else if (_opStr === "-") {
        result = _num1 - _num2;
    } else if (_opStr === "*") {
        result = _num1 * _num2;
    } else if (_opStr === "\/") {
        if (_num2 != 0) {
            result = _num1 / _num2;
        } else {
            result = "Div by 0 :(";
        }
    }

    return String(result);
}
