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
        // メタ情報
        // ----------------------------------------------
        const thisPathName = window.location.pathname;
        const thisPageUrl = window.location.href;
        const isTopPage = thisPathName === "/";

        // title
        const baseTitle = $("title").text();
        const setTitle = json.site_settings.site_name;
        const fullTitle = `${baseTitle} ${json.meta.dividing_line} ${json.site_settings.site_name}`;
        if (isTopPage) {
          $("title").text(setTitle);
        } else {
          $("title").text(fullTitle);
        }

        // description
        const descriptionText = json.meta.meta_description ?? "";
        const descriptionHtml = `
        <meta name="description" content="${descriptionText}">
        `;
        $("head").append(descriptionHtml);

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
        // Google Tag Manager
        // ----------------------------------------------
        if (json.tag_manager_script != null) {
          $("head").prepend(`${json.tag_manager_script}`);
        }

        if (json.tag_manager_noscript != null) {
          $("body").prepend(`${json.tag_manager_noscript}`);
        }

        // ----------------------------------------------
        // Google Analytics
        // ----------------------------------------------
        if (json.analytics != null) {
          $("head").prepend(`${json.analytics}`);
        }

        // ----------------------------------------------
        // OGP
        // ----------------------------------------------
        $("head").attr("prefix", "og: http://ogp.me/ns#");
        $("title").after(`
          <!-- OGP -->
          <meta property="og:title" content="${
            isTopPage ? setTitle : fullTitle
          }">
          <meta property="og:type" content="${
            isTopPage ? "website" : "article"
          }">
          <meta property="og:url" content="${thisPageUrl}">
          <meta property="og:image" content="${json.meta.og_image.url}">
          <meta property="og:site_name" content="${
            json.site_settings.site_name
          }">
          <meta property="og:description" content="${descriptionText}">
          <meta name="twitter:card" content="summary_large_image">
          <!-- / OGP -->
        `);

        // ----------------------------------------------
        // 追加CSS 挿入
        // ----------------------------------------------
        $("head").append("<style>" + json.add_css + "</style>");

        // ----------------------------------------------
        // noindex 設定
        // ----------------------------------------------
        if (json.site_settings.noindex) {
          $("head").append('<meta name="robots" content="noindex">');
        }
      });
  });
};
