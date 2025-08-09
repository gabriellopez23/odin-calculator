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
};
const getOperands = () => [operands.left, operands.operator, operands.right];

let operandEditMode = 'left';
const resetState = () => operandEditMode = 'left';

function updateOperand(input, operand, mode) {
    switch (mode) {
        case 'append':
            operands[operand] += input;
            break;
        case 'new':
            operands[operand] = input;
            break;
    }
}

// function updateOperandAndDisplay(input, operand, updateMode) {
//     updateOperand(input, operand, updateMode);
//     updateDisplay(operand);
// }

function updateDisplay(operand) {
    const display = document.querySelector(".display");
    display.textContent = operands[operand];
}

function clearData() {
    operands.left = '';
    operands.operator = '';
    operands.right = '';
}

function clearFunction() {
    clearData();
    resetState();
    updateDisplay('');
}

function resultFunction() {
    let [left, operator, right] = getOperands();
    let result = null;
    switch (operandEditMode) {
        case 'left':
            break;
        case 'operator':
            operandEditMode = 'result';

            result = operate(left, operator, left);
            updateOperand(left, 'right', 'new');
            updateOperand(result, 'left', 'new');
            updateDisplay('left');
            break;
        case 'right':
            operandEditMode = 'result';
            result = operate(left, operator, right);
            updateOperand(result, 'left', 'new');
            updateDisplay('left');
            break;
        case 'result':
            result = operate(left, operator, right);
            updateOperand(result, 'left', 'new');
            updateDisplay('left');
            break;
        default:
            alert('Something is amok!');
            break;
    }
}

function operatorFunction(symbol) {
    switch (operandEditMode) {
        case 'left':
            operandEditMode = 'operator';
            updateOperand(symbol, 'operator', 'new');
            updateDisplay('operator');
            break;
        case 'operator':
            updateOperand(symbol, 'operator', 'new');
            updateDisplay('operator');
            break;
        case 'right':
            operandEditMode = 'result';

            const [left, operator, right] = getOperands();
            const result = operate(left, operator, right);
            updateOperand(result, 'left', 'new');
            updateDisplay('left');
            break;
        case 'result':
            operandEditMode = 'operator';
            updateOperand(symbol, 'operator', 'new');
            updateDisplay('operator');
            break;
        default:
            alert('Something is amok!');
            break;
    }
}

function numberFunction(symbol) {
    switch (operandEditMode) {
        case 'left':
            updateOperand(symbol, 'left', 'append');
            updateDisplay('left');
            break;
        case 'operator':
            operandEditMode = 'right';
            updateOperand(symbol, 'right', 'new');
            updateDisplay('right');
            break;
        case 'right':
            updateOperand(symbol, 'right', 'append');
            updateDisplay('right');
            break;
        case 'result':
            clearData();
            operandEditMode = 'left';
            updateOperand(symbol, 'left', 'new');
            updateDisplay('left');
            break;
        default:
            alert('Something is amok!');
            break;
        }
}

function setupButtons() {
    const idToSymbol = {
        one:        '1',
        two:        '2',
        three:      '3',
        four:       '4',
        five:       '5',
        six:        '6',
        seven:      '7',
        eight:      '8',
        nine:       '9',
        add:        '+',
        subtract:   '-',
        multiply:   '*',
        divide:     '/',
    };
    const getSymbol = button => idToSymbol[button.id]; 
    const isNumber = (arg) => !isNaN(arg);

    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
        if (button.id === 'clear') {
            button.onclick = () => clearFunction();
        } else if (button.id === 'result') {
            button.onclick = () => resultFunction();
        } else if (isNumber(getSymbol(button))) {
            button.onclick = () => numberFunction(getSymbol(button));
        } else {
            button.onclick = () => operatorFunction(getSymbol(button));
        }
    }
} 

setupButtons();