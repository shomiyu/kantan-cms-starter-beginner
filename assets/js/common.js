import { headerMenu } from "./modules/header-menu.js";
import { getSettings } from "./modules/get-settings.js";

$(function () {
  // ----------------------------------------------
  // 全ページ共通
  // ----------------------------------------------

  // microCMSの設定取得
  getSettings();

  // モバイルメニューの開閉
  headerMenu();
});
