import { headerMenu } from "./modules/header-menu.js";
import { getSettings } from "./modules/get-settings.js";

$(function () {
  // microCMSの設定反映
  getSettings();

  // モバイルメニューの開閉
  headerMenu();
});
