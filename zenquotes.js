const getQuotes = () =>
  $.getJSON(
    "https://api.quotable.io/random",
    /**
     * @typedef {{ author: string, content: string }} Quotes
     * @param {Quotes} data
     */
    (data, status, xhr) => {
      $("body")
        .append(
          $("<blockquote></blockquote>").append(
            $("<h1></h1>").text(data.content)
          )
        )
        .append(
          $("<h3></h3>")
            .css("text-align", "end")
            .css("margin-right", "40px")
            .text(`- ${data.author}`)
        );
    }
  );

getQuotes();
