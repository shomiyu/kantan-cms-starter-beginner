import { microcms } from "../microcms.js";
import { setPagination } from "../functions/set-pagination.js";

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
  /**
   * ページングの情報
   * - paramPage
   * @type {Number}
   * - paramCategory
   * @type {String}
   * - offset
   * @type {Number}
   */
  const paramPage =
    parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
  const offset = limit * (paramPage - 1);
  const paramCategory =
    new URLSearchParams(window.location.search).get("category") || "すべて";
  let fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column?limit=${limit}&offset=${offset}`;

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
    // 記事一覧を取得
    // ----------------------------------------------

    if (paramCategory !== "すべて") {
      fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column?limit=${limit}&offset=${offset}&filters=category[contains]${paramCategory}`;
    } else {
      fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column?limit=${limit}&offset=${offset}`;
    }

    fetch(fetchUrl, {
      headers: {
        "X-MICROCMS-API-KEY": microcms.API_KEY,
      },
    })
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

        $("#js-getColumnList").append(insertHtml);

        // ----------------------------------------------
        // もっと見るボタン
        // ----------------------------------------------
        if (limit < json.totalCount) {
          // 表示件数以上の投稿がある場合は「もっと見る」ボタンを表示
          const moreButton = `
            <div class="u-text-center u-mt-sp-48 u-mt-tab-64">
              <a class="c-button" href="${path}">もっとみる</a>
            </div>
          `;

          $("#js-columnMoreButton").append(moreButton);
        }

        // ----------------------------------------------
        // ページング
        // ----------------------------------------------
        setPagination(json.totalCount, limit, paramPage, paramCategory);
      })
      .catch((e) => {
        console.log(e.message);
      });
  });

  // ----------------------------------------------
  // カテゴリ一を切り替える
  // ----------------------------------------------
  $(document).on("click", ".js-switchCategory", function () {
    const targetCategoryName = $(this).attr("data-category");
    window.location.href = `./?page=1&category=${targetCategoryName}`;
  });
};
