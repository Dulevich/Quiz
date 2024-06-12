'use strict'

const questionTime = 15 // время на вопрос
let questionTimeout = questionTime // таймер вопроса (обновляем на каждом новом вопросе)

// загружаем фоновую музыку и звуки
const backgroundMusic = new Audio('https://chelovek-gorod.github.io/front-quiz/bgm.mp3')
const soundTrue = new Audio('https://chelovek-gorod.github.io/front-quiz/true.mp3')
const soundFalse = new Audio('https://chelovek-gorod.github.io/front-quiz/false.mp3')

// создаем список вопросов
const questionsList = [
    {
        question: 'Сколько будет 2 + 2',
        answers:[
            '4',
            '12',
            'Очень много',
            '0'
        ],
        right: 0 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Сколько будет 3 + 7',
        answers:[
            '2',
            '12',
            'Очень много',
            '10'
        ],
        right: 3 // правильный ответ (нумерация с нуля)
    },
  
   {
        question: 'Какая четвёртая планета от солнца',
        answers:[
            'Марс',
            'Земля',
            'Плутон',
            'Луна'
        ],
        right: 0 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Сколько будет 9 * 2',
        answers:[
            '34',
            '18',
            '90',
            '0'
        ],
        right: 1 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Сколько будет 70 - 7',
        answers:[
            '33',
            '18',
            '65',
            '63'
        ],
        right: 3 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Сколько будет -1 - 1',
        answers:[
            '1',
            '2',
            '-1',
            '-2'
        ],
        right: 3 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Сколько будет 2 * 2 + 2',
        answers:[
            '2',
            '4',
            '6',
            '8'
        ],
        right: 2 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Раз в сколько лет наступает высокосный год',
        answers:[
            '3',
            '4',
            '10',
            '2'
        ],
        right: 1 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Какой город является первым регионом Беларуси',
        answers:[
            'Минск',
            'Витебск',
            'Брест',
            'Могилёв'
        ],
        right: 2 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Сколько будет 20 + 14',
        answers:[
            '34',
            '18',
            '90',
            '0'
        ],
        right: 0 // правильный ответ (нумерация с нуля)
    },
]
// сортируем вопросы в случайном порядке
questionsList.sort( arrayRandomSort ) // в метод sort передаем функцию сортировки
function arrayRandomSort() {
    // Math.random() генерирует случайное число от 0 до 1 (не включая 1)
    return Math.random() - 0.5
}

let score = 0 // число очков (начисляем при правильном ответе за оставшееся время)
let rightAnswers = 0 // число правильных ответов

let rightText = '' // текст правильного ответа (обновляем задавая новый вопрос)
let answer = '' // ответ, выбранный игроком (обновляем при клике игрока на ответ)

let questionCounter = 0 // счетчик заданных вопросов
const questionNumber = questionsList.length // число всех вопросов


// получаем ссылки на HTML-теги, для работы с ними
const startButton = document.querySelector('.start')

const gameContainer = document.querySelector('#game-container')

const divInfo = document.querySelector('#info')
const qNumberSpan = document.querySelector('#q-number')
const qAllSpan = document.querySelector('#q-all')
const qTimerSpan = document.querySelector('#q-timer')
const divQuestion = document.querySelector('.question')

const divAns1 = document.querySelector('#ans1')
const divAns2 = document.querySelector('#ans2')
const divAns3 = document.querySelector('#ans3')
const divAns4 = document.querySelector('#ans4')

const divResult = document.querySelector('#result')
const spanScore = document.querySelector('#score')
const spanRight = document.querySelector('#rightCount')

// создаем массив из тегов <div> с ответами
const answers = [divAns1, divAns2, divAns3, divAns4]
// создаем массив из тегов <span> в тегах <div> с ответами
const answerSpans = [
    divAns1.querySelector('span'),
    divAns2.querySelector('span'),
    divAns3.querySelector('span'),
    divAns4.querySelector('span'),
]

// подключаем слушатель клика к кнопкам ответа
for(let i = 0; i < answers.length; i++) {
    answers[i].onclick = getAnswerClick
    // answers[i].onclick = function() { getAnswerClick(i) }
}

// функция - обработчик клика по ответу
function getAnswerClick( event ) {
    if (answer) return // если ответ уже дан - выходим

    const divAnswer = event.target // получаем <div> по которому кликнул игрок
    const spanAnswer = divAnswer.querySelector('span') // получаем <span> в <div>
    if (spanAnswer) {
      answer = spanAnswer.innerText // достаем текст ответа из <span>
    } else {
      answer = divAnswer.innerText // достаем текст ответа из <div>
    }
    // проверка правильности произойдет в функции updateTimer()

    if (answer === rightText) {
        soundTrue.play()
    } else {
        soundFalse.play()
    }
}

startButton.onclick = startQuiz

function startQuiz() {
    backgroundMusic.play()

    startButton.style.display = 'none'
    gameContainer.style.display = 'block'
  
    qAllSpan.innerText = questionNumber
    nextQuestion()
}

function updateTimer() {
    if (answer) {
        if(rightText === answer) {
            score += questionTimeout
            rightAnswers += 1
        }
        return nextQuestion()
    }

    questionTimeout--
    qTimerSpan.innerText = questionTimeout
    if (questionTimeout > 0) {
        setTimeout(updateTimer, 1000)
    } else {
        setTimeout(nextQuestion, 1000)
    }
}

function nextQuestion() {
    answer = ''
    // clearTimeout(questionTimerID)

    questionCounter++
  
    if (questionCounter > questionNumber) {
        return showResults()
    }
  
    questionTimeout = questionTime
    qNumberSpan.innerText = questionCounter
    qTimerSpan.innerText = questionTimeout 

    let question = questionsList.pop()
    rightText = question.answers[ question.right ]

    divQuestion.innerText = question.question

    answerSpans.forEach( setAnswer )
    function setAnswer(ansSpan, index) {
        ansSpan.innerText = question.answers[index]
    }
  
    setTimeout(updateTimer, 1000)
}

function showResults() {
    gameContainer.style.display = 'none'

    spanScore.innerText = score
    spanRight.innerText = rightAnswers
    divResult.style.display = 'block'
}