import { addGameDoc, addPlayerDoc } from "../firebase";
import { navigate } from "../routes";
import {
  createPageContainerEl,
  createTextInputEl,
  createButtonEl,
} from "../utils";
import bg_music from "../../media/audio/bg_music2.mp3";

const joinGame = (id, username) => {
  // console.log(`joinGame: ${id} ${username}`);
  id = id.toLowerCase();
  addPlayerDoc({ id, username }).then(() => {
    var myAudio = new Audio(bg_music);

    myAudio.loop = true;
    myAudio.play();
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
