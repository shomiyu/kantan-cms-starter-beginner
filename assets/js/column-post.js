import { getColumnDetail } from "./modules/get-column-details.js";
import { copyPageLink } from "./functions/copy-page-link.js";

$(function () {
  // ----------------------------------------------
  // コラム詳細ページ
  // ----------------------------------------------

  // コラム詳細を取得
  getColumnDetail();

  // コピーボタン
  copyPageLink();
});
