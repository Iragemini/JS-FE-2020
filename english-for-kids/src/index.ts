import * as _ from 'lodash';
import * as cards from './ts/cards';
import {Game, playArray, setPlayedItem} from './ts/Game';
import {Card} from './ts/Card';
import {createElement} from './ts/Card';
import {Stat, createStatObj, updateStatistics} from './ts/Stat';

let cardsArray: any = cards;

let game: any;

var menu = document.getElementById("menu");
const clearStat: any = document.querySelector('.clear-stat');

function drawCard (init: string, mode: string) {
  setPage(init);
  showGameBtn();
  let description: string = "";
  let cardsArr: [] = cardsArray.cards[0];
  let imageSrc: string = "";
  let audioSrc: string = "";
  const mainContainer = createElement('div', 'main-container');
  mainContainer.id = "main-container";
  if(init == "main") {
    mainContainer.onclick = function(event: any) {
      //alert(`event.target.tagName = ${event.target.tagName}`);
      let p: any = "";
      if(event.target.tagName !== 'P') {
        p = event.target.querySelector('p');
      } else {
        p = event.target;
      }
      let text = p.innerHTML;
      //console.log(`p = ${p}, text = ${text}`);
      changeCardsList(event, text);
      changeMenuItemStyle(text);
    }
  }
  const main = document.querySelector('.main');
  main.append(mainContainer);
 
  if(init == "main") {
    setPageIndex(0);
    for (let i: number = 0; i < cardsArr.length; i++) {
      let j: number = i + 1;
      imageSrc = cardsArray.cards[j][0].image;
      description = cardsArr[i];
      //console.log(`imageArr = ${imageArr}`);
      const card = new Card(imageSrc, "", description, `${mode}`, init);
    }
  } else {
    let index: number = cardsArr.findIndex((item) => item == init);
    //console.log(`index = ${index}`);
    index += 1;
    setPageIndex(index);
    let categoryArr = cardsArray.cards[index];
    //console.log(`categoryArr = ${categoryArr[0].word}`);
    for (let i: number = 0; i < categoryArr.length; i++) {
      imageSrc = categoryArr[i].image;
      audioSrc = categoryArr[i].audioSrc;
      description = `${categoryArr[i].word},${categoryArr[i].translation}`; 
      //console.log(`imageSrc = ${imageSrc}, description = ${description}`);
      new Card(imageSrc, audioSrc, description, `${mode}`, init);
    }
  }
  playMode();
}
class Switcher {
  private switcher: string;

  public constructor (switcher: string) {
    this.switcher = switcher;
  }
  public getSwitcher() {
    return this.switcher;
  }
  public setSwitcher(value: string) {
    this.switcher = value;
  }
}

function setMode (mode: string) {
  localStorage.setItem('mode', mode);
}

function getMode () {
  return localStorage.getItem('mode');
}

function setPage (page: string) {
  localStorage.setItem('page', page);
  /*const activePage = document.querySelector('.active__page');
  activePage.innerHTML = page;*/
}

function getPage () {
  return localStorage.getItem('page');
}

function setPageIndex (pageIndex: number) {
  localStorage.setItem('pageIndex', pageIndex.toString());
}

function getPageIndex () {
  return localStorage.getItem('pageIndex');
}

function showGameBtn () {
  const startBtn = document.querySelector('.start__game');
  if(getPage() !== 'main' && getPage() !== 'stat') {
    if(getMode() === "play") {
      startBtn.classList.add("start__game-vis")
      changeStyleStartButton("start");
    } else {
      startBtn.classList.remove("start__game-vis");
    }
  } else {
    startBtn.classList.remove("start__game-vis");
  }
}

