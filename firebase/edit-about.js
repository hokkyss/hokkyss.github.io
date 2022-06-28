import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
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

/**
 * @typedef {{ id: string, avatar: string, name: string }} Company
 * @typedef {{ id: string, description: string, position: string, start: string, end: string | null, company: Company }} Experience
 * @typedef {{
 *    about: string,
 *    avatar: string,
 *    connections: number
 *    location: string,
 *    name: string,
 *    role: string,
 *    uid: string,
 *    username: string,
 * }} User
 */

let search = document.location.search;
if (search[0] === "?") {
  search = search.slice(1);
}
const queries = search.split("&");
/**
 * @type {Record<string, string>}
 */
const searchQuery = {};
for (var query of queries) {
  const [key, value] = query.split("=");
  searchQuery[key] = decodeURIComponent(value);
}

if (searchQuery["user"]) {
  //
} else {
  location.href = "/firebase/profile";
}

const editUser = (uid, idToken, about) => {
  const ajax = $.ajax({
    url: "https://nestjs-airtable.herokuapp.com/firebase/user",
    headers: { Authorization: `Bearer ${idToken}` },
    success: (data, status, xhr) => {
      location.href = `/firebase/profile?user=${encodeURIComponent(uid)}`;
    },
    method: "PATCH",
    data: { about: about },
  });
  ajax.send();
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    //
  } else {
    location.href = "/firebase/login";
  }
});

const newAbout = $("#edit-about__text");
$("#edit-about__form").on("submit", (ev) => {
  ev.preventDefault();
  auth.currentUser
    .getIdToken()
    .then((idToken) => editUser(searchQuery["user"], idToken, newAbout.val()));
});
