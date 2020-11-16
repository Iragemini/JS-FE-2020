var play = false;

function createDocument () {
    const body = document.querySelector('body');

    const div = body.appendChild(document.createElement("div"));
    div.classList.add("wrapper");
    
    const header = div.appendChild(document.createElement("header"));
    header.classList.add("header");
    
    const main = div.appendChild(document.createElement("main"));
    main.classList.add("main");
    
    const footer = div.appendChild(document.createElement("footer"));
    footer.classList.add("footer");
    
    // header menu
    
    const menu = header.appendChild(document.createElement("div"));
    menu.classList.add("wrapper__menu");
    const menuUl = menu.appendChild(document.createElement("ul"));
    menuUl.classList.add("menu");
    
    for(let i = 1; i <= 4; i++) {
        const li = menuUl.appendChild(document.createElement("li"));
        li.id = `li${i}`;
        if(i < 4) {
            li.classList.add("li__menu");
        }
        let text = "";
        if(i === 1) {
            text = "Новая игра";
        } else if (i === 2) {
            text = "Результаты";
        } else if (i === 3) {
            text = "Пауза";
        } else {
            text = "";
        }
        li.innerText = text;
    }
    const select = document.querySelector('#li4').appendChild(document.createElement('select'));
    select.classList.add('select__size');
    select.onchange = function () {
        changeGemSize();
    }
    for (let i = 3; i <= 8; i++) {
        const option = select.appendChild(document.createElement('option'));
        option.id = 'option_' + i;
        option.value = `${i}`;
        option.text = `${i} x ${i} `;
        if(i === 4) {
            option.selected = true;
        }
    }

    const pause = document.querySelector('#li3');
    pause.onclick = function () {
        pauseGame();
    }

    // игровое поле

    const timeAndScore = main.appendChild(document.createElement('div'));
    timeAndScore.classList.add('time_score');

    const timeDiv = timeAndScore.appendChild(document.createElement('div'));
    timeDiv.classList.add('time');
    const spanTime = timeDiv.appendChild(document.createElement('span'));
    spanTime.innerText = 'Время : ';
    let spanTimeValue = timeDiv.appendChild(document.createElement('span'));
    spanTimeValue.classList.add('time_value');
    spanTimeValue.innerText = '00:00:00';

    const score = timeAndScore.appendChild(document.createElement('div'));
    score.classList.add('score');
    const span = score.appendChild(document.createElement('span'));
    span.innerText = 'Количество ходов : ';
    let spanValue = score.appendChild(document.createElement('span'));
    spanValue.classList.add('score_value');
    spanValue.innerText = '0';
    //score.innerHTML = '<span class="score_value">0</span>';
    
    const canvas = main.appendChild(document.createElement("canvas"));
    canvas.id = "canvas";

    const menuFooter = footer.appendChild(document.createElement("div"));
    menuFooter.classList.add("wrapper__menu");
    const menuFooterUl = menuFooter.appendChild(document.createElement("ul"));
    menuFooterUl.classList.add("menu");

    for(let i = 1; i <= 3; i++) {
        const liF = menuFooterUl.appendChild(document.createElement("li"));
        liF.id = `liF${i}`;
        if(i < 3) {
            liF.classList.add("li__menu");
        }
        let text = "";
        if(i === 1) {
            text = "Сохранить игру";
        } else if (i === 2) {
            text = "Загрузить игру";
        } else {
            text = "";
        }
        liF.innerText = text;
    }

    const audioBtn = liF3.appendChild(document.createElement('span'));
    audioBtn.classList.add('audio__btn');
    audioBtn.innerHTML = '<img src="../assets/sound_mute.png" alt="sound_mute">';
    audioBtn.onclick = function () {
        play = !play;
        if(play) {
            audioBtn.innerHTML = '<img src="./assets/sound.png" alt="sound">';
        } else {
        audioBtn.innerHTML = '<img src="./assets/sound_mute.png" alt="sound_mute">';
        }
    }

    const audio = body.appendChild(document.createElement('audio'));
    audio.classList.add('audio');
    audio.src = "./assets/sounds/audio.mp3";

    const timerScript = body.appendChild(document.createElement('script'));
    timerScript.src = "./src/js/time.js";    
    const modalWinScript = body.appendChild(document.createElement('script'));
    modalWinScript.src = "./src/js/modalWin.js"; 
    const audioScript = body.appendChild(document.createElement('script'));
    audioScript.src = "./src/js/audio.js"; 
    const saveGameScript = body.appendChild(document.createElement('script'));
    saveGameScript.src = "./src/js/saveGame.js";
} 

