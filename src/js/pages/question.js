import Timer from "../components/timer";
import { gameDoc } from "../firebase";
import { CONTAINER_ID, QUESTION_CONTAINER_ID } from "../constants";
import { navigate } from "../routes";

const getShuffledAnswers = (question) => {
  const all_answers = question.incorrect_answers.concat(
    question.correct_answer
  );
  all_answers.sort(() => Math.random() - 0.5);
  return all_answers;
};

const renderQuestion = (question) => {
  // console.log("rendering trivia question");
  const all_answers = getShuffledAnswers(question);
  var questionContainerEl = document.getElementById(QUESTION_CONTAINER_ID);
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

    var labelEl = document.createElement("label");
    labelEl.className = "btn btn-outline-primary";
    labelEl.htmlFor = inputEl.id;
    labelEl.innerHTML = answer.toString();

    buttonGroupEl.append(inputEl, labelEl);
  });

  questionContainerEl.append(buttonGroupEl);
  document.getElementById(CONTAINER_ID).append(questionContainerEl);
};

export default function Question({ id, username }) {
  var questionContainerEl = document.createElement("div");
  questionContainerEl.id = QUESTION_CONTAINER_ID;

  var correct_answer;
  const timer = new Timer(10);
  timer.render();
  timer.ontimeout(() => {
    const answers = document.querySelectorAll('input[name="answers"]');
    answers.forEach((a) => {
      if (a.checked) {
        // Check if correct
        if (a.id === correct_answer) {
          console.log("+1 good job");
        } else {
          console.log("You were wrong");
        }
        return navigate("lobby", { id, username });
      }
    });
    return navigate("lobby", { id, username });
  });

  gameDoc(id)
    .get()
    .then((docSnap) => {
      const current_question = docSnap.data().current_question;
      console.log("current_question: ", current_question);
      const question = docSnap.data().questions[current_question];
      correct_answer = question.correct_answer;
      renderQuestion(question);
      timer.start();
    });

  return questionContainerEl;
}