import { microcms } from "../microcms.js";

export const getSettings = () => {
  $(function () {
    fetch(`https://${microcms.SERVICE_ID}.microcms.io/api/v1/settings`, {
      headers: {
        "X-MICROCMS-API-KEY": microcms.API_KEY,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // ----------------------------------------------
        // サイト名を設定
        // メモ：時間かかるのでやめるかも、どこまで許容するか考える
        // ----------------------------------------------
        $("title").html(json.site_settings.site_name);

        // ----------------------------------------------
        // ファビコン 挿入
        // ----------------------------------------------
        $("head").append(
          `<link rel="shortcut icon" sizes="32x32" href="${json.site_settings.favicon.url}">`
        );

        // ----------------------------------------------
        // Google Fonts 挿入
        // ----------------------------------------------
        if (json.google_fonts != null) {
          const insertGoogleFonts = `
          <!-- Google Fonts -->
          ${json.google_fonts}
          <!-- / Google Fonts -->`;
          $("title").after(insertGoogleFonts);
        }

        // ----------------------------------------------
        // 追加CSS 挿入
        // ----------------------------------------------
        $("head").append("<style>" + json.add_css + "</style>");

        // ----------------------------------------------
        // noindex 設定
        // メモ：Google 非推奨なのでやめるかも
        // ----------------------------------------------
        if (json.site_settings.noindex) {
          $("head").append('<meta name="robots" content="noindex">');
        }
      });
  });
};
