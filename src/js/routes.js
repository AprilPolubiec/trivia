import Landing from "./pages/landing";
import Lobby from "./pages/lobby";

import { CONTAINER_ID } from "./constants";

const routes = {
  landing: Landing,
  lobby: Lobby,
};

const container = document.getElementById(CONTAINER_ID);

export const navigate = (destination, params) => {
  if (container.childNodes[0]) {
    container.replaceChild(routes[destination](params), container.childNodes[0]);
  } else {
    container.appendChild(routes[destination](params))
  }
};
