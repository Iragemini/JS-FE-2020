function createModal (parent, headerText) {

    console.log(`headerText = ${headerText} type = ${typeof headerText} parent = ${parent}`);

    const modal = parent.appendChild(document.createElement("div"));
    modal.id = 'modal-win';
    modal.classList.add('modal');

    const content = modal.appendChild(document.createElement('div'));
    content.classList.add('modal-content');

    const header = content.appendChild(document.createElement('div'));
    header.classList.add('modal-header');
    if(typeof headerText === 'object') {
        header.innerHTML = "Результаты";
    } else {
        header.innerHTML = headerText;
    }
        
    const span = header.appendChild(document.createElement('span'));
    span.classList.add('close');
    span.innerHTML = "X";

    const modalBody = content.appendChild(document.createElement('div'));
    modalBody.classList.add('modal-body');
    if(typeof headerText === 'object') {
        if(headerText.length === 0) {
            const modalText = modalBody.appendChild(document.createElement('p'));
            modalText.classList.add('modal-text');
            modalText.innerText = "Здесь пока пусто...";
        }else{
            const table = modalBody.appendChild(document.createElement('table'));
            table.classList.add("table__result");
            const thSize = table.appendChild(document.createElement('th'));
            thSize.innerHTML = "Поле";
            const thName = table.appendChild(document.createElement('th'));
            thName.innerHTML = "Игрок";
            const thScore = table.appendChild(document.createElement('th'));
            thScore.innerHTML = "Счёт";
            const thTime = table.appendChild(document.createElement('th'));
            thTime.innerHTML = "Время";
    
            let len = headerText.length;
            console.log(`len = ${len}`);
            if(len > 10) {
                len = 11;
            }
            for(let i = 0; i < len; i++) {
                const tr = table.appendChild(document.createElement('tr'));
                const tdSize = tr.appendChild(document.createElement('td'));
                tdSize.innerHTML = headerText[i].sizeGem;
                const tdName = tr.appendChild(document.createElement('td'));
                tdName.innerHTML = headerText[i].user;
                const tdScore = tr.appendChild(document.createElement('td'));
                tdScore.innerHTML = headerText[i].score;
                const tdTime = tr.appendChild(document.createElement('td'));
                tdTime.innerHTML = headerText[i].time;
            }
        }

    } else {
        const modalText = modalBody.appendChild(document.createElement('p'));
        modalText.classList.add('modal-text');
    }
   
    span.onclick = function() {
        modal.style.display = "none";
        modal.remove();
        //c.classList.add('c__visible');
        if (headerText === 'Пауза') {
            init = 1;
            StartStop("pause");
        }
    };    
}
