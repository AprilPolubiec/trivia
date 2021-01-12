const getShuffledAnswers = (question) => {
  const all_answers = question.incorrect_answers.concat(
    question.correct_answer
  );
  all_answers.sort(() => Math.random() - 0.5);
  return all_answers;
};

const renderTriviaQuestion = (question) => {
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

    var labelEl = document.createElement("label");
    labelEl.className = "btn btn-outline-primary";
    labelEl.htmlFor = inputEl.id;
    labelEl.innerHTML = answer.toString();

    buttonGroupEl.append(inputEl, labelEl);
  });

  questionContainerEl.append(buttonGroupEl);
  $("#container").append(questionContainerEl);
  // console.log(questions);
};

$(document).ready(function () {
  const containerEl = $("#container");
  const AMOUNT = 20;

  fetch(`https://opentdb.com/api.php?amount=${AMOUNT}`)
    .then((res) => res.json())
    .then((data) => {
      const questions = data.results;
      var question = questions[0];
      renderTriviaQuestion(question);
    });
});
