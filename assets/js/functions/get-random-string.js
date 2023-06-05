/**
 * ----------------------------------------------
 * ランダムの文字列を生成する
 * --
 * @param {number} digit - 桁数
 * @return {string}
 * ----------------------------------------------
 */
export const getRandomString = (digit) => {
  const patterns = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let val = "";

  for (let i = 0; i < digit; i++) {
    val += patterns[Math.floor(Math.random() * patterns.length)] + "";
  }

  return val;
};
