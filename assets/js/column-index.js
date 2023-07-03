import { getColumnList } from "./modules/get-column-list.js";

$(function () {
  // ----------------------------------------------
  // コラム一覧ページ
  // ----------------------------------------------

  // コラム一覧を取得
  getColumnList("./", 6);
});
