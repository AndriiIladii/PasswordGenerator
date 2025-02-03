import "./main.css";
import "./index.html";

const passwordField = document.getElementById("password");
const generateBtn = document.querySelector(".generate__btn");
const copyBtn = document.querySelector(".copy__btn");
const clearBtn = document.querySelector(".delete__history");
const lengthSlider = document.getElementById("length__slider");
const lengthValue = document.querySelector(".password__slider-value");
const historyWrapper = document.querySelector(".history__wrapper");

let click = new Audio("./audio/click.wav");
let deleteSound = new Audio("./audio/delete.mp3");
let generateSound = new Audio("./audio/gen.mp3");

const options = {
  lowercase: {
    checkbox: document.getElementById("lowercase"),
    chars: "abcdefghijklmnopqrstuvwxyz",
  },
  uppercase: {
    checkbox: document.getElementById("uppercase"),
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
  symbols: {
    checkbox: document.getElementById("symbols"),
    chars: "!@#$%^&*()_+",
  },
  numbers: {
    checkbox: document.getElementById("numbers"),
    chars: "0123456789",
  },
};

Object.values(options).forEach((option) => {
  option.checkbox.addEventListener("change", () => {
    let clickSound = click.cloneNode(true);
    clickSound.play();
  });
});

copyBtn.addEventListener("click", () => {
  if (passwordField.value) {
    navigator.clipboard.writeText(passwordField.value);
    alert("Password copied to clipboard");
  }
});

const restorePasswordOptions = () => {
  if (localStorage.getItem("passwordOption")) {
    const passwordOption = JSON.parse(localStorage.getItem("passwordOption"));
    uppercase.checked = passwordOption["uppercase"];
    lowercase.checked = passwordOption["lowercase"];
    symbols.checked = passwordOption["symbols"];
    numbers.checked = passwordOption["numbers"];
    lengthSlider.value = passwordOption.length;
    updateLengthSlider();
  }
};

const savePasswordOptions = () => {
  const passwordOption = {};
  passwordOption["length"] = +lengthSlider.value;
  passwordOption["uppercase"] = uppercase.checked;
  passwordOption["lowercase"] = lowercase.checked;
  passwordOption["numbers"] = numbers.checked;
  passwordOption["symbols"] = symbols.checked;
  localStorage.setItem("passwordOption", JSON.stringify(passwordOption));
};

const updateLengthSlider = () => {
  const min = parseInt(lengthSlider.min, 10);
  const max = parseInt(lengthSlider.max, 10);
  const value = parseInt(lengthSlider.value, 10);

  lengthValue.textContent = value;
  const percent = ((value - min) / (max - min)) * 99 + 1;

  lengthValue.style.left = `calc(${percent}% - ${percent * 0.2}px)`;
};

lengthSlider.addEventListener("input", updateLengthSlider);

const createHistoryElement = (password, dateTime) => {
  const historyItem = document.createElement("div");
  historyItem.classList.add("history__item", "fade-in");
  const historyItemWrapper = document.createElement("div");
  historyItemWrapper.classList.add("history__item-wrapper");
  const pass = document.createElement("p");
  pass.classList.add("pass");
  pass.textContent = password;
  const timeElement = document.createElement("p");
  timeElement.classList.add("date-time");
  timeElement.textContent = dateTime;
  const copyPass = document.createElement("button");
  copyPass.classList.add("copy__pass");

  copyPass.addEventListener("click", () => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard");
  });

  historyItemWrapper.appendChild(pass);
  historyItemWrapper.appendChild(timeElement);
  historyItem.appendChild(historyItemWrapper);
  historyItem.appendChild(copyPass);

  return historyItem;
};

const addToHistory = () => {
  let password = JSON.parse(localStorage.getItem("passwordField"));
  let currentDateTime = new Date();
  let formattedDate = `${(currentDateTime.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${currentDateTime
    .getDate()
    .toString()
    .padStart(
      2,
      "0"
    )}/${currentDateTime.getFullYear()}, ${currentDateTime.toLocaleTimeString()}`;

  if (password) {
    const historyItem = createHistoryElement(password, formattedDate);
    historyWrapper.appendChild(historyItem);

    let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];
    history.push({ password, time: currentDateTime });
    localStorage.setItem("passwordHistory", JSON.stringify(history));
  }
};

const restoreHistory = () => {
  let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

  history.forEach(({ password, time }) => {
    const historyItem = createHistoryElement(password, time);
    historyWrapper.appendChild(historyItem);
  });
};

const clearHistory = () => {
  let deleteSoundInstance = deleteSound.cloneNode(true);
  deleteSoundInstance.play();

  const historyItems = Array.from(historyWrapper.children);

  historyItems.forEach((child, index) => {
    child.classList.add("fade-out"); // Добавляем анимацию исчезновения

    setTimeout(() => {
      historyWrapper.removeChild(child);
      if (index === historyItems.length - 1) {
        localStorage.removeItem("passwordHistory");
      }
    }, 300); // Даем время на проигрывание анимации перед удалением
  });
};

clearBtn.addEventListener("click", clearHistory);
document.addEventListener("DOMContentLoaded", () => {
  restoreHistory();
});

const diffSection = document.querySelectorAll(".difficulty__section");

generateBtn.addEventListener("click", () => {
  let generateSoundInstance = generateSound.cloneNode(true);
  generateSoundInstance.play();
  savePasswordOptions();
  addToHistory();
  const length = parseInt(lengthSlider.value, 10);
  const selectedChars = Object.values(options)
    .filter((option) => option.checkbox.checked)
    .map((option) => option.chars)
    .join("");

  if (!selectedChars) {
    alert("Please select at least one option");
    passwordField.value = "";
    return;
  }

  passwordField.value = Array.from(
    { length },
    () => selectedChars[Math.floor(Math.random() * selectedChars.length)]
  ).join("");

  let strength = passwordStrength(passwordField.value);

  diffSection.forEach((section) => {
    section.classList.remove("strong");
  });

  if (strength >= 1) {
    diffSection[3].classList.add("strong");
  }
  if (strength >= 2) {
    diffSection[2].classList.add("strong");
  }
  if (strength >= 3) {
    diffSection[1].classList.add("strong");
  }
  if (strength >= 4) {
    diffSection[0].classList.add("strong");
  }

  localStorage.setItem("passwordField", JSON.stringify(passwordField.value));
});

const passwordStrength = (password) => {
  const lengthWeight = 0.2;
  const uppercaseWeight = 0.5;
  const lowercaseWeight = 0.5;
  const numberWeight = 0.7;
  const symbolWeight = 1;
  let strength = 0;

  strength += password.length * lengthWeight;

  if (password.match(/[A-Z]/)) strength += uppercaseWeight;
  if (password.match(/[a-z]/)) strength += lowercaseWeight;
  if (password.match(/[0-9]/)) strength += numberWeight;
  if (password.match(/[^A-Za-z0-9]/)) strength += symbolWeight;

  return strength;
};

restorePasswordOptions();
updateLengthSlider();
