import { playersCollection, gameDoc } from "../firebase";

export default function Lobby({ id, username }) {
  const lobbyEl = document.createElement("div");
  lobbyEl.id = "lobby";
  lobbyEl.innerText = "chillin in da lobs of " + id;

  const playersListEl = document.createElement("ol");

  const addPlayerToList = ({ username, score }) => {
    const playerEl = document.createElement("li");
    playerEl.setAttribute("name", username);

    const usernameEl = document.createElement("div");
    usernameEl.className = "username";
    usernameEl.innerText = username;

    const scoreEl = document.createElement("div");
    scoreEl.className = "score";
    scoreEl.innerText = score;

    playerEl.append(usernameEl, scoreEl);
    playersListEl.append(playerEl);
  };

  const updatePlayerScore = ({ username, score }) => {
    var playerEl = document.getElementsByName(username)[0];
    var scoreEl = playerEl.getElementsByClassName("score")[0];
    scoreEl.innerText = score;
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
      }
    });
  });

  lobbyEl.append(playersListEl);

  const startGame = () => {
    console.log("leggo");
  };
  gameDoc(id)
    .get()
    .then((doc) => {
      const host = doc.data().host;
      if (host === username) {
        //Render start game button
        var startGameButtonEl = document.createElement("button");
        startGameButtonEl.className = "landing-btn";
        startGameButtonEl.innerText = "START";
        startGameButtonEl.onclick = () => startGame();
        lobbyEl.append(startGameButtonEl);
      } else {
        // render please wait for host to start
      }
    });

  return lobbyEl;
}

//TODO: add "exit" button
