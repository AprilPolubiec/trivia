import firebase from "firebase/app";
import "firebase/firestore";
import { generateGameID, generateTriviaQuestions } from "./utils";

const firebaseConfig = {
  apiKey: "AIzaSyBpfldqu40PdUQchxvlUh33EUK9S91bTLo",
  authDomain: "trivia-b67e1.firebaseapp.com",
  databaseURL: "https://trivia-b67e1-default-rtdb.firebaseio.com",
  projectId: "trivia-b67e1",
  storageBucket: "trivia-b67e1.appspot.com",
  messagingSenderId: "734274771672",
  appId: "1:734274771672:web:afc2aa6c6e46b3271255ad",
  measurementId: "G-PLJFMDYJP5",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const gameCollection = db.collection("games");
export const gameDoc = (id) => gameCollection.doc(id);

export const playersCollection = (id) => gameDoc(id).collection("players");

export const addGameDoc = async (host) => {
  // Generate new game ID
  const id = generateGameID();
  const questions = await generateTriviaQuestions();
  console.log(id, questions);
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
    .catch((err) => console.log(err));
};

//TODO: make sure player name doesn't already exist
export const addPlayerDoc = ({ id, username }) => {
  return playersCollection(id).doc(username).set({ username, score: 0 });
};

export const setCurrentQuestion = (id, index) => {
  return gameDoc(id).set({ current_question: index }, { merge: true });
};

export const increasePlayerScore = ({ id, username, amount }) => {
  return playersCollection(id)
    .doc(username)
    .update({ score: firebase.firestore.FieldValue.increment(amount) });
};
