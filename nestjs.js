/**
 * @typedef {{ id: string, avatar: string, name: string }} Company
 * @typedef {{ id: string, description: string, position: string, start: string, end: string | null, company: Company }} Experience
 * @typedef {{
 *    id: string,
 *    experiences: string[],
 *    experienceObjects: Experience[],
 *    location: string,
 *    name: string,
 *    username: string,
 *    role: string,
 *    avatar: string,
 *    about: string
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
const getUser = () => {
  $.getJSON(
    "https://nestjs-airtable.herokuapp.com/users/recGhtuqR4fh9mvZQ",
    /**
     * @param {User} data
     */
    (data, status, xhr) => {
      //   const preElement = $("<pre></pre>").append(JSON.stringify(data, null, 2));
      //   $("body").append(preElement);

      const aboutElement = $("<p></p>").text(data.about);
      $("#about-section").append(aboutElement);

      const experienceSection = $("#experience-section");
      data.experienceObjects.forEach((exp) => {
        console.log(formatDate(exp.end));
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
    }
  );
};

getUser();