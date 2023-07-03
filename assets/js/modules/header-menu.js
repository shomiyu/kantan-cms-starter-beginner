export const headerMenu = () => {
  $(function () {
    // ------------------------------------------------------
    // モバイルメニューの開閉
    // ------------------------------------------------------
    const body = $("body");
    const header = $("#js-header");
    const menu = $("#js-mobileMenu");

    $("#js-mobileMenuButton").on("click", function () {
      if ($("#js-header").hasClass("is-active")) {
        header.removeClass("is-active");
        menu.fadeOut();
        body.css("overflow", "auto");
      } else {
        header.addClass("is-active");
        menu.fadeIn();
        body.css("overflow", "hidden");
      }
    });
  });
};
