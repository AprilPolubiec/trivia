import "./css/style.css";
import { navigate } from "./js/routes";

$(document).ready(function () {
  // initially render landing.js
  navigate("landing");
  // when we have a game code, render lobby
  // if game.started - start the game!
});
