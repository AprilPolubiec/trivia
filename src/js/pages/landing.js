import { addGameDoc, addPlayerDoc } from "../firebase";
import { navigate } from "../routes";

const joinGame = (id, username) => {
  console.log(`joinGame: ${id} ${username}`);
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
