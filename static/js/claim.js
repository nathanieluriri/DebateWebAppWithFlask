// components
const firstLayerReplyComponent = ({
  imageURL,
  username,
  claimID,
  text,
  reply,
  creationTime,
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
    <span class="reply-tag">@${reply.parentUserName || "reply"}</span>
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
    >
      View Replies
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

const addEventListeners = (renderFirstReplies, renderSecondReplies) => {
  //   view replies button event handler
  $(".view-reply-btn").on("click", function () {
    const trigger = $(this);
    console.log(trigger[0]);
    const triggerID = trigger.data("reply-trigger-id");
    renderFirstReplies(triggerID).then(function (response) {
      console.log(response);
      $(`[data-reply-container-id=${triggerID}]`).fadeIn();
      //   create reply modal button trigger event handler
      $(".add-first-reply-btn").on("click", function () {
        const claimID = $(this).data("first-reply-claim-id");
        if (isLoggedIn) {
          $("[data-modal-id='create-first-reply']").fadeIn();
          $("#first-reply-modal-data-div").attr("data-claim-id", triggerID);
        } else {
          $("[data-modal-id='login']").fadeIn();
        }
      });
      //   create reply modal button trigger event handler

      //   view sub replies button event handler
      $(".view-sub-reply-btn").on("click", function () {
        const trigger = $(this);
        const triggerID = trigger.data("sub-reply-trigger-id");
        renderSecondReplies(triggerID).then(function (response) {
          $(`[data-sub-reply-container-id=${triggerID}]`).fadeIn();
          //   view sub replies button event handler
          $(".view-modal-reply-btn").on("click", function () {
            const element = $(this);
            const replyID = element.data("modal-reply-trigger-id");

            const thisReply = response.find(
              (each) => each.replyTextID == replyID
            );
            $("#modal-reply-username").html(thisReply?.parentUserName);
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

            const triggerID = element.data("modal-reply-trigger-id");
            renderSecondReplies(triggerID, true).then(function (response) {
              console.log(response);
              $(`[data-modal-id=view-sub-reply]`).fadeIn();
              // show hide button
            });
          });
          // View nested reply via modal UI
        });
      });
      $(".add-sub-reply-btn").on("click", function () {
        $(".modal").fadeOut();
        console.log("adf");
        const trigger = $(this);
        const triggerID = trigger.data("add-sub-reply-trigger-id");

        $("#create-sub-reply-modal-data-div").attr("data-parent-id", triggerID);

        $("#replyTo").text(trigger.data("reply-to"));

        if (isLoggedIn) {
          if (trigger.is("#modal-reply-btn"))
            trigger.attr("data-open-reply-modal-after", "true");
          else $("#modal-reply-btn").attr("data-open-reply-modal-after", "");
          $("[data-modal-id='create-sub-reply']").fadeIn();
          $("#create-sub-reply-modal-data-div").attr(
            "data-parent-id",
            triggerID
          );
        } else {
          $("[data-modal-id='login']").fadeIn();
        }
        // renderSecondReplies(triggerID).then(function (response) {
        //   $(`[data-sub-reply-container-id=${triggerID}]`).fadeIn();
        // show hide button

        //   create sub reply modal button trigger event handler
        //   console.log("adfad");
        //   create sub reply modal button trigger event handler
        // });
      });
      //   hide sub replies button event handler
      $(".hide-sub-reply-btn").on("click", function () {
        console.log("adf");
        const triggerID = $(this).data("sub-reply-trigger-id");
        $(`[data-sub-reply-container-id=${triggerID}]`).fadeOut();
        // $(this).hide();
        // show addview button
        // $(`.view-sub-reply-btn[data-sub-reply-trigger-id=${triggerID}]`).fadeIn();
      });
      //   hide sub replies button event handler

      // View nested reply via modal UI
    });
  });
  //   view replies button event handler
  //   hide replies button event handler
  $(".hide-reply-btn").on("click", function () {
    console.log("adf");
    const triggerID = $(this).data("reply-trigger-id");
    $(`[data-reply-container-id=${triggerID}]`).fadeOut();
    // $(this).hide();
    // show view button
    // $(`.view-reply-btn[data-reply-trigger-id=${triggerID}]`).fadeIn();
  });
};
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
        <button>View Replies</button>
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
            <a href="#">${thisClaim.userName}</a>
            <span>${getDate(thisClaim.creationTime)}</span>
            </div>
        </div>
      <button>View Replies</button>
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
    $.post({
      url: "/get_related_claims",
      data: JSON.stringify({ first_claim_id: secondClaimID || firstClaimID }), // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        relatedClaims = data;
        console.log(data);
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
        $("#opposing-claims").append(opposingClaims);
        $("#equivalent-claims").append(equivalentClaims);
        addEventListeners(renderFirstReplies, renderSecondReplies);
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

  // handle create child claim  submission
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
        renderFirstReplies(claimID);
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

    console.log("Serialized data:", data);
    const claimID = $("#first-reply-modal-data-div").data("claim-id");
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
        renderFirstReplies(claimID);
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

    console.log("Serialized data:", data);
    const parentID = $("#create-sub-reply-modal-data-div").data("parent-id");
    console.log(parentID);
    data = JSON.parse(data);
    data.replyType = "reply";
    data.userID = getCookie("userID");
    data.parentReplyID = parentID;
    console.log(data);
    data = JSON.stringify(data);
    $.post({
      url: "/create_reply",
      data: data, // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        thisForm[0].reset();
        const modalBtn = $(
          "#modal-reply-btn[data-open-reply-modal-after='true']"
        );

        alert("Reply created Successfully");
        renderSecondReplies(parentID, Boolean(modalBtn)).then(() => {
          if (modalBtn) {
            console.log("fdasfas");
            $(".modal").fadeOut();
            $('[data-modal-id="view-sub-reply"]').fadeIn();
          }
        });
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  });

  const renderFirstReplies = (claim_id) => {
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
        console.log(data);
        replies.forEach((each, index, array) => {
          content += firstLayerReplyComponent({
            imageURL: profileIconImage,
            username: each.userName,
            claimID: claim_id,
            creationTime: each.creationTime,
            text: each.text,
            reply: each,
          });
        });

        parent.append(content);
        addEventListeners(renderFirstReplies, renderSecondReplies);
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
    console.log(renderInModal);
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
        console.log(data);
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

        //   view sub replies button event handler
        $(".view-modal-reply-btn").on("click", function () {
          const element = $(this);
          const replyID = element.data("modal-reply-trigger-id");

          const thisReply = replies.find((each) => each.replyTextID == replyID);
          $("#modal-reply-username").html(thisReply?.parentUserName);
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

          const triggerID = element.data("modal-reply-trigger-id");
          renderSecondReplies(triggerID, true).then(function (replies) {
            console.log(replies);
            $(`[data-modal-id=view-sub-reply]`).fadeIn();
            // show hide button
          });
        });
        // View nested reply via modal UI
        modalTriggerEventListener();
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  };
});
