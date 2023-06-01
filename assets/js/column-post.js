import { headerMenu } from "./modules/header-menu.js";
import { getSettings } from "./modules/get-settings.js";
import { getColumnDetail } from "./modules/get-column-details.js";

$(function () {
  // ----------------------------------------------
  // コラム一覧ページ
  // ----------------------------------------------

  // - microCMSの設定取得
  getSettings();

  // - モバイルメニューの開閉
  headerMenu();

  // コラム詳細を取得
  getColumnDetail();
});
