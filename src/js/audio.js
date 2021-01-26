import buzzerFile from "../media/audio/timeout-buzzer.flac";
import bgMusicFile from "../media/audio/bg_music2.mp3";

export const playBuzzer = () => {
  const buzzer = new Audio(buzzerFile);
  buzzer.play();
};

export const startBackgroundMusic = () => {
  console.log("starting bg music");
  const bg_music = new Audio(bgMusicFile);
  bg_music.loop = true;
  bg_music.play();
};

const speechSynthesis = window.speechSynthesis;
const getVoices = () => {
  return new Promise((resolve, reject) => {
    let id;

    id = setInterval(() => {
      if (speechSynthesis.getVoices().length !== 0) {
        resolve(speechSynthesis.getVoices());
        clearInterval(id);
      }
    }, 10);
  });
};

export const announceNewPlayer = (username) => {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();

    getVoices().then((voices) => {
      var voice = voices.filter(function (voice) {
        return voice.name === "Google UK English Female";
      })[0];
      var text = `${username} has entered the lobby.`;

      var speech = new SpeechSynthesisUtterance(text);
      speech.volume = 1;
      speech.voice = voice;
      speech.text = text;
      speech.lang = "en-US";
      speechSynthesis.speak(speech);
      speech.onend = () => {
        resolve();
      };
    });
  });
};

export const callOutPlayer = (username) => {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();

    getVoices().then((voices) => {
      var voice = voices.filter(function (voice) {
        return voice.name === "Google UK English Female";
      })[0];
      var text = `Hey ${username}! Where do you think you're going? You're not cheating are you? I told you I would know! You really thought I wouldn't notice?`;

      var speech = new SpeechSynthesisUtterance(text);
      speech.volume = 1;
      speech.voice = voice;
      speech.text = text;
      speech.lang = "en-US";
      speechSynthesis.speak(speech);
      speech.onend = () => {
        // synthesis.cancel()
        resolve();
      };
    });
  });
};

export const greetPlayer = (username) => {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();

    getVoices().then((voices) => {
      var voice = voices.filter(function (voice) {
        return voice.name === "Google UK English Female";
      })[0];
      var text = `Welcome to trivia ${username}! The game will start whenever the host is ready. Hang tight! And remember, if you even dare try to cheat during this game - I... Will... Know...`;

      var speech = new SpeechSynthesisUtterance(text);
      speech.volume = 1;
      speech.voice = voice;
      speech.text = text;
      speech.lang = "en-US";
      speechSynthesis.speak(speech);
      speech.onend = () => {
        // synthesis.cancel()
        resolve();
      };
    });
  });
};

export const announceCorrectAnswer = (correct_answer, is_player_correct) => {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();

    getVoices().then((voices) => {
      console.log(voices);
      var voice = voices.filter(function (voice) {
        return voice.name === "Google UK English Female";
      })[0];
      var text = `Time's up! The correct answer is ${correct_answer}.`;
      if (is_player_correct) {
        text += "Nice job!";
      } else {
        text += "Oof... maybe next time";
      }
      text += "Let's see how your friends did";
      var speech = new SpeechSynthesisUtterance(text);
      speech.volume = 1;
      speech.voice = voice;
      speech.text = text;
      speech.lang = "en-US";
      speechSynthesis.speak(speech);
      speech.onend = () => {
        // synthesis.cancel()
        resolve();
      };
    });
  });
};

export const announceCurrentScores = (scores) => {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();

    getVoices().then((voices) => {
      var voice = voices.filter(function (voice) {
        return voice.name === "Google UK English Female";
      })[0];
      var text = `In the lead we've got ${scores[0].username} with ${scores[0].score} points. Following behind we have ${scores[1].username} with ${scores[1].score} points and ${scores[2].username} with ${scores[2].score} points.`;

      var speech = new SpeechSynthesisUtterance(text);
      speech.volume = 1;
      speech.voice = voice;
      speech.text = text;
      speech.lang = "en-US";
      speechSynthesis.speak(speech);
      speech.onend = () => {
        // synthesis.cancel()
        resolve();
      };
    });
  });
};
