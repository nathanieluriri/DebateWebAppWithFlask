// components
const firstLayerReplyComponent = ({
  imageURL,
  username,
  claimID,
  text,
  reply,
  creationTime,
  claimUserName,
}) => `            <div class="reply">
  <div class="header">
    <div class="user">
      <img src="${imageURL}" alt="user icon" />
      <div class="data">
        <a href="#">${username}</a>
        <span>${getDate(creationTime)}</span>
        <span class="${
          reply?.relationshipType == "Clarification"
            ? "badge-success"
            : reply?.relationshipType == "Supporting Argument"
            ? "badge-warning"
            : reply?.relationshipType == "Counterargument"
            ? "badge-danger"
            : ""
        }">${reply?.relationshipType}</span>
      </div>
    </div>
    <span clas="flex">

    <button
      class="view-sub-reply-btn"
      type="button"
      data-sub-reply-trigger-id="${reply.replyTextID}"
    >
      View Replies
    </button>
    <button
      type="button"
      class="hidden hide-sub-reply-btn"
      data-sub-reply-trigger-id="${reply.replyTextID}"
    >
      Hide Replies
    </button>
    </span>
  </div>
  <p>
    <span class="reply-tag">@${
      reply.parentUserName || claimUserName || "reply"
    }</span>
    ${text}

  </p>
<p>
<span
    class="text-primary add-sub-reply-btn"
    data-add-sub-reply-trigger-id="${reply.replyTextID}"
    data-reply-to="${reply.userName}"
        >
          Reply to comment
        </span></p>
  <div class="nested-replies" data-sub-reply-container-id=${reply.replyTextID}>
        
  </div>
</div>

`;
const subLayerReplyComponent = ({
  imageURL,
  username,
  claimID,
  text,
  reply,
  creationTime,
}) => `            <div class="nested-reply">
  <div class="header">
    <div class="user">
      <img src="${imageURL}" alt="user icon" />
      <div class="data">
        <a href="#">${username}</a>
        <span>${getDate(creationTime)}</span>
        <span class="${
          reply?.relationshipType == "Evidence"
            ? "badge-success"
            : reply?.relationshipType == "Support"
            ? "badge-warning"
            : reply?.relationshipType == "Rebuttal"
            ? "badge-danger"
            : ""
        }">${reply?.relationshipType}</span>
      </div>
    </div>
    <span clas="flex">

    <button
      class="view-modal-reply-btn"
      type="button"
      data-modal-reply-trigger-id="${reply?.replyTextID}"
      data-reply-data='${JSON.stringify(reply)}'
    >
      View Repliesdafa
    </button>
    </span>
  </div>
  <p>
    <span class="reply-tag text-primary">@${
      reply.parentUserName || "reply"
    }</span>
    ${text}

  </p>
</div>

`;

const claimComponent = ({
  type,
  image,
  claim,
  firstClaimID,
  secondClaimID,
  topicID,
}) => `<div class="claim ${type}">
  <div class="header">
    <div class="user">
      <img src="${image}" alt="user icon" />
      <div class="data">
        <a href="#">${claim.username}</a>
        <span>${getDate(claim.creationTime)}</span>
      </div>
    </div>
<span class="flex">
    <button
      class="view-reply-btn"
      type="button"
      data-reply-trigger-id="${claim.claimId}"
      data-claim-username=${claim.username}
    >
      View Replies 
    </button>
    <button
      type="button"
      class="hide-reply-btn"
      data-reply-trigger-id="${claim.claimId}"
    >
      Hide Replies
    </button>
    </span>
  </div>
  <h3 class="heading">
    <a
      href="/${topicID}/${secondClaimID || firstClaimID}/${claim.claimId}"
      >${claim.text}</a
    >
  </h3>

  <div
    class="replies-cotainer hidden"
    data-reply-container-id="${claim.claimId}"
  >
    <div class="replies">
      <h3>
        <span>Replies</span>
        <button
          class="btn btn-primary text-white add-first-reply-btn"
          data-first-reply-claim-id="${claim.claimId}"
        >
          Add Reply
        </button>
      </h3>
      <div class="render-container" data-claim-id="${claim.claimId}"></div>
    </div>
  </div>
</div>
`;

