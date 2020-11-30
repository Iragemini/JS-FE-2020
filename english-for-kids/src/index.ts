import * as _ from 'lodash';
import * as cards from './ts/cards';
import {Game} from './ts/Game';

let cardsArray: any = cards;

let game: any;

var menu = document.getElementById("menu");

interface applicationMode {
  mode: String;
}
class Card {

  private imageUrl: string;
  private audioUrl: string;
  private description: string;
  private cardType: string;
  private mode: string;

  public constructor (imageUrl : string, audioUrl: string, description: string, mode: string, cardType: string) {
    this.imageUrl = imageUrl;
    this.description = description;
    this.cardType = cardType;
    this.mode = mode;
    this.audioUrl = audioUrl;
    let carParameters: {} = {
      imageUrl,
      audioUrl,
      description,
      mode,
      cardType,
    };
    this.createCardBody(carParameters);
    console.log(`cards ${cards} type = ${typeof cards}, cardType = ${cardType}`);
  }

  private createCardBody(carParameters: Object): void {
    let {imageUrl, audioUrl, description, mode, cardType}: any = carParameters;

    const descriptionEn: string = description.split(',')[0];
    const descriptionRu: string = description.split(',')[1];
    const mainContainer = document.querySelector('.main-container');
    const main = document.querySelector('.main');

    let classList: string = `flip,card_${mode},flip-vertical`;
    if(cardType == "main") {
      classList = `card,card_${mode}`;
    }
    const card = createElement('div', `${classList}`);
    const divFront = createElement('div', 'front');
    divFront.style.backgroundImage = `url(${imageUrl})`;
    const h1 = createElement('h1', 'text-shadow');
    h1.innerText = descriptionEn;
    divFront.append(h1);

    if(cardType !== "main") {
      const divBack = createElement('div','back');
      divBack.style.backgroundImage = `url(${imageUrl})`;
      const h1 = createElement('h1', 'text-shadow');
      h1.innerText = descriptionRu;
      const rotateDiv = createElement('div', 'rotate');
      divBack.append(h1);
      divFront.append(rotateDiv);
      card.append(divFront, divBack);
      mainContainer.append(card);
    } else{
      card.append(divFront);
      mainContainer.append(card);
    }
  }
} 

function createElement (elementName: string, className: string) {
  const element = document.createElement(elementName);
  if (className !== "") {
    let classNameArr = className.split(",");
    for (let i: number = 0; i < classNameArr.length; i++) {
      element.classList.add(classNameArr[i]);
    }
  }
  return element;
}

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
      if(event.target.tagName !== 'DIV') return;
      let h1 = event.target.querySelector('h1');
      let text = h1.innerHTML;
      console.log(`h1 = ${h1}, text = ${text}`);
      changeCardsList(event, text);
    }
  }
  const main = document.querySelector('.main');
  main.append(mainContainer);

  console.log(`cardsArr = ${cardsArr}, init = ${init}`);
  
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
    console.log(`index = ${index}`);
    index += 1;
    setPageIndex(index);
    let categoryArr = cardsArray.cards[index];
    console.log(`categoryArr = ${categoryArr[0].word}`);
    for (let i: number = 0; i < categoryArr.length; i++) {
      imageSrc = categoryArr[i].image;
      audioSrc = categoryArr[i].audioSrc;
      description = `${categoryArr[i].word},${categoryArr[i].translation}`; 
      //console.log(`imageSrc = ${imageSrc}, description = ${description}`);
      const category = new Card(imageSrc, audioSrc, description, `${mode}`, init);
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
  return localStorage.getItem('mode' || 'train');
}

function setPage (page: string) {
  localStorage.setItem('page', page);
}

function getPage () {
  return localStorage.getItem('page' || 'main');
}

function setPageIndex (pageIndex: number) {
  localStorage.setItem('pageIndex', pageIndex.toString());
}

function getPageIndex () {
  return localStorage.getItem('pageIndex' || '0');
}

