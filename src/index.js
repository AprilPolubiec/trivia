import "./css/style.css";
import "./js/question";
import Timer from "./js/timer";

$(document).ready(function () {
  const timer = new Timer(10);
  timer.render()
  timer.start()
});
