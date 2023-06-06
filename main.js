window.addEventListener("DOMContentLoaded", () => {
    // Получаем элементы
    const calculator = document.querySelector(".calculator");
    const display = calculator.querySelector(".calculator_display");
    const keys = calculator.querySelector(".calculator_keys");
    // функция выполняющая математические исчисления
    function calculate(firstEl, operator, secondEl) {
        // присваиваем переменным преобразованное значение(если оно является строкой) в число
        let num1 = parseFloat(firstEl);
        let num2 = parseFloat(secondEl);
        // с помощью условий проверяем значение оператора и возвращаем результат выполнения соответствующей операции num1 и num2
        if (operator === "+") return num1 + num2;
        if (operator === "-") return num1 - num2;
        if (operator === "*") return num1 * num2;
        if (operator === "/") {
            // условие в котором делить на 0 нельзя
            if(num2 === 0) return 'Error';
            return num1 / num2;
        }
    }
    // функция определяющая тип кнопки: цифра, операция и т.д.
    function getKeyType(key) {
        const action = key.dataset.action;
        if (!action) return "number";
        // если значение атрибута равно одному из операторов то будет возвращен тип кнопки - оператор
        if (
            action === "+" ||
            action === "-" ||
            action === "*" ||
            action === "/"
        )
            return "operator";
        // иначе возвращается значение атрибута
        return action;
    }

    function getResult(key, displayNum, state) {
        const keyContent = key.textContent;
        const keyType = getKeyType(key);
        const { firstEl, operator, modValue, previousKeyType } = state;
        // если нажатая клавиша число то проверяем равно ли оно "0" или оператору или "=" если да то возвращаем значение нажатой клавиши
        // иначе возвращаем отображаемый элемент + значение клавиши
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
        // если нажатая клавиша "dot", то сначала проверяем есть ли еще на дисплее "." если нет то к отображаемому элементу добавляем "."
        // если предыдущая кнопка оператор или "=" то возвращаем "0."
        // показываем отображаемый элемент
        if (keyType === "dot") {
            if (!displayNum.includes(".")) return displayNum + ".";
            if (previousKeyType === "operator" || previousKeyType === "equal")
                return "0.";
            return displayNum;
        }
        //если нажатая клавиша оператор то проверяем условием и если true то проверяем 
        // было ли деление на 0 если да то показываем ошибку, иначе запускаем функцию 
        // calculate(firstEl, operator, displayNum); с 3 параметрами (1эл, оператор, отображаемый элемент)
        // иначе возвращаем отображаемый элемент
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
        // если нажатая клавиша "=", и условия что firstEl существует то проверяем было ли деление на 0
        // если да, показываем ошибку. дальше проверяем если предыдущая нажатая клавиша была "="
        // то запускаем функцию с 3 параметрами calculate(1эл, оператор, второй элемент) 
        // иначе запускаем функцию с 3 параметрами calculate(1эл, оператор, отображаемый элемент)
        // если же firstEl не существет то показываем на дисплее отображаемое число
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
    // функция обновления данных калькулятора
    function updateDisplay(key, calculator, calculatedValue, displayNum) {
        const keyType = getKeyType(key);
        // присваиваем переменным значение свойств объекта dataset
        const { firstEl, modValue, operator, previousKeyType } =
            calculator.dataset;
        // записываем нажатие предыдущей кнопки в атрибут previousKeyType
        calculator.dataset.previousKeyType = keyType;
        // если нажатая клавиша оператор
        if (keyType === "operator") {
            // мы присваиваем этому оператору атрибут action
            calculator.dataset.operator = key.dataset.action;
            // проверяем какое значение будет у firstEl
            calculator.dataset.firstEl =
                firstEl &&
                operator &&
                previousKeyType !== "operator" &&
                previousKeyType !== "equal"
                // если true то присваиваем рассчитанное значение, иначе выводим значение на дисплей
                    ? calculatedValue
                    : displayNum;
        }
        // если нажатая клавиша "=" то modValue присваиваем значение в котором проверяем 
        // есть ли 1ый элемент и нажат ли "=" если да то присваиваем значение modValue, иначе выводим на дисплей
        if (keyType === "equal") {
            calculator.dataset.modValue =
                firstEl && previousKeyType === "equal" ? modValue : displayNum;
        }
        // если нажатая клавиша "clear" то обновляем у атрибутов данные
        if (keyType === "clear" && keyType !== "AC") {
            calculator.dataset.firstEl = "";
            calculator.dataset.modValue = "";
            calculator.dataset.operator = "";
            calculator.dataset.previousKeyType = "";
        }
    }
    // функция обновления внешнего вида калькулятора
    function updateVisual(key, calculator) {
        const keyType = getKeyType(key);
        // преобразуем все дочернии элементы родителя key в массив, перебираем и у каждого удаляем класс
        Array.from(key.parentNode.children).forEach((k) =>
            k.classList.remove("isActive")
        );
        // проверяем тип кнопки
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
    // назначаем на все кнопки слушатель "click"
    keys.addEventListener("click", (e) => {
        const key = e.target;
        const displayNum = display.textContent;
        const result = getResult(key, displayNum, calculator.dataset);
        // проверяем содержит ли нажатый элемент тег "button", если нет то прерываем дальнейшее выполнение
        if (!key.matches("button")) return;
        // показываем результат на дисплее
        display.textContent = result;
        // обновляем дисплей калькулятора
        updateDisplay(key, calculator, result, displayNum);
        // обновляем внешний вид калькулятора
        updateVisual(key, calculator);
    });
});
