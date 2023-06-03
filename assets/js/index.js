import { headerMenu } from "./modules/header-menu.js";
import { getSettings } from "./modules/get-settings.js";
import { getNewsList } from "./modules/get-news-list.js";
import { getColumnList } from "./modules/get-column-list.js";
import { setMainVisual } from "./modules/set-main-visual.js";

$(function () {
  // ----------------------------------------------
  // TOPページ
  // ----------------------------------------------

  // microCMSの設定取得
  getSettings();

  // モバイルメニューの開閉
  headerMenu();

  // メインビジュアル設定
  setMainVisual();

  // お知らせ一覧を取得
  getNewsList("./news/", 3);

  // コラム一覧を取得
  getColumnList("./column/", 4);
});
