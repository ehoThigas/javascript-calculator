document.addEventListener('DOMContentLoaded', () => {
const output = document.querySelector('input#output');
const ERROR_STATE = "[ERRO]"
const historyList = document.querySelector('ul#history');
let history = [];

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const button = e.currentTarget;

        switch (button.id){
            case 'clear':
                clear();
                return;

            case 'allClear':
                clear();
                history = [];
                createHistory();
                return;

            case 'decimal':
                addDecimal();
                return;

            case 'percentage':
                applyPercentage();
                return;

            case 'invert':
                invertExpression();
                return;

            case 'result':
                calculate();
                return;
        };
        
        if(button.classList.contains('number')){
            addContent(button.textContent);
        };
        
        if(button.classList.contains('operator')){
            addOperator(button.textContent);
        };
    });
});

function clear(){
    output.value = '';
};

function addContent(content){
    resetIfError();

    output.value += content;
};

function addOperator(content){
    resetIfError();

    const lastChar = output.value.slice(-1);

    if(!output.value && content !== '-') return;

    if(['+', '÷', 'x', '.'].includes(lastChar) && content !== '-') return;

    if(['-', '.'].includes(lastChar)) return;

    output.value += content;
};

function addDecimal(){
    resetIfError();

    const lastChar = output.value.slice(-1);
    
    if(!output.value){
        output.value = "0.";
        return;
    };

    if(['+', '÷', 'x', '-'].includes(lastChar)){
        output.value += "0.";
        return;
    };

    if(lastChar === '.') return;

    output.value += '.';
};

function applyPercentage(){
    resetIfError();

    const lastChar = output.value.match(/(\d+(\.\d+)?)$/);
    if(!lastChar) return;

    const number = Number(lastChar[0]);

    if(!isFinite(number)) return;

    const percentage = number / 100;

    output.value = output.value.slice(0, -lastChar[0].length) + percentage;
};

function invertExpression(){
    resetIfError();

    const lastChar = output.value.match(/([+\-*/]?)(\d+(\.\d+)?)$/);
    if(!lastChar) return;

    const operator = lastChar[1];
    const number = Number(lastChar[2]);

    if(!isFinite(number)) return;

    const inverted = -number;
    let newOperator = '';

    if(operator === '+') newOperator = '-';
    else if (operator === '-') newOperator = '+';
    else if (!operator && inverted < 0) newOperator = '-';

    output.value = output.value.slice(0, -lastChar[0].length) + newOperator + Math.abs(inverted);
};

function calculate(){
    if(!endsWithNumber(output.value)){
        output.value = ERROR_STATE;
        return;
    };

    try {
        const ogExpression = output.value;
        const normalized = normalizeExpression(ogExpression);
        const result = Function(`"use strict"; return (${normalized})`)();

        if(!Number.isFinite(result)){
            throw new Error("Invalid math");
        };
        
        output.value = result;
        addHistory(ogExpression, result);
    } catch {
        output.value = ERROR_STATE;
    }
};

function endsWithNumber(value){
    return /\d$/.test(value);
};

function resetIfError(){
    if(output.value === ERROR_STATE) clear();
}

function normalizeExpression(exp){
    return exp
        .replace(/x/g, '*')
        .replace(/÷/g, '/')
};

function addHistory(expression, result){
    history.unshift({expression, result});

    if(history.length > 5){
        history.pop();
    };

    createHistory();
};

function createHistory(){
    historyList.innerHTML = '';

    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.expression} = ${item.result}`;
        historyList.appendChild(li);
    });
};
});
