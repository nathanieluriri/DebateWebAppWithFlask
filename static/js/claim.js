$(document).ready(function () {
  const topicID = $("#data-div").data("topic-id");
  const firstClaimID = $("#data-div").data("first-claim-id");
  const secondClaimID = $("#data-div").data("second-claim-id");
  const profileIconImage = $("#data-div").data("profile-icon-url");
  console.log(firstClaimID);
  console.log(secondClaimID);
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
    if (secondClaimID) {
      $.post({
        url: `/get_related_claims`,
        data: JSON.stringify({ first_claim_id: firstClaimID }),
        success: function (data, textStatus, jqXHR) {
          const container = $(".claim.main");
          // topicsContainer.empty();
          container.empty();
          const thisClaim = data.find((each) => each.claimId == secondClaimID);
          let content = `   
           <div class="header">
          <div class="user">
              <img
              src="${profileIconImage}"
              alt="user icon"
              />
              <div class="data">
              <a href="#">${thisClaim.username}</a>
              <span>${getDate(thisClaim.creationTime)}</span>
              </div>
          </div>
        <button>30 Replies</button>
      </div>
      <h3>${thisClaim?.text}</h3>`;
          console.log(thisClaim);

          container.append(content);
        },
        contentType: "application/json", // Specify content type as JSON
        dataType: "json", // Specify expected response data type
      });
    } else {
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
    }
  };
  renderParentClaim();

  const renderRelatedClaims = () => {
    let relatedClaims = [];
    let equivalentClaims = "";
    let opposingClaims = "";
    if (secondClaimID) {
      $.post({
        url: "/get_related_claims",
        data: JSON.stringify({ first_claim_id: secondClaimID }), // Send the JSON string as data
        success: function (data, textStatus, jqXHR) {
          relatedClaims = data;
          console.log(data);
          relatedClaims.forEach((each, index, array) => {
            if (each.relationshipType == "Equivalent") {
              equivalentClaims += `      <div class="claim equivalent">
                  <div class="header">
                    <div class="user">
                      <img
                        src="${profileIconImage}"
                        alt="user icon"
                      />
                      <div class="data">
                        <a href="#">${each.username}</a>
                        <span>${getDate(each.creationTime)}</span>
                      </div>
                    </div>
          
                    <button>30 Replies</button>
                  </div>
                  <h3 class="heading"><a href="/${topicID}/${
                secondClaimID || firstClaimID
              }/${each.claimId}">${each.text}</a></h3>
                <div class='replies-cotainer hidden'>
                <div class=" replies ">
                </div>
                </div>
          
                </>`;
            } else {
              opposingClaims += `   <div class="claim opposition">
                  <div class="header">
                    <div class="user">
                      <img
                        src="${profileIconImage}"
                        alt="user icon"
                      />
                      <div class="data">
                        <a href="#">${each.username}</a>
                        <span>${getDate(each.creationTime)}</span>
                      </div>
                    </div>
          
                    <button>30 Replies</button>
                  </div>
                  <h3 class="heading"><a href="/${topicID}/${
                secondClaimID || firstClaimID
              }/${each.claimId}">${each.text}</a></h3>
                </div>`;
            }
          });
          $("#opposing-claims").append(opposingClaims);
          $("#equivalent-claims").append(equivalentClaims);
        },
        error: function (jqXHR) {
          alert(jqXHR.responseJSON.error || "Something went wrong.");
        },
        contentType: "application/json", // Specify content type as JSON
        dataType: "json", // Specify expected response data type
      });
    } else {
      $.post({
        url: "/get_related_claims",
        data: JSON.stringify({ first_claim_id: firstClaimID }), // Send the JSON string as data
        success: function (data, textStatus, jqXHR) {
          relatedClaims = data;
          console.log(data);
          relatedClaims.forEach((each, index, array) => {
            if (each.relationshipType == "Equivalent") {
              equivalentClaims += `      <div class="claim equivalent">
                  <div class="header">
                    <div class="user">
                      <img
                        src="${profileIconImage}"
                        alt="user icon"
                      />
                      <div class="data">
                        <a href="#">${each.username}</a>
                        <span>${getDate(each.creationTime)}</span>
                      </div>
                    </div>
          
                    <button>30 Replies</button>
                  </div>
                  <h3 class="heading"><a href="/${topicID}/${
                secondClaimID || firstClaimID
              }/${each.claimId}">${each.text}</a></h3>
                <div class='replies-cotainer hidden'>
                <div class=" replies ">
                </div>
                </div>
          
                </>`;
            } else {
              opposingClaims += `   <div class="claim opposition">
                  <div class="header">
                    <div class="user">
                      <img
                        src="${profileIconImage}"
                        alt="user icon"
                      />
                      <div class="data">
                        <a href="#">${each.username}</a>
                        <span>${getDate(each.creationTime)}</span>
                      </div>
                    </div>
          
                    <button>30 Replies</button>
                  </div>
                  <h3 class="heading"><a href="/${topicID}/${
                secondClaimID || firstClaimID
              }/${each.claimId}">${each.text}</a></h3>
                </div>`;
            }
          });
          $("#opposing-claims").append(opposingClaims);
          $("#equivalent-claims").append(equivalentClaims);
        },
        error: function (jqXHR) {
          alert(jqXHR.responseJSON.error || "Something went wrong.");
        },
        contentType: "application/json", // Specify content type as JSON
        dataType: "json", // Specify expected response data type
      });
    }
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
    data.claimID = secondClaimID || firstClaimID;
    data.userID = getCookie("userID");
    data = JSON.stringify(data);
    $.post({
      url: "/create_claim_relationship",
      data: data, // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        thisForm[0].reset();

        alert("Claim Created Successfully");
        renderRelatedClaims();
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  });
});
