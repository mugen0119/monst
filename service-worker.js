const cacheName = 'monster-app-cache';
const filesToCache = [
  './', './index.html', './style.css', './game.js', './images/icon-192x192.png', 
  './images/icon-512x512.png', './images/monsterball.png', './images/room_background.jpg',
  './images/1.png', './images/2.png', './sounds/jump.mp3', './sounds/bgm.mp3',
  './sounds/battle.mp3', './sounds/enter.mp3', './sounds/win.mp3', './player/default.png',

  // 敵ポケモンのファイル
  './enemy/レディバ.png', './enemy/アーボ.png', './enemy/イーブイ.png', './enemy/ウリムー.png', './enemy/エイパム.png',
  './enemy/エネコ.png', './enemy/エリキテル.png', './enemy/エレズン.png', './enemy/オタチ.png', './enemy/カゲボウズ.png',
  './enemy/カモネギ.png', './enemy/キノココ.png', './enemy/キャタピー.png', './enemy/コイキング.png', './enemy/ココドラ.png',
  './enemy/コラッタ.png', './enemy/サッチムシ.png', './enemy/ジグザグマ.png', './enemy/スバメ.png', './enemy/スリープ.png',
  './enemy/タッツー.png', './enemy/タネボー.png', './enemy/チルット.png', './enemy/ディグダ.png', './enemy/デデンネ.png',
  './enemy/トゲピー.png', './enemy/トサキント.png', './enemy/ネイティ.png', './enemy/ハスボー.png', './enemy/パッチール.png',
  './enemy/バルキー.png', './enemy/ビードル.png', './enemy/ピチュー.png', './enemy/ヒメグマ.png', './enemy/ビリリダマ.png',
  './enemy/フカマル.png', './enemy/ホーホー.png', './enemy/ポチエナ.png', './enemy/ポッポ.png', './enemy/ポニータ.png',
  './enemy/ポワルン.png', './enemy/マダツボミ.png', './enemy/ミノムッチ.png', './enemy/メリープ.png', './enemy/ヤンチャム.png',
  './enemy/ヨーギラス.png', './enemy/ヨマワル.png', './enemy/ラルトス.png',

  './enemy2/リオル.png', './enemy2/ウッウ.png', './enemy2/エルフーン.png', './enemy2/オノンド.png', './enemy2/カジリガメ.png',
  './enemy2/ガバイト.png', './enemy2/ガラルポニータ.png', './enemy2/キマワリ.png', './enemy2/キルリア.png', './enemy2/グレイシア.png',
  './enemy2/ゴーリキー.png', './enemy2/コクーン.png', './enemy2/ゴチミル.png', './enemy2/コドラ.png', './enemy2/コノハナ.png',
  './enemy2/ゴンベ.png', './enemy2/サクラビス.png', './enemy2/サンダース.png', './enemy2/サンドパン.png', './enemy2/シャワーズ.png',
  './enemy2/ズガイドス.png', './enemy2/ソーナンス.png', './enemy2/チラチーノ.png', './enemy2/チリーン.png', './enemy2/ドーブル.png',
  './enemy2/ドロンチ.png', './enemy2/ニドリーノ.png', './enemy2/ニューラ.png', './enemy2/ニョロゾ.png', './enemy2/パウワウ.png',
  './enemy2/バオッキー.png', './enemy2/パチリス.png', './enemy2/ビーダル.png', './enemy2/ピカチュウ.png', './enemy2/ピジョン.png',
  './enemy2/ブイゼル.png', './enemy2/ブースター.png', './enemy2/プラスル.png', './enemy2/ヘイガニ.png', './enemy2/ヘラクロス.png',
  './enemy2/ベロリンガ.png', './enemy2/マイナン.png', './enemy2/マッスグマ.png', './enemy2/マホイップ.png', './enemy2/ミミロル.png',
  './enemy2/ムチュール.png', './enemy2/メタング.png', './enemy2/ユンゲラー.png', './enemy2/ラッキー.png', './enemy2/リーフィア.png',

  './enemy3/ローブシン.png', './enemy3/アブソル.png', './enemy3/アマージョ.png', './enemy3/イワーク.png', './enemy3/ウインディ.png',
  './enemy3/ウーラオス.png', './enemy3/ウォーグル.png', './enemy3/オーロンゲ.png', './enemy3/オノノクス.png', './enemy3/カイリュー.png',
  './enemy3/カビゴン.png', './enemy3/ガブリアス.png', './enemy3/ギャラドス.png', './enemy3/ギャロップ.png', './enemy3/キュウコン.png',
  './enemy3/ギルガルド.png', './enemy3/グソクムシャ.png', './enemy3/クリムガン.png', './enemy3/グレンアルマ.png', './enemy3/クロバット.png',
  './enemy3/ゲンガー.png', './enemy3/サーナイト.png', './enemy3/サイドン.png', './enemy3/シビルドン.png', './enemy3/ジャラランガ.png',
  './enemy3/ストリンダー.png', './enemy3/ソウブレイズ.png', './enemy3/ゾロアーク.png', './enemy3/タチフサグマ.png', './enemy3/チルタリス.png',
  './enemy3/デスカーン.png', './enemy3/ドオー.png', './enemy3/ドクロッグ.png', './enemy3/ドラパルト.png', './enemy3/ドラピオン.png',
  './enemy3/ドレディア.png', './enemy3/トロピウス.png', './enemy3/ナッシー.png', './enemy3/ヌメルゴン.png', './enemy3/バタフリー.png',
  './enemy3/ハリテヤマ.png', './enemy3/バンギラス.png', './enemy3/ピジョット.png', './enemy3/フーディン.png', './enemy3/ブーバーン.png',
  './enemy3/フラージェス.png', './enemy3/フライゴン.png', './enemy3/ヘイラッシャ.png', './enemy3/ヘルガー.png', './enemy3/ボーマンダ.png',
  './enemy3/ミロカロス.png', './enemy3/ムーランド.png', './enemy3/ムクホーク.png', './enemy3/ラムパルド.png', './enemy3/リングマ.png',
  './enemy3/ルージュラ.png', './enemy3/ルカリオ.png', './enemy3/ルガルガン.png', './enemy3/ルンパッパ.png',

  './enemy4/レックウザ.png', './enemy4/アルセウス.png', './enemy4/イベルタル.png', './enemy4/エンテイ.png', './enemy4/カイオーガ.png',
  './enemy4/ギラティナ.png', './enemy4/グラードン.png', './enemy4/ザシアン.png', './enemy4/ザマゼンタ.png', './enemy4/サンダー.png',
  './enemy4/ジラーチ.png', './enemy4/スイクン.png', './enemy4/ゼクロム.png', './enemy4/ゼルネアス.png', './enemy4/セレビィ.png',
  './enemy4/ソルガレオ.png', './enemy4/ダークライ.png', './enemy4/ディアルガ.png', './enemy4/デオキシス.png', './enemy4/パルキア.png',
  './enemy4/ファイヤー.png', './enemy4/フリーザー.png', './enemy4/ホウオウ.png', './enemy4/ミュウ.png', './enemy4/ミュウツー.png',
  './enemy4/ライコウ.png', './enemy4/ラティアス.png', './enemy4/ラティオス.png', './enemy4/ルギア.png', './enemy4/ルナアーラ.png',
  './enemy4/レシラム.png'
];

// Service Worker のインストール
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// キャッシュの有効化 (古いキャッシュを削除)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName]; // 保持したいキャッシュ名

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!cacheWhitelist.includes(cache)) {
            console.log(`Deleting cache: ${cache}`);
            return caches.delete(cache); // 古いキャッシュを削除
          }
        })
      );
    })
  );
});

// URLの正規化関数
function normalizeUrl(url) {
  // URLから 'public' を除去
  return url.replace('/public/', '/');
}

// fetch イベントの処理
self.addEventListener('fetch', (event) => {
  // リクエストの URL を正規化してキャッシュに一致するように調整
  const normalizedUrl = normalizeUrl(event.request.url);
  
  event.respondWith(
    caches.match(normalizedUrl).then((response) => {
      return response || fetch(event.request);
    }).catch((error) => {
      console.error('Fetch error:', error);
    })
  );
});
