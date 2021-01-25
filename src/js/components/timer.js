import { CONTAINER_ID } from "../constants";
import buzzer from "../../media/audio/timeout-buzzer.flac"

function Timer(duration = 0) {
  this.buzzer = new Audio(buzzer)
  this.duration = duration;
  this.timeLeft = this.duration;
  this.interval = () => {};
  this.timerEl = document.createElement("div");
  this.timerEl.id = "timer";
  this.timerEl.innerText = this.timeLeft;

  this.setDuration = (duration) => {
    this.duration = duration;
    this.timeLeft = duration;
  };

  this.start = (duration = this.duration) => {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        if (this.timeLeft === 11) {
          this.buzzer.play();
        }
        this.timeLeft--;
        this.timerEl.innerText = this.timeLeft
      } else {
        this.stop();
        this.timeoutListener();
      }
    }, 1000);
  };

  this.stop = () => {
    clearInterval(this.interval);
    this.reset();
  };

  this.pause = () => {
    clearInterval(this.interval);
  };

  this.reset = () => {
    this.timeLeft = this.duration;
  };

  this.render = () => {
    document.getElementById(CONTAINER_ID).append(this.timerEl);
  };

  this.timeoutListener = function (val) {};

  this.ontimeout = function (callback) {
    this.timeoutListener = callback;
  };
}

export default Timer;
