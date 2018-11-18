
/*var intervall;
function init(){
    var transformValue = 0;
    intervall = setInterval(function(){
        transformValue+=0.5;
        gameContainer.style.transform = "translateY("+transformValue+"px)"; //(Number.parseInt(getComputedStyle(gameContainer).bottom) - 1) + "px"; 
        /* gameContainer.innerHTML += `<div class="question-box">
                                        <div class="question-box__answer">21+21 = 42</div>
                                        <div class="question-box__answer">21+21 = 22</div>
                                        <div class="question-box__answer">21+21 = 32</div>
                                    </div>`; /
        if(transformValue >= window.innerHeight - 60){
            
        }
    },10);

}*/

/*
    CreateGameLevel
    Create Animation
    Create Questions
    Create Elemenets
    Check Answer
*/

const gameContainer = document.getElementById("gameContainer");

let gameLevel=1; // Use for speed
let failCount;
let score;
let transformValue;
let questions = [];
let interval;
const questionCount = 5;

function init(){
    if(interval){
        clearInterval(interval);
    }
    gameLevel = 1;
    failCount = 0;
    score = 0;
    transformValue=0;
    questions = [];
    document.querySelector(".score-board").style.display = 'none';
    createLevel();
    createAnimation();
    updateScore();
    document.querySelector(".header__heart").innerHTML = `<img class="animated infinite" src="images/heart.svg" alt="1">
    <img class="animated infinite" src="images/heart.svg" alt="2">
    <img class="animated infinite" src="images/heart.svg" alt="3">`;
}
init();

function createAnimation(){
    var transformValue = 0;
    interval = setInterval(function(){
        transformValue+=0.5;
        gameContainer.style.transform = "translateY("+transformValue+"px)"; //(Number.parseInt(getComputedStyle(gameContainer).bottom) - 1) + "px"; 
        if(transformValue >= window.innerHeight - 60){
            var questionElements = document.querySelectorAll(".question-box");
            for(let i=questionElements.length;i>0;i--){
                console.log(i);
                if(!questions[i-1].isClicked){
                    if(questionElements[i-1].getBoundingClientRect().bottom >= window.innerHeight+90){
                        // Gamer Over Function
                        gameEnd();
                        clearInterval(interval);
                    }
                }
            }
            /*questionElements.forEach(element => {
                element.clientTop
            });*/
            //console.log(questionElements.length);
        }
    },3); //25
}

function createLevel(){
    let _questionsDomObj = createLevelObject();
    gameContainer.innerHTML = _questionsDomObj;
}

function checkAnswer(index,option){
    console.log(index,option);
    var _clickedQuestion = questions[index];
    if(!_clickedQuestion.isClicked){
        var elementId = `question-option-${index}-${option}`;
        console.log(elementId);
        _clickedQuestion.isClicked = true;
        if(_clickedQuestion.answer == option){
            score++;
            updateScore();
            correctSound.play();
            document.getElementById(elementId).classList.add("green");
        }else{
            failCount++;
            if(failCount == 4)
                gameEnd();
            destroyHeart();
            window.navigator.vibrate(400); // vibrate for 200ms
            incorrectSound.play();
            document.getElementById(elementId).classList.add("red");
        }
    }
}

function createLevelObject(){
    let _questionObj = "";
    questions = getQuestions();
    questions.forEach((element,index) => {
        const decideProcess = parseInt(Math.random()*3)+1;
        _questionObj += `<div class="question-box" id="question${index}">`;
        element.options.forEach(option => {
            _questionObj += `<div id="question-option-${index}-${option}" onclick="checkAnswer(${index},${option})" class="question-box__answer">${element.question} = ${option}</div>`;
        });
        _questionObj += `</div>`;
    });
    return _questionObj;
}

function getQuestions(){
    let questions = [];
    let _questionCount = questionCount + (gameLevel + 1);
    for(let i = 0; i < _questionCount;i++){
        questions.push(createQuestion());
    }
    return questions;
}

function createQuestion(){
    const firstNumber = parseInt(Math.random() * 10);
    const secondNumber = parseInt(Math.random() * 10);
    const decideProcess = parseInt(Math.random()*4);
    let answer;
    let questionKey;
    let options = [];
    switch(decideProcess){
        case 0:
            questionKey= "+";
            answer = firstNumber + secondNumber;
            options.push(answer);
            options.push(firstNumber + secondNumber + parseInt(Math.random()*10) + 4);
            options.push(firstNumber - secondNumber + parseInt(Math.random()*10) + 4);
            break;
        case 1:
            questionKey= "x";
            answer = firstNumber * secondNumber;
            options.push(answer);
            options.push(firstNumber * secondNumber - parseInt(Math.random()*6) + 2);
            options.push(firstNumber * secondNumber + parseInt(Math.random()*6) + 2);
            break;
        case 2:
            if(firstNumber%secondNumber == 0){
                questionKey= "/";
                answer = firstNumber / secondNumber;
                options.push(answer);
                options.push((firstNumber / secondNumber - parseInt(Math.random()*6) + 2).toFixed(2));
                options.push((firstNumber / secondNumber + parseInt(Math.random()*6) + 2).toFixed(2));
            }
            else{
                questionKey= "+";
                answer = firstNumber + secondNumber;
                options.push(answer);
                options.push(firstNumber + secondNumber + parseInt(Math.random()*10) + 4);
                options.push(firstNumber - secondNumber + parseInt(Math.random()*10) + 4);
            }
            break;
        case 3:
            questionKey= "-";
            answer = firstNumber - secondNumber;
            options.push(answer);
            options.push(firstNumber + secondNumber + parseInt(Math.random()*10) + 4);
            options.push(firstNumber - secondNumber + parseInt(Math.random()*10) + 4);
            break;
    }
    shuffle(options);
    return {
        question: firstNumber + questionKey + secondNumber,
        answer:answer,
        options:options
    }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function updateScore(){
    document.querySelector(".header__score").innerHTML = "SCORE: "+score;
}

function destroyHeart() {
    var hearts = document.querySelectorAll(".header__heart img");
    var element = hearts[0].classList.add("swing");
    setTimeout(function(){
        hearts[0].remove();
    },1500);
}

function gameEnd(){
    document.querySelector(".score-board__score").innerHTML = "SCORE: "+score;
    init();
    document.querySelector(".score-board").style.display = 'flex';
}

const refreshButton = document.querySelector(".header__refresh");
refreshButton.addEventListener("click",function(){
    init();
});

let incorrectSound = new sound("sounds/incorrect.mp3");
let correctSound = new sound("sounds/correct.mp3");
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}