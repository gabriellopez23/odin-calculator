/**
 * CONSTANST AND STATE
 */
const MAX_LEN = 15;
const MAX_FRAC_DIGITS = 12;

const State = {
    ENTERING_LEFT:      'left',
    OPERATOR_SELECTED:  'operator',
    ENTERING_RIGHT:     'right',
    RESULT_DISPLAYED:   'result',
};

let operands = {
    left:       '',
    operator:   '',
    right:      '',
};

let calculatorState = State.ENTERING_LEFT;

/** 
 * UTILITIES
*/
const isNumber = (arg) => !isNaN(arg);
const isOperator = (arg) => '+-*/'.includes(arg);

const getSymbol = id => {
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
    return idToSymbol[id]
}; 

const hasDecimal = (value) => value.includes('.');
const isZeroInteger = (value) => parseInt(value) === 0 && !hasDecimal(value);
const isNegated = (value) => value.startsWith('-');
const isEmpty = (value) => value.length === 0;

const getTrueLength = (value) => {
    const decimalOffset = Number(hasDecimal(value));
    const negationOffset = Number(isNegated(value));
    return value.length - decimalOffset - negationOffset;
}

/**
 * CALCULATION LOGIC
 */
function operate(left, operator, right) {
    const operatorToOperation = {
        "+": (a, b) => Number(a) + Number(b),
        "-": (a, b) => Number(a) - Number(b),
        "*": (a, b) => Number(a) * Number(b),
        "/": (a, b) => Number(a) / Number(b),
    };
    const result = operatorToOperation[operator](left, right);
    return result.toString();
}

