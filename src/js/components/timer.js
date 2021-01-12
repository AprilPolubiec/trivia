import { CONTAINER_EL } from "../constants";

function Timer(duration = 0) {
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
        this.timeLeft--;
        console.log(this.timeLeft);
      } else {
        this.stop();
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
    CONTAINER_EL.append(this.timerEl);
  };
}

export default Timer;
