import { microcms } from "../microcms.js";
import { formatDate } from "./format-date.js";

export const getColumnDetail = () => {
  // パラメーター取得関数
  const getParam = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  $(function () {
    const postId = getParam("id");

    fetch(
      `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column/${postId}`,
      {
        headers: {
          "X-MICROCMS-API-KEY": microcms.API_KEY,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
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
            <a class="c-label" href="./column/">${category}</a>
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
        $("#js-post").append(json.body);
      });
  });
};
