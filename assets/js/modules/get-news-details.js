import { microcms } from "../microcms.js";
import { formatDate } from "../functions/format-date.js";
import { getParam } from "../functions/get-param.js";

export const getNewsDetail = () => {
  $(function () {
    const postId = getParam("id");

    fetch(`https://${microcms.SERVICE_ID}.microcms.io/api/v1/news/${postId}`, {
      headers: {
        "X-MICROCMS-API-KEY": microcms.API_KEY,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // ----------------------------------------------
        // 投稿を出力
        // ----------------------------------------------
        const publishedAt = formatDate(json.publishedAt);
        const updatedAt = formatDate(json.updatedAt);
        const thumbnail = json.thumbnail ?? null;

        // 投稿日と更新日を設定
        $("#js-publishedDate").html(publishedAt);
        $("#js-updatedDate").attr("datetime", json.updatedAt).html(updatedAt);

        // 見出しを挿入
        $("#js-postTitle").html(json.title);

        // カテゴリ挿入
        let innertCategories = $(
          '<ul class="p-columnPostCategories u-fz-sp-xsmall"></ul>'
        );
        for (const category of json.category) {
          const addItem = `
          <li>
            <span class="c-label">${category}</span>
          </li>
          `;

          innertCategories.append(addItem);
        }
        $("#js-postCategory").append(innertCategories);

        // サムネイルがあれば挿入
        if (thumbnail !== null) {
          const insertHtml = `
            <figure class="p-columnThumbnail">
              <img
                src="${json.thumbnail.url}"
                alt=""
                width="${json.thumbnail.width}"
                height="${json.thumbnail.height}"
              />
            </figure>`;

          $("#js-postThumbnail").append(insertHtml);
        }

        // 投稿内容を挿入
        $("#js-post").append(`<div class="c-postEditor">${json.body}</div>`);

        // ----------------------------------------------
        // meta 最適化
        // ----------------------------------------------
        let title = json.title;
        let seoDescription = undefined;
        if (json.seo_settings !== null) {
          title = json.seo_settings.meta_title ?? json.title;
          seoDescription = json.seo_settings.meta_description ?? undefined;
        }

        fetch(`https://${microcms.SERVICE_ID}.microcms.io/api/v1/settings`, {
          headers: {
            "X-MICROCMS-API-KEY": microcms.API_KEY,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            // title
            const setTitle = `${title} ${json.meta.dividing_line} ${json.site_settings.site_name}`;
            $("title").text(setTitle);

            // description
            const description = seoDescription ?? json.meta.meta_description;
            $('meta[name="description"]').attr("content", description);

            // OGP
            $('meta[property="og:title"]').attr("content", setTitle);
            $('meta[property="og:description"]').attr("content", description);
          });
      });
  });
};
