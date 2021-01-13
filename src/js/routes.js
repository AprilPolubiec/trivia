import { CONTAINER_EL } from "./constants";
import Landing from "./pages/landing";
import Lobby from "./pages/lobby";

const routes = {
  landing: Landing,
  lobby: Lobby,
};

export const redirect = (destination) => {
  document
    .getElementById("container")
    .removeChild(document.getElementById("container").childNodes[0]);
  document.getElementById("container").append(routes[destination]);
};
