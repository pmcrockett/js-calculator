let g_display = document.querySelector(".display");
let g_eq = document.querySelector(".eq");
let g_opButtons = document.querySelectorAll(".op");
let g_clearButton = document.querySelector(".clear");
let g_undoButton = document.querySelector(".undo");
let g_displayStr = "";
let g_blockInput = false;

initListeners();

// Initializes input events
function initListeners() {
    g_opButtons.forEach(_elem => {
        _elem.addEventListener("click", function() {
            if (!g_blockInput) {
                g_displayStr += _elem.textContent;
            }
            updateDisplay();
        });
    });

    g_clearButton.addEventListener("click", function() {
        g_displayStr = "";
        g_blockInput = false;
        updateDisplay();
    });

    g_undoButton.addEventListener("click", function () {
        g_displayStr = g_displayStr.slice(0, g_displayStr.length - 1);
        g_blockInput = false;
        updateDisplay();
    });

    document.addEventListener("keydown", function(_e) {
        let selector = ""

        if (_e.key >= "0" && _e.key <= "9") {
            selector = _e.key;
        } else if (_e.key == "+") {
            selector = "add";
        } else if (_e.key == "-") {
            selector = "sub";
        } else if (_e.key == "*") {
            selector = "mult";
        } else if (_e.key == "\/") {
            selector = "div";
        } else if (_e.key == ".") {
            selector = "dot";
        } else if (_e.key == "Enter") {
            selector = "enter";
        } else if (_e.key == "Escape") {
            selector = "clear";
        } else if (_e.key == "Backspace" 
                || (_e.key.toLowerCase() == "z" && _e.ctrlKey)) {
            selector = "undo";
        }

        if (selector.length) {
            let event = new Event("click");
            let button = document.querySelector(`.key-${selector}`);
            button.dispatchEvent(event);
        }
    });
}

// Prints equation and result to screen.
function updateDisplay() {
    let input = parseInput(g_displayStr);
    g_displayStr = input.str;
    g_eq.textContent = getDisplayEq(input);

    if (g_eq.textContent == "Div0") {
        g_eq.textContent = ":(";
    }
    
    if (input.num2 && isNum(input.num2)) {
        let newText = operate(Number(input.num1), Number(input.num2), input.opStr);
        
        if (newText != "Div0") {
            g_display.textContent = newText;
        } else {
            g_display.textContent = "";
        }

        g_display.classList.add("disable");
    } else if (isNum(input.num1) && input.opStr == "") {
        if (input.num1 == "Div0") {
            g_blockInput = true;
            g_display.textContent = "Division by zero :(";
        } else {
            g_display.textContent = input.num1;
        }

        g_display.classList.remove("disable");
    } else {
        g_display.textContent = "";
    }
}

// Gets the display equation.
function getDisplayEq(_inputObj) {
   let displayStr = "";

    if (_inputObj.num1.length) {
        displayStr += _inputObj.num1;
    }

    if (_inputObj.opStr.length) {
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
            if (nums.length >= 2 && opStr.length && nums[0].length && isNum(nums[1])) {
                runOp = true;
            } else {
                _str = _str.slice(0, _str.length - 1);
            }
        } else if (_str[i] >= "0" && _str[i] <= "9") {
            nums[nums.length - 1] += _str[i];
        } else if (_str[i] == "." && !decFound) {
            nums[nums.length - 1] += _str[i];
            decFound = true;
        } else if (_str[i] == " " || _str[i] == String.fromCharCode(9)) {
            decFound = false;
        } else if (_str[i] == "+" || _str[i] == "-" || _str[i] == "*" 
                || _str[i] == "\/") {
            if (nums.length >= 2 && isNum(nums[1])) {
                runOp = true;
                i--;
            } else if (opStr == "" && isNum(nums[0])) {
                opStr = _str[i];
                nums.push("");
                decFound = false;
            } else if (_str[i] == "-" && !nums[nums.length - 1].length) {
                nums[nums.length - 1] += "-";
            } else if (_str[i] != "+") {
                _str = _str.slice(0, _str.length - 1);
            }
        } else {
            _str = _str.slice(0, _str.length - 1);
            break;
        }

        if (nums.length >= 2 && opStr.length && isNum(nums[0]) && isNum(nums[1])
                && runOp) {
            nums[0] = operate(Number(nums[0]), Number(nums[1]), opStr);

            if (nums[0] == "Div0") {
                nums[1] = "";
                opStr = "";
                break;
            }
            
            nums.pop();
            opStr = "";
            runOp = false;
        }
    }

    return { num1: nums[0], num2: nums[1] || null, opStr, str: _str };
}

// Checks if a number string has content or just a negative/dot symbol.
function isNum(_str) {
    return _str.length > 2 
        || (_str.length == 1 && _str[0] != "-" && _str[0] != ".")
        || (_str.length == 2 && (_str[0] != "-" || _str[1] != "."));
}

// Does the math.
function operate(_num1, _num2, _opStr) {
    let result = "Error";
    
    if (_opStr === "+") {
        result = formatFloat(_num1 + _num2);
    } else if (_opStr === "-") {
        result = formatFloat(_num1 - _num2);
    } else if (_opStr === "*") {
        result = formatFloat(_num1 * _num2);
    } else if (_opStr === "\/") {
        if (_num2 != 0) {
            result = formatFloat(_num1 / _num2);
        } else {
            result = "Div0";
        }
    }

    return result;
}

// Converts number to formatted string.
function formatFloat(_num) {
    return trimZeroes(String(_num.toFixed(6)));
}

// Formats a float by truncating trailing zeroes and (if needed) decimal points.
function trimZeroes(_str) {
    if (_str.search(".") >= 0) {
        let char = _str[_str.length - 1];
        
        while (char == "0" || char == ".") {
            _str = _str.slice(0, _str.length - 1);

            if (char == ".") break;
            char = _str[_str.length - 1];
        }
    }

    return _str;
}