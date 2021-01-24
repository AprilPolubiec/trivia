import { addGameDoc, addPlayerDoc } from "../firebase";
import { navigate } from "../routes";
import {
  createPageContainerEl,
  createTextInputEl,
  createButtonEl,
} from "../utils";

const joinGame = (id, username) => {
  // console.log(`joinGame: ${id} ${username}`);
  id = id.toLowerCase();
  addPlayerDoc({ id, username }).then(() => {
    navigate("lobby", { id, username });
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
  var codeEl = createTextInputEl("game code");

  var joinButtonEl = createButtonEl("join");
  joinButtonEl.onclick = () => joinGame(codeEl.value, usernameInputEl.value);

  var newGameButtonEl = createButtonEl("create");
  newGameButtonEl.onclick = createGame;

  landingContainerEl.append(
    usernameInputEl,
    codeEl,
    joinButtonEl,
    newGameButtonEl
  );
  return landingContainerEl;
}
