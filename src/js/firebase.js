import firebase from "firebase/app";
import "firebase/firestore";
import { generateGameID, generateTriviaQuestions } from "./utils";

const CONFIG = require("../.config")

const firebaseConfig = CONFIG.firebase;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const gameCollection = db.collection("games");
export const gameDoc = (id) => gameCollection.doc(id.toLowerCase());

export const playersCollection = (id) =>
  gameDoc(id.toLowerCase()).collection("players");

export const addGameDoc = async (host) => {
  // Generate new game ID
  var id, is_unique_id;
  while (!is_unique_id) {
    // console.log("Not a unique id... trying again");
    id = generateGameID();
    var doc = await gameDoc(id).get();
    is_unique_id = !doc.exists;
  }
  const questions = await generateTriviaQuestions();
  // console.log(id, questions);
  return gameDoc(id)
    .set({
      id,
      questions,
      host,
      current_question: null,
    })
    .then(() => {
      return id;
    })
    .catch((err) => console.error(err));
};

export const addPlayerDoc = ({ id, username }) => {
  id = id.toLowerCase();
  return gameDoc(id)
    .get()
    .then((gameDoc) => {
      if (gameDoc.exists) {
        return playersCollection(id)
          .doc(username)
          .get()
          .then((docRef) => {
            if (docRef.exists) {
              if (!docRef.data().online) {
                return docRef.ref.update({ online: true });
              } else {
                return Promise.reject("Username is taken");
              }
            } else {
              return docRef.ref.set({ username, score: 0, online: true });
            }
          });
      } else {
        return Promise.reject("Game does not exist");
      }
    });
};

export const setCurrentQuestion = (id, index) => {
  id = id.toLowerCase();
  return gameDoc(id).set({ current_question: index }, { merge: true });
};

export const increasePlayerScore = ({ id, username, amount }) => {
  id = id.toLowerCase();
  return playersCollection(id)
    .doc(username)
    .update({ score: firebase.firestore.FieldValue.increment(amount) });
};

export const exitGame = ({ id, username }) => {
  return playersCollection(id).doc(username).update({ online: false });
};
