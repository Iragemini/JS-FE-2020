const petsPage = document.querySelector('#petsPage'),
    makeFriend = document.querySelector('#makeFriend'),
    getToKnow = document.querySelector('#getToKnow'),
    mainPage = document.querySelector('#mainPage');

function changePage(){
	document.location.href = '../pets/index.html';
}

mainPage.onclick = function(e){
    document.location.href = '../main/index.html';
}

petsPage.addEventListener('click', changePage);
makeFriend.addEventListener('click', changePage);
getToKnow.addEventListener('click', changePage);
