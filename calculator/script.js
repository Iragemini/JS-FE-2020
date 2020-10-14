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
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
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
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
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
      default:
        return;
    }
    computation = parseFloat(computation.toFixed(7));
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
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
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

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener("click", () => {

      if((calculator.previousOperand === "") &&
      calculator.currentOperand !== "" &&
  calculator.readyToReset) {
          calculator.currentOperand = "";
          calculator.readyToReset = false;
      }
      if(calculator.previousOperand === "-"){
        calculator.previousOperand = "";
        calculator.appendNumber(`-${button.innerText}`)
      }else{
        calculator.appendNumber(button.innerText)
      }
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
  calculator.computeSqrt();
  calculator.updateDisplay();
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



