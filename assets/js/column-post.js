import { getColumnDetail } from "./modules/get-column-details.js";
import { copyPageLink } from "./modules/copy-text.js";

$(function () {
  // ----------------------------------------------
  // コラム詳細ページ
  // ----------------------------------------------

  // コラム詳細を取得
  getColumnDetail();

  // コピーボタン
  copyPageLink();
});
