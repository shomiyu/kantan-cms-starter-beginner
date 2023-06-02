import { microcms } from "../microcms.js";
import { formatDate } from "../functions/format-date.js";

export const getNewsList = (path, limit) => {
  /**
   * カテゴリ
   * - カテゴリを増やす場合はcategoryListの配列にも追加すること
   *
   * @type {String[]}
   */
  const categoryList = ["お知らせ", "プレスリリース"];

  const paramPage =
    parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
  const offset = limit * (paramPage - 1);
  const paramCategory =
    new URLSearchParams(window.location.search).get("category") || "すべて";
  let fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/news?limit=${limit}&offset=${offset}`;

  $(function () {
    // ----------------------------------------------
    // カテゴリ一覧をタブに挿入
    // ----------------------------------------------
    let insertCategoryListHtml = $('<ul class="c-tab"></ul>');
    insertCategoryListHtml.append(`
      <li>
        <button type="button" class="c-tab__button js-switchCategory" data-category="すべて">すべて</button>
      </li>
    `);

    for (const category of categoryList) {
      const addItem = `
        <li>
          <button type="button" class="c-tab__button js-switchCategory" data-category="${category}">${category}</button>
        </li>
      `;
      insertCategoryListHtml.append(addItem);
    }

    $("#js-getCategoryList").append(insertCategoryListHtml);

    // カレントタブのアクティブ化
    const tabs = $(".js-switchCategory");
    for (const tab of tabs) {
      if ($(tab).attr("data-category") === paramCategory) {
        $(tab).addClass("is-active");
      }
    }

    // ----------------------------------------------
    // 記事一覧を取得
    // ----------------------------------------------
    if (paramCategory !== "すべて") {
      fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/news?limit=${limit}&offset=${offset}&filters=category[contains]${paramCategory}`;
    } else {
      fetchUrl = `https://${microcms.SERVICE_ID}.microcms.io/api/v1/news?limit=${limit}&offset=${offset}`;
    }

    fetch(fetchUrl, {
      headers: {
        "X-MICROCMS-API-KEY": microcms.API_KEY,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        let insertHtml = $('<ol class="c-newsList"></ol>');
        for (const content of json.contents) {
          const date = formatDate(content.updatedAt);
          let addItem = "";

          if (content.external_link != null) {
            // 外部リンク
            addItem = `
            <li class="c-newsList__item">
              <a class="c-newsList__contents" href="${content.external_link}" target="_blank" rel="noopener noreferrer">
                <dl>
                  <dt class="c-newsList__head">
                    <time datetime="${content.updatedAt}">${date}</time>
                    <span class="c-newsList__label">${content.category}</span>
                  </dt>
                  <dd>${content.title}</dd>
                </dl>
              </a>
            </li>
            `;
          } else if (content.body != null) {
            // 本文あり（詳細ページにリンク）
            addItem = `
            <li class="c-newsList__item">
              <a class="c-newsList__contents" href="${path}post.html?id=${content.id}">
                <dl>
                  <dt class="c-newsList__head">
                    <time datetime="${content.updatedAt}">${date}</time>
                    <span class="c-newsList__label">${content.category}</span>
                  </dt>
                  <dd>${content.title}</dd>
                </dl>
              </a>
            </li>
            `;
          } else {
            // 見出しのみ
            addItem = `
            <li class="c-newsList__item">
              <div class="c-newsList__contents">
                <dl>
                  <dt class="c-newsList__head">
                    <time datetime="${content.updatedAt}">${date}</time>
                    <span class="c-newsList__label">${content.category}</span>
                  </dt>
                  <dd>${content.title}</dd>
                </dl>
              </div>
            </li>
            `;
          }

          insertHtml.append(addItem);
        }

        // ページに挿入
        $("#js-getNewsList").append(insertHtml);

        // ----------------------------------------------
        // ページング
        // ----------------------------------------------
        const totalCount = json.totalCount;
        const pageCount = Math.ceil(totalCount / limit);
        const pager = `<ol class="c-pagination u-mt-sp-40">${
          // 前のページ
          paramPage >= 2
            ? `<li><a class="c-pagination__link" href="./?page=${
                paramPage - 1
              }&category=${paramCategory}"><img src="../assets/images/icon_arrow_left_bk.svg" alt="" width="24" height="24" title="前のページへ"></a></li>`
            : ""
        }${
          // 数字
          Array.from(Array(pageCount))
            .map((noValue, index) => {
              const targetPage = index + 1;
              return targetPage === paramPage
                ? `<li><span class="c-pagination__link is-current">${
                    index + 1
                  }</span></li>`
                : `<li><a class="c-pagination__link number" href="./?page=${
                    index + 1
                  }&category=${paramCategory}">${index + 1}</a></li>`;
            })
            .join("\n")
        }${
          //次のページ
          paramPage < pageCount
            ? `<li><a class="c-pagination__link" href='./?page=${
                paramPage + 1
              }&category=${paramCategory}'><img src="../assets/images/icon_arrow_right_bk.svg" alt="" width="24" height="24" title="次のページへ"></a></li>`
            : ""
        }</ol>`;

        // 表示件数より投稿が多いときのみページャーを表示
        if (limit < totalCount) {
          $("#js-paging").append(pager);
        }
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
