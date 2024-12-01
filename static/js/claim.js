$(document).ready(function () {
  const topicID = $("#data-div").data("topic-id");
  const firstClaimID = $("#data-div").data("first-claim-id");
  const secondClaimID = $("#data-div").data("second-claim-id");
  const profileIconImage = $("#data-div").data("profile-icon-url");

  // const renderParentClaim = () => {
  //   $.get(`/get_related_claims/${topicID}`, function (data, textStatus, jqXHR) {
  //     console.log(data);
  //     const topicsContainer = $(".claim-previews");
  //     topicsContainer.empty();
  //     $(".topic-name").text(data.topicName);
  //   });
  // };
  // renderParentClaim();
  const renderParentClaim = () => {
    $.get(
      `/get_claims_for_topic/${topicID}`,
      function (data, textStatus, jqXHR) {
        const container = $(".claim.main");
        // topicsContainer.empty();
        container.empty();
        console.log(firstClaimID);
        const thisClaim = data.find((each) => each.claimID == firstClaimID);
        let content = `   
         <div class="header">
        <div class="user">
            <img
            src="${profileIconImage}"
            alt="user icon"
            />
            <div class="data">
            <a href="#">Username</a>
            <span>${getDate(thisClaim.creationTime)}</span>
            </div>
        </div>
      <button>30 Replies</button>
    </div>
    <h3>${thisClaim?.text}</h3>`;
        console.log(thisClaim);

        container.append(content);
      }
    );
  };
  renderParentClaim();

  const renderRelatedClaims = () => {
    $.post({
      url: "/get_related_claims",
      data: JSON.stringify({ first_claim_id: firstClaimID }), // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        console.log(data);
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  };

  renderRelatedClaims();

  $(".create-child-claim-btn").on("click", () => {
    console.log("afad");
    if (isLoggedIn) {
      $("[data-modal-id='create-child-claim']").fadeIn();
    } else {
      $("[data-modal-id='login']").fadeIn();
    }
  });

  $("#create-child-claim-form").on("submit", function (e) {
    e.preventDefault();
    const thisForm = $(this);
    let data = serializeFormData(thisForm);

    console.log("Serialized data:", data);
    data = JSON.parse(data);
    data.topicID = topicID;
    data.first = firstClaimID;
    data.userID = getCookie("userID");
    data = JSON.stringify(data);
    $.post({
      url: "/create_claim_relationship",
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
