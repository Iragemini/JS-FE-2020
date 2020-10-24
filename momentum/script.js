// DOM Elements
const time = document.querySelector('.time'),
  dmy = document.querySelector('.dmy'),
  greeting = document.querySelector('.greeting'),
  name = document.querySelector('.name'),
  focus = document.querySelector('.focus'),
  city = document.querySelector('.city'),
  humidity = document.querySelector('.humidity'),
  quotationText = document.querySelector('#quotation_text'),
  author = document.querySelector('#author'),
  quotationButton = document.querySelector('.quotation_btn'),
  error = document.querySelector('.error'),
  weather = document.querySelector('.weather');

  // Weather
  const weatherIcon = document.querySelector('.weather-icon');
  const temperature = document.querySelector('.temperature');
  const weatherDescription = document.querySelector('.weather-description');
  const wind = document.querySelector('.wind');

  //for change image
  const pathFolder = "";
  const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg',
                  '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg',
                  '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg',
                  '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
  const btn = document.querySelector('.btn');


// Show Time
function showTime() {
  //let today = new Date('October 20, 2020 6:24:00'),
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds(),
    day = today.getDay();
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric"
  }
  let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']; 
  // Day Month Year
  let todayDMY = today.toLocaleDateString('ru-RU', options)
  // Output Date
  dmy.innerHTML = `${days[day]}<span>, </span>${todayDMY}`;
  // Output Time
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
  setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}
//утро 6:00-12:00, день 12:00-18:00, вечер 18:00-24:00, ночь 24:00-6:00.

// Set Background and Greeting
function setBgGreet() {
  //let today = new Date('October 20, 2020 8:59:59'),
  let today = new Date(),
    hour = today.getHours();
  console.log(`hour = ${hour}`);
  
  if (hour >= 6 && hour < 12) {
    // Morning
    greeting.textContent = 'Доброе утро, ';
    window.pathFolder = "morning";
  } else if (hour >= 12 && hour < 18) {
    // Afternoon
    greeting.textContent = 'Добрый день, ';
    window.pathFolder = "day";
  } else if(hour >= 18 && hour < 24) {
    // Evening
    greeting.textContent = 'Добрый вечер, ';
    document.body.style.color = 'white';
    document.querySelector('.overlay').style.background = 'rgba(0, 0, 0, 0.2)'
    window.pathFolder = "evening";
  } else{
    // Night
    greeting.textContent = 'Доброй ночи, ';
    document.body.style.color = 'white';
    window.pathFolder = "night";
  }
}
//----------------------Content block------------------------
// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Введите имя]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('name', e.target.innerText);
      name.blur();
    }
  } else {
    localStorage.setItem('name', e.target.innerText);
  }
}

name.onclick = function(e){
  e.target.innerText = '';
}

name.onblur = function(e){
  let elem = e.target;
  if(elem.textContent === null || elem.textContent === ""){
    elem.textContent = '[Введите имя]';
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Введите цель]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

// Set Focus
function setFocus(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('focus', e.target.innerText);
      focus.blur();
    }
  } else {
    localStorage.setItem('focus', e.target.innerText);
  }
}

focus.onclick = function(e){
  e.target.innerText = '';
}

focus.onblur = function(e){
  let elem = e.target;
  if(elem.textContent === null || elem.textContent === ""){
    elem.textContent = '[Введите цель]';
  }
}

//----------------------Info block------------------------

//WEATHER
async function getWeather(city){

  if(city === undefined || city === null || city === ""){
    city = localStorage.getItem('city');
  }
  if(city === undefined || city === null || city === ""){
    city = localStorage.getItem('city');
    weather.className = 'weather';
    weather.classList.add(`error`);
  }else{
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=17227db8a8fac1ac6f661ea99d8541a9&units=metric&lang=ru`;
    console.log(`url = ${url}`);
    try{
      const response = await fetch(url);
      const data = await response.json();
    
      console.log(`data = ${data.cod}`);
      if(data.cod && data.cod === '404'){
        console.log(`error = ${data.message}`);
        setErrorCity("error");
        error.textContent = `${data.message}`;
        return;
      }else{
        setErrorCity("");
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${data.wind.speed} км/ч`;
        humidity.textContent = `${data.main.humidity}%`;
      }  
    }catch (e){
      console.log(`Exeption: ${e}`);
      setErrorCity("error");
      error.textContent = `Ошибка получения данных`.toUpperCase();
      city.focus();
    }
  }  
}

// Change visibility
function setErrorCity(mode){
  //alert(mode);
  weather.className = 'weather';
  error.className = 'error';
  if(mode === "error"){
    weather.classList.add(`error`);
    error.classList.add(`error__visibility`);
    localStorage.setItem('city', "");
    city.focus();
    city.blur();
  }else{
    weather.classList.add(`error__visibility`);
    error.classList.add(`error`);
    weatherIcon.className = 'weather-icon owf';
  }
  
}

//Info block location
//get City
function getCity() {
  console.log(`localStorage = ${localStorage.getItem('city')}`);

  if (localStorage.getItem('city') === null || localStorage.getItem('city') === "") {
    city.textContent = '[Введите город]';
  } else {
    city.textContent = localStorage.getItem('city');
    getWeather(localStorage.getItem('city'));
  }
}
//  set City
function setCity(e){
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('city', e.target.innerText);
      city.blur();
    }
  } else {
    localStorage.setItem('city', e.target.innerText);
    getWeather(e.target.innerText);
  }
}
city.onclick = function(e){
  e.target.innerText = '';
}

city.onblur = function(e){
  let elem = e.target;
  if(elem.textContent === null || elem.textContent === ""){
    if(localStorage.getItem('city') !== undefined && localStorage.getItem('city') !== null && localStorage.getItem('city') !== ""){
      elem.textContent = localStorage.getItem('city');
      getWeather(localStorage.getItem('city'));
    }else{
      elem.textContent = '[Введите город]';
    }
  }
}

//----------------------quotation block------------------------

//Quotes
async function getQuotes(){
  const url = `https://quote-garden.herokuapp.com/api/v2/quotes/random`;

  const response = await fetch(url);
  const data = await response.json();
  quotationText.textContent = data.quote.quoteText;
  author.textContent = data.quote.quoteAuthor;
}

// Events
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

document.addEventListener('DOMContentLoaded', getWeather);
document.addEventListener('DOMContentLoaded', getQuotes);
document.addEventListener('DOMContentLoaded', getCity);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);
quotationButton.addEventListener('click', getQuotes);




//----------------------change image------------------------
let i = 0;
async function changeBgImage(imgIndex){
  await setBgGreet();
  const body = document.querySelector('body');
  const path = './assets/images/' + window.pathFolder + '/' + imgIndex;
  console.log(`path = ${path}`);
  const img = document.createElement('img');
  img.src = path;
  img.onload = () => {      
    body.style.backgroundImage = `url(${path})`;
  };
}

function getImage() {
  const index = i % images.length;
  changeBgImage(images[index]);
  i++;
  btn.disabled = true;
  setTimeout(function() { btn.disabled = false }, 500);
  setTimeout(getImage, 3600000);
} 
btn.addEventListener('click', getImage);

// Run
showTime();
getImage();
getName();
getFocus();