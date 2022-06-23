/**
 * @typedef {{
 *      id: string,
 *      url: string,
 *      filename: string
 * }} Attachment
 * @typedef {{
 *      location: string,
 *      experiences: string[],
 *      about: string,
 *      role: string,
 *      name: string,
 *      avatar: Attachment,
 *      username: string
 * }} User
 * @typedef {{ name: string, avatar: Attachment }} Company
 * @typedef {{
 *      position: string,
 *      description: string,
 *      start: string,
 *      companyAvatar: Attachment[],
 *      companyName: string[]
 * }} Experience
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

const baseUrl = "https://api.airtable.com/v0/appcXoRcnydxRrALx";
const apiKey = "api_key=keyeKtCQMXivCRyRl";

const getData = () => {
  $.get(
    `${baseUrl}/user/recGhtuqR4fh9mvZQ?${apiKey}`,
    /**
     *
     * @param {{ id: string, createdTime: string, fields: User }} data
     */
    (data, status, xhr) => {
      $("#user-avatar").attr("src", data.fields.avatar[0].url);
      $("#user-name").text(data.fields.name);
      $("#user-role").text(data.fields.role);
      $("#user-location").text(
        `${data.fields.location} · ${data.fields.connections} connections`
      );
      $("#about-section").append($("<p></p>").text(data.fields.about));

      const experienceSection = $("#experience-section");
      // const OR_CONDITION = `OR(${data.fields.experiences
      //   .map((e) => `{id} = "${e}"`)
      //   .join(", ")})`;
      data.fields.experiences.forEach((e) =>
        $.get(
          `${baseUrl}/experiences/${e}?${apiKey}`,
          /**
           * @param {{ id: string, createdTime: string, fields: Experience }} experience
           */
          (experience, status, xhr) => {
            experienceSection.append(
              $(`<div role="listitem" class="w-dyn-item">
                <div class="education__card">
                  <img
                    alt=""
                    loading="lazy"
                    src="${experience.fields.companyAvatar[0].url}"
                    class="experience__image circle"
                  />
                  <div class="div-block-4">
                    <h4 class="experience__position">
                      ${experience.fields.position}
                    </h4>
                    <p class="experience__description">${
                      experience.fields.companyName[0]
                    }</p>
                    <p class="experience__description">
                      ${experience.fields.description}
                    </p>
                    <div class="div-block-5">
                      <p class="experience__date">${formatDate(
                        experience.fields.start
                      )}</p>
                      <p class="experience__date">-</p>
                      <p
                        class="experience__date"
                      >${formatDate(experience.fields.end)}</p>
                    </div>
                  </div>
                </div>
              </div>`)
            );
          }
        )
      );
    }
  );
};

getData();
