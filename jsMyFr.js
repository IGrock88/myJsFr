/*
Присваиваем функцию возвращающюю основной объект к переменной $. Получается что-то типо jQuery, по крайней мере
визуально)).
 */
var $ = function (selector) {
    return new Main(selector);
};

var DEFAULT_ELEMENT_INDEX = 0;

var SELECTOR_SYMBOLS = {
    id: '#',
    class: '.',
    name: '^'
};

/**
 * Конструктор основого класса, в нем осуществляется выборка элементов в зависимости от переданного селектора
 *
 * @param selector
 * @constructor
 */
function Main(selector) {
    this.selector = selector;
    this.elements = [];

    var startSymbol = this.selector.substring(0, 1);

    if (startSymbol === SELECTOR_SYMBOLS.id){
        /* Пояснение: решил, даже при получении одного элемента, все равно закидывать его в массив для однообразия.
            Так как в дальнейшем, пришлось бы делать проверки массив ли в свойстве или просто один элемент, в итоге
            в каждом методе появились бы ветвления для обработки разных типов данных
        */
        this.elements.push(document.getElementById(this.selector.substring(1)));
    }
    else if (startSymbol === SELECTOR_SYMBOLS.class){
        this.elements = getElementsByClassName(this.selector.substring(1));
    }
    else if (startSymbol === SELECTOR_SYMBOLS.name){
        this.elements = document.getElementsByName(this.selector.substring(1));
    }
    else {
        this.elements = document.getElementsByTagName(this.selector);
    }

    if(this.elements[0] === null){
        console.log('Elements not found. Selector', this.selector);
    }
}

/**
 * Метод для получения/изменения текстового содержимого DOM элементов.
 * Если не передано не одного аргумента или явно передан параметр text = null, то метод возвращает содержимое элемента
 * в виде строки.
 * По умолчанию получаем содержимое из первого полученного DOM элемента, но можно указать порядковый номер элемента явно
 * передав нужный номер вторым аргуметом.
 *
 * Если передан параметр text отличный от null, то произойдёт передача данного параметра по всей коллекции выбранных DOM
 * элементов, в итоге произойдёт постановка текста в каждый DOM элемент коллекции.
 *
 * @param text string|null
 * @param indexElement default|int
 * @returns str|bool
 */
Main.prototype.text = function (text = null, indexElement = DEFAULT_ELEMENT_INDEX) {
    if (!this.elements[indexElement]){
        return false;
    }

    if(text === null){
        return this.elements[indexElement].innerText;
    }
    for (var key in this.elements){
        if (this.elements.hasOwnProperty(key) && this.elements[key] !== null){
            this.elements[key].innerText = text;
        }
    }
};

/**
 * Метод принимает html разметку и осуществляет подстановку переданной разметки в каждый элемент выбранной коллекции
 * @param html string
 */
Main.prototype.setHtml = function (html) {
    for (var key in this.elements){
        if (this.elements.hasOwnProperty(key) && this.elements[key] !== null){
            this.elements[key].innerHTML = html;
        }
    }
};

/**
 * Метод для получения/изменения аттрибутов DOM элементов по имени аттрибута.
 * Если не указан attributeValue либо указан явно attributeValue = null то осуществляется получение значения.
 * По умолчанию получаем аттрибут из первого полученного DOM элемента, но можно указать порядковый номер элемента явно.
 *
 * Если указан attributeValue не равный null то происходит присвоение значения выбранному аттрибуту, по всем элеметам
 * в колекции.
 * @param attributeName str
 * @param attributeValue str|null
 * @param indexElement default|null
 * @returns str|bool
 */
Main.prototype.attr = function (attributeName, attributeValue = null, indexElement = DEFAULT_ELEMENT_INDEX) {
    if (!this.elements[indexElement]){
        return false;
    }

    if (attributeValue === null && this.elements[indexElement].hasAttribute(attributeName)){
        return this.elements[indexElement].getAttribute(attributeName);
    }

    for(var key in this.elements){
        if (this.elements.hasOwnProperty(key) && this.elements[key] !== null){
            this.elements[key].setAttribute(attributeName, attributeValue);
        }
    }
};

/**
 * Метод для изменения значения форм input. Если парметр value не указан или явно указан null. То осуществляет получение
 * значения формы.
 * Если параметр value указан то осуществляется передача указаного значения в форму
 * @param value str|null
 * @param indexElement int
 * @returns str|bool
 */
Main.prototype.val = function (value = null, indexElement = DEFAULT_ELEMENT_INDEX) {
    if (!this.elements[indexElement]){
        return false;
    }
    if (value === null){
        return this.elements[indexElement].value;
    }
    for(var key in this.elements){
        if (this.elements.hasOwnProperty(key) && this.elements[key] !== null){
            this.elements[key].value = value;
        }
    }
};

/**
 * Функция для выборки элеметов по имени класса. Возвращает массив DOM элементов.
 * @param selector str
 * @returns array
 */
function getElementsByClassName(selector) {
    if(document.getElementsByClassName){ // IE8+
        return document.getElementsByClassName(selector);
    }
    else{
        var elements, pattern, i, results = [];

        if (document.querySelectorAll) { // IE8
            return document.querySelectorAll(SELECTOR_SYMBOLS.class + selector);
        }
        else if (document.evaluate) { // IE6, IE7
            pattern = ".//*[contains(concat(' ', @class, ' '), ' " + selector + " ')]";
            elements = document.evaluate(pattern, document, null, 0, null);
            while ((i = elements.iterateNext())) {
                results.push(i);
            }
        }
        else { // остальные
            elements = document.getElementsByTagName("*");
            pattern = new RegExp("(^|\\s)" + selector + "(\\s|$)");
            for (i = 0; i < elements.length; i++) {
                if ( pattern.test(elements[i].className) ) {
                    results.push(elements[i]);
                }
            }
        }
        return results;
    }
}







