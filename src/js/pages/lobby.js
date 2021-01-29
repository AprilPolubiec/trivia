import {
  playersCollection,
  gameDoc,
  setCurrentQuestion,
  exitGame,
} from "../firebase";
import { navigate } from "../routes";
import {
  createPageContainerEl,
  createPlayerListEl,
  createButtonEl,
} from "../utils";
import { CONTAINER_ID } from "../constants";
import {
  greetPlayer,
  announceNewPlayer,
  announceCurrentScores,
  greetHost,
  announcePlayerHasLeft,
} from "../audio";
import { exitIcon } from "../icons";

export default function Lobby({ id, username }) {
  console.log("rendering lobby");
  id = id.toLowerCase();
  const lobbyEl = createPageContainerEl("lobby");

  const containerEl = document.getElementById(CONTAINER_ID);
  const exitButtonEl = document.createElement("div");
  exitButtonEl.id = "exit";
  exitButtonEl.innerHTML = exitIcon;
  exitButtonEl.onclick = () => {
    exitGame({ id, username });
    navigate("landing");
  };
  containerEl.append(exitButtonEl);

  const textEl = document.createElement("div");
  textEl.id = "subtitle";
  textEl.innerText = "Waiting on players...";

  const gameIdEl = document.createElement("div");
  gameIdEl.id = "game-id";
  gameIdEl.innerText = id.toUpperCase();

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

  var isFirstSnap = true;
  var players = [];
  const unsubscribePlayers = playersCollection(id).onSnapshot((querySnap) => {
    querySnap.docChanges().forEach(function (change) {
      const data = change.doc.data();
      if (change.type === "added") {
        console.log("New player: ", data.username);
        if (!isFirstSnap) {
          announceNewPlayer(data.username);
        }
        addPlayerToList(data);
        players.push(data.username);
      }
      if (change.type === "modified") {
        console.log("Modified player: ", data);
        // If played has signed back in, add to lobby list
        if (data.online && !players.includes(data.username)) {
          addPlayerToList(data);
          announceNewPlayer(data.username);
          players.push(data.username);
        } else if (!data.online && players.includes(data.username)) {
          // User has signed out
          removePlayerFromList(data);
          announcePlayerHasLeft(data.username);
          players.splice(players.indexOf(data.username), 1);
        } else {
          updatePlayerScore(data);
        }
      }
      // if (change.type === "removed") {
      //   //TODO: handle leaving
      //   console.log("Player left: ", data);
      //   removePlayerFromList(data);
      // }
    });
    isFirstSnap = false;
  });

  var current_question = -1;
  const unsubscribeCurrentQuestion = gameDoc(id).onSnapshot((snap) => {
    if (current_question === -1) {
      current_question = snap.data().current_question;
      return;
    }
    console.log("unsubscribeCurrentQuestion: ", snap.data());
    navigate("question", { id, username });
    unsubscribePlayers();
    unsubscribeCurrentQuestion();
  });

  const startGame = () => {
    setCurrentQuestion(id, 0);
  };

  gameDoc(id)
    .get()
    .then((doc) => {
      const isHost = username === doc.data().host;
      const isGameInProgress =
        doc.data().current_question !== null &&
        doc.data().current_question >= 0;
      const isFinalQuestion =
        doc.data().current_question === doc.data().questions.length - 1;
      if (isGameInProgress) {
        lobbyEl.append(gameIdEl, playersListEl);
        // sortPlayersByScore()
        doc.ref
          .collection("players")
          .orderBy("score", "desc")
          .get()
          .then((collectionQuery) => {
            const scores = collectionQuery.docs.map((doc) => {
              return { username: doc.id, score: doc.data().score };
            });
            //sort scores
            return announceCurrentScores(scores);
          })
          .then(() => {
            if (isHost) {
              // TODO: handle end of game
              if (isFinalQuestion) {
                // announceWinner
              } else {
                setTimeout(() => {
                  setCurrentQuestion(id, doc.data().current_question + 1);
                }, 5000);
              }
            }
          });
      } else {
        if (isHost) {
          greetHost(username, id);
        } else {
          greetPlayer(username);
        }
        lobbyEl.append(gameIdEl, textEl, playersListEl);

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
