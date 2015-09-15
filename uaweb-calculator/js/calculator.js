var Calculator = (function (Calc) {

    var tableResultIds = ["belowNormal", "justNormal", "aboveNormal1", "aboveNormal2", "aboveNormal3", "aboveNormal4"];
    var personHeight = document.getElementById('personHeight');
    var personWeight = document.getElementById('personWeight');
    var displayText = document.getElementById('finalResult');
    var errorMsg = document.getElementById('errorMessage');
    var resultMsg = document.getElementById('resultMessage')
    function addEvent(element, event, callback) {
        if (window.addEventListener) {
            element.addEventListener(event, callback, false);
        } else if (document.attachEvent) {
            element.attachEvent('on' + event, callback);
        } else {
            element['on' + event] = callback;
        }
    }
    function calculateIMT(personHeight, personWeight) {
        var result = personWeight / ((personHeight / 100) * (personHeight / 100));
        result = Math.round(result * 100) / 100;
        return result;
    }
    function render() {
        var resultIMT;
        removeCurrentResults();
        if (isPositive(personHeight.value) && isPositive(personWeight.value)) {
            resultIMT = calculateIMT(personHeight.value, personWeight.value);
            renderResult(resultIMT);
        } else {
            renderError();
        }
    }
    function renderResult(resultValue) {
        //console.log("result: " + resultValue);
        highlightCurrentResult(resultValue);
        displayText.innerHTML = resultValue;
        resultMsg.style.display = 'block';
    }
    function renderError() {
        errorMsg.style.display = 'block';
    }
    
    function highlightTableResult(classId) {
        addClass('current', document.getElementById(classId));
    }
    function removeCurrentResults() {
        var i,
            element,
            len = tableResultIds.length;
        // Remove active class from table
        for (var i = 0; i < len; i++) {
            element = document.getElementById(tableResultIds[i]);
            removeClass('current', element);
        }
        // Hide error and result messages
        resultMsg.style.display = 'none';
        errorMsg.style.display = 'none';
    }
    function highlightCurrentResult(resultValue) {
        if (resultValue < 18.5) {
            highlightTableResult(tableResultIds[0]);
        } else if (resultValue > 18.5 && resultValue <= 25) {
            highlightTableResult(tableResultIds[1]);
        } else if (resultValue > 25 && resultValue <= 30) {
            highlightTableResult(tableResultIds[2]);
        } else if (resultValue > 30 && resultValue <= 35) {
            highlightTableResult(tableResultIds[3]);
        } else if (resultValue > 35 && resultValue <= 40) {
            highlightTableResult(tableResultIds[4]);
        } else {
            highlightTableResult(tableResultIds[5]);
        }
    }
    function addClass(classname, element) {
        var cn = element.className;
        //test for existance
        if (cn.indexOf(classname) != -1) {
            return;
        }
        //add a space if the element already has class
        if (cn != '') {
            classname = ' ' + classname;
        }
        element.className = cn + classname;
    }
    function removeClass(classname, element) {
        var cn = element.className;
        var rxp = new RegExp("\\s?\\b" + classname + "\\b", "g");
        cn = cn.replace(rxp, '');
        element.className = cn;
    }
    function isPositive(n) {
        return n > 0;
    }
    

    function initEvents() {
        var cb = document.getElementById('calculateButton');
        addEvent(cb,'click',Calculator.render);
    }

    Calc.render = function() {
        var resultIMT;    
         
        removeCurrentResults();
            
        if (isPositive(personHeight.value) && isPositive(personWeight.value)) {
            resultIMT = calculateIMT(personHeight.value, personWeight.value);
            renderResult(resultIMT);
        } else {
            renderError();
        }
    }
    Calc.init = function () {
        addEvent(window,'DOMContentLoaded',initEvents);
    }
    return Calc;

})(Calculator || {});

