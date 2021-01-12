var randomWords = require("random-words");

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
