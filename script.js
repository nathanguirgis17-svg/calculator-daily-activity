const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

let currentValue = "0";
let firstValue = null;
let operator = null;
let waitingForNextValue = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function clearCalculator() {
  currentValue = "0";
  firstValue = null;
  operator = null;
  waitingForNextValue = false;
  updateDisplay();
}

function enterDigit(digit) {
  if (currentValue === "Error" || waitingForNextValue) {
    currentValue = digit;
    waitingForNextValue = false;
  } else if (currentValue === "0") {
    currentValue = digit;
  } else if (currentValue.length < 14) {
    currentValue += digit;
  }
  updateDisplay();
}

function enterDecimal() {
  if (currentValue === "Error" || waitingForNextValue) {
    currentValue = "0.";
    waitingForNextValue = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  updateDisplay();
}

function calculate(left, right, mathOperator) {
  switch (mathOperator) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return right === 0 ? null : left / right;
    default: return right;
  }
}

function formatResult(value) {
  if (!Number.isFinite(value)) return "Error";
  // Avoid displaying long floating-point tails such as 0.30000000000000004.
  return String(Number(value.toPrecision(10)));
}

function chooseOperator(nextOperator) {
  const inputValue = Number(currentValue);
  if (!Number.isFinite(inputValue)) {
    clearCalculator();
    return;
  }

  if (operator && !waitingForNextValue) {
    const result = calculate(firstValue, inputValue, operator);
    currentValue = result === null ? "Error" : formatResult(result);
    firstValue = result;
    if (result === null || currentValue === "Error") {
      operator = null;
      updateDisplay();
      return;
    }
  } else {
    firstValue = inputValue;
  }

  operator = nextOperator;
  waitingForNextValue = true;
  updateDisplay();
}

function showResult() {
  if (!operator || waitingForNextValue) return;

  const result = calculate(firstValue, Number(currentValue), operator);
  currentValue = result === null ? "Error" : formatResult(result);
  firstValue = null;
  operator = null;
  waitingForNextValue = true;
  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit !== undefined) enterDigit(button.dataset.digit);
  if (button.dataset.action === "decimal") enterDecimal();
  if (button.dataset.action === "clear") clearCalculator();
  if (button.dataset.action === "equals") showResult();
  if (button.dataset.operator) chooseOperator(button.dataset.operator);
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) enterDigit(event.key);
  else if (event.key === ".") enterDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") showResult();
  else if (event.key === "Escape" || event.key === "Backspace") clearCalculator();
  else return;

  event.preventDefault();
});
