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

function Game(id) {
  this.current_question = null;
  this.current_correct_answer = null;
  this.selected_answer = null;
  const timer = new Timer(10);

  timer.ontimeout(() => {
    if (this.selected_answer === this.current_correct_answer) {
      increasePlayerScore({ id, username: "host", amount: 5 });
    }
    document.getElementById("lobby").hidden = false;
    document.getElementById("question-container").remove();
  });

  var unsubscribeGame;
  this.start = () => {
    console.log("game.start!");
    // Hide lobby
    document.getElementById("lobby").hidden = true;
    unsubscribeGame = gameDoc(id).onSnapshot((docSnap) => {
      const current_question = docSnap.data().current_question;
      console.log("current_question: ", current_question);
      if (current_question >= 0 && current_question !== this.current_question) {
        // Render trivia question
        this.current_question = current_question;
        const question = docSnap.data().questions[current_question];
        this.current_correct_answer = question["correct_answer"];
        this.renderQuestion(question);
        timer.render();
        timer.start();
      }
    });
  };

  this.end = () => unsubscribeGame();

  this.renderQuestion = (question) => {
    // console.log("rendering trivia question");
    const all_answers = getShuffledAnswers(question);

    var questionContainerEl = document.createElement("div");
    questionContainerEl.id = "question-container";

    var buttonGroupEl = document.createElement("div");
    buttonGroupEl.className = "btn-group-vertical";
    buttonGroupEl.setAttribute("name", "answers");
    buttonGroupEl.innerHTML = question.question;

    all_answers.forEach((answer) => {
      var inputEl = document.createElement("input");
      inputEl.type = "radio";
      inputEl.className = "btn-check";
      inputEl.setAttribute("name", "answers");
      inputEl.id = answer;
      inputEl.onclick = (e) => {
        this.selected_answer = e.target.id;
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
}

export default Game;
