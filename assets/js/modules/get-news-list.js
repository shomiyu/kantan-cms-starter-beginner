import { microcms } from "../microcms.js";
import { formatDate } from "../functions/format-date.js";
import { setPagination } from "../functions/set-pagination.js";
import { switchCategory } from "../functions/switch-category.js";

export const getNewsList = (path, limit) => {
  // カテゴリを増やす場合はcategoryListにも追加する
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
