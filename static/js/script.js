$(document).ready(function () {
  console.log($);
  $(".modal").hide();
  $("#modal-trigger").click(function () {
    const modalId = $(this).data("modal-id");

    $(`#${modalId}`).fadeIn();
  });
  $(".modal-overlay").click(function () {
    const modalId = $(this).data("modal-id");
    $(`#${modalId}`).fadeOut();
  });
  $(".modal .title .close-btn").click(function () {
    const modalId = $(this).data("modal-id");
    $(`#${modalId}`).fadeOut();
  });
});
