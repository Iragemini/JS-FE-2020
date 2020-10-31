if(!window.localStorage.getItem('language') || window.localStorage.getItem('language') === ""){
  window.localStorage.setItem('language', 'ru');
}

// Создаем распознаватель
var recognizer = new webkitSpeechRecognition();

// Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
recognizer.interimResults = true;
recognizer.continuous = true;

// Используем колбек для обработки результатов
recognizer.onresult = function (event) {
  var result = event.results[event.resultIndex];
  //document.querySelector('.use-keyboard-input').value = result[0].transcript;
  document.querySelector('.use-keyboard-input').value = result[0].transcript;
  document.querySelector('.use-keyboard-input').focus();
  //document.querySelector('.voice').classList.remove('voice-active');
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
    capsLock: false
  },

  init(langCode) {
    //console.log(`init lang = ${langCode}`);
    this.langCode = langCode;
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys(this.langCode));

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      console.log(`element = ${element}`);
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys(lang) {
    const fragment = document.createDocumentFragment();
    let keyLayout = [];
    if(lang === "en"){
      keyLayout = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
        "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
        `${lang}`, "space", "speech", "stop"
      ];
    }else{
      keyLayout = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "?", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", ",",
        `${lang}`, "space", "speech", "stop"
      ];
    }
    

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    console.log(`global lang = ${lang}`);
    keyLayout.forEach(key => {

      const keyElement = document.createElement("button");
      let insertLineBreak = [];
      if(lang === 'en'){
        insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
      }else{
        insertLineBreak = ["backspace", "p", "enter", "caps", ","].indexOf(key) !== -1;
      }

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        case ("ru" || "en"):
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = key;

          keyElement.addEventListener("click", () => {
            console.log(`key = ${key}`);
            this.close();
            this._triggerEvent("onclose");
            this.changeLanguage(key);
            document.querySelector('.use-keyboard-input').focus();
          });

          break;

        case "speech":
          keyElement.innerHTML = '<span class="voice"><img src="./assets/voice_32.svg" alt="speech"></span>'

          keyElement.addEventListener("click", () => {
            this.speech ();
            document.querySelector('.voice').classList.add("voice-active");
            this._triggerEvent("oninput");
          });

          break;
        
        case "stop":
          keyElement.innerHTML = '<span class="mute-voice"><img src="./assets/mute_voice_32.svg" alt="stop"></span>'
  
          keyElement.addEventListener("click", () => {
            recognizer.stop();
            keyElement.classList.add("keyboard__key--active");
            document.querySelector('.voice').classList.remove('voice-active');
            this._triggerEvent("oninput");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
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
    console.log(`handlerName = ${handlerName}`);
    console.log(`value = ${this.properties.value}`);
    if (typeof this.eventHandlers[handlerName] == "function") {
      console.log(`this.eventHandlers[handlerName] = ${this.eventHandlers[handlerName]}`);
      this.eventHandlers[handlerName](this.properties.value);
      document.querySelector('.use-keyboard-input').focus();
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
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
    console.log(`lang = ${language}`);
    if(this.language && this.language === "ru"){
      this.language = "en";
    }else if(this.language && this.language === "en") {
      this.language = "ru";
    }
    window.localStorage.setItem('language', this.language);
    Keyboard.init(this.language);
    document.querySelector('.use-keyboard-input').focus();
  },

  speech () {
    let langRec = 'ru-Ru';

    if(window.localStorage.getItem('language') === 'en') {
      langRec = 'en-US'
    }
    console.log(`recognizer.lang = ${langRec}`);

    // Какой язык будем распознавать?
    recognizer.lang = langRec;
    // Начинаем слушать микрофон и распознавать голос
    recognizer.start();
  }

};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init(window.localStorage.getItem('language' || 'ru'));
});



