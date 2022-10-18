"use strict"
//swap blocks
let buttonSwap = document.querySelector(".swap-button");
buttonSwap.addEventListener("click", swapBlocks);

let buttonCalc = document.querySelector(".calc-button");
buttonCalc.addEventListener("click", findEllipseArea);

//count words
let buttonCount = document.querySelector(".count-button");
buttonCount.addEventListener("click", countWords);

//change filling
for (let i = 1; i < 8; i++) {
    let button = document.querySelector(`.confirm-button-${i}`);
    button.addEventListener("click", function () {
        changeFilling(i);
    });
}

function swapBlocks() {
    let item4 = document.querySelector(".item-4");
    let item5 = document.querySelector(".item-5");
    let tmp = item5.innerHTML;
    item5.innerHTML = item4.innerHTML;
    item4.innerHTML = tmp;
}

let isAreaFound = false;

function findEllipseArea() {
    if (!isAreaFound) {
        let semiMajorAxis = 50;
        let semiMinorAxis = 20;
        isAreaFound=true;
        const textElement = document.querySelector(".selection");
        textElement.insertAdjacentHTML('beforebegin',
            `<div style="font-size: 15px">Ellipse Area: <b>${semiMinorAxis * semiMajorAxis * Math.PI.toFixed(4)}</b></div>`);
    }
}

let cookieName = "number";

function countWords() {
    let numWords = 0;
    let text = document.querySelector(".count-words").value;
    for (let i = 0; i < text.length; i++) {
        let currentCharacter = text[i];
        if (currentCharacter === " " && text[i + 1] !== " " && text[i + 1] !== undefined) {
            numWords += 1;
        }
    }
    numWords += 1;
    document.cookie = `${cookieName}=${numWords}`;
    alert("Count of words: " + numWords);
}

//change the original text to the entered || confirm button pressed
function changeFilling(numberOfButton) {
    document.querySelector(`.item-${numberOfButton}`).innerHTML =
        document.querySelector(`.change-filling-${numberOfButton}`).value;
    document.querySelector(`.item-${numberOfButton}`).style.fontStyle = "italic";
    resetButton(numberOfButton);
    if (numberOfButton === 3) {
        checkSelection();
        document.querySelector(".count-button").addEventListener("click", countWords);
    } else if (numberOfButton === 6) {
        document.querySelector(".swap-button").addEventListener("click", swapBlocks);
        document.querySelector(".calc-button").addEventListener("click", findEllipseArea);
    }// after replacing innerHTML, we need to re-add event listener
    localStorage.setItem(`.item-${numberOfButton}`, document.querySelector(`.item-${numberOfButton}`).innerHTML);
}

//check update
if (performance.navigation.type === 1 && getCookie(cookieName) !== undefined) {
    if (confirm(`Clear cookies? (${cookieName}=${getCookie(cookieName)})`)) {
        eraseCookie(cookieName);
        alert("Cookies have been deleted");
    } else {
        alert(`Current cookies: ${cookieName}=${getCookie(cookieName)}, you can remove them by reloading the page`);
    }
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0'
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

//Checkbox checking
let checkbox = document.querySelector(".checkbox");
document.ondblclick = function () {
    changeAlignment(checkbox);
};


function changeAlignment() {
    if (checkbox.checked) {
        console.log(localStorage.getItem('text-align'))
        if (localStorage.getItem('text-align') === null) {
            localStorage.setItem('text-align', "start")
            for (let i = 3; i < 6; i++) {
                document.querySelector(`.item-${i}`).style.textAlign = 'start';
            }
        } else {
            for (let i = 3; i < 6; i++) {
                document.querySelector(`.item-${i}`).style.textAlign = 'center';
            }
            localStorage.removeItem('text-align');
        }
    }
}

//check local storage on text-align
window.onload = function () {
    if (localStorage.getItem('text-align') !== null) {
        for (let i = 3; i < 6; i++) {
            document.querySelector(`.item-${i}`).style.textAlign = localStorage.getItem('text-align');
        }
    }
    for (let i=1; i<8; i++)
    {
        localStorage.removeItem(`.item-${i}`);
    }
    checkSelection();
};

//copy original text into input form
function fillContent(numberOfBlock) {
    document.querySelector(`.change-filling-${numberOfBlock}`).innerHTML =
        document.querySelector(`.item-${numberOfBlock}`).innerHTML;
}

//change block visibility edit code
let blockOriginalContent = [];
for (let i = 1; i < 8; i++) { //saving original content
    blockOriginalContent.push(document.querySelector(`.item-${i}`).innerHTML);
}

function checkSelection() {
    let select = document.getElementsByClassName('selection')[0];
    let lastIndex = 1; // After each option change, store the index of the previous block here

    select.addEventListener('change', function () {
        document.querySelector(`.change-filling-form-${lastIndex}`).style.display = "none";
        let index = select.selectedIndex;
        if (localStorage.getItem(`.item-${index}`) === null) {
            fillContent(index);
            document.querySelector(`.change-filling-form-${index}`).style.display = "flex";
            lastIndex = index;
        }
    });
}

//reset button visibility change
function resetButton(numberOfButton) {
    let resetButton = document.querySelector(`.reset-button-${numberOfButton}`);
    resetButton.style.display = "inline-block";
    resetButton.addEventListener("click", function () {
        resetFilling(numberOfButton);
    });
}

//reset blocks content || reset pressed
function resetFilling(numberOfButton) {
    document.querySelector(`.item-${numberOfButton}`).innerHTML = blockOriginalContent[numberOfButton - 1];
    document.querySelector(`.reset-button-${numberOfButton}`).style.display = "none";
    document.querySelector(`.item-${numberOfButton}`).style.fontStyle = "normal";
    document.querySelector(`.reset-button-${numberOfButton}`).removeEventListener("click", function () {
        resetFilling(numberOfButton);
    });
    document.querySelector(`.confirm-button-${numberOfButton}`).addEventListener("click", function () {
        changeFilling(numberOfButton);
    });
    if (numberOfButton === 3) {
        document.querySelector(".count-button").addEventListener("click", countWords);
        checkSelection(); // after replacing innerHTML, we need to re-add event listener
    } else if (numberOfButton === 6) {
        document.querySelector(".swap-button").addEventListener("click", swapBlocks);
    }
    localStorage.removeItem(`.item-${numberOfButton}`);
}