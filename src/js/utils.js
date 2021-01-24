var randomWords = require("random-words");

// TODO: use my own funner words
export const generateGameID = () => {
  return randomWords({
    exactly: 1,
    wordsPerString: 2,
    maxLength: 4,
    separator: "-",
  })[0];
};

export const generateTriviaQuestions = () => {
  return fetch("https://opentdb.com/api.php?amount=10")
    .then((res) => res.json())
    .then((data) => data.results)
    .catch((err) => console.log(err));
};

export const createPageContainerEl = (page) => {
  var containerEl = document.createElement("div");
  containerEl.id = page;
  return containerEl;
};

export const createTextInputEl = (name) => {
  var inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.id = name.replace(" ", "-");
  inputEl.setAttribute("name", name.replace(" ", "-"));
  inputEl.placeholder = `enter ${name}`.toUpperCase();
  return inputEl;
};

export const createButtonEl = (text) => {
  var buttonEl = document.createElement("button");
  buttonEl.classList.add("btn");
  buttonEl.innerText = text.toUpperCase();
  return buttonEl;
};

export const createPlayerListEl = (username, score) => {
  const playerEl = document.createElement("li");
  playerEl.setAttribute("name", username);

  const usernameEl = document.createElement("div");
  usernameEl.className = "username";
  usernameEl.innerText = username;

  const scoreEl = document.createElement("div");
  scoreEl.className = "score";
  scoreEl.innerText = score;

  playerEl.append(usernameEl, scoreEl);
  return playerEl;
};
