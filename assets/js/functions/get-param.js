/**
 * ----------------------------------------------
 * URLからパラメータの値を取得する
 * --
 * @param {string} name - 値を抽出したいパラメーターのキー
 * @param {string} url - 抽出するURL
 * @return {string}
 * ----------------------------------------------
 */
export const getParam = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};
