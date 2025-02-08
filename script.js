import {tex} from "./data.js"

const $paragraph = document.querySelector("p")
const $reload = document.querySelector("button")
const $wpm = document.querySelector("h2.wpm")
const $percent = document.querySelector("h2.percent")

const $imageEnter = document.createElement("img")
$imageEnter.setAttribute("src","image/Backspace.png")
$imageEnter.classList.add("enter")
$imageEnter.addEventListener("click", ()=>{
    let custom = new Event("keypress")
    custom.key = "Enter"
    on_press(custom)
});


window.addEventListener("focus", on_focus);
window.addEventListener("blur", on_blur);
document.addEventListener("keypress",on_press)
$reload.addEventListener("click",init_game)

let currWord 
let currLetter
let currTime = 0
let interval = null
let failedTheFirstAttempt = false
let press_enter = false


function init_game(){
    $reload.blur()
    $paragraph.innerHTML = ""
    $wpm.innerHTML = ""
    $percent.innerHTML = ""
    clearInterval(interval)
    failedTheFirstAttempt = false

    const texto = tex.toSorted(()=> {return Math.random() - .5}).slice(0,16)
    texto.map((word,index) =>{
        const $word = document.createElement("span")
        $word.classList.add("word")
        word.split("").map((letter)=>{
            const $letter = document.createElement("span")
            $letter.classList.add("letter")
            $letter.textContent = letter
            $word.append($letter)
        })
        $paragraph.appendChild($word)

        if (index !== texto.length-1){
            const $void = document.createElement("span")
            const $space = document.createElement("span")
            $space.innerText = " "
            $space.classList.add("space")
            $void.appendChild($space)
            $paragraph.appendChild($void)
        }
    })
    currWord = document.querySelector("span.word")
    currLetter = document.querySelector("span.letter")
    currLetter.classList.add("active")
}
init_game()

function end_game(){
    clearInterval(interval)
    $wpm.textContent = (24 / (currTime / 60)).toFixed(2)  + " wpm"
    let corrects = [...document.querySelectorAll("span.letter.correct")].length;
    let incorrects = [...document.querySelectorAll("span.letter.incorrect")].length;
    $percent.textContent = (100 - ((incorrects/corrects)*100)).toFixed(2) + " %"
}
function on_focus(){}
function on_blur(){}

function on_press(event){
    
    if (interval == null){
        interval = setInterval(()=>currTime++,1000)
    }
    
    if (!press_enter && event.key != currLetter.textContent) {
        failedTheFirstAttempt = true
        return
    }
    if (press_enter){
        if (event.key != "Enter"){
            return
        }
        press_enter = false
        currLetter.removeChild($imageEnter)
    }
    if (failedTheFirstAttempt) currLetter.classList.add("incorrect")
    else currLetter.classList.add("correct")

    failedTheFirstAttempt = false
    currLetter.classList.remove("active")
    let next = currLetter.nextElementSibling

    if (next == null){
        currWord = currWord.nextElementSibling
        if (currWord == null){
            end_game()
            return
        }
        next = currWord.firstChild
        if(next.offsetWidth == 0){
            next.appendChild($imageEnter)
            press_enter = true
        }
    }
    next.classList.add("active")
    currLetter = next
}

