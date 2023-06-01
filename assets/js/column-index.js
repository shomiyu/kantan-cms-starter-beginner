import { headerMenu } from "./modules/header-menu.js";
import { getSettings } from "./modules/get-settings.js";
import { getColumnList } from "./modules/get-column-list.js";

$(function () {
  // ----------------------------------------------
  // コラム一覧ページ
  // ----------------------------------------------

  // microCMSの設定取得
  getSettings();

  // モバイルメニューの開閉
  headerMenu();

  // コラム一覧を取得
  getColumnList("./", 20);
});
