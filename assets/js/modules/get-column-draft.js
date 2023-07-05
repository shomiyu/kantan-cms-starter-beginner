import { microcms } from "../microcms.js";
import { formatDate } from "../functions/format-date.js";
import { getParam } from "../functions/get-param.js";

/**
 * ----------------------------------------------
 * コラムプレビュー取得
 * ----------------------------------------------
 */
export const getColumnDraft = () => {
  $(function () {
    const postId = getParam("id");
    const draftKey = getParam("draftKey");

    fetch(
      `https://${microcms.SERVICE_ID}.microcms.io/api/v1/column/${postId}?draftKey=${draftKey}`,
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
        for (const content of json.body) {
          if (content.fieldId === "balloon") {
            /*
              パーツ - 吹き出し
            ---------------------------------------------- */
            let layout = "left";
            if (content.layout[0] === "画像が右") {
              layout = "right";
            }

            const addItem = `
              <div class="c-balloon c-balloon--${layout}">
                <figure class="c-balloon__image">
                  <img src="${content.image.url}" alt="" width="${content.image.width}" height="${content.image.height}" />
                </figure>
                <p class="c-balloon__text">${content.balloon}</p>
              </div>
            `;
            $("#js-post").append(addItem);
          } else if (content.fieldId === "button") {
            /*
              パーツ - ボタン
            ---------------------------------------------- */
            const link = `
              <div class="u-mt-sp-24 u-mb-sp-40 u-text-center">
                <a class="c-button c-button--${content.theme}" href="${content.button_link}">${content.button_text}</a>
              </div>
            `;
            const externalLink = `
              <div class="u-mt-sp-24 u-mb-sp-40 u-text-center">
                <a class="c-button c-button--${content.theme} c-button--external" href="${content.button_link}" target="_blank" rel="noopener noreferrer">${content.button_text}</a>
              </div>
            `;

            if (content.external_link) {
              $("#js-post").append(externalLink);
            } else {
              $("#js-post").append(link);
            }
          } else if (content.fieldId === "checkPannel") {
            /*
              パーツ - チェックパネル
            ---------------------------------------------- */
            const addItem = `
              <div class="c-checkPannel">
                <dl class="c-checkPannel__inner">
                  <dt class="c-checkPannel__heading">${content.heading}</dt>
                  <dd class="c-checkPannel__text">${content.text}</dd>
                </dl>
              </div>
            `;
            $("#js-post").append(addItem);
          } else if (content.fieldId === "carousel") {
            /*
              パーツ - カルーセル
            ---------------------------------------------- */
            const images = content.images;
            const param = getRandomString(6);

            $("#js-post").append(
              `<div class="swiper mySwiper${param} c-carousel"></div>`
            );
            $(`#js-post .mySwiper${param}`).append(
              '<div class="swiper-wrapper"></div>'
            );

            if (content.navigation) {
              $(`#js-post .mySwiper${param}`).append(`
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
              `);
            }

            if (content.pagination) {
              $(`#js-post .mySwiper${param}`).append(
                '<div class="swiper-pagination"></div>'
              );
            }

            if (content.scrollbar) {
              $(`#js-post .mySwiper${param}`).append(
                '<div class="swiper-scrollbar"></div>'
              );
            }

            for (const image of images) {
              const addItem = `
                <div class="swiper-slide">
                  <img src="${image.url}" alt="" width="${image.width}" height="${image.height}" />
                </div>
              `;
              $(`#js-post .mySwiper${param} .swiper-wrapper`).append(addItem);
            }

            // Swiper init
            var swiper = new Swiper(`.mySwiper${param}`, {
              effect: content.effect[0],
              loop: content.loop,
              autoplay: {
                delay: content.delay_speed,
              },
              speed: content.animation_speed,
              pagination: {
                el: content.pagination ? ".swiper-pagination" : "",
              },
              navigation: {
                nextEl: content.navigation ? ".swiper-button-next" : "",
                prevEl: content.navigation ? ".swiper-button-prev" : "",
              },
              scrollbar: {
                el: content.scrollbar ? ".swiper-scrollbar" : "",
              },
            });
          } else if (content.fieldId === "editor") {
            /*
              パーツ - リッチエディタ
            ---------------------------------------------- */
            const addItem = `
              <div class="c-postEditor">${content.editor}</div>
            `;
            $("#js-post").append(addItem);
          }
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
