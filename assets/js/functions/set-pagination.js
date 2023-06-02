/**
 * ----------------------------------------------
 * ページネーションを出力
 * --
 * @param {number} totalCount     - microCMSのtotalCount
 * @param {number} limit          - 1ページに表示する記事の上限数
 * @param {number} paramPage      - 何ページ目か
 * @param {string} paramCategory  - 指定するカテゴリー
 * ----------------------------------------------
 */
export const setPagination = (totalCount, limit, paramPage, paramCategory) => {
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
    $("#js-setPagination").append(pager);
  }
};
