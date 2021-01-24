import { playersCollection, gameDoc, setCurrentQuestion } from "../firebase";
import { navigate } from "../routes";
import {
  createPageContainerEl,
  createPlayerListEl,
  createButtonEl,
} from "../utils";

export default function Lobby({ id, username }) {
  id = id.toLowerCase();
  const lobbyEl = createPageContainerEl("lobby");

  const gameIdEl = document.createElement("div");
  gameIdEl.id = "game-id";
  gameIdEl.innerText = id.toUpperCase();
  lobbyEl.append(gameIdEl);

  const playersListEl = document.createElement("ol");
  playersListEl.id = "player-list";
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

  const unsubscribePlayers = playersCollection(id).onSnapshot((querySnap) => {
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

  var current_question = -1;
  const unsubscribeCurrentQuestion = gameDoc(id).onSnapshot((snap) => {
    if (current_question === -1) {
      current_question = snap.data().current_question;
      return;
    }
    navigate("question", { id, username });
    unsubscribePlayers();
    unsubscribeCurrentQuestion();
  });

  lobbyEl.append(playersListEl);

  const startGame = () => {
    setCurrentQuestion(id, 0);
  };

  gameDoc(id)
    .get()
    .then((doc) => {
      const isGameInProgress =
        doc.data().current_question !== null &&
        doc.data().current_question >= 0;
      if (isGameInProgress) {
        if (username === doc.data().host) {
          setTimeout(() => {
            setCurrentQuestion(id, doc.data().current_question + 1);
          }, 5000);
        }
      } else {
        const host = doc.data().host;
        if (host === username) {
          //Render start game button
          var startGameButtonEl = createButtonEl("start");
          startGameButtonEl.onclick = () => startGame();
          lobbyEl.append(startGameButtonEl);
        } else {
          // render please wait for host to start
          var waitForHostEl = document.createElement("div");
          waitForHostEl.innerText = "Please wait for host to start game";
          lobbyEl.append(waitForHostEl);
        }
      }
    });

  return lobbyEl;
}

//TODO: add "exit" button
