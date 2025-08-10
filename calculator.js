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

function updateDisplay() {
    const display = document.querySelector(".display");

    if (operandEditMode === 'result') {
        display.textContent = operands['left'];
    } else {
        display.textContent = operands[operandEditMode];
    }
}

function delFunction() {
    switch (operandEditMode) {
        case 'left':
        case 'right':
        case 'operator':
            let operand = operands[operandEditMode];
            operands[operandEditMode] = operand.substr(1);
            break;
        case 'result':
            break;
    }
}

function decFunction() {
    const hasDecimal = (num) => num.includes('.');
    const isEmpty = (num) => num.length === 0;

    const addDecimal = (operand) => {
        if (!hasDecimal(operands[operand])) {
            const data = (isEmpty(operands[operand])) ? '0.' : '.';
            operands[operand] += data;
        }
    }

    switch (operandEditMode) {
        case 'left':
        case 'right':
            addDecimal(operandEditMode);
            break;
        case 'operator':
            break;
        case 'result':
            clearData();
            addDecimal('left');
            break;
    }
}

function numFunction(input) {
    switch (operandEditMode) {
        case 'left':
        case 'right':
            operands[operandEditMode] += input;
            break;
        case 'operator':
            operandEditMode = 'right';
            operands['right'] = input;
            break;
        case 'result':
            clearData();
            operandEditMode = 'left';
            operands['left'] = input;
            break;
    }
}

function opFunction(input) {
    let {left, operator, right} = operands;
    let result = '';

    switch (operandEditMode) {
        case 'left':
            operandEditMode = 'operator';
            operands['operator'] = input;
            break;
        case 'right':
            operandEditMode = 'operator';

            // Store result in left
            result = operate(left, operator, right);
            operands['left'] = result;

            operands['operator'] = input;
            break;
        case 'operator':
            operands['operator'] = input;
            break;
        case 'result':
            operandEditMode = 'operator';
            operands['operator'] = input;
            break;
    }
}

function resFunction() {
    let {left, operator, right} = operands;
    let result = null;

    switch (operandEditMode) {
        case 'left':
            break;
        case 'right':
            operandEditMode = 'result';

            // Store result in left
            result = operate(left, operator, right);
            operands['left'] = result;
            break;
        case 'operator':
            operandEditMode = 'result';

            // Store result in left
            result = operate(left, operator, left);
            operands['left'] = result;

            // Duplicate left into right to reuse as operands
            operands['right'] = left;
            break;
        case 'result':
            result = operate(left, operator, right);
            operands['left'] = result;
            break;
    }
}

function clearData() {
    operands.left = '';
    operands.operator = '';
    operands.right = '';
}

function clearFunction() {
    clearData();
    resetState();
    updateDisplay();
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
            button.onclick = () => resFunction();
        } else if (button.id === 'delete') {
            button.onclick = () => delFunction();
        } else if (button.id === 'decimal') {
            button.onclick = () => decFunction();
        } else if (isNumber(getSymbol(button))) {
            button.onclick = () => numFunction(getSymbol(button));
        } else {
            button.onclick = () => opFunction(getSymbol(button));
        }
        button.addEventListener("click", () => updateDisplay());
    }
} 

setupButtons();