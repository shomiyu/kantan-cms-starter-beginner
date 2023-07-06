![KANTAN! CMS STARTER for Beginner](https://images.microcms-assets.io/assets/3649ca4c219e401883022f9be8faf891/d443ce344a0f48e7881e117ce38025ca/ogp.jpg)

# KANTAN! CMS STARTER for Beginner

HTML と CSS と jQuery で出来る初心者向けの CMS です。
デモページのコラムでもセットアップやカスタマイズについて解説しているので併せてご覧ください。

[KANTAN! CMS STARTER](https://beginner.kantan-cms-starter.com/column/)

## 開発環境

コードエディタに Visual Studio Code（以下 VSCode）を使用します。
拡張機能「[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)」をインストールしておいてください。

## セットアップ

プロジェクトファイルをダウンロード・解凍したら、VSCode のアプリアイコンにフォルダごとドラッグ＆ドロップして VSCode を立ち上げ、右下隅の「Go Live」のリンクからローカルサーバを立ち上げます。<br>
※開発中は基本的にローカルサーバを立ち上げて作業してください。

`/assets/js/microcms.template.js`をコピーして`/assets/js/microcms.js`を作り、サービス ID と API キーを入力します。

```js
export const microcms = {
  SERVICE_ID: "your-site-name",
  API_KEY: "your-api-key",
};
```

設定は microCMS との連携のみで、あとはお好きに開発していただけます。

## デプロイ

フォーム機能で Netlify Forms を使用しているのでそのまま使用したい方は [Netlify](https://www.netlify.com/) を推奨しています。
フォルダごとドラッグ＆ドロップで公開・更新できます。

Xserver などのレンタルサーバーにアップする場合には FTP ツールでアップロードします。
