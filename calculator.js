const operatorToOperation = {
    "+": (a, b) => Number(a) + Number(b),
    "-": (a, b) => Number(a) - Number(b),
    "*": (a, b) => Number(a) * Number(b),
    "/": (a, b) => Number(a) / Number(b),
}
const operate = (left, operator, right) => operatorToOperation[operator](left, right);

let operands = {
    left: '',
    operator: '',
    right: '',
}
const getOperands = () => [operands.left, operands.operator, operands.right];


let operandState = 'left';
const resetState = () => operandState = 'left';

function updateOperand(input, mode) {
    switch (mode) {
        case 'append':
            operands[operandState] += input;
            break;
        case 'new':
            operands[operandState] = input;
            break;
    }
    return operands[operandState];
}

function calculateResult() {
    let [left, operator, right] = getOperands();
    let result = operate(left, operator, right);

    /**
     * Update left operand without clearing other operands. This is to 
     * allow operand reuse on clicking '=' button again
     */
    resetState();
    updateOperand(result, 'new');
}

function readInput(input) {
    const isNumber = (arg) => !isNaN(arg);
    switch (operandState) {
        case 'left':
            operandState = isNumber(input) ? operandState : 'operator';
            updateOperand(input);
            break;
        case 'operator':
            operandState = isNumber(input) ? 'right' : operandState;
            updateOperand(input);
            break;
        case 'right':
            if (isNumber(input)) {
                updateOperand(input);
            }
            break;
    }
}

function updateDisplay() {
    const display = document.querySelector(".display");
    display.textContent = operands[operandState];
}

function clearData() {
    operands.left = '';
    operands.operator = '';
    operands.right = '';
}

function setupButtons() {
    const idToSymbol = {
        "one":      '1',
        "two":      '2',
        "three":    '3',
        "four":     '4',
        "five":     '5',
        "six":      '6',
        "seven":    '7',
        "eight":    '8',
        "nine":     '9',
        "add":      '+',
        "subtract": '-',
        "multiply": '*',
        "divide":   '/',
    };

    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
        if (button.id === 'clear') {
            button.onclick = () => {
                clearData();
                resetState();
                updateDisplay();
            }
        } else if (button.id === 'result') {
            button.onclick = () => {
                let [left, operator, right] = getOperands();
                calculateResult(left, operator, right);
                updateDisplay();  
            }
        } else {
            button.onclick = () => {
                let input = idToSymbol[button.id];
                readInput(input);
                updateDisplay();
            }
        }
    }
} 

setupButtons();