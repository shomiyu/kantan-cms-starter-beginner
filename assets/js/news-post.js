import { headerMenu } from "./modules/header-menu.js";
import { getSettings } from "./modules/get-settings.js";
import { getNewsDetail } from "./modules/get-news-details.js";

$(function () {
  // ----------------------------------------------
  // コラム一覧ページ
  // ----------------------------------------------

  // - microCMSの設定取得
  getSettings();

  // - モバイルメニューの開閉
  headerMenu();

  // - お知らせ詳細を取得
  getNewsDetail();
});
