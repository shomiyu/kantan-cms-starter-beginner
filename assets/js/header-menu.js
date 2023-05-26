$(function () {
  // ------------------------------------------------------
  // モバイルメニューの開閉
  // ------------------------------------------------------
  const header = $("#js-header");
  const menu = $("#js-mobileMenu");

  $("#js-mobileMenuButton").on("click", function () {
    if ($("#js-header").hasClass("is-active")) {
      header.removeClass("is-active");
      menu.fadeOut();
    } else {
      header.addClass("is-active");
      menu.fadeIn();
    }
  });

  $(window).resize(function () {
    // ---------------------------------------
    // モバイルメニュー展開後のブラウザのリサイズに対応
    // ---------------------------------------
    if (window.matchMedia("(min-width: 1024px)").matches) {
      header.removeClass("is-active");
      menu.css("display", "block");
    } else {
      menu.css("display", "none");
    }
  });
});
