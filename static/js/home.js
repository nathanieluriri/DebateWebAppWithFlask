$(document).ready(function () {
  let isLoggedIn = Boolean(getCookie("isLoggedIn"));
  const renderTopics = () => {
    $.get("/get_all_topics", function (data, textStatus, jqXHR) {
      console.log(data);
      const topicsContainer = $(".topics-section__topics");
      topicsContainer.empty();
      let content = "";
      data.forEach((each) => {
        content += `<a href="/${each.topicID}" class="btn btn-primary btn-hollow">${each.topicName}</a>`;
      });

      const addTopicButton = $("<button>")
        .text("+ Add Topic")
        .attr("id", "add-topic-btn")
        .attr("class", "btn btn-primary text-white")
        .on("click", () => {
          if (isLoggedIn) {
            $("[data-modal-id='create-topic']").fadeIn();
          } else {
            $("[data-modal-id='login']").fadeIn();
          }
        });
      topicsContainer.append(content);
      topicsContainer.append(addTopicButton);
    });
  };

  renderTopics();
});
