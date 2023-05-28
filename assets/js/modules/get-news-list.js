import { microcms } from "../microcms.js";

export const getNewsList = () => {
  // 日付のフォーマット関数
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const delimiter = ".";
    return `${date.getFullYear()}${delimiter}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${delimiter}${date
      .getDate()
      .toString()
      .padStart(2, "0")}`.replace(/\n|\r/g, "");
  };

  // 記事の取得上限数
  const limit = 3;

  $(function () {
    fetch(
      `https://${microcms.SERVICE_ID}.microcms.io/api/v1/news?limit=${limit}`,
      {
        headers: {
          "X-MICROCMS-API-KEY": microcms.API_KEY,
        },
      }
    )
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
              <a class="c-newsList__contents" href="./news/?id=${content.id}">
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
      });
  });
};