function playMode () {
  const cardsSet = document.querySelectorAll('.flip');

  cardsSet.forEach(function(item: any) {
    const rotateDiv = item.querySelector('.rotate');
    const textDiv = item.querySelector('.text-shadow');

    if(getMode() == 'play') {
      item.classList.add('card_play');
      item.classList.remove('card_train');
      rotateDiv.classList.add('no__display');
      textDiv.classList.add('no__display');
      //console.log(`getStartGame() = ${getStartGame()}`);
      item.addEventListener( 'click', function(event: any) {
        const div = event.target.innerText;
        let index: number = cardsArray.cards[getPageIndex()].findIndex((e: any) => e.translation === div);
        //console.log(`play inner = ${div}, index = ${index}, pageIndex = ${getPageIndex()}`);
        item.dataset['index'] = index.toString();
        const isTrue: string = compare(index);
        //console.log(`isTrue = ${isTrue} event.currentTarget.classList = ${event.currentTarget.classList}`);
        if(isTrue == "1") {
          <HTMLElement>event.currentTarget.classList.add("flip-disable");
          updateStatistics(getPage().trim(), 'play', div, true);
        } else if (isTrue == "0") {
          updateStatistics(getPage().trim(), 'play', div, false);
        }
      });
    } 
    if (getMode() == 'train') {
      item.classList.add('card_train');
      item.classList.remove('card_play', 'flip-disable');
      rotateDiv.classList.remove('no__display');
      textDiv.classList.remove('no__display');
      item.addEventListener( 'click', function(event: any) {
        //console.log(`event.currentTarget  = ${event.target.classList }`);
        if(event.target.tagName == 'P') return;
        const div = event.target.innerText;
        const rotateDiv = <HTMLElement>event.target;
        const classList = rotateDiv.classList;
        let index: number = cardsArray.cards[getPageIndex()].findIndex((e: any) => e.translation === div);
        //console.log(`inner = ${div}, index = ${index}, pageIndex = ${getPageIndex()}`);
        let audioSrc = cardsArray.cards[getPageIndex()][index].audioSrc;
        //console.log(`train audioSrc = ${audioSrc}`);
        if(getMode() == 'train') {
          audioPlay(audioSrc);
          if(getPage() !== 'main') {
            updateStatistics(getPage().trim(), 'train', div.trim(), false);
          }
        }
      });
          
      let rotate = document.querySelectorAll('.text-shadow');
      if(rotate) {
        rotate.forEach(function(item: any) {
          //console.log(`forEach item = ${item.classList}`);
          item.addEventListener('click', function(event: any) {
            event.target.closest('DIV').style.transform = 'rotateY(0deg)';
            event.target.closest('DIV').style.opacity = 1;
            event.target.closest('DIV').style.transition = '1.5s'
          });
          item.addEventListener('mouseout', function(event: any) {
            event.target.closest('DIV').style.transform = 'rotateY(-180deg)';
            event.target.closest('DIV').style.opacity = 0;
            event.target.closest('DIV').style.transition = '1.5s'
          })
        });    
      }
  
    }
  })

  const menu = document.querySelector('#menu');
  const divPlay = document.querySelectorAll('.play');
  const divTrain = document.querySelectorAll('.train');
  if (getMode() == 'play') {
    menu.classList.remove('hidden-menu_train');
    menu.classList.add('hidden-menu_play');
    divPlay.forEach(function(item: any) {
      item.classList.remove('no__display');
    });
    divTrain.forEach(function(item: any) {
      item.classList.add('no__display');
    });
  } else {
    menu.classList.remove('hidden-menu_play');
    menu.classList.add('hidden-menu_train');
    divPlay.forEach(function(item: any) {
      item.classList.add('no__display');
    });
    divTrain.forEach(function(item: any) {
      item.classList.remove('no__display');
    });
  }
}

function compare (index: number) {
  if(getStartGame() == 'false') {
    return "";
  }
  let playedItemStr = localStorage.getItem('playedItem').trim();
  let playedItem = playedItemStr.split(',')[playedItemStr.split(',').length - 1];
  let clickItem = index.toString().trim();
  //console.log(`playedItemStr = ${playedItemStr}  playedItem = ${playedItem}  clickItem= ${clickItem} `);
  const answerScale = document.querySelector('.answers__scale');
  answerScale.classList.remove('no__display');
  if(playedItem == clickItem) {
    correct('../src/assets/audio/correct-answer.mp3');
    answerScale.appendChild(createElement('div', 'correct_answer'));
    return "1";
  } else {
    audioPlay('../src/assets/audio/error.mp3');
    answerScale.appendChild(createElement('div', 'wrong_answer'));
    localStorage.setItem("wrong", (Number.parseInt(localStorage.getItem("wrong" || "0")) + 1).toString());
    return "0";
  }
}

export function audioPlay (audioSrc: string) {
  const audio = new Audio(audioSrc);
  audio.play();
}

async function correct(src: string) {
  await audioPlay(src);
  if(getStartGame() === 'true') {
    game.playSound();
  }
}

function getStartGame() {
  return localStorage.getItem('start');
}

function setStartGame (start: string) {
  localStorage.setItem('start', start || 'false');
}
const startGame = <HTMLDivElement>document.querySelector('.start-btn');

function changeStyleStartButton (mode: string) {
  //console.log(`mode = ${mode}`);
  const startImgBtn = document.querySelector(".image-btn");
  const startRepeat = document.querySelector(".start-repeat");
  if(mode == 'repeat') {
    startGame.classList.add("start-btn_repeat");
    startImgBtn.classList.add("no__display");
    startRepeat.innerHTML = '';
  } else {
    startGame.classList.remove("start-btn_repeat");
    startImgBtn.classList.remove("no__display");
    startRepeat.innerHTML = 'Start game';
  }
}

