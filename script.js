document.addEventListener('DOMContentLoaded', function(){
const output = document.querySelector('input#output');

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e){
        if(this.id == 'clear'){
            clear();
        };

        if(this.id == 'allClear'){
            clear();
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

    switch(content){
        case "%":
            output.value += "\u00F7";
            break;
        case "X":
            output.value += "x"
            break;
        default:
            output.value += content;
            break;
    };
};

function addDecimal(){
    if(isErrorState()){
        clear();
    };

    const expression = output.value.trim();
    const lastChar = expression.slice(-1);
    const lastOperator = Math.max(
        expression.lastIndexOf('+'),
        expression.lastIndexOf('-'),
        expression.lastIndexOf('\u00F7'),
        expression.lastIndexOf('x')
    );
    const currentNumber = expression.substring(lastOperator + 1);
    
    if(!expression){
        output.value = "0.";
        return;
    };

    if(['+', '-', '\u00F7', 'x', ' '].includes(lastChar)){
        output.value = "0.";
        return;
    };

    if(currentNumber.includes('.')) return;

    output.value += '.';
};

function calculate(){
    if(!endsWithNumber(output.value)){
        output.value = "[ERRO] Expressão Inválida!"
        return;
    };

    try {
        const normalized = normalizeExpression(output.value);
        const result = Function(`"use strict"; return (${normalized})`)();

        if(!Number.isFinite(result)){
            throw new Error("Invalid math");
        }

        output.value = result;
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
});
