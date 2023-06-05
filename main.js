window.addEventListener("DOMContentLoaded", () => {
    const calculator = document.querySelector(".calculator");
    const display = calculator.querySelector(".calculator_display");
    const keys = calculator.querySelector(".calculator_keys");

    function calculate(firstEl, operator, secondEl) {
        let num1 = parseFloat(firstEl);
        let num2 = parseFloat(secondEl);

        if (operator === "+") return num1 + num2;
        if (operator === "-") return num1 - num2;
        if (operator === "*") return num1 * num2;
        if (operator === "/") {
            if(num2 === 0) return 'Error';
            return num1 / num2;
        }
    }
    function getKeyType(key) {
        const action = key.dataset.action;
        if (!action) return "number";
        if (
            action === "+" ||
            action === "-" ||
            action === "*" ||
            action === "/"
        )
            return "operator";

        return action;
    }

    function getResult(key, displayNum, state) {
        const keyContent = key.textContent;
        const keyType = getKeyType(key);
        const { firstEl, operator, modValue, previousKeyType } = state;

        if (keyType === "number") {
            if (
                displayNum === "0" ||
                previousKeyType === "operator" ||
                previousKeyType === "equal"
            ) {
                return keyContent;
            }
            return displayNum + keyContent;
        }

        if (keyType === "dot") {
            if (!displayNum.includes(".")) return displayNum + ".";
            if (previousKeyType === "operator" || previousKeyType === "equal")
                return "0.";
            return displayNum;
        }

        if (keyType === "operator") {
            if (
                firstEl &&
                operator &&
                previousKeyType !== "operator" &&
                previousKeyType !== "equal"
            ) {
                if(operator === '/' && displayNum === '0') return 'Error';
                return calculate(firstEl, operator, displayNum);
            }
            return displayNum;
        }

        if (keyType === "clear") return 0;

        if (keyType === "equal") {
            if (firstEl) {
                if(operator === '/' && displayNum === '0') return 'Error';
                return previousKeyType === "equal"
                    ? calculate(displayNum, operator, modValue)
                    : calculate(firstEl, operator, displayNum);
            } else {
                return displayNum;
            }
        }
    }

    function updateDisplay(key, calculator, calculatedValue, displayNum) {
        const keyType = getKeyType(key);
        const { firstEl, modValue, operator, previousKeyType } =
            calculator.dataset;

        calculator.dataset.previousKeyType = keyType;

        if (keyType === "operator") {
            calculator.dataset.operator = key.dataset.action;
            calculator.dataset.firstEl =
                firstEl &&
                operator &&
                previousKeyType !== "operator" &&
                previousKeyType !== "equal"
                    ? calculatedValue
                    : displayNum;
        }

        if (keyType === "equal") {
            calculator.dataset.modValue =
                firstEl && previousKeyType === "equal" ? modValue : displayNum;
        }

        if (keyType === "clear" && keyType !== "AC") {
            calculator.dataset.firstEl = "";
            calculator.dataset.modValue = "";
            calculator.dataset.operator = "";
            calculator.dataset.previousKeyType = "";
        }
    }

    function updateVisual(key, calculator) {
        const keyType = getKeyType(key);
        Array.from(key.parentNode.children).forEach((k) =>
            k.classList.remove("isActive")
        );

        if (keyType === "operator") {
            display.textContent = key.textContent;
            key.classList.add("isActive");
        }
        if (keyType === "clear" && key.textContent !== "AC")
            key.textContent = "AC";
        if (keyType !== "clear") {
            const clearBtn = calculator.querySelector("[data-action=clear]");
            clearBtn.textContent = "CE";
        }
    }

    keys.addEventListener("click", (e) => {
        if (!e.target.matches("button")) return;
        const key = e.target;
        const displayNum = display.textContent;
        const result = getResult(key, displayNum, calculator.dataset);

        display.textContent = result;
        updateDisplay(key, calculator, result, displayNum);
        updateVisual(key, calculator);
    });
});
