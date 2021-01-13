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

const gameCollection = db.collection("games");

const playersCollection = (id) => gameCollection.doc(id).collection("players");

export const addGameDoc = async () => {
  // Generate new game ID
  const id = generateGameID();
  const questions = await generateTriviaQuestions();
  console.log(id, questions);
  return gameCollection
    .doc(id)
    .set({
      id,
      questions,
    })
    .then(() => {
      return id;
    })
    .catch((err) => console.log(err));
};

export const addPlayerDoc = ({ id, username }) => {
  return playersCollection(id).doc(username).set({ username, score: 0 });
};