function createArr (size) {

    const arrSize = size * size;
    //console.log(`game arrSize = ${arrSize} , size = ${size}`);
    
        let arr = [];
        for (let i = 1; i <= arrSize; i++) {
            let subArr = [];
            let subArrSize = +size + i;
            //console.log(`subArrSize = ${subArrSize}, i = ${i}, size = ${+size}`);
    
            for (let j = 0; j < +size; j++) {
                let item = i + j;
                if(item === arrSize) {
                    item = 0;
                    //console.log(`item = ${item}`);
                }
                subArr.push(item);
            }
            arr.push(subArr);
            i = subArrSize - 1;
        }
        return arr;
}

function Game (size, context, cellSize) {
//console.log(`game cell = ${cellSize} , size = ${size}`);

    let arr = createArr(size);

    //console.log(`arr = ${arr}`);

    let clicks = 0;



    function cellView(x, y) {
        //console.log(`x = ${x},  y = ${y}`);
        let per = (cellSize / 100) * 15;
        let per_ = (cellSize / 100) * 55;
        let radius1 = (cellSize - per) / 2;
        let radius2 = radius1 / 2;
        let radgrad = context.createRadialGradient(x + per_, y + per_, radius2, x + per_ - 5, y + per_ - 5, radius1);
        radgrad.addColorStop(0, '#fe7cb5');
        radgrad.addColorStop(0.9, '#5b0302');
        radgrad.addColorStop(1, '#f2f2f2');
        context.fillStyle = radgrad;
        context.fillRect(
            x + 1,
            y + 1,
            cellSize - 2,
            cellSize - 2
        );
    };

    function numView(){
		context.font = "bold "+ 
            (cellSize/2) + "px Sans";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "black";
    };
    
    this.getNullCell = function(){
		for (let i = 0; i < size; i++){
			for (let j = 0; j < size; j++){
				if(arr[j][i] === 0){
					return {'x': i, 'y': j};
				}
			}
		}
	};

    this.draw = function () {
        //console.log(`contex = ${context}, cellSize = ${cellSize}`);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (arr[i][j] > 0) {
                    cellView (
                        j * cellSize,
                        i * cellSize
                    );
                    numView();
                    context.fillText (
                        arr[i][j],
                        j * cellSize + cellSize / 2,
                        i * cellSize + cellSize / 2
                    );
                }
            }
        }
    };

    this.move = function (x, y) {
        const nullX = this.getNullCell().x;
        const nullY = this.getNullCell().y;
        if ( ((x - 1 === nullX || x + 1 === nullX) && y === nullY) || 
        ((y - 1 === nullY || y + 1 === nullY) && x === nullX) ) {
            arr[nullY][nullX] = arr[y][x];
            arr[y][x] = 0;
            clicks++;
            document.querySelector('.score_value').innerText = clicks.toString();
        }
    };

    this.victory = function () {
        const arrInit = createArr(size);
    //console.log(`arrInit = ${arrInit}`);

        const e = arrInit;
        let res = true;
        for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (e[i][j] != arr[i][j]) {
					res = false;
				}
			}
		}
		return res;
    };

    function getRandomBool() {
		if (Math.floor(Math.random() * 2) === 0) {
			return true;
		}
    };
    
    this.mix = function(sizeGem) {
        let sizeStep = +sizeGem - 1
        let stepCount = sizeStep * 100;
		//console.log(stepCount);
		let x,y;
		for (let i = 0; i < stepCount; i++) {
			let nullX = this.getNullCell().x;
			let nullY = this.getNullCell().y;
			let hMove = getRandomBool();
			let upLeft = getRandomBool();
			if (!hMove && !upLeft) { y = nullY; x = nullX - 1;}
			if (hMove && !upLeft)  { x = nullX; y = nullY + 1;}
			if (!hMove && upLeft)  { y = nullY; x = nullX + 1;}
			if (hMove && upLeft)   { x = nullX; y = nullY - 1;}
			if (0 <= x && x <= sizeStep && 0 <= y && y <= sizeStep) {
				this.move(x, y);
			}
		}
        clicks = 0;
        document.querySelector('.score_value').innerText = clicks.toString();
    };
    
    this.getClicks = function() {
		return clicks;
    };
    
    this.changeSize = function (size) {
        cellSize = size;
    }

    this.getArr = function () {
        return arr;
    }
}

