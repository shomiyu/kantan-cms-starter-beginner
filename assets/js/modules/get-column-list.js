import { microcms } from "../microcms.js";

/**
 * ----------------------------------------------
 * カテゴリ一覧を取得
 * --
 * @param path - TOPからpost.htmlまでの間のパス
 * @param limit - 一覧表示する記事の上限数
 * ----------------------------------------------
 */
export const getColumnList = (path, limit) => {
  /**
   * カテゴリ
   * - カテゴリを増やす場合はcategoryListの配列にも追加すること
   *
   * @type {String[]}
   */
  const categoryList = ["カスタマイズ", "機能紹介", "知識"];

  $(function () {
    // ----------------------------------------------
    // カテゴリ一覧をサイドバーに挿入
    // ----------------------------------------------
    let insertCategoryListHtml = $('<ul class="c-linkList"></ul>');
    insertCategoryListHtml.append(`
      <li>
        <button class="c-linkList__contents js-switchCategory" data-category="すべて">すべて</button>
      </li>
    `);

    for (const category of categoryList) {
      const addItem = `
        <li>
          <button class="c-linkList__contents js-switchCategory" data-category="${category}">${category}</button>
        </li>
      `;

      insertCategoryListHtml.append(addItem);
    }
    $("#js-getCategoryList").append(insertCategoryListHtml);

    // ----------------------------------------------
    // カテゴリ一覧を取得
    // ----------------------------------------------
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
              <a class="c-linkList__contents" href="${path}post.html?id=${content.id}">${content.title}</a>
            </li>
          `;

          insertHtml.append(addItem);
        }

        if (limit < json.totalCount) {
          // 表示件数以上の投稿がある場合は「もっと見る」ボタンを表示
          const moreButton = `
            <div class="u-text-center u-mt-sp-48 u-mt-tab-64">
              <a class="c-button" href="${path}">もっとみる</a>
            </div>
          `;

          insertHtml.append(moreButton);
        }

        // ページに挿入
        $("#js-getColumnList").append(insertHtml);
      });

    // ----------------------------------------------
    // カテゴリ一を切り替える
    // ----------------------------------------------
    $(document).on("click", ".js-switchCategory", function () {
      $("#js-getCategoryName > *").remove();
      $("#js-getColumnList > *").remove();

      const targetCategoryName = $(this).attr("data-category");
      let fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column?limit=${limit}`;

      if (targetCategoryName !== "すべて") {
        fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column?limit=${limit}&filters=category[contains]${targetCategoryName}`;
      }

      fetch(fetchUrl, {
        headers: {
          "X-MICROCMS-API-KEY": microcms.API_KEY,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (targetCategoryName !== "すべて") {
            // 見出し挿入
            $("#js-getCategoryName").append(
              `<h2 class="p-columnCategoryTitle">${targetCategoryName}</h2>`
            );
          }

          let insertHtml = $('<ul class="c-linkList"></ul>');
          for (const content of json.contents) {
            const addItem = `
              <li>
                <a class="c-linkList__contents" href="${path}post.html?id=${content.id}">${content.title}</a>
              </li>
            `;

            insertHtml.append(addItem);
          }

          // ページに挿入
          $("#js-getColumnList").append(insertHtml);
        });
    });
  });
};
