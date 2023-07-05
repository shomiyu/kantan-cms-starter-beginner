import { getColumnDetail } from "./modules/get-column-details.js";
import { copyPageLink } from "./functions/copy-page-link.js";
import { getColumnDraft } from "./modules/get-column-draft.js";
import { getParam } from "./functions/get-param.js";

$(function () {
  // ----------------------------------------------
  // コラム詳細ページ
  // ----------------------------------------------
  const draftKey = getParam("draftKey") ?? null;

  if (draftKey !== null) {
    // 下書きを取得
    getColumnDraft();
  } else {
    // コラム詳細を取得
    getColumnDetail();
  }

  // コピーボタン
  copyPageLink();
});
