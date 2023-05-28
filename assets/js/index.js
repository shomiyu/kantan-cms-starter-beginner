import { headerMenu } from "./modules/header-menu.js";
import { getSettings } from "./modules/get-settings.js";
import { getNewsList } from "./modules/get-news-list.js";
import { getColumnList } from "./modules/get-column-list.js";

$(function () {
  // microCMSの設定反映
  getSettings();

  // モバイルメニューの開閉
  headerMenu();

  // お知らせ一覧を取得
  getNewsList();

  // コラム一覧を取得
  getColumnList();
});
