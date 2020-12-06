import { cards } from "./cards";
import {audioPlay, changeCardsList} from "../index";

export let playArray: any = [];
let itemStr: string = "";
let counter: number = 0;

export class Game {
    private page: string;
    private cardsArr: any;
    private pageIndex: any;
    private randArr: any;

    public constructor (page: string, cardsArr: any, pageIndex: string) {
        this.page = page;
        this.cardsArr = cardsArr;
        this.pageIndex = pageIndex;
        setPlayedItem("");
        this.clear();
        this.randArr = this.createRandomPoll(this.page, this.cardsArr, this.pageIndex);
        for(let i = 0; i < this.randArr.length; i++) {
            console.log(`i = ${i}`);
            let src = this.randArr[i].audioSrc;
            let card = {'index': i, 'audioSrc': src};
            playArray.push(card);
        }
        this.playSound();
    }

    private createRandomPoll (page: string, cardsArr: any, pageIndex: string){
        //console.log(`page = ${page}, pageIndex = ${pageIndex}`);
        let randArr: any = shuffle(cardsArr.cards[pageIndex]);
        function shuffle(array: any) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        return randArr;
    }

    public playSound () {
        let item = Math.floor(Math.random() * playArray.length);
        const playedItem = localStorage.getItem('playedItem' || '');

        //console.log(`item = ,${item},  itemStr = ,${itemStr},  counter = ${counter}  playArray.length = ${playArray.length}`);
        if(counter + 1 > playArray.length) {
            this.gameOver();
            return false;
        }
        if(`,${itemStr},`.indexOf(`,${item},`) >= 0) {
            this.playSound();
            return false;
        }
        counter ++;
        const audioSrc = playArray[item].audioSrc;
        console.log(`item = ${item} src = ${audioSrc} len = ${playArray.length}`);
        if(playArray.length === 0) {
            setTimeout(this.gameOver, 2000);
        }
        let audio = document.querySelector('audio');
        audio.src = audioSrc;
        if (!audio) return;  
        if (audio.play) {
            audio.pause;
        }
        audio.addEventListener('canplay', function () {
            audio.play();
        }, true);
        if(playedItem !== "") {
            itemStr = `${playedItem},${item.toString()}`;
        } else {
            itemStr = `${item.toString()}`;
        }
        setPlayedItem(itemStr);
    }

    private gameOver() {
        if(!localStorage.getItem("wrong") || localStorage.getItem("wrong") == ""){
            audioPlay('../src/assets/audio/success.mp3');
            modalWin('win');
        } else {
            audioPlay('../src/assets/audio/failure.mp3');
            localStorage.setItem("wrong", "");
            modalWin('fail');
        }

        function modalWin (value: string) {
            const modal = document.body.appendChild(document.createElement("div"));
            modal.classList.add('modal');
            const img = modal.appendChild(document.createElement('div'));
            img.classList.add('modal-img');
            if(value === 'fail') {
                img.style.backgroundImage = 'url(../src/assets/img/try_again_2.png)';
            } else {
                img.style.backgroundImage = 'url(../src/assets/img/winner.png)';
            }
            setTimeout(() => {
                document.body.removeChild(modal);
                changeCardsList("", "main");
            }, 3000);
        }
        localStorage.setItem('start', 'false');
    }

    private clear () {
        playArray = [];
        itemStr = "";
        counter = 0;
    }
}

export function setPlayedItem (item: string) {
    localStorage.setItem('playedItem', item);
}

