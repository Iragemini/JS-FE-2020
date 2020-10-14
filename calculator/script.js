class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    calculator.readyToReset = false;
    console.log(`number = ${number}, prev = ${this.previousOperand}, includes = ${this.currentOperand.includes('.')}`)
    if (number === '.' && this.currentOperand.includes('.')) return;
    if(this.previousOperand.toString() === "-"){
      if(this.currentOperand.includes('-')) return;
      this.currentOperand = this.previousOperand.toString() + number.toString();
      this.previousOperand = '';
    }else{
      console.log(`currentOperand = ${this.currentOperand}`);
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    console.log(`**this.previousOperand = ${this.previousOperand}`)
    if (this.currentOperand === ''){
      if(operation !== '-'){
        return;
      }else{
        this.currentOperand = '-';
      }
    } 
    if (this.currentOperand !== '' && this.previousOperand !== '') {
      this.compute();
    }
    if(operation === '√' && this.currentOperand !== ''){
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    console.log(`compute: this.operation = ${this.operation}`);
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    console.log(`compute : prev = ${prev}, <0 = ${prev < 0}`);
    if ((isNaN(prev) && this.operation !== '√') || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break
      case '-':
        computation = prev - current;
        break
      case '*':
        computation = prev * current;
        break
      case '÷':
        computation = prev / current;
        break
      case '^':
        computation = Math.pow(prev, current);
        break
      case '√':
        computation = (prev < 0) ? "invalid input".toString() : Math.sqrt(prev);
        break
      default:
        return;
    }
    console.log(`compute: computation = ${computation} type = ${typeof computation}`);
    if(typeof computation === 'number'){
      computation = parseFloat(computation.toFixed(7));
    }
    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  computeSqrt(){
    let computation;
    const current = parseFloat(this.currentOperand);
    if (this.currentOperand === '' || isNaN(current)) return;
    if(current < 0){
      computation = "invalid input".toString();
    }else{
      computation = parseFloat(Math.sqrt(current).toFixed(7));
    }   

    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  computePow(){
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    this.previousOperand = this.currentOperand + '^';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    console.log(`stringNumber = ${stringNumber}, integerDigits = ${integerDigits}, decimalDigits = ${decimalDigits}`)
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('ru', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    console.log(`this.previousOperand = ${this.previousOperand}`);
    this.currentOperandTextElement.innerText = this.currentOperand ;
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const sqrtButton = document.querySelector('[ data-operation-sqrt]');
const powButton = document.querySelector('[data-pow]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const symbolButton = document.getElementById('symbol');
const result = document.getElementById('result');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener("click", () => {

      if((calculator.previousOperand === "") &&
      calculator.currentOperand !== "" &&
  calculator.readyToReset) {
          calculator.currentOperand = "";
          calculator.readyToReset = false;
      }
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay();
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
})

powButton.addEventListener('click', button => {
  calculator.chooseOperation('^');
  calculator.updateDisplay();
})

sqrtButton.addEventListener('click', button => {
  calculator.chooseOperation('√');
  calculator.updateDisplay();
  symbolButton.click();
  result.click();
})

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
})



