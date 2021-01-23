import { playersCollection, gameDoc, setCurrentQuestion } from "../firebase";
import { navigate } from "../routes";
import {
  createPageContainerEl,
  createPlayerListEl,
  createButtonEl,
} from "../utils";

export default function Lobby({ id, username }) {
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
    setCurrentQuestion(id, 0).then(() => {
      //TODO: use localStorage for username
      navigate("question", { id, username });
    });
  };


  gameDoc(id)
    .get()
    .then((doc) => {
      console.log(doc.data().current_question);
      const isGameInProgress =
        doc.data().current_question !== null &&
        doc.data().current_question >= 0;
      if (isGameInProgress) {
        if (username === doc.data().host) {
          setCurrentQuestion(id, doc.data().current_question + 1).then(() => {
            setTimeout(() => navigate("question", { id, username }), 2000);
          });
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
