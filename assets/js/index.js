import { getNewsList } from "./modules/get-news-list.js";
import { getColumnList } from "./modules/get-column-list.js";
import { setMainVisual } from "./modules/set-main-visual.js";

$(function () {
  // ----------------------------------------------
  // TOPページ
  // ----------------------------------------------

  // メインビジュアル設定
  setMainVisual();

  // お知らせ一覧を取得
  getNewsList("./news/", 3);

  // コラム一覧を取得
  getColumnList("./column/", 4);
});