const addEventListeners = (
  renderFirstReplies,
  renderSecondReplies,
  variable
) => {
  //   view replies button event handler
  $(".view-reply-btn").on("click", function () {
    const trigger = $(this);
    const triggerID = trigger.attr("data-reply-trigger-id");
    const claimUserName = trigger.attr("data-claim-username");
    renderFirstReplies(triggerID, claimUserName).then(function (response) {
      $(`[data-reply-container-id=${triggerID}]`).show();
      //   create reply modal button trigger event handler
      $(".add-first-reply-btn").on("click", function () {
        const claimID = $(this).attr("data-first-reply-claim-id");
        if (isLoggedIn) {
          $("[data-modal-id='create-first-reply']").show();
          $("#first-reply-modal-data-div").attr("data-claim-id", claimID);
          $("#first-reply-modal-data-div").attr(
            "data-claim-username",
            claimUserName
          );
        } else {
          $("[data-modal-id='login']").show();
        }
      });
      //   create reply modal button trigger event handler

      // View nested reply via modal UI
    });
  });
  if (renderSecondReplies) {
    //   view sub replies button event handler
    $(".view-sub-reply-btn").on("click", function () {
      const trigger = $(this);
      const triggerID = trigger.attr("data-sub-reply-trigger-id");
      renderSecondReplies(triggerID).then(function (response) {
        $(`[data-sub-reply-container-id=${triggerID}]`).show();
        //   view sub replies button event handler
        $(".view-modal-reply-btn").on("click", function () {
          const element = $(this);
          const replyID = element.attr("data-modal-reply-trigger-id");
          const thisReply = response.find(
            (each) => each.replyTextID == replyID
          );
          $("#modal-reply-username").html(thisReply?.userName);
          $("#modal-reply-to").html(thisReply?.parentUserName);
          $("#modal-reply-creation-time").html(
            getDate(thisReply?.creationTime)
          );
          $("#modal-reply-text").html(thisReply?.text);
          $("#modal-reply-btn").attr(
            "data-add-sub-reply-trigger-id",
            thisReply.replyTextID
          );
          $("#modal-reply-btn").attr(
            "data-reply-to",
            thisReply?.parentUserName
          );
          $("#view-sub-reply-modal-data-div").attr(
            "data-reply-data",
            JSON.stringify(thisReply)
          );

          const triggerID = element.attr("data-modal-reply-trigger-id");
          renderSecondReplies(triggerID, true).then(function (response) {
            $(`[data-modal-id=view-sub-reply]`).show();
            // show hide button
          });
        });
        // View nested reply via modal UI
      });
    });
    $(".add-sub-reply-btn").on("click", function () {
      $(".modal").hide();
      const trigger = $(this);
      const triggerID = trigger.attr("data-add-sub-reply-trigger-id");

      $("#create-sub-reply-modal-data-div").attr("data-parent-id", triggerID);

      $("#replyTo").text(trigger.attr("data-reply-to"));

      if (isLoggedIn) {
        if (trigger.is("#modal-reply-btn"))
          trigger.attr("data-open-reply-modal-after", "true");
        else $("#modal-reply-btn").attr("data-open-reply-modal-after", "");
        $("[data-modal-id='create-sub-reply']").show();
        $("#create-sub-reply-modal-data-div").attr("data-parent-id", triggerID);
      } else {
        $("[data-modal-id='login']").show();
      }
    });
    //   hide sub replies button event handler
    $(".hide-sub-reply-btn").on("click", function () {
      const triggerID = $(this).attr("data-sub-reply-trigger-id");
      $(`[data-sub-reply-container-id=${triggerID}]`).hide();
      // $(this).hide();
      // show addview button
      // $(`.view-sub-reply-btn[data-sub-reply-trigger-id=${triggerID}]`).show();
    });
    //   hide sub replies button event handler
  }
  //   view replies button event handler
  //   hide replies button event handler
  $(".hide-reply-btn").on("click", function () {
    const triggerID = $(this).attr("data-reply-trigger-id");
    $(`[data-reply-container-id=${triggerID}]`).hide();
    // $(this).hide();
    // show view button
    // $(`.view-reply-btn[data-reply-trigger-id=${triggerID}]`).show();
  });
};
$(document).ready(function () {
  const previousPage = document.referrer;
  $("#back-btn").attr("href", previousPage);
  const topicID = $("#data-div").attr("data-topic-id");
  const firstClaimID = $("#data-div").attr("data-first-claim-id");
  const secondClaimID = $("#data-div").attr("data-second-claim-id");
  const profileIconImage = $("#data-div").attr("data-profile-icon-url");

  // const renderParentClaim = () => {
  //   $.get(`/get_related_claims/${topicID}`, function (data, textStatus, jqXHR) {
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
          if (!thisClaim) window.location = "/page/not/found/404";

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
      </div>
      <h3>${thisClaim?.text}</h3>`;

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
          const thisClaim = data.find((each) => each.claimID == firstClaimID);
          if (!thisClaim) window.location = "/page/not/found/404";
          let content = `   
         <div class="header">
        <div class="user">
            <img
            src="${profileIconImage}"
            alt="user icon"
            />
            <div class="data">
            <a href="#">${thisClaim.userName}</a>
            <span>${getDate(thisClaim.creationTime)}</span>
            </div>
        </div>
    </div>
    <h3>${thisClaim?.text}</h3>`;

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
    $.post({
      url: "/get_related_claims",
      data: JSON.stringify({ first_claim_id: secondClaimID || firstClaimID }), // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        $("#opposing-claims .render-container").empty();
        $("#equivalent-claims .render-container").empty();

        relatedClaims = data;
        relatedClaims.forEach((each, index, array) => {
          if (each.relationshipType == "Equivalent") {
            equivalentClaims += claimComponent({
              type: "equivalent",
              claim: each,
              image: profileIconImage,
              topicID,
              firstClaimID,
              secondClaimID,
            });
          } else {
            opposingClaims += claimComponent({
              type: "opposition",
              claim: each,
              image: profileIconImage,
              topicID,
              firstClaimID,
              secondClaimID,
            });
          }
        });
        $("#opposing-claims .render-container").append(opposingClaims);
        $("#equivalent-claims .render-container").append(equivalentClaims);
        addEventListeners(renderFirstReplies, null);
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
    if (isLoggedIn) {
      $("[data-modal-id='create-child-claim']").show();
    } else {
      $("[data-modal-id='login']").show();
    }
  });

  // handle create child claim  submission
  $("#create-child-claim-form").on("submit", function (e) {
    e.preventDefault();
    const thisForm = $(this);
    let data = serializeFormData(thisForm);
    const claimID = secondClaimID || firstClaimID;
    data = JSON.parse(data);
    data.topicID = topicID;
    data.claimID = claimID;
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
  // handle create first level reply submission
  $("#create-first-reply-form").on("submit", function (e) {
    e.preventDefault();
    const thisForm = $(this);
    let data = serializeFormData(thisForm);

    const claimID = $("#first-reply-modal-data-div").attr("data-claim-id");
    const claimUserName = $("#first-reply-modal-data-div").attr(
      "data-claim-username"
    );
    data = JSON.parse(data);
    data.replyType = "claim";
    data.claimID = claimID;
    data.userID = getCookie("userID");
    data = JSON.stringify(data);
    $.post({
      url: "/create_reply",
      data: data, // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        thisForm[0].reset();
        alert("Reply created Successfully");
        renderFirstReplies(claimID, claimUserName);
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  });

  // handle create sub(second) level reply submission
  $("#create-sub-reply-form").on("submit", function (e) {
    e.preventDefault();
    const thisForm = $(this);
    let data = serializeFormData(thisForm);

    const parentID = $("#create-sub-reply-modal-data-div").attr(
      "data-parent-id"
    );
    data = JSON.parse(data);
    data.replyType = "reply";
    data.userID = getCookie("userID");
    data.parentReplyID = parentID;
    data = JSON.stringify(data);
    const modalBtn = $("#modal-reply-btn[data-open-reply-modal-after='true']");
    $.post({
      url: "/create_reply",
      data: data, // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        thisForm[0].reset();
        const modalBtn = $(
          "#modal-reply-btn[data-open-reply-modal-after='true']"
        );
        alert("Reply created Successfully");
        renderSecondReplies(parentID, Boolean(modalBtn.length)).then(() => {
          if (Boolean(modalBtn.length)) {
            $(".modal").hide();
            $('[data-modal-id="view-sub-reply"]').show();
          }
          addEventListeners(renderFirstReplies, renderSecondReplies);
          modalTriggerEventListener();
        });
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  });

  const renderFirstReplies = (claim_id, claimUserName) => {
    return $.post({
      url: "/get_replies_by_claim_id",
      data: JSON.stringify({ claim_id }), // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        replies = data;
        const parent = $(
          `.replies .render-container[data-claim-id='${claim_id}']`
        );
        parent.empty();
        let content = "";
        replies.forEach((each, index, array) => {
          content += firstLayerReplyComponent({
            imageURL: profileIconImage,
            username: each.userName,
            claimID: claim_id,
            creationTime: each.creationTime,
            text: each.text,
            reply: each,
            claimUserName,
          });
        });

        parent.append(content);
        addEventListeners(renderFirstReplies, renderSecondReplies, "lucci");
        modalTriggerEventListener();
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  };
  const renderSecondReplies = (parent_id, renderInModal = false) => {
    return $.post({
      url: "/get_replies_by_parent_id",
      data: JSON.stringify({ parent_id }), // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        replies = data;
        const parent = !renderInModal
          ? $(`.nested-replies[data-sub-reply-container-id='${parent_id}']`)
          : $(`.modal-body .nested-replies`);
        parent.empty();
        let content = "";
        replies.forEach((each, index, array) => {
          content += subLayerReplyComponent({
            imageURL: profileIconImage,
            username: each.userName,
            claimID: parent_id,
            creationTime: each.creationTime,
            text: each.text,
            reply: each,
          });
        });
        parent.append(content);

        if (renderInModal) {
          //   view sub replies button event handler
          $(".view-modal-reply-btn").on("click", function () {
            const element = $(this);
            const replyID = element.attr("data-modal-reply-trigger-id");
            const thisReply = JSON.parse(element.attr("data-reply-data"));
            $("#modal-reply-username").html(thisReply?.userName);
            $("#modal-reply-to").html(thisReply?.parentUserName);
            $("#modal-reply-creation-time").html(
              getDate(thisReply?.creationTime)
            );
            $("#modal-reply-text").html(thisReply?.text);
            $("#modal-reply-btn").attr(
              "data-add-sub-reply-trigger-id",
              thisReply.replyTextID
            );
            $("#modal-reply-btn").attr(
              "data-reply-to",
              thisReply?.parentUserName
            );
            $("#view-sub-reply-modal-data-div").attr(
              "data-reply-data",
              JSON.stringify(thisReply)
            );

            const triggerID = element.attr("data-modal-reply-trigger-id");
            renderSecondReplies(triggerID, true).then(function (replies) {
              $(`[data-modal-id=view-sub-reply]`).show();
              // show hide button
            });
          });
          // View nested reply via modal UI
        }
        // modalTriggerEventListener();
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  };
});