function updateNumber(operand, inputData) {
    /** 
     * Max length of an operand is 16 digits, excluding '.' and '-'. 
     * If the operand is at max length, return the operand. 
     **/
    if (getTrueLength(operand) >= MAX_LEN) {
        return operand;
    }

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

function negate(operand) {
    /**
     * Negate any number, unless it is a 0 without a decimal point
     */
    if (isZeroInteger(operand)) {
        return operand;
    } else {
        return (isNegated(operand) ? operand.substring(1) : '-' + operand);
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

/**
 * STATE HANDLERS
 */
function clearData() {
    operands.left = '';
    operands.operator = '';
    operands.right = '';
}

function handleClearAll() {
    // Reset edit mode and data
    clearData();
    calculatorState = State.ENTERING_LEFT;
}

function handleClearEntry() {
    if (calculatorState === State.RESULT_DISPLAYED) {
        clearData();
    } else {
        operands[calculatorState] = '';
    }
}

function handleNumber(input) {
    switch (calculatorState) {
        case State.ENTERING_LEFT:
        case State.ENTERING_RIGHT:
            let operand = operands[calculatorState];
            operands[calculatorState] = updateNumber(operand, input);
            break;
        case State.OPERATOR_SELECTED:
            calculatorState = State.ENTERING_RIGHT;
            operands['right'] = input;
            break;
        case State.RESULT_DISPLAYED:
            clearData();
            calculatorState = State.ENTERING_LEFT;
            operands['left'] = input;
            break;
    }
}

function handleOperator(input) {
    let {left, operator, right} = operands;
    let result = null;

    switch (calculatorState) {
        case State.ENTERING_LEFT:
            if (!isEmpty(left)) {
                calculatorState = State.OPERATOR_SELECTED;
                operands['operator'] = input;
            }
            break;
        case State.ENTERING_RIGHT:
            calculatorState = State.OPERATOR_SELECTED;

            // Store result in left
            result = operate(left, operator, right);
            operands['left'] = result;

            operands['operator'] = input;
            break;
        case State.OPERATOR_SELECTED:
            operands['operator'] = input;
            break;
        case State.RESULT_DISPLAYED:
            calculatorState = State.OPERATOR_SELECTED;
            operands['operator'] = input;
            break;
    }
}

function handleResult() {
    let {left, operator, right} = operands;
    let result = null;

    switch (calculatorState) {
        case State.ENTERING_LEFT:
            break;
        case State.ENTERING_RIGHT:
            calculatorState = State.RESULT_DISPLAYED;

            // Store result in left
            result = operate(left, operator, right);
            operands['left'] = result;
            break;
        case State.OPERATOR_SELECTED:
            calculatorState = State.RESULT_DISPLAYED;

            // Store result in left
            result = operate(left, operator, left);
            operands['left'] = result;

            // Duplicate left into right to reuse as operands
            operands['right'] = left;
            break;
        case State.RESULT_DISPLAYED:
            result = operate(left, operator, right);
            operands['left'] = result;
            break;
    }
}

function handleNegate() {
    switch (calculatorState) {
        case State.ENTERING_LEFT:
        case State.ENTERING_RIGHT:
            let operand = operands[calculatorState];
            operands[calculatorState] = negate(operand);
            break;
        case State.OPERATOR_SELECTED:
            break;
        case State.RESULT_DISPLAYED:
            calculatorState = State.ENTERING_LEFT;
            operands['left'] = negate(operands['left']);
            break;
    }
}

function handleDelete() {
    switch (calculatorState) {
        case State.ENTERING_LEFT:
        case State.ENTERING_RIGHT:
        case State.OPERATOR_SELECTED:
            let operand = operands[calculatorState];
            operands[calculatorState] = backspace(operand);
            break;
        case State.RESULT_DISPLAYED:
            break;
    }
}

function handleDecimal() {
    const addDecimal = mode => {
        if (!hasDecimal(operands[mode])) {
            const data = (isEmpty(operands[mode])) ? '0.' : '.';
            operands[mode] += data;
        }
    }

    switch (calculatorState) {
        case State.ENTERING_LEFT:
        case State.ENTERING_RIGHT:
            addDecimal(calculatorState);
            break;
        case State.OPERATOR_SELECTED:
            calculatorState = State.ENTERING_RIGHT;
            addDecimal('right')
            break;
        case State.RESULT_DISPLAYED:
            clearData();
            addDecimal('left');
            break;
    }
}

/**
 * DOM METHODS
 */
function updateDisplay() {
    const display = document.querySelector(".display");

    // If edit mode is 'result', display left since it stores the result
    const operand = calculatorState === State.RESULT_DISPLAYED ? 
                    operands['left'] : 
                    operands[calculatorState];

    if (isEmpty(operand)){
        display.textContent = '0';
    } else if (getTrueLength(operand) > MAX_LEN) {
        const value = Number(operand);
        const expForm = value.toExponential(MAX_FRAC_DIGITS);
        display.textContent = expForm;
    } else {
        display.textContent = operand;
    }

}

function initializeKeyboard() {
    document.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return;
        }

        switch (event.key) {
            case 'Escape':
                handleClearAll();
                break;
            case 'Delete':
                handleClearEntry();
                break;
            case 'Backspace':
                handleDelete();
                break;
            case '.':
                handleDecimal();
                break;
            case 'Enter':
            case '=':
                handleResult();
                break;
            default:
                if (isNumber(event.key)) {
                    handleNumber(event.key);
                } else if(isOperator(event.key)) {
                    handleOperator(event.key);
                }  
                break;
        }
        updateDisplay();
        }, true);
}

function initializeButtons() {
    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
        let id = button.id;

        if (id === 'clear') {
            button.onclick = () => handleClearAll();
        } else if (id === 'clear-entry') {
            button.onclick = () => handleClearEntry();
        } else if (id === 'result') {
            button.onclick = () => handleResult();
        } else if (id === 'delete') {
            button.onclick = () => handleDelete();
        } else if (id === 'decimal') {
            button.onclick = () => handleDecimal();
        } else if (id === 'negate') {
            button.onclick = () => handleNegate();
        } else if (isNumber(getSymbol(id))) {
            button.onclick = () => handleNumber(getSymbol(id));
        } else {
            button.onclick = () => handleOperator(getSymbol(id));
        }

        // Clicking any button updates the display
        button.addEventListener("click", () => updateDisplay());
    }
} 

initializeButtons();
initializeKeyboard();
updateDisplay();