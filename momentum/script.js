// DOM Elements
const time = document.querySelector('.time'),
  dmy = document.querySelector('.dmy'),
  greeting = document.querySelector('.greeting'),
  name = document.querySelector('.name'),
  focus = document.querySelector('.focus'),
  city = document.querySelector('.city'),
  humidity = document.querySelector('.humidity');

  // Weather
  const weatherIcon = document.querySelector('.weather-icon');
  const temperature = document.querySelector('.temperature');
  const weatherDescription = document.querySelector('.weather-description');
  const wind = document.querySelector('.wind');

// Options
const showAmPm = true;

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
  
  console.log(`todayDMY = ${todayDMY}, day = ${days[day]}`);

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
  //let today = new Date('October 20, 2020 00:24:00'),
  let today = new Date(),
    hour = today.getHours();
  console.log(`hour = ${hour}`);
  
  if (hour >= 6 && hour < 12) {
    // Morning
    document.body.style.backgroundImage =
      "url('assets/images/morning/01.jpg')";
    greeting.textContent = 'Доброе утро, ';
  } else if (hour >= 12 && hour < 18) {
    // Afternoon
    document.body.style.backgroundImage =
      "url('assets/images/day/01.jpg')";
    greeting.textContent = 'Добрый день, ';
  } else if(hour >= 18 && hour < 24) {
    // Evening
    document.body.style.backgroundImage =
      "url('assets/images/evening/01.jpg')";
    greeting.textContent = 'Добрый вечер, ';
    document.body.style.color = 'white';
  } else{
    // Night
    document.body.style.backgroundImage =
      "url('assets/images/night/01.jpg')";
    greeting.textContent = 'Доброй ночи, ';
    document.body.style.color = 'white';
  }
}

// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
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
    elem.textContent = '[Enter Name]';
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]';
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
    elem.textContent = '[Enter Focus]';
  }
}


//Weather
async function getWeather(){
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&appid=17227db8a8fac1ac6f661ea99d8541a9&units=metric&lang=ru`;
  
  const response = await fetch(url);
  const data = await response.json();

  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `Ветер: ${data.wind.speed} км/ч`;
  humidity.textContent = `Влажность: ${data.main.humidity}%`;
}

function setCity(e){
  if(e.which == 13 || e.keyCode == 13){
    getWeather();
    city.blur();
  }
}

name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
document.addEventListener('DOMContentLoaded', getWeather);

focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
city.addEventListener('keypress', setCity);


// Run
showTime();
setBgGreet();
getName();
getFocus();