function loadGame(sizeGem) {

    if(!localStorage.getItem("scoreArr")){
        localStorage.setItem("scoreArr", JSON.stringify([]));
    }
    
    //console.log(`sizeGem = ${sizeGem}`);
    const canvas = document.querySelector("#canvas");
    const real_width = document.documentElement.clientWidth;
    let my_width = Math.round((real_width / 100)) * 25;
    if(real_width < 800) {
        my_width = Math.round((real_width / 100)) * 50;
    }
    if(real_width < 550) {
        my_width = Math.round((real_width / 100)) * 75;
    }
    canvas.width = my_width;
    canvas.height = my_width;
    let cellSize = canvas.width / sizeGem;
    let context = canvas.getContext("2d");
    context.fillRect(0, 0, canvas.width, canvas.height);

    const game = new Game (sizeGem, context, cellSize);
    game.mix(sizeGem);
    game.draw();
    
    const newGame = document.querySelector('#li1');
    newGame.onclick = function (e) {
        //localStorage.setItem('time', '00:00:00');
        StartStop("new");
        game.mix(sizeGem);
        context.fillRect(0, 0, canvas.width, canvas.height);
        game.draw();
    };

    const showResult = document.querySelector('#li2');
    showResult.onclick = function () {
        let result = JSON.parse(localStorage.getItem("scoreArr"));
        result = result.sort((a, b) => {
            return a.score - b.score;
        }).reverse();
        //console.log(result);

        createModal(document.querySelector('.main'), result);
        const modal = document.querySelector('#modal-win');
        modal.style.display = "block";
    }
    
    const save = document.querySelector('#liF1');
    save.onclick = function () {
        saveGame(getUser(), game.getClicks(), getTime(), getSizeGem(), game.getArr());
    }
  
    canvas.onclick = function(e) {
        playSound(play);
        const x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
        const y = (e.pageY - canvas.offsetTop)  / cellSize | 0;
        //console.log(e.pageY, canvas.offsetTop);
        event(x, y); 
    };

    /*canvas.ontouchend = function(e) {
        const x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0;
        const y = (e.touches[0].pageY - canvas.offsetTop)  / cellSize | 0;
        
        event(x, y);
    };  */

    function event(x, y) {
        //console.log(`click = ${game.getClicks()}`);
        if(game.getClicks() === 0) {
            StartStop("click");
        } 
        game.move(x, y);
        context.fillRect(0, 0, canvas.width, canvas.height);
        game.draw();
        if (game.victory()) {
            saveResult(getUser(), game.getClicks(), getTime(), getSizeGem());
            StartStop("victory");
            // модальное окно
            createModal(document.querySelector('.main'), 'Ура, победа!');
            const modal = document.querySelector('#modal-win');
            modal.style.display = "block";
            const modalText = document.querySelector('.modal-text');
            modalText.innerText = `Собрано за ${game.getClicks()} ходов!`;
        }
    }

    window.onresize = function() {
        const canvas = document.querySelector("#canvas");
        const real_width = document.documentElement.clientWidth;
        let my_width = Math.round((real_width / 100)) * 35;
        if(real_width < 800) {
            my_width = Math.round((real_width / 100)) * 50;
        }
        if(real_width < 550) {
            my_width = Math.round((real_width / 100)) * 70;
        }
        canvas.width = my_width;
        canvas.height = my_width;
        cellSize = canvas.width / getSizeGem();
        context = canvas.getContext("2d");
        context.fillRect(0, 0, canvas.width, canvas.height);
        game.changeSize(cellSize);
        game.draw();
    }
}

function createUser() {
    let userName;
    /*userName = prompt("Введите Ваше имя", "");
    if(!userName) {
    }*/
    userName = "Гость";
    localStorage.setItem('userName', userName);
}

function getUser () {
    return localStorage.getItem("userName");
}

function getTime () {
    let time = document.querySelector('.time_value').innerHTML;
    let timeInSec = 0;
    if(time){
        let timeArr = time.split(':');
        let h = timeArr[0];
        let m = timeArr[1];
        let s = timeArr[2];
        timeInSec = +h + 3600 + +m * 60 + s;
    } else {
        timeInSec = 0;
    }
    return ({time, timeInSec});
}

function getSizeGem () {
    return document.querySelector("#li4 > select").value;
}

function changeGemSize () {
    loadGame(getSizeGem());
}

function pauseGame () {
    StartStop("pause");
    createModal(document.querySelector('.main'), "Пауза");
    const modal = document.querySelector('#modal-win');
    modal.style.display = "block";
    const modalText = document.querySelector('.modal-text');
    modalText.innerText = `Возвращайся скорее!`;
}

function saveResult (user, moves, time, sizeGem) {
    this.user = user;
    this.moves = +moves;
    this.time = time.time;
    this.timeInSec = +time.timeInSec;
    this.sizeGem = +sizeGem;
    let k = 3; //коэфф.
    /*scoreResult - баллы за игру, в зависимости от размера поля, количества ходов и времени*/
    let scoreResult = ((k/this.moves +  k/this.timeInSec) * this.sizeGem).toFixed(2);
    let scoreArr = JSON.parse(localStorage.getItem("scoreArr"));
    //console.log(`user = ${this.user}   moves = ${this.moves}, time = ${this.time}, scoreResult = ${scoreResult}`);
    scoreArr.push({'user': this.user, 'score': scoreResult.toString(), 'time': this.time, 'sizeGem': `${this.sizeGem} x ${this.sizeGem}`, 'moves': this.moves});
    localStorage.setItem("scoreArr", JSON.stringify(scoreArr));
}

window.addEventListener("DOMContentLoaded", function () {
    createDocument();
    loadGame(getSizeGem()); 
    createUser();   
});

