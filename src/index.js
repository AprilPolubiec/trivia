import "./css/style.css";
import Landing from "./js/pages/landing";

$(document).ready(function () {
  // initially render landing.js
  document.getElementById("container").append(Landing());
  // when we have a game code, render lobby
  // if game.started - start the game!
});
