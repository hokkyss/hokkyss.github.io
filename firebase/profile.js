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

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * @param {string | null} date
 */
const formatDate = (date) => {
  if (date) {
    const obj = new Date(date);
    return `${months[obj.getMonth()]} ${obj.getDate()}, ${obj.getFullYear()}`;
  }
  return "Present";
};

const getUser = (uid) => {
  $.ajax({
    url: `https://nestjs-airtable.herokuapp.com/firebase/users/${uid}`,
    /**
     * @param {User} data
     */
    success: (data, status, xhr) => {
      $("#user-avatar").attr("src", data.avatar);
      $("#user-name").text(data.name);
      $("#user-role").text(data.role);
      $("#user-location").text(
        `${data.location} · ${data.connections} connections`
      );
      $("#about-section").append($("<p></p>").text(data.about));
    },
  });
};

const getExperience = (uid) => {
  $.ajax({
    url: `https://nestjs-airtable.herokuapp.com/firebase/users/${uid}/experiences`,
    /**
     * @param {Experience[]} data
     */
    success: (data, status, xhr) => {
      const experienceSection = $("#experience-section");

      data.forEach((exp) => {
        experienceSection.append(
          $(`<div role="listitem" class="w-dyn-item">
            <div class="education__card">
              <img
                alt=""
                loading="lazy"
                src="${exp.company.avatar}"
                class="experience__image circle"
              />
              <div class="div-block-4">
                <h4 class="experience__position">
                  ${exp.position}
                </h4>
                <p class="experience__description">${exp.company.name}</p>
                <p class="experience__description">
                  ${exp.description}
                </p>
                <div class="div-block-5">
                  <p class="experience__date">${formatDate(exp.start)}</p>
                  <p class="experience__date">-</p>
                  <p
                    class="experience__date"
                  >${formatDate(exp.end)}</p>
                </div>
              </div>
            </div>
          </div>`)
        );
      });
    },
  });
};

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

console.log(searchQuery);

if (searchQuery["user"]) {
  getUser(searchQuery["user"]);
  getExperience(searchQuery["user"]);
} else {
  location.search = "user=7zieRJJ4tfZ3VsX9gLLRynrLdZY2";
}

const logoutButtonSelector = $("<button></button>")
  .attr("id", "app__logout")
  .text("Logout")
  .on("click", async (ev) => {
    await signOut(auth);
    document.location.href = "/firebase/login";
  });

const editAboutButtonSelector = $("<button></button>")
  .attr("id", "edit__about__button")
  .text("Edit About")
  .on("click", (ev) => {
    document.location.href = `/firebase/edit-about?user=${auth.currentUser.uid}`;
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    $("#app__nav__items").append(logoutButtonSelector);
    $("#about-section").append(editAboutButtonSelector);
  } else {
    $("#app__nav__items").remove(logoutButtonSelector);
    $("#about-section").remove(editAboutButtonSelector);
  }
});
