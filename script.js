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

        if(this.id == 'result'){
            calculate();
        };
    });
});

function clear(){
    output.value = "";
};

function addContent(content){
    if(isErrorState()){
        clear();
    };

    output.value += content;
};

function addOperator(content){
    if(isErrorState()){
        clear();
    };

    const expression = output.value.trim();
    const lastChar = expression.slice(-1);

    if(!expression && content !== '-') return;

    if(['+', '\u00F7', 'x', ' ', '.'].includes(lastChar) && content !== '-') return;

    if(['-', ' ', '.'].includes(lastChar)) return;

    output.value += content;
};

function addDecimal(){
    if(isErrorState()){
        clear();
    };

    const expression = output.value.trim();
    const lastChar = expression.slice(-1);
    
    if(!expression){
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
        .replace(/÷/g, '/');
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
