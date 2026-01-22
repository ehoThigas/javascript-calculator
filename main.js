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
            if(!output.value.trim()){

            };
        };
    });
});

function clear(){
    output.value = "";
};

function addContent(content){
    output.value += content;
};

function addOperator(content){
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

    if(currentNumber.includes('.')){
        return;
    }

    output.value += '.';
}

});
