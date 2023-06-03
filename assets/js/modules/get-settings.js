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
        // テーマ 挿入
        // ----------------------------------------------
        const insertThemeStyle = `
        <style>
        :root {
          --color-bg-main: ${json.theme_color.color_bg_main ?? "#fff"};
          --color-bg-accent: ${json.theme_color.color_bg_accent ?? "#fafafa"};
          --color-bg-button: ${json.theme_color.color_bg_button ?? "#000"};
          --color-text-main: ${json.theme_color.color_text_main ?? "#000"};
          --color-text-h2: ${json.theme_color.color_text_h2 ?? "#000"};
          --color-text-h3: ${json.theme_color.color_text_h3 ?? "#000"};
          --color-text-h4: ${json.theme_color.color_text_h4 ?? "#000"};
          --color-accent-primary: ${
            json.theme_color.color_accent_primary ?? "#000"
          };
        }
        </style>`;
        $("head").append(insertThemeStyle);

        // ----------------------------------------------
        // 追加CSS 挿入
        // ----------------------------------------------
        $("head").append("<style>" + json.add_css + "</>");

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
