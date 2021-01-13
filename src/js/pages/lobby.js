import { playersCollection } from "../firebase";

export default function Lobby({ id, username }) {
  const lobbyEl = document.createElement("div");
  lobbyEl.id = "lobby";
  lobbyEl.innerText = "chillin in da lobs of " + id;

  const playersListEl = document.createElement("ol");
  const addPlayerToList = (username) => {
    const playerEl = document.createElement("li");
    playerEl.innerText = username;
    playersListEl.append(playerEl);
  };
  const unsubsribePlayers = playersCollection(id).onSnapshot((querySnap) => {
    querySnap.docChanges().forEach(function (change) {
      if (change.type === "added") {
        console.log("New player: ", change.doc.data().username);
        addPlayerToList(change.doc.data().username);
      }
      if (change.type === "removed") {
        console.log("Player left: ", change.doc.data());
      }
    });
  });

  lobbyEl.append(playersListEl);
  return lobbyEl;
}

//TODO: add "exit" button
