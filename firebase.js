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

const getUser = (idToken) => {
  $.ajax({
    url: "https://nestjs-airtable.herokuapp.com/firebase/user",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
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

const getExperience = (idToken) => {
  $.ajax({
    url: "https://nestjs-airtable.herokuapp.com/firebase/user/experiences",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    user.getIdToken().then((idToken) => {
      getUser(idToken);
      getExperience(idToken);
    });
  } else {
    document.location.href = "/login";
  }
});

$("#app__logout").on("click", async (ev) => {
  await signOut(auth);
  document.location.href = "/login";
});
