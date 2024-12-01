$(document).ready(function () {
  const topicID = $("#data-div").data("topic-id");
  const previewCardImage = $("#data-div").data("preview-card-url");
  const renderTopicName = () => {
    $.get(`/get_specific_topic/${topicID}`, function (data, textStatus, jqXHR) {
      console.log(data);
      const topicsContainer = $(".claim-previews");
      topicsContainer.empty();
      $(".topic-name").text(data.topicName);
    });
  };
  renderTopicName();
  const renderClaims = () => {
    $.get(
      `/get_claims_for_topic/${topicID}`,
      function (data, textStatus, jqXHR) {
        console.log(data);
        const topicsContainer = $(".claim-previews");
        topicsContainer.empty();
        let content = "";

        data.forEach((each) => {
          content += `<div class="claim-preview-card">
          <div class='img-container'>
          <img
            src="${previewCardImage}"
            alt="claim"
          />
          </div>
          <div class='text-container'>
            <h3><a href='/${topicID}/${each.claimID}' >${each.text}</a></h3>
            <p class="date">${getDate(each.creationTime)}</p>
          </div>
        </div>`;
        });

        topicsContainer.append(content);
      }
    );
  };
  renderClaims();

  $("#create-claim-btn").on("click", () => {
    if (isLoggedIn) {
      $("[data-modal-id='create-claim']").fadeIn();
    } else {
      $("[data-modal-id='login']").fadeIn();
    }
  });

  $("#create-claim-form").on("submit", function (e) {
    e.preventDefault();
    const thisForm = $(this);
    let data = serializeFormData(thisForm);

    console.log("Serialized data:", data);
    data = JSON.parse(data);
    data.topicID = topicID;
    data.userID = getCookie("userID");
    data = JSON.stringify(data);
    $.post({
      url: "/create_claim",
      data: data, // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        thisForm[0].reset();

        alert("Claim Created Successfully");
        renderClaims();
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  });
});
