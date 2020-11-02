if(!window.localStorage.getItem('language') || window.localStorage.getItem('language') === ""){
  window.localStorage.setItem('language', 'ru');
}

const output = document.querySelector('.use-keyboard-input');

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognizer = new SpeechRecognition();
recognizer.interimResults = true;
recognizer.continuous = true;

const prevOutput = output.value;

recognizer.onresult = function (event) {
  var result = event.results[event.resultIndex];
  output.value = prevOutput + result[0].transcript;
  output.focus();
};


const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false
  },
  
  language : {
    value: ""
  },

  voice : {
    speech : false
  },

  audio : {
    play : false
  },

  keyLayout : {
    keyArr : []
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);

    document.body.appendChild(this.elements.main);

    this.voice.speech = false;
    this.audio.play = false;

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    
    this.language.value = window.localStorage.getItem('language');

    let arrKeys = [];

    let tempArr = [];

    if(this.language.value === "en"){
      tempArr = en.slice();
    }else{
      tempArr = ru.slice();
    } 
    for (let i = 0; i < tempArr.length; i++) {
      if(this.properties.shift){
        let name = tempArr[i].name;
        if(tempArr[i].secondName && tempArr[i].secondName !== null){
          name = tempArr[i].secondName;
        }
        arrKeys.push({'id': tempArr[i].id, 'name': name});
      }else{
        arrKeys.push({'id': tempArr[i].id, 'name': tempArr[i].name});
      }
    }
    this.keyLayout.keyArr = arrKeys;

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };
    this.keyLayout.keyArr.forEach(obj => {

      this.output = output;

      const keyElement = document.createElement("button");      

      let insertLineBreak = [];

      insertLineBreak = ["Backspace", "\\", "Enter", "↑"].indexOf(obj.name) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      keyElement.addEventListener("click", () => {
        playSound(obj.id, this.audio.play);
      });
      keyElement.addEventListener("mousedown", (e) => {
        if(e.which === 1) {
          keyElement.classList.add("keyboard__key_active");
        }
      });
      keyElement.addEventListener("mouseup", (e) => {
        if(e.which === 1) {
          keyElement.classList.remove("keyboard__key_active");
        }
      });

      switch (obj.name) {
        case "Backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.dataset['key'] = obj.id;

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this.printToOutput(obj.id, obj.name);
          });

          break;

        case "Caps Lock":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          keyElement.dataset['key'] = obj.id;

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "Shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = obj.name;
          keyElement.dataset['key'] = obj.id;
            
          keyElement.addEventListener("click", () => {
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            document.querySelector('.use-keyboard-input').focus();
          });

          break;
          
        case "voice":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = '<span class="additional"><img src="./assets/microphone_32.svg" alt="speech"></span>'

          keyElement.addEventListener("click", () => {
            this.speech ();
            keyElement.classList.toggle("keyboard__key--active", this.voice.speech);
            this._triggerEvent("oninput");
          });

          break;
          
        case "audio":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = '<span class="additional"><img src="./assets/voice_32.svg" alt="speech"></span>'

          keyElement.addEventListener("click", () => {
            this.sound (obj.id);
            keyElement.classList.toggle("keyboard__key--active", this.audio.play);
          });

          break;

        case ("ru"):
            keyElement.innerHTML = obj.name;
  
            keyElement.addEventListener("click", () => {
              this.close();
              this._triggerEvent("onclose");
              this.changeLanguage(obj.name);
              document.querySelector('.use-keyboard-input').focus();
            });
  
            break;
  
        case ("en"):
            keyElement.innerHTML = obj.name;
  
            keyElement.addEventListener("click", () => {
              this.close();
              this._triggerEvent("onclose");
              this.changeLanguage(obj.name);
              document.querySelector('.use-keyboard-input').focus();
            });
  
            break;
  
        case "Enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.dataset['key'] = obj.id;

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this.printToOutput(obj.id, obj.name);
          });

          break;

        case "Space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.dataset['key'] = obj.id;

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this.printToOutput(obj.id, obj.name);
          });

          break;

        case "Done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        case "←":
          keyElement.innerHTML = obj.name;
          keyElement.dataset['key'] = obj.id;
  
          keyElement.addEventListener("click", () => {
            this.printToOutput(obj.id, obj.name);
            //this._triggerEvent("oninput");
          });

          break;

        case "→":
          keyElement.innerHTML = obj.name;
          keyElement.dataset['key'] = obj.id;
  
          keyElement.addEventListener("click", () => {
            this.printToOutput(obj.id, obj.name);
            //this._triggerEvent("oninput");
          });

          break;

        case "↑":
          keyElement.innerHTML = obj.name;
          keyElement.dataset['key'] = obj.id;
  
          keyElement.addEventListener("click", () => {
            this.printToOutput(obj.id, obj.name);
            //this._triggerEvent("oninput");
          });

          break;

        case "↓":
          keyElement.innerHTML = obj.name;
          keyElement.dataset['key'] = obj.id;
  
          keyElement.addEventListener("click", () => {
            this.printToOutput(obj.id, obj.name);
          });

          break;

        default:
          keyElement.textContent = obj.name.toLowerCase();
          keyElement.dataset['key'] = obj.id;
          
          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock ? obj.name.toUpperCase() : obj.name.toLowerCase();
            this.printToOutput(obj.id, keyElement.textContent);
          });

          break;
      }

      fragment.appendChild(keyElement);


      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  // handlerName = oniput, onclose
  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      let enterValue = this.properties.value;
      if(this.properties.shift && !this.properties.capsLock) {
        enterValue = enterValue.toUpperCase();
      }
      if(this.properties.capsLock && this.properties.shift) {
        enterValue = enterValue.toLowerCase();
      }
      this.eventHandlers[handlerName](enterValue);
      this.output.focus();
    }
  },

  printToOutput(keyCode, symbol) {

    let isFnKey = Boolean(symbol.match(/tab|Back|Enter|Space/));
    let direction = keyCode;
   
    this.output = document.querySelector('.use-keyboard-input');
    
    let cursorPos = this.output.selectionStart;
    
    const left = this.output.value.slice(0, cursorPos);
    const right = this.output.value.slice(cursorPos);

    if(symbol === "tab") {
      this.output.value = `${left}\t${right}`;
      cursorPos += 1;
    }

    if(symbol === "Enter") {
      this.output.value = `${left}\n${right}`;
      cursorPos += 1;
    }

    if(symbol === "Backspace") {
      this.output.value = `${left.slice(0, -1)}${right}`;
      cursorPos -= 1;
    }
    
    if(symbol === "Space") {
      this.output.value = `${left} ${right}`;
      cursorPos += 1;
    }    

    if (!isFnKey) {
      if(direction === 37) {
        cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
      } else if (direction === 39) {
        cursorPos += 1;
      } else if(direction === 38) {
        const positionFromLeft = this.output.value.slice(0, cursorPos).match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPos -= positionFromLeft[0].length;
      }else if(direction === 40) {
        const positionFromLeft = this.output.value.slice(cursorPos).match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPos += positionFromLeft[0].length;
      } else{
        if((this.properties.shift && !this.properties.capsLock) || (!this.properties.shift && this.properties.capsLock)) {
          symbol = symbol.toUpperCase();
        }
        if(this.properties.capsLock && this.properties.shift) {
          symbol = symbol.toLowerCase();
        }
        cursorPos += 1;
        this.output.value = `${left}${symbol || ''}${right}`;
      }
    }
    this.output.focus();
    this.output.setSelectionRange(cursorPos, cursorPos);
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && !key.textContent.match(/tab|Shift|ctrl|en|ru/)) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    let language = this.language.value;

    let arr = ru;

    if(language === "en") {
      arr = en;
    }

    const keys = Array.from(document.querySelectorAll('.keyboard__key'));
    keys.forEach(key => {
      let keyCode = key.dataset.key;
      for (let i = 0; i < arr.length; i++) {
        if(arr[i].id && arr[i].id !== null){
            if(Number.parseInt(keyCode) === arr[i].id) {
              if(arr[i].secondName !== null) {
                if (this.properties.shift) {
                  key.textContent = arr[i].secondName;
                }else{
                  key.textContent = arr[i].name;
                }
              }
            }
          }
      }
    });
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },

  changeLanguage(language) {
    if(language && language === "ru"){
      language = "en";
    }else if(language && language === "en") {
      language = "ru";
    }
    window.localStorage.setItem('language', language);
    this.properties.capsLock = false;
    this.properties.shift = false;
    this.language.value = language;
    this.init();
    document.querySelector('.use-keyboard-input').focus();
  },

  speech () {

    let language = this.language.value;
    
    this.voice.speech = !this.voice.speech;
    
    let speech = this.voice.speech;

    let langRec = 'ru-Ru';

    if(language === 'en') {
      langRec = 'en-US'
    }
    recognizer.lang = langRec;
    if(speech){
      recognizer.start();
    }else{
      recognizer.stop();
    }
  },

  sound () {
    this.audio.play = !this.audio.play;
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});



function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('playing');
}

function playSound(e, play) {
  let lang = window.localStorage.getItem('language');
  let dataKey = "";

  if(e && (typeof e === 'number') && (e === 16 || e === 20 || e === 8 || e === 13)){
    dataKey = e;
  }else {
    dataKey = lang;
  }

  const audio = document.querySelector(`audio[data-key="${dataKey}"]`);
  const key = document.querySelector(`button[data-key="${e}"]`);
  if (!audio) return;

  audio.currentTime = 0;
  if(play){
    audio.play();
  }else{
    audio.pause();
  }
}

function clickVirtualButton (e) {
  e.returnValue = false;

  const keyCode = e.keyCode;

  let button = document.querySelector(`button[data-key="${keyCode}"]`);

  button.click();
}

const keys = Array.from(document.querySelectorAll('.keyboard__key'));
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
//window.addEventListener('keydown', playSound);

window.addEventListener('keydown', clickVirtualButton);

