import Landing from "./pages/landing";
import Lobby from "./pages/lobby";
import Question from "./pages/question";

import { CONTAINER_ID } from "./constants";

const routes = {
  landing: Landing,
  lobby: Lobby,
  question: Question,
};

const container = document.getElementById(CONTAINER_ID);

export const navigate = (destination, params) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  container.appendChild(routes[destination](params));
};
