import "./main.css";
import "./index.html";

const passwordField = document.getElementById("password");
const generateBtn = document.querySelector(".generate__btn");
const copyBtn = document.querySelector(".copy__btn");
const clearBtn = document.querySelector(".delete__history");
const lengthSlider = document.getElementById("length__slider");
const lengthValue = document.querySelector(".password__slider-value");
const historyWrapper = document.querySelector(".history__wrapper");

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
  historyItem.classList.add("history__item");
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
  Array.from(historyWrapper.children).forEach((child) =>
    historyWrapper.removeChild(child)
  );

  localStorage.removeItem("passwordHistory");
};

clearBtn.addEventListener("click", clearHistory);

document.addEventListener("DOMContentLoaded", restoreHistory);

generateBtn.addEventListener("click", () => {
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

  localStorage.setItem("passwordField", JSON.stringify(passwordField.value));
});

restorePasswordOptions();
updateLengthSlider();
