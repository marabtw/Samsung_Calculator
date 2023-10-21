let buffer = "0"
let bracketCount = 0
let toBufferCheck = true
let toShowResultCheck = false
let stopCheck = false
let writeToHistoryCheck = true

const lengthLimit = 30
const mathOperators = ["/", "*", "-", "+"]
const brackets = ["(", ")"]
const allSpecialSymbols = [...mathOperators, ...brackets, "."]
const historyScreen = document.querySelector('.historyScreen')

init()

function init() {
  document.querySelector(".btns").addEventListener("click", (e) => {
    const targetItem = e.target
    if (targetItem.closest(".clcBtn")) {
      buttonClicked(e.target.innerText)
    }
  });

  const historyWindow = document.querySelector(".history")
  const historyClearBtn = document.querySelector('.historyClearBtn')
  document.querySelector(".historyBtn").addEventListener("click", () => {
    historyWindow.style.width = historyWindow.style.width === "20rem" ? "0" : "20rem"
    historyClearBtn.style.display = historyWindow.style.width === "20rem" ? "initial" : null
  })
}

const screenTask = document.querySelector(".screenTask")

function buttonClicked(value) {
  if (value === "x") value = "*";
  if (buffer === "0" && allSpecialSymbols.includes(value)) {
    toBufferCheck = false
  }
  checkForSpecialSymbols(value)
  checkForMath(value)

  if (buffer.length < lengthLimit && toBufferCheck && !["<", "C", "="].includes(value)) {
    buffer = buffer === "0" ? value : buffer + value
  } else if (buffer.length === lengthLimit && !["<", "C", "="].includes(value)) {
    reportError()
  }

  toBufferCheck = true
  screenTask.innerText = buffer
  toSolve(buffer)
}

function checkForSpecialSymbols(value) {
  if (value === "C") {
    bracketCount = 0
    buffer = "0"
    toShowResultCheck = false
    stopCheck = false
    writeToHistoryCheck = true
  } else if (value === "<" && stopCheck === false) {
    toBufferCheck = false
    if (buffer.length === 1) {
      bracketCount += buffer === ")" ? 1 : buffer === "(" ? -1 : 0
      buffer = "0"
    } else {
      bracketCount += buffer.endsWith(")") ? 1 : buffer.endsWith("(") ? -1 : 0
      buffer = buffer.slice(0, -1);
    }
  } else if (value === "=") {
    if (eval(buffer)) {
      stopCheck = true
      toBufferCheck = false
      toSolve(buffer)
      toShowResultCheck = true
      if (writeToHistoryCheck === true) {
        writeToHistory()
      }
      writeToHistoryCheck = false
    }
  }
}

function checkForMath(sym) {
  if (stopCheck === true) return
  if(buffer.length > lengthLimit) return
  const lastChar = buffer.charAt(buffer.length - 1)

  if (buffer === "0" && allSpecialSymbols.includes(sym)) return

  toBufferCheck = false

  if ((sym === "(" || sym === ")") && !["<", "C", "="].includes(sym)) {
    if (sym === "(" && (mathOperators.includes(lastChar) || lastChar === '(')) {
      buffer += sym
      bracketCount++
    } else if (
      sym === ")" &&
      (!isNaN(lastChar) || lastChar === ')') &&
      buffer !== "0" &&
      bracketCount > 0
    ) {
      buffer += sym;
      bracketCount--
    }
  } else if (sym === "." && !["<", "C", "="].includes(sym)) {
    if (isNaN(lastChar)) {
      if (lastChar === ")") {
        bracketCount++
        buffer = buffer.slice(0, -1) + sym;
      } else if (!isNaN(buffer.charAt(buffer.length - 2))) {
        buffer = buffer.slice(0, -1) + sym;
      }
    } else {
      buffer += sym
    }
  } else if (mathOperators.includes(sym) && !["<", "C", "="].includes(sym)) {
    if (isNaN(lastChar)) {
      if (
        mathOperators.includes(lastChar) ||
        lastChar === "."
      ) {
        buffer = buffer.slice(0, -1) + sym
      } else if (lastChar === ")") {
        buffer += sym
      } else {
        buffer += sym
      }
    } else {
      buffer += sym
    }
  } else if (!isNaN(sym) && !["<", "C", "="].includes(sym)) {
    if (buffer === "0") {
      buffer = sym
    } else if (lastChar !== ")") {
      buffer += sym
    }
  }
}

function toSolve(equation) {
  try {
    const result = document.querySelector(".screenRes")
    const bufferResult = eval(equation)

    result.innerText = bufferResult

    if (toShowResultCheck === true && !isNaN(bufferResult)) {
      screenTask.style.display = "none"
      result.style.fontSize = "2.5rem"
      toBufferCheck = false
    } else if (toShowResultCheck === false) {
      screenTask.style.display = null
      result.style.fontSize = null
    }
  } catch (e) {
    console.error(e)
    alert("Error: Invalid expression!")
  }
}

function writeToHistory() {
  const historyNewDiv = document.createElement("div")
  historyNewDiv.className = "historyItem"
  historyNewDiv.innerHTML = `
    <div class="historyResult">${eval(buffer)}</div>
    <div class="historyBuffer">${buffer}</div>`
  historyScreen.appendChild(historyNewDiv)
}

function historyClean() {
  historyScreen.innerHTML = ''
}

function reportError() {
  const screenTitle = document.querySelector(".screenTitle h3")
  screenTitle.innerText = `Limit is ${lengthLimit} char`
  screenTitle.style.color = "red"
  window.setTimeout(returnDefaultValue, 1500)
}

function returnDefaultValue() {
  const screenTitle = document.querySelector(".screenTitle h3")
  screenTitle.innerText = "Calculator"
  screenTitle.style.color = "white"
}
