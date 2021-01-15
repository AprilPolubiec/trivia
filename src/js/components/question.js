import { gameDoc } from "../firebase";
import Timer from "./timer";
import { navigate } from "../routes";
import { CONTAINER_ID } from "../constants";

const getShuffledAnswers = (question) => {
  const all_answers = question.incorrect_answers.concat(
    question.correct_answer
  );
  all_answers.sort(() => Math.random() - 0.5);
  return all_answers;
};

const renderTriviaQuestion = (question) => {
  // console.log("rendering trivia question");
  const all_answers = getShuffledAnswers(question);

  var questionContainerEl = document.createElement("div");
  questionContainerEl.className = "question-container";

  var buttonGroupEl = document.createElement("div");
  buttonGroupEl.className = "btn-group-vertical";
  buttonGroupEl.setAttribute("name", "answers");
  buttonGroupEl.innerHTML = question.question;

  all_answers.forEach((answer) => {
    var inputEl = document.createElement("input");
    inputEl.className = "btn-check";
    inputEl.setAttribute("name", "answers");
    inputEl.id = answer;
    inputEl.onclick = (e) => {
      // renderScoreBoard()
      console.log("selected: ", e, this);
    };

    var labelEl = document.createElement("label");
    labelEl.className = "btn btn-outline-primary";
    labelEl.htmlFor = inputEl.id;
    labelEl.innerHTML = answer.toString();

    buttonGroupEl.append(inputEl, labelEl);
  });

  questionContainerEl.append(buttonGroupEl);
  document.getElementById(CONTAINER_ID).append(questionContainerEl);
};

function Game(id) {
  this.current_question = null;
  const timer = new Timer(30);
  timer.ontimeout(() => {
    // stop showing the current trivia question
    console.log("Times up!");
    // renderScoreBoard()
  });


  var unsubscribeGame;
  this.start = () => {
    console.log("game.start!");
    unsubscribeGame = gameDoc(id).onSnapshot((docSnap) => {
      const current_question = docSnap.data().current_question;
      console.log("current_question: ", current_question);
      if (current_question >= 0 && current_question !== this.current_question) {
        // Render trivia question
        this.current_question = current_question;
        const question = docSnap.data().questions[current_question];
        renderTriviaQuestion(question);
        timer.render();
        timer.start();
      }
    });
  };

  this.end = () => unsubscribeGame();
}

export default Game;
