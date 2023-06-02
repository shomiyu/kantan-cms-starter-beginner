export const copyPageLink = () => {
  $(function () {
    // ----------------------------------------------
    // SNSシェアのリンクコピー
    // ----------------------------------------------
    $(".js-copyLink").on("click", function () {
      const copyText = $(this).attr("data-link");
      const img = $(this).find("img")[0];
      const iconDoneSrc = "../assets/images/icon_done_lg.svg";
      const iconLinkSrc = "../assets/images/icon_link_lg.svg";

      navigator.clipboard.writeText(copyText);
      $(img).attr("src", iconDoneSrc);

      setTimeout(() => {
        $(img).attr("src", iconLinkSrc);
      }, 1000);
    });
  });
};
