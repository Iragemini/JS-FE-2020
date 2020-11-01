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

  init(langCode, shiftOn) {
    this.langCode = langCode;
    this.shiftOn = shiftOn;
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys(this.langCode, this.shiftOn));

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);

    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys(lang, shiftOn) {
    const fragment = document.createDocumentFragment();

    let keyLayout = [];

    if(lang === "en"){
      keyLayout = en;
    }else{
      keyLayout = ru;
    } 
    
    this.shiftOn = shiftOn;
    window.shiftOn = shiftOn;

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(obj => {

      this.output = output;
            
      let name = obj.name;
      if(this.shiftOn){
        name = obj.secondName;
        if(name === null){
          name = obj.name;
        }
      }

      const keyElement = document.createElement("button");      

      let insertLineBreak = [];

      insertLineBreak = ["Backspace", "\\", "Enter", "↑"].indexOf(name) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      keyElement.addEventListener("click", () => {
        playSound(obj.id);
      });

      switch (name) {
        case "Backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.dataset['key'] = obj.id;

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
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

        case "Enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.dataset['key'] = obj.id;

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });

          break;

        case "Space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.dataset['key'] = obj.id;

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
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

        case ("ru"):
          //keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = obj.name;

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
            this.changeLanguage(obj.name);
            document.querySelector('.use-keyboard-input').focus();
          });

          break;

        case ("en"):
          //keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = obj.name;

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
            this.changeLanguage(obj.name);
            document.querySelector('.use-keyboard-input').focus();
          });

          break;

        case "speech":
          keyElement.innerHTML = '<span class="additional voice"><img src="./assets/voice_32.svg" alt="speech"></span>'

          keyElement.addEventListener("click", () => {
            this.speech ();
            document.querySelector('.voice').classList.add("voice-active");
            this._triggerEvent("oninput");
          });

          break;
        
        case "stop":
          keyElement.innerHTML = '<span class="additional"><img src="./assets/mute_voice_32.svg" alt="stop"></span>'
  
          keyElement.addEventListener("click", () => {
            recognizer.stop();
            keyElement.classList.add("keyboard__key--active");
            document.querySelector('.voice').classList.remove('voice-active');
            this._triggerEvent("oninput");
          });

          break;

        case "←":
          keyElement.innerHTML = obj.name;
          keyElement.dataset['key'] = obj.id;
  
          keyElement.addEventListener("click", () => {
            this.moveCursor(obj.id);
            this._triggerEvent("oninput");
          });

          break;

        case "→":
          keyElement.innerHTML = obj.name;
          keyElement.dataset['key'] = obj.id;
  
          keyElement.addEventListener("click", () => {
            this.moveCursor(obj.id);
            this._triggerEvent("oninput");
          });

          break;

        case "Shift":
          keyElement.innerHTML = obj.name;
          if(shiftOn){
            keyElement.classList.add("glow");
          }else{
            keyElement.classList.remove("glow");
          }
          keyElement.dataset['key'] = obj.id;
            
          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
            this.shift(this.shiftOn);
            document.querySelector('.use-keyboard-input').focus();
          });

          break;

        default:
          keyElement.textContent = name.toLowerCase();
          keyElement.dataset['key'] = obj.id;
          
          keyElement.addEventListener("click", () => {
            //playSound(obj.id);
            this.properties.value += this.properties.capsLock ? name.toUpperCase() : name.toLowerCase();
            this._triggerEvent("oninput");
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
      if(window.shiftOn && !this.properties.capsLock) {
        enterValue = enterValue.toUpperCase();
      }
      this.eventHandlers[handlerName](enterValue);
      this.output.focus();
    }
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

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && !key.textContent.match(/tab|Shift|ctrl|en|ru/)) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
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
    this.language = language;
    if(this.language && this.language === "ru"){
      this.language = "en";
    }else if(this.language && this.language === "en") {
      this.language = "ru";
    }
    window.localStorage.setItem('language', this.language);
    this.properties.capsLock = false;
    Keyboard.init(this.language, false);
    document.querySelector('.use-keyboard-input').focus();
  },

  speech () {
    let langRec = 'ru-Ru';

    if(window.localStorage.getItem('language') === 'en') {
      langRec = 'en-US'
    }

    recognizer.lang = langRec;
    recognizer.start();
  },

  moveCursor (direction) {
    this.direction = direction;
    this.output = output;
    let cursorPos = this.output.selectionStart;

    if(direction === 37) {
      cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
    } else if (direction === 39) {
      cursorPos += 1;
    }
    this.output.setSelectionRange(cursorPos, cursorPos);
  },

  shift (shiftOn) {

    this.shiftOn = shiftOn;
    if(!this.shiftOn){
      Keyboard.init(window.localStorage.getItem('language'), true);
    }else{
      Keyboard.init(window.localStorage.getItem('language'), false);
    }
    document.querySelector('.use-keyboard-input').focus();
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init(window.localStorage.getItem('language' || 'ru'), false);
});



function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('playing');
}

function playSound(e) {
  const audio = document.querySelector(`audio[data-key="all"]`);
  const key = document.querySelector(`button[data-key="${e}"]`);
  if (!audio) return;

  audio.currentTime = 0;
  audio.play();
}

const keys = Array.from(document.querySelectorAll('.keyboard__key'));
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
window.addEventListener('keydown', playSound);

