//объявляем переменные
let base = 60;
let clockTimer, dateObj, dh, dm, ds;
let readout = '';
var h = 1,
    m = 1,
    tm = 1,
    s = 0,
    ts = 0,
    ms = 0,
    init = 0;

//функция для очистки поля
function ClearСlock() {    
    clearTimeout(clockTimer);
    h = 1;
    m = 1;
    tm = 1;
    s = 0;
    ts = 0;
    ms = 0;
    init = 0;
    readout = '00:00:00';
    document.querySelector('.time_value').innerHTML = readout;
}

//функция для старта секундомера
function StartTIME() {

    let cdateObj = new Date();
    let t = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);
    if (t > 999) {
        s++;
    }
    if (s >= (m * base)) {
        ts = 0;
        m++;
    } else {
        ts = parseInt((ms / 100) + s);
        if (ts >= base) {
        ts = ts - ((m - 1) * base);
        }
    }
    if (m > (h * base)) {
        tm = 1;
        h++;
    } else {
        tm = parseInt((ms / 100) + m);
        if (tm >= base) {
        tm = tm - ((h - 1) * base);
        }
    }
    ms = Math.round(t / 10);
    if (ms > 99) {
        ms = 0;
    }
    if (ms == 0) {
        ms = '00';
    }
    if (ms > 0 && ms <= 9) {
        ms = '0' + ms;
    }
    if (ts > 0) {
        ds = ts;
        if (ts < 10) {
        ds = '0' + ts;
        }
    } else {
        ds = '00';
    }
    dm = tm - 1;
    if (dm > 0) {
        if (dm < 10) {
        dm = '0' + dm;
        }
    } else {
        dm = '00';
    }
    dh = h - 1;
    if (dh > 0) {
        if (dh < 10) {
        dh = '0' + dh;
        }
    } else {
        dh = '00';
    }
    readout = dh + ':' + dm + ':' + ds;
    document.querySelector('.time_value').innerHTML = readout;
    clockTimer = setTimeout(`StartTIME()`, 1);
}

//Функция запуска и остановки
function StartStop(value) {
    console.log(`value = ${value}, init = ${init}`);
    let dhSave, dmSave, dsSave;
    
    if (value) {
        if (value === "pause") {
            localStorage.setItem('time', getTime().time);
            if(init === 0) {
                clearTimeout(clockTimer);
                init = 1;
            } else {
               /* let timeStorage = localStorage.getItem('time');
                if(timeStorage) {
                    let timeArr = timeStorage.split(':');
                    dhSave = timeArr[0];
                    dmSave = timeArr[1];
                    dsSave = timeArr[2];
                }*/
                setTimeout(`StartTIME()`, 1);
                init = 0;
            }
            return;
        }
        if (value === "new") {
            localStorage.setItem('time', '00:00:00');
            ClearСlock();
            return;
        }
        if (value === "click") {
            ClearСlock();
            dateObj = new Date();
            StartTIME();
            return;
        }
        if (value === "victory") {
            clearTimeout(clockTimer);
            return;
        }
    }
}