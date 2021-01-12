import { addGameDoc } from "../firebase";
const joinGame = (game_code, username) => {
  console.log(`joinGame: ${game_code} ${username}`);
};

const createGame = () => {
  try {
    addGameDoc();
  } catch (e) {
    console.log(e);
  }
};

export default function Landing() {
  var landingContainerEl = document.createElement("div");
  landingContainerEl.id = "landing";

  var usernameInputEl = document.createElement("input");
  usernameInputEl.id = "username";
  usernameInputEl.setAttribute("name", "username");
  usernameInputEl.placeholder = "ENTER NAME";

  var codeEl = document.createElement("input");
  codeEl.id = "code";
  codeEl.setAttribute("name", "code");
  codeEl.placeholder = "ENTER GAME CODE";

  var joinButtonEl = document.createElement("button");
  joinButtonEl.className = "landing-btn";
  joinButtonEl.innerText = "JOIN";
  joinButtonEl.onclick = () => joinGame(codeEl.value, usernameInputEl.value);

  var newGameButtonEl = document.createElement("button");
  newGameButtonEl.className = "landing-btn";
  newGameButtonEl.innerText = "CREATE";
  newGameButtonEl.onclick = () => createGame();

  landingContainerEl.append(
    usernameInputEl,
    codeEl,
    joinButtonEl,
    newGameButtonEl
  );
  return landingContainerEl;
}
