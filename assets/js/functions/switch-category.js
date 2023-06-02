/**
 * ----------------------------------------------
 * カテゴリーの切り替え
 * --
 * @param {string} className - 切り替えるカテゴリーのclass
 * ----------------------------------------------
 */
export const switchCategory = (className) => {
  $(document).on("click", className, function () {
    const targetCategoryName = $(this).attr("data-category");
    window.location.href = `./?page=1&category=${targetCategoryName}`;
  });
};
