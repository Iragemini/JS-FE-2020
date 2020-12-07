import * as cards from './cards';

export class Card {

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
      //console.log(`cards ${cards} type = ${typeof cards}, cardType = ${cardType}`);
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
      const pEn = createElement('p', 'text-shadow');
      pEn.innerText = descriptionEn;
      /*if(cardType !== 'main') {
        divFront.append(p);
      }*/
        
      if(cardType !== "main") {
        const divBack = createElement('div','back');
        divBack.style.backgroundImage = `url(${imageUrl})`;
        const p = createElement('p', 'text-shadow,text-shadow_back');
        p.innerText = descriptionRu;
        const rotateDiv = createElement('div', 'rotate');
        const rotateImg: any = createElement('img', 'rotate-img');
        rotateImg.src = '../../src/assets/img/flip.png';
        rotateDiv.append(pEn, rotateImg);
        divBack.append(p);
        divFront.append(rotateDiv);
        card.append(divFront, divBack);
        mainContainer.append(card);
      } else{
        card.append(divFront, pEn);
        mainContainer.append(card);
      }
    }
  } 

  export function createElement (elementName: string, className: string) {
    const element = document.createElement(elementName);
    if (className !== "") {
      let classNameArr = className.split(",");
      for (let i: number = 0; i < classNameArr.length; i++) {
        element.classList.add(classNameArr[i]);
      }
    }
    return element;
  }

  