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

       // let cardsArr: [] = cardsArray.cards[0];

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
        //console.log(`len = ${len}`);

        for(let i = 0; i < len; i++) {
            let j = i + 1;
            let statisticsPart: any = statistics[i][1];
            //console.log(`statisticsPart = ${statisticsPart}`);
            const tr = table.appendChild(document.createElement('tr'));
            const tdNum = tr.appendChild(document.createElement('td'));
            tdNum.innerHTML = `${j}`;
            const tdCategory = tr.appendChild(document.createElement('td'));
            const ulCategory = tdCategory.appendChild(document.createElement('ul'));
            ulCategory.classList.add('ul');
            ulCategory.innerHTML = statistics[i][0];
            for(let k = 0; k < statisticsPart.length; k++) {
                const liCategory = ulCategory.appendChild(document.createElement('li'));
                liCategory.classList.add('li');
                liCategory.innerHTML = `${statisticsPart[k].word} (${statisticsPart[k].translation})`;
            }
        }

        const main = document.querySelector('.main');
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

export function updateStatistics (mode: string, word: string, correct: boolean) {

}

