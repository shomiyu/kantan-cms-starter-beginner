import { getNewsDetail } from "./modules/get-news-details.js";
import { getNewsDraft } from "./modules/get-news-draft.js";
import { getParam } from "./functions/get-param.js";

$(function () {
  // ----------------------------------------------
  // お知らせ詳細ページ
  // ----------------------------------------------
  const draftKey = getParam("draftKey") ?? null;

  if (draftKey !== null) {
    // 下書きを取得
    getNewsDraft();
  } else {
    // お知らせ詳細を取得
    getNewsDetail();
  }
});
