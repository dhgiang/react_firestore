import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";

import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";

import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const rrfConfig = {
  userProfile: "users",
  userFirestoreForProfile: true
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

// Check for settings in localStorage
if (localStorage.getItem("settings") == null) {
  // default
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  // set to local storage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// Create initial state
const initialState = {
  settings: JSON.parse(localStorage.getItem("settings"))
};

// Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
