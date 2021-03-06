import buzzerFile from "../media/audio/timeout-buzzer.flac";
import bgMusicFile from "../media/audio/bg_music2.mp3";
import correctSoundFile from "../media/audio/correct.wav";
import incorrectSoundFile from "../media/audio/incorrect.mp3";
import fanfareSoundFile from "../media/audio/fanfare.mp3";
import drumrollSoundFile from "../media/audio/drumroll.wav";

export const playBuzzer = () => {
  const buzzer = new Audio(buzzerFile);
  try {
    buzzer.play();
  } catch {
    console.error("Audio disabled");
  }
};

export const startBackgroundMusic = () => {
  // console.log("starting bg music");
  const bg_music = new Audio(bgMusicFile);
  bg_music.loop = true;
  try {
    bg_music.play();
  } catch {
    console.error("Audio disabled");
  }
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

const speak = (text) => {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();

    getVoices().then((voices) => {
      var voice = voices.filter(function (voice) {
        return voice.name === "Google UK English Female";
      })[0];

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

export const announceNewPlayer = (username) => {
  return speak(`${username} has joined the game.`);
};

export const announcePlayerHasLeft = (username) => {
  return speak(`${username} has left the game.`);
};

export const callOutPlayer = (username) => {
  return speak(
    `Hey ${username}! Where do you think you're going? You're not cheating are you? I told you I would know! You really thought I wouldn't notice?`
  );
};

export const greetPlayer = (username) => {
  return speak(
    `Welcome to trivia ${username}! The game will start whenever the host is ready. Hang tight!`
  );
};

export const greetHost = (username, id) => {
  return speak(
    `Welcome to trivia ${username}! Your game code is ${id}. Share this code with your friends and press start when everybody has joined.`
  );
};

export const announceCorrectAnswer = (
  correct_answer,
  is_player_correct,
  highlightCorrectAnswer
) => {
  return speak("Time's up! The correct answer is")
    .then(() => {
      const sound_effect = is_player_correct
        ? new Audio(correctSoundFile)
        : new Audio(incorrectSoundFile);
      try {
        sound_effect.play();
      } catch {
        console.error("Audio disabled");
      }
      highlightCorrectAnswer(correct_answer);
      return speak(correct_answer);
    })
    .then(() => {
      if (is_player_correct) {
        return speak("Nice job!");
      } else {
        return speak("Sorry... maybe next time");
      }
    });
};

//TODO: fix random error that score could be found on null
export const announceCurrentScores = (scores) => {
  // console.log(scores);
  if (scores.length === 1) {
    return;
  }
  var text;
  const firstPlace = scores[0].score > 0 ? scores[0] : null;

  if (!firstPlace) {
    text =
      "In first place we have... NOBODY! Really? Not a single one of you knew the answer? Yeesh.";
  } else {
    const secondPlace = scores[1].score > 0 ? scores[1] : null;
    const tieForFirst =
      firstPlace && secondPlace && firstPlace.score === secondPlace.score;
    if (tieForFirst) {
      const allTiesForFirst = scores.filter(
        (s) => s.score === firstPlace.score
      );

      var names =
        allTiesForFirst
          .slice(0, allTiesForFirst.length - 1)
          .map((s) => s.username)
          .join(", ") +
        " and " +
        allTiesForFirst[allTiesForFirst.length - 1].username;
      text = `We've got a tie for first! ${names} are tied with a score of ${allTiesForFirst[0].score}.`;
    } else {
      text = `${firstPlace.username} is taking the lead with a score of ${firstPlace.score}.`;
      if (secondPlace) {
        text += `And in second place we have ${secondPlace.username} with ${secondPlace.score} points.`;
      }
    }
  }

  return speak(text);
};

export const readQuestion = (question, index) => {
  return speak(`Question ${index + 1}...`);
};

export const announceWinner = (scores, highlightWinner) => {
  var announcement;
  var winners = [];
  const firstPlace = scores[0].score > 0 ? scores[0] : null;
  if (!firstPlace) {
    announcement = "nobody!";
  } else {
    winners.push(firstPlace);
    const secondPlace = scores[1].score > 0 ? scores[1] : null;
    const tieForFirst =
      firstPlace && secondPlace && firstPlace.score === secondPlace.score;
    if (tieForFirst) {
      const allTiesForFirst = scores.filter(
        (s) => s.score === firstPlace.score
      );

      winners = winners.concat(allTiesForFirst);
      var names =
        allTiesForFirst
          .slice(0, allTiesForFirst.length - 1)
          .map((s) => s.username)
          .join(", ") +
        " and " +
        allTiesForFirst[allTiesForFirst.length - 1].username;
      announcement = `We've got a tie for first! ${names} win with a score of ${allTiesForFirst[0].score}.`;
    } else {
      announcement = `${firstPlace.username} is our winner! Way to go!`;
    }
  }
  return speak(
    "And that was our final question. The winner of today's trivia game is..."
  ).then(() => {
    const drum_roll = new Audio(drumrollSoundFile);
    try {
      drum_roll.play();
    } catch {
      console.error("Audio disabled");
    }
    drum_roll.onended = () => {
      const fanfare = new Audio(fanfareSoundFile);
      try {
        fanfare.play();
      } catch {
        console.error("Audio disabled");
      }
      // highlightWinner(winners);
      return speak(announcement);
    };
  });
};
