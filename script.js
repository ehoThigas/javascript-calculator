document.addEventListener('DOMContentLoaded', function(){
const output = document.querySelector('input#output');
let history = [];

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e){
        if(this.id == 'clear'){
            clear();
        };

        if(this.id == 'allClear'){
            clear();
            history = [];
            createHistory();
        };

        if(this.classList.contains('number')){
            addContent(button.textContent);
        };

        if(this.id == 'decimal'){
            addDecimal();
        };

        if(this.classList.contains('operator')){
            addOperator(button.textContent);
        };

        if(this.id == 'percentage'){
            applyPercentage();
        };

        if(this.id == 'invert'){
            invertExpression();
        }

        if(this.id == 'result'){
            calculate();
        };
    });
});

function clear(){
    output.value = "";
};

function addContent(content){
    if(isErrorState()) clear();

    output.value += content;
};

function addOperator(content){
    if(isErrorState()) clear();

    const lastChar = output.value.slice(-1);

    if(!output.value && content !== '-') return;

    if(['+', '\u00F7', 'x', ' ', '.'].includes(lastChar) && content !== '-') return;

    if(['-', ' ', '.'].includes(lastChar)) return;

    output.value += content;
};

function addDecimal(){
    if(isErrorState()) clear();

    const lastChar = output.value.slice(-1);
    
    if(!output.value){
        output.value = "0.";
        return;
    };

    if(['+', '\u00F7', 'x', '-'].includes(lastChar)){
        output.value += "0.";
        return
    };

    if(lastChar === '.') return;

    output.value += '.';
};

function applyPercentage(){
    if(isErrorState()) clear();

    const lastChar = output.value.match(/(\d+(\.\d+)?)$/);
    if(!lastChar) return;

    const number = Number(lastChar[0]);

    if(!isFinite(number)) return;

    const percentage = number/100;

    output.value = output.value.slice(0, -lastChar[0].length) + percentage;
};

function invertExpression(){
    if(isErrorState()) return;

    const lastChar = output.value.match(/([+\-*/]?)(\d+(\.\d+)?)$/);
    if(!lastChar) return;

    const operator = lastChar[1];
    const number = Number(lastChar[2]);

    if(!isFinite(number)) return;

    const inverted = -number;

    if(operator === '+') newOperator = '-';
    else if (operator === '-') newOperator = '+';
    else if (!operator && inverted < 0) newOperator = '-';

    output.value = output.value.slice(0, -lastChar[0].length) + newOperator + Math.abs(inverted);
};

function calculate(){
    if(!endsWithNumber(output.value)){
        output.value = "[ERRO] Expressão Inválida!"
        return;
    };

    try {
        const ogExpression = output.value;
        const normalized = normalizeExpression(output.value);
        const result = Function(`"use strict"; return (${normalized})`)();

        if(!Number.isFinite(result)){
            throw new Error("Invalid math");
        };

        output.value = result;
        addHistory(ogExpression, result);
    } catch {
        output.value = "[ERRO] Expressão Inválida!";
    }
};

function endsWithNumber(value){
    return /\d$/.test(value);
};

function isErrorState(){
    if(output.value.includes("[ERRO]")){
        return true;
    };
};

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
    const list = document.querySelector('ul#history');
    list.innerHTML = '';

    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.expression} = ${item.result}`;
        list.appendChild(li);
    });
};
});
