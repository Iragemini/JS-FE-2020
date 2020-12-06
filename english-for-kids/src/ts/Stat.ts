import * as cards from './cards';
import {createElement} from './Card';

export class Stat {

    private cardsArray: any;
    private catArr: any;

    public constructor (cardsArray: any) {
        this.cardsArray = cardsArray;
        this.createStatBody(this.cardsArray);
    }
    private createStatBody(cardsArray: any): void {

        let cardsArr: [] = cardsArray.cards[0];

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

        let len = cardsArr.length;
        console.log(`len = ${len}`);

        for(let i = 0; i < len; i++) {
            let j = i + 1;
            const cardArr: any = cardsArray.cards[j];
            const tr = table.appendChild(document.createElement('tr'));
            const tdNum = tr.appendChild(document.createElement('td'));
            tdNum.innerHTML = `${j}`;
            const tdCategory = tr.appendChild(document.createElement('td'));
            const ulCategory = tdCategory.appendChild(document.createElement('ul'));
            ulCategory.classList.add('ul');
            ulCategory.innerHTML = cardsArr[i];
            for(let k = 0; k < cardArr.length; k++) {
                const liCategory = ulCategory.appendChild(document.createElement('li'));
                liCategory.classList.add('li');
                liCategory.innerHTML = `${cardArr[k].word} (${cardArr[k].translation})`;
            }
        }

        const main = document.querySelector('.main');
        main.append(mainContainer);
    }
}

