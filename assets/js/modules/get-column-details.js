import { microcms } from "../microcms.js";
import { formatDate } from "../functions/format-date.js";
import { getParam } from "../functions/get-param.js";

export const getColumnDetail = () => {
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
        $("#js-post").append(json.body);

        // ----------------------------------------------
        // 同じカテゴリの記事を取得する（最大8件）
        // ----------------------------------------------
        const category = json.category[0] ?? "";
        let fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column?limit=8`;

        if (category !== "") {
          fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column?limit=8&filters=category[contains]${category}`;
        }

        fetch(fetchUrl, {
          headers: {
            "X-MICROCMS-API-KEY": microcms.API_KEY,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            // 表示されている記事を省く
            const relatedPosts = $.map(json.contents, (item) => {
              if (item.id !== postId) return item;
            });

            if (relatedPosts.length !== 0) {
              // 関連記事あり
              let insertHtml = $('<ul class="c-linkList"></ul>');
              for (const post of relatedPosts) {
                const addItem = `
                <li>
                  <a class="c-linkList__contents" href="../column/post.html?id=${post.id}">${post.title}</a>
                </li>
                `;

                insertHtml.append(addItem);
              }

              $("#js-relatedPostList").append(insertHtml);
            } else {
              // 関連記事なし
              $("#js-relatedPostList").append(
                "<p>まだ関連する記事がありません。</p>"
              );
            }
          });

        // ----------------------------------------------
        // SNSシェアボタンの設定
        // ----------------------------------------------
        const snsList = $(".js-getSnsLink");
        const pageUrl = window.location.href;
        const pageTitle = json.title;

        for (const sns of snsList) {
          if ($(sns).attr("data-sns") !== "") {
            // SNS
            let link = "";
            if ($(sns).attr("data-sns") === "twitter") {
              link = `https://twitter.com/share?text=${pageTitle}&url=${pageUrl}`;
            } else if ($(sns).attr("data-sns") === "facebook") {
              link = `http://www.facebook.com/share.php?u=${pageUrl}`;
              $(sns).attr("href", link);
            } else if ($(sns).attr("data-sns") === "line") {
              link = `https://social-plugins.line.me/lineit/share?url=${pageUrl}`;
            } else {
              link = pageUrl;
            }
            $(sns).attr("href", link);
          } else {
            // copy button
            $(sns).attr("data-link", pageUrl);
          }
        }
      });
  });
};
