// Converts the input string into tokens that the code can work with.
function parseInput(_str) {
    _str = _str.trim();
    let nums = [""];
    let opStr = ""
    let decFound = false;
    let runOp = false;

    for (let i = 0; i < _str.length; i++) {
        if (_str[i] >= "0" && _str[i] <= "9") {
            nums[nums.length - 1] += _str[i];
        } else if (_str[i] == "." && !decFound) {
            nums[nums.length - 1] += _str[i];
            decFound = true;
        } else if (_str[i] == " " || _str[i] == String.fromCharCode(9)) {
            decFound = false;
            if (nums.length >= 2 && nums[1].length) runOp = true;
        } else if (_str[i] == "+" || _str[i] == "-" || _str[i] == "*" 
                || _str[i] == "\/") {
            if (nums.length >= 2 && nums[nums.length - 1].length) {
                runOp = true;
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
            console.log(nums[0] + " " + nums[1] + " " + opStr);
            let result = operate(Number(nums[0]), Number(nums[1]), opStr);
            console.log(result);
            break;
        }
    }

    // Split at whitespace
    // Convert to number if possible
    // Throw error if not readable
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
        result = _num1 / _num2;
    }

    return result;
}
