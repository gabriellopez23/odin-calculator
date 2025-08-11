function operate(left, operator, right) {
    const operatorToOperation = {
        "+": (a, b) => Number(a) + Number(b),
        "-": (a, b) => Number(a) - Number(b),
        "*": (a, b) => Number(a) * Number(b),
        "/": (a, b) => Number(a) / Number(b),
    };
    return operatorToOperation[operator](left, right);
}

let operands = {
    left: '',
    operator: '',
    right: '',
};
let operandEditMode = 'left';

const hasDecimal = (num) => num.includes('.');
const isZeroInteger = (operand) => parseInt(operand) === 0 && !hasDecimal(operand);
const isNegated = (num) => num.startsWith('-');
const isEmpty = (num) => num.length === 0;

function updateNumber(operand, inputData) {
    /**
     * Appends new data to operand value, unless operand value is 0. 
     * 
     * If it is 0, trailing zeroes are ignored and the operand is 
     * returned unmodified. Any other number replaces the 0.  
     */
    if (isZeroInteger(operand)) {
        return (parseFloat(inputData) === 0) ? operand : inputData;
    } else {
        return operand + inputData;
    }
}

function updateDisplay() {
    const display = document.querySelector(".display");

    // Display left, since it stores the result
    if (operandEditMode === 'result') {
        display.textContent = operands['left'];
    } else {
        display.textContent = operands[operandEditMode];
    }
}

function negate(operand) {
    /**
     * Negate any number, unless it is a 0 without a decimal point
     */
    if (isZeroInteger(operand)) {
        return operand;
    } 
    return (isNegated(operand) ? operand.substring(1) : '-' + operand);
}

function negFunction() {
    switch (operandEditMode) {
        case 'left':
        case 'right':
            let operand = operands[operandEditMode];
            operands[operandEditMode] = negate(operand);
            break;
        case 'operator':
        case 'result':
            break;
    }
}

function backspace(operand) {
    /**
     * If a character is negated and too short, return an empty string. We don't
     * want to display a negation symbol by itself. Otherwise, delete the 
     * last character.
     */
    if (isNegated(operand) && operand.length < 3) {
        return '';
    }
    return operand.substring(0, operand.length - 1);
}

function delFunction() {
    switch (operandEditMode) {
        case 'left':
        case 'right':
        case 'operator':
            let operand = operands[operandEditMode];
            operands[operandEditMode] = backspace(operand);
            break;
        case 'result':
            break;
    }
}

function decFunction() {
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

function clearData() {
    operands.left = '';
    operands.operator = '';
    operands.right = '';
}

function clearFunction() {
    // Reset edit mode and data
    clearData();
    operandEditMode = 'left';
}

function numFunction(input) {
    switch (operandEditMode) {
        case 'left':
        case 'right':
            let operand = operands[operandEditMode];
            operands[operandEditMode] = updateNumber(operand, input);
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
    let result = null;

    switch (operandEditMode) {
        case 'left':
            if (!isEmpty(left)) {
                operandEditMode = 'operator';
                operands['operator'] = input;
            }
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

function setupButtons() {
    const getSymbol = button => {
        const idToSymbol = {
            zero:       '0',
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
        return idToSymbol[button.id]
    }; 
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
        } else if (button.id === 'negate') {
            button.onclick = () => negFunction();
        } else if (isNumber(getSymbol(button))) {
            button.onclick = () => numFunction(getSymbol(button));
        } else {
            button.onclick = () => opFunction(getSymbol(button));
        }
        button.addEventListener("click", () => updateDisplay());
    }
} 

setupButtons();