$(function () {
  // ------------------------------------------------------
  // モバイルメニューの開閉
  // ------------------------------------------------------
  $("#js-mobileMenuButton").on("click", function () {
    const header = $("#js-header");
    const menu = $("#js-mobileMenu");

    if ($("#js-header").hasClass("is-active")) {
      header.removeClass("is-active");
      menu.fadeOut();
    } else {
      header.addClass("is-active");
      menu.fadeIn();
    }
  });
});
