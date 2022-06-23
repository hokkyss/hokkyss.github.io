import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjwArp-f8FLukF9dX2dp596Z5Dx4lm2M8",
  authDomain: "nestjs-firebase-cdf2d.firebaseapp.com",
  databaseURL:
    "https://nestjs-firebase-cdf2d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nestjs-firebase-cdf2d",
  storageBucket: "nestjs-firebase-cdf2d.appspot.com",
  messagingSenderId: "499694483726",
  appId: "1:499694483726:web:3ad97f84cde7dae76aff5f",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const email = $("#login__email");
const password = $("#login__password");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    document.location.href = "/firebase";
  }
});

$("#login__form").on("submit", (ev) => {
  login();
});
const login = async () => {
  await signInWithEmailAndPassword(auth, email.val(), password.val());
};
