export const headerMenu = () => {
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
  });
};
