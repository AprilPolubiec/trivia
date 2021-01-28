import { addGameDoc, addPlayerDoc } from "../firebase";
import { navigate } from "../routes";
import {
  createPageContainerEl,
  createTextInputEl,
  createButtonEl,
} from "../utils";
import { startBackgroundMusic } from "../audio";

const joinGame = (id, username) => {
  // console.log(`joinGame: ${id} ${username}`);
  id = id.toLowerCase();
  addPlayerDoc({ id, username })
    .then(() => {
      startBackgroundMusic();
      navigate("lobby", { id, username });
    })
    .catch((err) => {
      document.getElementById("error").innerText = err;
    });
};

const createGame = () => {
  const username = "host";
  addGameDoc(username).then((id) => {
    joinGame(id, username);
  });
};

export default function Landing() {
  var landingContainerEl = createPageContainerEl("landing");

  var usernameInputEl = createTextInputEl("username");
  var gameCodeEl = document.createElement("div");
  gameCodeEl.id = "game-code-container";
  var codeEl1 = createTextInputEl("gameCode1", false);
  var codeEl2 = createTextInputEl("gameCode2", false);
  var separator = document.createElement("div");
  separator.innerText = "-";
  separator.classList.add("separator");
  gameCodeEl.append(codeEl1, separator, codeEl2);

  var joinButtonEl = createButtonEl("join");
  joinButtonEl.onclick = () =>
    joinGame(`${codeEl1.value}-${codeEl2.value}`, usernameInputEl.value);

  var errorEl = document.createElement("div")
  errorEl.id = "error"

  var orEl = document.createElement("div");
  orEl.innerText = "- OR -";
  orEl.classList.add("separator");

  var newGameButtonEl = createButtonEl("create");
  newGameButtonEl.onclick = createGame;

  landingContainerEl.append(
    usernameInputEl,
    gameCodeEl,
    joinButtonEl,
    errorEl,
    orEl,
    newGameButtonEl
  );
  return landingContainerEl;
}