startGame.onclick = function(e) {
  if(getStartGame() == 'false') {
    setStartGame('true');
    clearAnswerScale();
    game = new Game(getPage(), cards, getPageIndex());
    changeStyleStartButton('repeat');
  } else {
    let playedItemStr = localStorage.getItem('playedItem').trim();
    let playedItem: any = playedItemStr.split(',')[playedItemStr.split(',').length - 1];
    const audioSrc: any = playArray[Number.parseInt(playedItem)].audioSrc;
    audioPlay(audioSrc);
  }
}

/* ONLOAD */
document.addEventListener("DOMContentLoaded", function() {
 
  let modeSwitcher = new Switcher('unchecked');
  setPage('main');
  setMode('train');
  setStartGame('false');
  setPageIndex(0);
  localStorage.setItem("wrong", "0");
  /*
  switcher.unchecked => train mode
  switcher.checked => play mode
  */
  const switcher = document.querySelector('.checkbox__switcher');
  //console.log(switcher);
  switcher.addEventListener('change', function () {
    if ( this.checked ) {
        //console.log('checked');
        modeSwitcher.setSwitcher('checked');
        setMode('play');
      } else {
      //console.log('unchecked');
      modeSwitcher.setSwitcher('unchecked');
      setMode('train');
      setStartGame('false');
    }
    clearAnswerScale();
    showGameBtn();
    playMode();
    setPlayedItem("");
    rotateBack();
  });

  //console.log(`getSwitcher = ${modeSwitcher.getSwitcher()}`);
  const stat: any = document.querySelector(".open-stat");
  stat.addEventListener('click', function () {
    new Stat(JSON.parse(localStorage.getItem('statistics')));
    clearStat.classList.remove('no__display');
    setPage('stat');
    showGameBtn();
  });

  clearStat.onclick = function() {
    updateStatistics('all', 'clear', '', false);
    new Stat(JSON.parse(localStorage.getItem('statistics')));
  }

  drawCard(getPage(), getMode());
  if(!localStorage.getItem('statistics') || localStorage.getItem('statistics') == '') {
    createStatObj(cardsArray);  
  }  
  
});

menu.onclick = function(event: any) { 
  if(event.target.tagName !== 'A') return;
  const checkboxMenu = <HTMLInputElement>document.querySelector('.hidden-menu-ticker');
  //console.log(`checkboxMenu = ${checkboxMenu}`);
  const activeMenu = document.querySelector('.menu-current');
  //console.log(`activeMenu = ${activeMenu} class = ${activeMenu.className}`)
  activeMenu.classList.remove('menu-current');
  const li = event.target;
  li.classList.add('menu-current');
  const menuItem = li.innerHTML;
  //console.log(li.innerHTML);
  changeCardsList(event, menuItem);
  checkboxMenu.checked = false;
  setStartGame('false');
  clearStat.classList.add('no__display');
  rotateBack();
}

function changeMenuItemStyle(elem: string) {
  //console.log(`elem = ${elem}`);
  const menuItem = document.querySelectorAll('.menu-item');
  menuItem.forEach(function(item) {
    item.classList.remove('menu-current');
    if(item.innerHTML === elem) {
      //console.log(`item = ${item.innerHTML}`);
      item.classList.add('menu-current');
    }
  })
}

export function changeCardsList (event: any, menuItem: string) {

  clearAnswerScale();
  setPlayedItem("");

  if(menuItem.toUpperCase().startsWith("MAIN")) {
    menuItem = "main";
  }  

  let mainContainer = document.querySelector(".main-container");
  mainContainer.remove();
  drawCard(menuItem, getMode());
}

function clearAnswerScale () {
  const answerScale = document.querySelector('.answers__scale');
  answerScale.innerHTML = "";
  answerScale.classList.add('no__display');
}

function rotateBack () {
  let back = document.querySelectorAll('.back');
  back.forEach(function(item: any) {
    item.style.transform = 'rotateY(-180deg)';
    item.style.opacity = 0;
  })
}

document.addEventListener('click', function(event: any) {
  //console.log(`target = ${event.target}`);
  const checkboxMenu = <HTMLInputElement>document.querySelector('.hidden-menu-ticker');
  const targetElem = event.target;
  //console.log(`targetElem.classList = ${targetElem.classList.toString()} type = ${typeof targetElem.classList}  checkboxMenu.checked = ${checkboxMenu.checked}`);
  const classArr = targetElem.classList.toString().split(' ');
  for (let i = 0; i < classArr.length; i++) {
    //console.log(`classArr[i] = ${classArr[i]}`);
    if (classArr[i] == 'menu' || classArr[i] == 'visually__hidden' ||  classArr[i] == 'li-item' ||
        (checkboxMenu.checked == true && classArr[i].startsWith('bar'))) {
      return;
    }
  }
  if(checkboxMenu.checked) {
    checkboxMenu.checked = false;
  }
  //if(event.target != )
})