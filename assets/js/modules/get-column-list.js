import { microcms } from "../microcms.js";

export const getColumnList = () => {
  // 記事の取得上限数
  const limit = 8;

  $(function () {
    fetch(
      `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column?limit=${limit}`,
      {
        headers: {
          "X-MICROCMS-API-KEY": microcms.API_KEY,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        let insertHtml = $('<ul class="c-linkList"></ul>');
        for (const content of json.contents) {
          const addItem = `
          <li>
            <a class="c-linkList__contents" href="./post.html?id=${content.id}">${content.title}</a>
          </li>
          `;

          insertHtml.append(addItem);
        }

        if (limit < json.totalCount) {
          // 表示件数以上の投稿がある場合は「もっと見る」ボタンを表示
          const moreButton = `
          <div class="u-text-center u-mt-sp-48 u-mt-tab-64">
            <a class="c-button" href="./column/">もっとみる</a>
          </div>
          `;

          insertHtml.append(moreButton);
        }

        // ページに挿入
        $("#js-getColumnList").append(insertHtml);
      });
  });
};
