import { microcms } from "../microcms.js";
import { formatDate } from "../functions/format-date.js";
import { getParam } from "../functions/get-param.js";

/**
 * ----------------------------------------------
 * お知らせプレビュー取得
 * ----------------------------------------------
 */
export const getNewsDraft = () => {
  $(function () {
    const postId = getParam("id");
    const draftKey = getParam("draftKey");

    fetch(
      `https://${microcms.SERVICE_ID}.microcms.io/api/v1/news/${postId}?draftKey=${draftKey}`,
      {
        headers: {
          "X-MICROCMS-API-KEY": microcms.API_KEY,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        // ----------------------------------------------
        // 投稿を出力
        // ----------------------------------------------
        const publishedAt = formatDate(json.publishedAt ?? new Date());
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
        if (json.body !== undefined || null) {
          $("#js-post").append(`<div class="c-postEditor">${json.body}</div>`);
        }

        // ----------------------------------------------
        // コードブロックのコピー機能
        // ----------------------------------------------
        const copyIconPath = "../../assets/images/icon_copy_wh.svg";
        const doneIconPath = "../../assets/images/icon_done_wh.svg";

        $(".c-postEditor pre").wrap(`<div class="c-codeBlock"></div>`);
        $(".c-postEditor pre").append(`
          <button type="button" class="js-copyText">
            <img src="${copyIconPath}" alt="copy" width="18" height="18">
          </button>
        `);

        $(document).on("click", ".js-copyText", function () {
          const copyText = $(this).prev().text();
          const img = $(this).children("img");

          navigator.clipboard.writeText(copyText);
          $(img).attr("src", doneIconPath);

          setTimeout(() => {
            $(img).attr("src", copyIconPath);
          }, 1000);
        });
      });
  });
};
