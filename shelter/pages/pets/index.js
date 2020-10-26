const mainPage = document.querySelector('#mainPage'),
    logo = document.querySelector('.logo'),
    petsPage = document.querySelector('#petsPage');

function changePage(){
	document.location.href = '../main/index.html';
}

petsPage.onclick = function(e){
    document.location.href = '../pets/index.html';
}

mainPage.addEventListener('click', changePage);
logo.addEventListener('click', changePage);
