import { microcms } from "../microcms.js";
import { setPagination } from "../functions/set-pagination.js";
import { switchCategory } from "../functions/switch-category.js";

/**
 * ----------------------------------------------
 * コラム一覧を取得
 * --
 * @param path - 該当のページからpost.htmlまでの間のパス
 * @param limit - 一覧表示する記事の上限数
 * ----------------------------------------------
 */
export const getColumnList = (path, limit) => {
  // カテゴリを増やす場合はcategoryListにも追加する
  const categoryList = ["カスタマイズ", "機能紹介", "コラム"];
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
    let insertCategoryListHtml = $(
      '<ul class="c-linkList c-linkList--underLine"></ul>'
    );
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
        let insertHtml = "";

        if (json.contents.length > 0) {
          // --
          // 投稿があるとき
          // ----------------------------------------------
          insertHtml = $('<ol class="c-columnList"></ol>');

          for (const content of json.contents) {
            let sammaryHtml = "";
            let thumbnailHtml = "";

            // sammaryがあればHTMLを形成
            if (content.summary !== undefined) {
              sammaryHtml = `
              <p class="c-card__text">${content.summary}</p>
            `;
            }

            // thumbnailがあればHTMLを形成
            if (content.thumbnail !== undefined) {
              thumbnailHtml = `
            <figure class="c-card__image">
              <img
                src="${content.thumbnail.url}"
                alt=""
                width="${content.thumbnail.width}"
                height="${content.thumbnail.height}"
              />
            </figure>
            `;
            }

            const addItem = `
            <li class="c-card">
              <a href="${path}post.html?id=${content.id}">
                <section class="c-card">
                  <div class="c-card__inner">
                    <div class="c-card__textContents">
                      <h3 class="c-card__title">${content.title}</h3>
                      <ul class="c-card__tagList u-mb-sp-8">
                        <li class="c-card__tag">${content.category[0]}</li>
                      </ul>
                      ${content.summary !== undefined ? sammaryHtml : ""}
                    </div>
                    ${content.thumbnail !== undefined ? thumbnailHtml : ""}
                  </div>
                </section>
              </a>
            </li>
          `;

            insertHtml.append(addItem);
          }
        } else {
          // --
          // 投稿がないとき
          // ----------------------------------------------
          insertHtml = $('<p class="u-text-center">投稿がありません。</p>');
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
  switchCategory(".js-switchCategory");
};
