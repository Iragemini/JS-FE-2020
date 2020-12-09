import * as cards from './cards';
import {createElement} from './Card';

export class Stat {

    private statistics: any;
    private catArr: any;

    public constructor (statistics: any) {
        this.statistics = statistics;
        this.createStatBody(this.statistics);
    }
    private createStatBody(statistics: any): void {

        const main = document.querySelector('.main');
        const stat = document.querySelector(".stat");
        let mainContainer = document.querySelector('.main-container');
        mainContainer.remove();
        mainContainer = createElement('div', 'main-container');
        mainContainer.id = "main-container";

        const table = mainContainer.appendChild(document.createElement('table'));
        table.classList.add("table__result");
        const thNum = table.appendChild(document.createElement('th'));
        thNum.innerHTML = "N";
        thNum.style.width = '5px';
        const thCategory = table.appendChild(document.createElement('th'));
        thCategory.innerHTML = "Категория";

        let len = statistics.length;

        for(let i = 0; i < len; i++) {
            let j = i + 1;
            let statisticsPart: any = statistics[i][1];
            const tr = table.appendChild(document.createElement('tr'));
            const tdNum = tr.appendChild(document.createElement('td'));
            tdNum.innerHTML = `${j}`;
            const tdCategory = tr.appendChild(document.createElement('td'));
            const tableCategory = tdCategory.appendChild(document.createElement('table'));
            tableCategory.classList.add('category-table');
            const caption = tableCategory.appendChild(document.createElement('caption'));
            caption.innerHTML = statistics[i][0];
            for(let k = 1; k <= 6; k++){
                const th = tableCategory.appendChild(document.createElement('th'));
                if(k === 1) {
                    th.innerHTML = 'Word';
                    th.style.width = '20%';
                } else if(k === 2) {
                    th.innerHTML = 'Translation';
                    th.style.width = '20%';
                } else if(k === 3) {
                    th.innerHTML = 'Train clicks';
                    th.style.width = '10%';
                } else if(k === 4) {
                    th.innerHTML = 'Success answers';
                    th.style.width = '10%';
                } else if(k === 5) {
                    th.innerHTML = 'Wrong answers';
                    th.style.width = '10%';
                } else {
                    th.innerHTML = 'Success answers, %';
                    th.style.width = '10%';
                }
            }
            for(let q = 0; q < statisticsPart.length; q++) {
                const liTr = tableCategory.appendChild(document.createElement('tr'));
                for(let k = 1; k <= 6; k++){
                    const td = liTr.appendChild(document.createElement('td'));
                    if(k === 1) {
                        td.innerHTML = statisticsPart[q].word;
                    } else if(k === 2) {
                        td.innerHTML = statisticsPart[q].translation;
                    } else if(k === 3) {
                        td.innerHTML = statisticsPart[q].train_clicks;
                    } else if(k === 4) {
                        td.innerHTML = statisticsPart[q].success_clicks;
                    } else if(k === 5) {
                        td.innerHTML = statisticsPart[q].wrong_clicks;
                    } else {
                        td.innerHTML = statisticsPart[q].percents;
                    }
                }
            }
        }
        main.append(mainContainer);
    }
}


export function createStatObj (cardsArray: any) {

    let statistics: any = [];
    const categories: any = cardsArray.cards[0];
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const j = i + 1;
        const cardArr: any = cardsArray.cards[j];
        let statisticsPart: any = [];
        for(let k = 0; k < cardArr.length; k++) {
            statisticsPart.push({
                'word': cardArr[k].word,
                'translation': cardArr[k].translation,
                'train_clicks': 0,
                'success_clicks': 0,
                'wrong_clicks': 0,
                'percents': 0
            })
        }
        statistics.push([[category], statisticsPart])
    }
    if(!localStorage.getItem("statistics")){
        localStorage.setItem("statistics", JSON.stringify([]));
    }
    localStorage.setItem("statistics", JSON.stringify(statistics));
}

export function updateStatistics (category:string, mode: string, word: string, success: boolean) {

    const statistics = JSON.parse(localStorage.getItem("statistics"));

    for(let i = 0; i < statistics.length; i++) {
        const categoryStat = statistics[i][0];
        const statisticsPart = statistics[i][1];
        if(categoryStat == category) {
            for(let j = 0; j < statisticsPart.length; j++) {
                if(statisticsPart[j].translation == word) {
                    if(mode == 'train') {
                        statisticsPart[j].train_clicks = statisticsPart[j].train_clicks + 1;
                    } else {
                        if(success == true) {
                            statisticsPart[j].success_clicks = statisticsPart[j].success_clicks + 1;
                        } else {
                            statisticsPart[j].wrong_clicks = statisticsPart[j].wrong_clicks + 1;
                        }
                        const percents = (100 / (statisticsPart[j].success_clicks + statisticsPart[j].wrong_clicks)) * statisticsPart[j].success_clicks;
                        statisticsPart[j].percents = percents.toFixed();
                    }
                }
            }
        }
        if(mode == 'clear') {
            for(let j = 0; j < statisticsPart.length; j++) {
                statisticsPart[j].train_clicks = 0;
                statisticsPart[j].success_clicks = 0;
                statisticsPart[j].wrong_clicks = 0;
                statisticsPart[j].percents = 0;
            }
        }
    }
    localStorage.setItem("statistics", JSON.stringify(statistics));
}
