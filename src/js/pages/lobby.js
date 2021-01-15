import { playersCollection, gameDoc, setCurrentQuestion } from "../firebase";
import {
  createPageContainerEl,
  createPlayerListEl,
  createButtonEl,
} from "../utils";

import Game from "../components/question";

export default function Lobby({ id, username }) {
  const game = new Game(id);

  const lobbyEl = createPageContainerEl("lobby");
  const playersListEl = document.createElement("ol");

  const addPlayerToList = ({ username, score }) => {
    const playerEl = createPlayerListEl(username, score);
    playersListEl.append(playerEl);
  };

  const updatePlayerScore = ({ username, score }) => {
    var playerEl = document.getElementsByName(username)[0];
    var scoreEl = playerEl.getElementsByClassName("score")[0];
    scoreEl.innerText = score;
  };

  const removePlayerFromList = ({ username }) => {
    var playerEl = document.getElementsByName(username)[0];
    playerEl.remove();
  };

  const unsubsribePlayers = playersCollection(id).onSnapshot((querySnap) => {
    querySnap.docChanges().forEach(function (change) {
      if (change.type === "added") {
        console.log("New player: ", change.doc.data().username);
        addPlayerToList(change.doc.data());
      }
      if (change.type === "modified") {
        console.log("Modified player: ", change.doc.data());
        updatePlayerScore(change.doc.data());
      }
      if (change.type === "removed") {
        console.log("Player left: ", change.doc.data());
        removePlayerFromList(change.doc.data());
      }
    });
  });

  lobbyEl.append(playersListEl);

  const startGame = () => {
    setCurrentQuestion(id, 0).then(() => game.start());
  };

  gameDoc(id)
    .get()
    .then((doc) => {
      const host = doc.data().host;
      if (host === username) {
        //Render start game button
        var startGameButtonEl = createButtonEl("start");
        startGameButtonEl.onclick = () => startGame();
        lobbyEl.append(startGameButtonEl);
      } else {
        // render please wait for host to start
      }
    });

  return lobbyEl;
}

//TODO: add "exit" button
