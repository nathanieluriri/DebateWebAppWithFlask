$(document).ready(function () {
  const renderClaims = () => {
    const topicId = $("#data-div").data("topic-id");
    const previewCardImage = $("#data-div").data("preview-card-url");

    console.log(topicId);
    $.get(
      `/get_claims_for_topic/${topicId}`,
      function (data, textStatus, jqXHR) {
        console.log(data);
        const topicsContainer = $(".claim-previews");
        topicsContainer.empty();
        let content = "";

        data.forEach((each) => {
          content += `<div class="claim-preview-card">
          <img
            src="${previewCardImage}"
            alt="claim"
          />
          <div>
            <h3>${each.text}</h3>
            <p class="date">${getDate(each.creationTime)}</p>
          </div>
        </div>`;
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
      }
    );
  };
  renderClaims();
});
