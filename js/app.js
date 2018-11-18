const gameContainer = document.getElementById("gameContainer");

let gameLevel=1; // Use for speed
let failCount;
let score;
let transformValue;
let questions = [];
let wrongAnswers = [];
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
        wrongAnswers = [];
        document.querySelector(".main-screen").style.display = 'none';
        document.querySelector(".score-board").style.display = 'none';
        createLevel();
        createAnimation();
        updateScore();
        document.querySelector(".header__heart").innerHTML = `<img class="animated infinite" src="images/heart.svg" alt="1">
        <img class="animated infinite" src="images/heart.svg" alt="2">
        <img class="animated infinite" src="images/heart.svg" alt="3">`;
}

function createAnimation(){
    var transformValue = 0;
    interval = setInterval(function(){
        for(let i=0;i<(gameLevel+1);i++){
            transformValue+=0.15;
            gameContainer.style.transform = "translateY("+transformValue+"px)"; //(Number.parseInt(getComputedStyle(gameContainer).bottom) - 1) + "px"; 
        }
        if(transformValue >= window.innerHeight - 60){
            var questionElements = document.querySelectorAll(".question-box");
            for(let i=questionElements.length;i>0;i--){
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

function checkAnswer(index,option,index2){
    console.log(index,option);
    var _clickedQuestion = questions[index];
    if(!_clickedQuestion.isClicked){
        var elementId = `question-option-${index}-${option}-${index2}`;
        console.log(elementId);
        _clickedQuestion.isClicked = true;
        if(_clickedQuestion.answer == option){
            score++;
            updateScore();
            correctSound.play();
            document.getElementById(elementId).classList.add("green");
        }else{
            failCount++;
            wrongAnswers.push(_clickedQuestion);
            if(failCount >= 3)
                gameEnd();
            destroyHeart();
            try{
                window.navigator.vibrate(400); // vibrate for 200ms
            }catch(ex){

            }
            incorrectSound.play();
            document.getElementById(elementId).classList.add("red");
            var getCorrectIndex = _clickedQuestion.options.indexOf(_clickedQuestion.answer);
            document.getElementById(`question-option-${index}-${_clickedQuestion.answer}-${getCorrectIndex}`).classList.add("yellow");
        }
        if(checkLevelIsComplete() && failCount < 3){
            clearInterval(interval);
            nextLevel();
        }
    }
}

function checkLevelIsComplete(){
    let _complete = true; 
    questions.forEach(element => {
        if(!element.isClicked){
            _complete = false;
        }
    });
    return _complete;
}

function nextLevel(){
    gameLevel++;
    document.querySelector(".level-board__count").innerHTML = gameLevel;
    document.querySelector(".level-board").style.display = "flex";
    let timer = 5;
    document.querySelector(".level-board__timer").innerHTML = timer;
    var levelTimerInterval = setInterval(function(){
        timer--;
        document.querySelector(".level-board__timer").innerHTML = timer;
        if(timer == 0){
            clearInterval(levelTimerInterval);
            console.log("NEXT");
            transformValue=0;
            questions = [];
            createLevel();
            createAnimation();
            document.querySelector(".level-board").style.display = "none";
        }
    },1000);
}

function createLevelObject(){
    let _questionObj = "";
    questions = getQuestions();
    questions.forEach((element,index) => {
        const decideProcess = parseInt(Math.random()*3)+1;
        _questionObj += `<div class="question-box" id="question${index}">`;
        element.options.forEach((option,index2) => {
            _questionObj += `<div id="question-option-${index}-${option}-${index2}" onclick="checkAnswer(${index},${option},${index2})" class="question-box__answer">${element.question} = ${option}</div>`;
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
    const firstNumber = parseInt(Math.random() * (7 + (gameLevel * 2)));
    const secondNumber = parseInt(Math.random() * (7 + (gameLevel * 2)));
    const decideProcess = parseInt(Math.random() * 4);
    let answer;
    let questionKey;
    let options = [];
    switch(decideProcess){
        case 0:
            questionKey= "+";
            answer = firstNumber + secondNumber;
            options.push(answer);
            break;
        case 1:
            questionKey= "x";
            answer = firstNumber * secondNumber;
            options.push(answer);
            break;
        case 2:
            if(firstNumber%secondNumber == 0){
                questionKey= "/";
                answer = parseInt(firstNumber / secondNumber);
                options.push(answer);
            }
            else{
                questionKey= "+";
                answer = firstNumber + secondNumber;
                options.push(answer);
            }
            break;
        case 3:
            questionKey= "-";
            answer = firstNumber - secondNumber;
            options.push(answer);
            break;
    }
    let randomOpts = [];
    randomOpts.push(answer + parseInt(Math.random()*10 + 1));
    randomOpts.push(answer - parseInt(Math.random()*10 + 1));
    randomOpts.push(answer - parseInt(Math.random()*10 + 1));
    randomOpts.push(answer + parseInt(Math.random()*10 + 1));
    randomOpts = shuffle(randomOpts);
    options.push(randomOpts[0]);
    options.push(randomOpts[1]);
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
    },500);
}

function gameEnd(){
    document.querySelector(".score-board__score").innerHTML = "SCORE: "+score;
    document.querySelector(".score_board__wrongs").innerHTML = "";
    console.log(wrongAnswers);
    wrongAnswers.forEach(function(ans){
        document.querySelector(".score_board__wrongs").innerHTML += `<p>${ans.question}=${ans.answer}</p>`;
    });
    init();
    clearInterval(interval);
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