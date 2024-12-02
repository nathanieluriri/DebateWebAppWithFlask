$(document).ready(function () {
  const renderTopics = () => {
    $.get("/get_all_topics", function (data, textStatus, jqXHR) {
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

  $("#create-topic-form").on("submit", function (e) {
    e.preventDefault();
    const thisForm = $(this);
    const data = serializeFormData(thisForm);
    $.post({
      url: "/create_topic",
      data: data, // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        thisForm[0].reset();

        alert("Topic Created Successfully");
        renderTopics();
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  });
});