function showGameBtn () {
  const startBtn = document.querySelector('.start__game');
  if(getPage() !== 'main') {
    if(getMode() === "play") {
      startBtn.classList.add("start__game-vis");
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

    console.log(`rotateDiv = ${rotateDiv.classList}`);
    if(getMode() === 'play') {
      item.classList.add('card_play');
      item.classList.remove('card_train');
      rotateDiv.classList.add('no__display');
      textDiv.classList.add('no__display');
      if(getStartGame) {
        item.addEventListener( 'click', function(event: any) {
          const div = event.target.innerText;
          let index: number = cardsArray.cards[getPageIndex()].findIndex((e: any) => e.translation === div);
          console.log(`inner = ${div}, index = ${index}, pageIndex = ${getPageIndex()}`);
          item.dataset['index'] = index.toString();
          compare(index);
        });
      }
    } else {
      item.classList.add('card_train');
      item.classList.remove('card_play');
      rotateDiv.classList.remove('no__display');
      textDiv.classList.remove('no__display');
      item.addEventListener( 'click', function(event: any) {
        const div = event.target.innerText;
        const rotateDiv = <HTMLElement>event.currentTarget;
        const classList = rotateDiv.classList;
        console.log(`classList = ${classList}`);
        if(rotateDiv.className == 'rotate') {
          console.log(`rotateDiv = ${rotateDiv}`);
        }
        let index: number = cardsArray.cards[getPageIndex()].findIndex((e: any) => e.translation === div);
        console.log(`inner = ${div}, index = ${index}, pageIndex = ${getPageIndex()}`);
        let audioSrc = cardsArray.cards[getPageIndex()][index].audioSrc;
        console.log(`audioSrc = ${audioSrc}`);
        audioPlay(audioSrc);
      });
    }
  })
}

function compare (index: number) {
  let playedItem = localStorage.getItem('playedItem').trim();
  let clickItem = index.toString().trim();
  const answerScale = document.querySelector('.answers__scale');
  answerScale.classList.remove('no__display');
  if(playedItem == clickItem) {
    answerScale.appendChild(createElement('div', 'correct_answer'));
  } else {
    answerScale.appendChild(createElement('div', 'wrong_answer'));
  }
  game.playSound();
}

function audioPlay (audioSrc: string) {
  let audio = document.querySelector('audio');
  audio.src = audioSrc;
  if (!audio) return;  
  audio.addEventListener('canplay', function () {
      audio.play();
  }) 
}

function getStartGame() {
  return localStorage.getItem('start');
}

function setStartGame (start: any) {
  localStorage.setItem('start', start || false);
}

const startGame = <HTMLDivElement>document.querySelector('.start-btn');
startGame.onclick = function(e) {
  setStartGame(true);
  game = new Game(getPage(), cards, getPageIndex());
}

document.addEventListener("DOMContentLoaded", function() {
 
  let modeSwitcher = new Switcher('unchecked');
  setPage('main');
  setMode('train');
  setStartGame(false);
  setPageIndex(0);
 
  const switcher = document.querySelector('.checkbox__switcher');
  console.log(switcher);
  switcher.addEventListener('change', function () {
    if ( this.checked ) {
        console.log('checked');
        modeSwitcher.setSwitcher('checked');
        setMode('play');
      } else {
      console.log('unchecked');
      modeSwitcher.setSwitcher('unchecked');
      setMode('train');
      setStartGame(false);
    }
    showGameBtn();
    playMode();
  });

  console.log(`getSwitcher = ${modeSwitcher.getSwitcher()}`);

  /*
  switcher.unchecked => train mode
  switcher.checked => play mode
  */

  drawCard(getPage(), getMode());  
 
});

menu.onclick = function(event: any) { 
  if(event.target.tagName !== 'A') return;
  const checkboxMenu = <HTMLInputElement>document.querySelector('.hidden-menu-ticker');
  //console.log(`checkboxMenu = ${checkboxMenu}`);
  const li = event.target;
  const menuItem = li.innerHTML;
  //console.log(li.innerHTML);
  changeCardsList(event, menuItem);
  checkboxMenu.checked = false;
}

function changeCardsList (event: any, menuItem: string) {

  if(menuItem.toUpperCase().startsWith("MAIN")) {
    menuItem = "main";
  }  

  let mainContainer = document.querySelector(".main-container");
  mainContainer.remove();
  drawCard(menuItem, getMode());
    
  let containerItem = document.querySelectorAll('.flip');
  let rotate = document.querySelectorAll('.rotate');
  
  console.log(`rotate = ${rotate}`);

  if(rotate) {
    rotate.forEach(function(a) {
      console.log(`forEach a = ${a.classList}`);
      a.addEventListener('click', flipCard);
    });    
  }
  function flipCard(a: any) {
    console.log(`a = ${a}`);
    const div: any = containerItem[+<HTMLElement>a.target];
    div.style.transform = 'rotateY(180deg)';
  }
}



