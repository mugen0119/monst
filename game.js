// キャンバスとコンテキストを取得
const canvas = document.getElementById('creatureCanvas');
const ctx = canvas.getContext('2d');

// プレイヤーの選択したポケモンの表示
let selectedPokemon = null;
let pokemonX = 0; // ポケモンの位置
let direction = 1; // ポケモンの移動方向
let enemyPokemon = null;  // 野生のポケモン
let isBattleActive = false;  // 戦闘中かどうか
let caughtPokemons = []; // 捕まえたポケモンのリスト
let encounteredPokemons = []; // プレイヤーが遭遇したポケモンのリスト

// ポケモンの動きをランダムにするためのパラメータ
let verticalOffset = 0;
let verticalDirection = 1;

// HPバーのデフォルト設定
let playerHP = 100;
let enemyHP = 100;

// サウンドを追加
const jumpSound = new Audio('./sounds/jump.mp3'); // ポケモンが跳ねた時の音
// サウンドを追加
const bgm = new Audio('./sounds/bgm.mp3');  // 通常時のBGM
const battleMusic = new Audio('./sounds/battle.mp3');  // バトル時のBGM
const enterSound = new Audio('./sounds/enter.mp3');  // ボタンを押した時の効果音
// 勝利時の音楽オブジェクトを定義
const winMusic = new Audio();
winMusic.src = './sounds/win.mp3';  // mp3ファイル
winMusic.onerror = function() {
  winMusic.src = './sounds/win.ogg';  // mp3が再生できない場合oggに切り替え
};


// BGMはループ再生
bgm.loop = true;
battleMusic.loop = true;


// タイプ別ポケモンリスト
const firePokemons = ['ヒトカゲ', 'ヒノアラシ', 'アチャモ', 'ヒコザル', 'ポカブ', 'フォッコ', 'ニャビー', 'ホゲータ'];
const waterPokemons = ['ゼニガメ', 'ワニノコ', 'ミズゴロウ', 'ポッチャマ', 'ミジュマル', 'ケロマツ', 'アシマリ', 'クワッス'];
const grassPokemons = ['フシギダネ', 'チコリータ', 'キモリ', 'ナエトル', 'ツタージャ', 'ハリマロン', 'モクロー', 'ニャオハ'];

window.onload = function() {
  // 初期音量を設定する
  const initialVolume = 0.5;  // 初期音量
  document.getElementById('volumeRange').value = initialVolume;
  setVolume(initialVolume);

  // サウンド要素すべての音量を調整する関数
  function setVolume(volume) {
      bgm.volume = volume;
      battleMusic.volume = volume;
      winMusic.volume = volume;
      enterSound.volume = volume;
      jumpSound.volume = volume;
  }

  // 音量バーの変更イベントを監視
  document.getElementById('volumeRange').addEventListener('input', function(event) {
      const volume = event.target.value;
      setVolume(volume);
  });

  // タイプ選択モーダルの表示
  document.getElementById('typeSelectionModal').style.display = 'block';
  
  // 戦闘コマンドを初期非表示にする
  document.getElementById('battleCommands').style.display = 'none'; 

  // ゲーム開始時に通常BGMを再生
  playBGM();

  // ボタンにクリックイベントを追加して、効果音を再生
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playEnterSound);  // ボタンをクリックした時に効果音
  });
};




document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', playEnterSound);  // ボタンをクリックした時に効果音を再生
});



// プレイヤーが選んだタイプに応じてランダムにポケモンを割り当てる関数
function assignRandomPokemon(type) {
  let selectedPokemon;
  if (type === 'fire') {
    selectedPokemon = firePokemons[Math.floor(Math.random() * firePokemons.length)];
  } else if (type === 'water') {
    selectedPokemon = waterPokemons[Math.floor(Math.random() * waterPokemons.length)];
  } else if (type === 'grass') {
    selectedPokemon = grassPokemons[Math.floor(Math.random() * grassPokemons.length)];
  }
  return selectedPokemon;
}

// タイプをボタンで選択する関数
function selectPokemonType(type) {
  selectedPokemon = assignRandomPokemon(type);  // 選ばれたタイプに基づいてランダムにポケモンを割り当てる
  showMessageModal(`${selectedPokemon} が選ばれました！`);  // 選ばれたポケモン名をアラートで表示
  drawPokemon();  // キャンバスにポケモンを描画
  
  // ポケモンの名前をHTML要素に表示
  document.getElementById('pokemonNameDisplay').textContent = selectedPokemon;  // ポケモンの名前を表示
  
  document.getElementById('typeSelectionModal').style.display = 'none';  // タイプ選択画面を非表示にする
}


// 通常時のBGMを再生
function playBGM() {
  if (winMusic.paused) {  // winMusicが再生中でない場合のみ通常BGMを再生
    battleMusic.pause();  // バトルBGMを停止
    bgm.currentTime = 0;  // 通常BGMをリセット
    bgm.play().catch(error => {
      console.error("BGMの再生に失敗しました:", error);
    });
  }
}


// 勝利時の音楽再生後、通常のBGMを再開
winMusic.addEventListener('ended', function() {
  playBGM();  // winMusicが終了したら通常BGMを再開
});


// ユーザーが操作した後にBGMを再生
document.body.addEventListener('click', function() {
  playBGM();
}, { once: true });  // 最初のクリックで一度だけBGMを再生

// バトル時のBGMを再生
function playBattleMusic() {
  bgm.pause();  // 通常BGMを停止
  battleMusic.currentTime = 0;  // バトルBGMをリセット
  battleMusic.play().catch(error => console.error('Battle music play error:', error));  // バトルBGMを再生
}

// ボタンを押した時の効果音
function playEnterSound() {
  enterSound.currentTime = 0;  // 効果音をリセット
  enterSound.play();  // 効果音を再生
}





// ポケモンをキャンバス内に描画する関数
function drawPokemon() {
  if (!selectedPokemon) {
    console.error("選択されたポケモンがありません。");
    return;
  }
  const img = new Image();
  img.src = `./player/${selectedPokemon}.png`;  // 選ばれたポケモンの画像を読み込む
  img.onerror = function() {
    img.src = './player/default.png';  // 404の場合デフォルト画像に切り替える
  };
  img.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
    ctx.drawImage(img, pokemonX, verticalOffset, canvas.width / 2, canvas.height / 2); // キャンバスにポケモンを描画
  };
}



// 捕まえたポケモンが遊びに来る制御変数
let isVisiting = false; // 誰かが遊びに来ているかどうか
let visitDuration = 7000; // 10秒後に帰る
let visitingPokemon = null; // 遊びに来ているポケモン
let visitingPokemonX = 0; // 遊びに来たポケモンのX座標
let visitingDirection = 1; // 遊びに来たポケモンの移動方向

// 捕まえたポケモンがランダムに遊びに来る
// 捕まえたポケモンがランダムに遊びに来る
function randomCaughtPokemonVisit() {
  if (isVisiting || caughtPokemons.length === 0) return; // すでに遊びに来ているか、捕まえたポケモンがいない場合は終了

  // ランダムで遊びに来るポケモンを選ぶ
  const randomIndex = Math.floor(Math.random() * caughtPokemons.length);
  visitingPokemon = caughtPokemons[randomIndex]; // 捕まえたポケモンのオブジェクトを選択
  visitingPokemonX = Math.random() * canvas.width; // ランダムなX座標
  isVisiting = true;

  setTimeout(() => {
    isVisiting = false; // 一定時間経過後に帰る
    visitingPokemon = null; // ポケモンが帰る
  }, visitDuration);
}




// 捕まえたポケモンのフォルダを正確に保持して再表示する
function animateVisitingPokemon() {
  if (!isVisiting || !visitingPokemon) return; 

  visitingPokemonX += visitingDirection * 2;

  if (visitingPokemonX > canvas.width - 50 || visitingPokemonX < 0) {
    visitingDirection *= -1;
  }

  const folder = visitingPokemon.folder || getEnemyFolderForVisitingPokemon(visitingPokemon); // 捕まえたポケモンのフォルダ情報を取得

  const visitImg = new Image();
  visitImg.src = `./${folder}/${visitingPokemon.name}.png`;

  // フォルダに基づいてポケモンのサイズを変更
  let pokemonSize = 50; // デフォルトサイズ
  if (folder === 'enemy') {
    pokemonSize = 50; // 小さいポケモン
  } else if (folder === 'enemy2') {
    pokemonSize = 70; // 少し大きいポケモン
  } else if (folder === 'enemy3') {
    pokemonSize = 90; // さらに大きいポケモン
  } else if (folder === 'enemy4') {
    pokemonSize = 120; // 一番大きいポケモン
  }

  visitImg.onload = function() {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over'; 
    ctx.drawImage(visitImg, visitingPokemonX, canvas.height / 2, pokemonSize, pokemonSize); // サイズを適用して描画
    ctx.restore();
  };

  visitImg.onerror = function() {
    console.error(`画像が見つかりません: /${folder}/${visitingPokemon.name}.png`);
  };
}







// 捕まえたポケモンがどのフォルダに属するか判定する関数
function getEnemyFolderForVisitingPokemon(pokemon) {
  // 捕まえたポケモンに対して適切なフォルダを割り当てる
  const level = pokemonStats.level;

  if (level >= 30) {
    return 'enemy4';
  } else if (level >= 20) {
    return 'enemy3';
  } else if (level >= 10) {
    return 'enemy2';
  } else {
    return 'enemy';
  }
}




// メッセージモーダルを開く
function showMessageModal(message, shouldPlayWinMusic = false) {
  document.getElementById('modalMessage').textContent = message;
  document.getElementById('messageModal').style.display = 'block';

  // 勝利時のみ win.mp3 を再生し、通常BGMを停止
  if (shouldPlayWinMusic) {
    bgm.pause();  // 通常BGMを停止
    battleMusic.pause();  // バトルBGMを停止
    winMusic.currentTime = 0;  // win.mp3の再生位置をリセット
    winMusic.play().catch(error => console.error('Win music play error:', error));  // win.mp3を再生
  }
}

// メッセージモーダルを閉じる
function closeMessageModal() {
  document.getElementById('messageModal').style.display = 'none';

  // 勝利時に win.mp3 を停止して通常BGMを再生
  winMusic.pause();

  // 通常BGMを再生
  if (bgm.paused) {
    bgm.currentTime = 0;  // 通常BGMの再生位置をリセット
    bgm.play().catch(error => console.error('BGM play error:', error));  // 通常BGMを再生
  }
}


function drawHPBars() {
  // プレイヤーのHPバー
  ctx.fillStyle = "green";
  ctx.fillRect(10, 10, playerHP, 100);

  // 敵ポケモンのHPバー
  ctx.fillStyle = "red";
  ctx.fillRect(canvas.width - 110, 10, enemyHP, 100);
}


// ポケモンをクリックしたときのアクション（ジャンプと鳴く）
canvas.addEventListener('click', () => {
  if (selectedPokemon) {
    jumpSound.play(); // 跳ねる音を再生
    verticalOffset -= 20; // ジャンプ
    setTimeout(() => verticalOffset = 0, 500); // 元の位置に戻る
  }
});

// ポケモンのランダムな動きとジャンプ
function animatePokemon() {
  if (isBattleActive) return; // 戦闘中はアニメーションを停止

  // ランダムに方向を変えるロジック
  if (Math.random() < 0.3) {  // 小さな確率で方向を変える
    direction = Math.random() < 0.5 ? -1 : 1; // 左右ランダムに方向を変える
  }

  pokemonX += direction * (Math.random() * 6 + 4); // 移動速度を上げる（最小2、最大7）

  // 画面の端に行くと方向を変える
  if (pokemonX > canvas.width - 50) {
    direction = -1;
  } else if (pokemonX < 0) {
    direction = 1;
  }

  // キャンバスの下半分に限定して、ポケモンを上下に移動
  const lowerBound = canvas.height / 2;  // 下半分の開始位置
  const upperBound = canvas.height - 50; // 下端から少し手前の位置

  // 現在の位置が上下の範囲を超えないように制御
  verticalOffset += verticalDirection * (Math.random() * 4 + 2); // 上下移動の速度を設定

  if (verticalOffset > upperBound) {
    verticalDirection = -1;
    verticalOffset = upperBound;
  } else if (verticalOffset < lowerBound) {
    verticalDirection = 1;
    verticalOffset = lowerBound;
  }

  // ポケモンをキャンバスに描画
  drawPokemon();
  
  // HPバーは戦闘中のみ表示
  if (isBattleActive) {
    drawHPBars(); // HPバーを描画
  }
}




// ステータスの初期値
let pokemonStats = {
  hunger: 0, // 初期値を0に設定
  cleanliness: 100,
  stamina: 100,
  experience: 0,
  affection: 0,
  level: 5,
  moves: [] // 覚えた技を管理
};

const moveSets = {
  // ヒトカゲ系統
  'ヒトカゲ': ['ひのこ', 'きりさく'],
  'リザード': ['かえんほうしゃ', 'メタルクロー'],
  'リザードン': ['だいもんじ', 'ドラゴンクロー'],

  // ゼニガメ系統
  'ゼニガメ': ['みずでっぽう', 'アクアジェット'],
  'カメール': ['バブルこうせん', 'かみつく'],
  'カメックス': ['ハイドロポンプ', 'ロケットずつき'],

  // フシギダネ系統
  'フシギダネ': ['つるのムチ', 'はっぱカッター'],
  'フシギソウ': ['ソーラービーム', 'どくのこな'],
  'フシギバナ': ['ハードプラント', 'ギガドレイン'],

  // ヒノアラシ系統
  'ヒノアラシ': ['ひのこ', 'えんまく'],
  'マグマラシ': ['かえんほうしゃ', 'スピードスター'],
  'バクフーン': ['だいもんじ', 'オーバーヒート'],

  // ワニノコ系統
  'ワニノコ': ['みずでっぽう', 'こおりのキバ'],
  'アリゲイツ': ['あばれる', 'かみくだく'],
  'オーダイル': ['ハイドロカノン', 'クラブハンマー'],

  // チコリータ系統
  'チコリータ': ['はっぱカッター', 'つるのムチ'],
  'ベイリーフ': ['ソーラービーム', 'リフレクター'],
  'メガニウム': ['ハードプラント', 'じしん'],

  // アチャモ系統
  'アチャモ': ['ひのこ', 'ニトロチャージ'],
  'ワカシャモ': ['かえんほうしゃ', 'スカイアッパー'],
  'バシャーモ': ['ブレイズキック', 'フレアドライブ'],

  // ミズゴロウ系統
  'ミズゴロウ': ['みずでっぽう', 'どろかけ'],
  'ヌマクロー': ['マッドショット', 'れいとうパンチ'],
  'ラグラージ': ['じしん', 'ハイドロカノン'],

  // キモリ系統
  'キモリ': ['はっぱカッター', 'リーフブレード'],
  'ジュプトル': ['リーフストーム', 'かげぶんしん'],
  'ジュカイン': ['ハードプラント', 'ドラゴンクロー'],

  // ヒコザル系統
  'ヒコザル': ['ひのこ', 'マッハパンチ'],
  'モウカザル': ['かえんほうしゃ', 'インファイト'],
  'ゴウカザル': ['フレアドライブ', 'もえつきる'],

  // ポッチャマ系統
  'ポッチャマ': ['あわ', 'はたく'],
  'ポッタイシ': ['バブルこうせん', 'メタルクロー'],
  'エンペルト': ['ハイドロポンプ', 'ドリルくちばし'],

  // ナエトル系統
  'ナエトル': ['はっぱカッター', 'たいあたり'],
  'ハヤシガメ': ['ソーラービーム', 'のしかかり'],
  'ドダイトス': ['ハードプラント', 'じしん'],

  // ポカブ系統
  'ポカブ': ['ひのこ', 'たいあたり'],
  'チャオブー': ['ニトロチャージ', 'のしかかり'],
  'エンブオー': ['フレアドライブ', 'アームハンマー'],

  // ミジュマル系統
  'ミジュマル': ['みずでっぽう', 'シェルブレード'],
  'フタチマル': ['アクアジェット', 'みずのはどう'],
  'ダイケンキ': ['ハイドロカノン', 'れいとうビーム'],

  // ツタージャ系統
  'ツタージャ': ['はっぱカッター', 'グラスミキサー'],
  'ジャノビー': ['リーフブレード', 'とぐろをまく'],
  'ジャローダ': ['ハードプラント', 'リーフストーム'],

  // フォッコ系統
  'フォッコ': ['ひのこ', 'サイケこうせん'],
  'テールナー': ['かえんほうしゃ', 'マジカルフレイム'],
  'マフォクシー': ['オーバーヒート', 'サイコキネシス'],

  // ケロマツ系統
  'ケロマツ': ['あわ', 'みずのはどう'],
  'ゲコガシラ': ['アクアジェット', 'みずしゅりけん'],
  'ゲッコウガ': ['ハイドロカノン', 'つじぎり'],

  // ハリマロン系統
  'ハリマロン': ['たいあたり', 'タネマシンガン'],
  'ハリボーグ': ['タネばくだん', 'のしかかり'],
  'ブリガロン': ['ハードプラント', 'じしん'],

  // ニャビー系統
  'ニャビー': ['ひのこ', 'にどげり'],
  'ニャヒート': ['かえんほうしゃ', 'クロスチョップ'],
  'ガオガエン': ['フレアドライブ', 'DDラリアット'],

  // アシマリ系統
  'アシマリ': ['あわ', 'みずのはどう'],
  'オシャマリ': ['バブルこうせん', 'ハイパーボイス'],
  'アシレーヌ': ['ムーンフォース', 'ハイドロポンプ'],

  // モクロー系統
  'モクロー': ['はっぱカッター', 'タネばくだん'],
  'フクスロー': ['リーフブレード', 'シャドーボール'],
  'ジュナイパー': ['ゴーストダイブ', 'リーフストーム'],

  // ホゲータ系統
  'ホゲータ': ['ひのこ', 'たいあたり'],
  'アチゲータ': ['かえんほうしゃ', 'きあいだま'],
  'ラウドボーン': ['オーバーヒート', 'シャドーボール'],

  // クワッス系統
  'クワッス': ['みずでっぽう', 'つばさでうつ'],
  'ウェルカモ': ['アクアジェット', 'ブレイブバード'],
  'ウェーニバル': ['ハイドロポンプ', 'ブレイズキック'],

  // ニャオハ系統
  'ニャオハ': ['はっぱカッター', 'たいあたり'],
  'ニャローテ': ['マジカルリーフ', 'かげぶんしん'],
  'マスカーニャ': ['リーフストーム', 'シャドークロー']
};


// ゲージの更新
function updateStats() {
  document.getElementById('hungerBar').style.width = pokemonStats.hunger + '%';
  document.getElementById('cleanlinessBar').style.width = pokemonStats.cleanliness + '%';
  document.getElementById('staminaBar').style.width = pokemonStats.stamina + '%';
  document.getElementById('experienceBar').style.width = pokemonStats.experience + '%';
  document.getElementById('pokemonLevel').textContent = `レベル: ${pokemonStats.level}`; // レベル表示
}

// 各ステータスの自動減少/回復
function updateAutoStats() {
  // おなかときれいさは時間とともに減少
  pokemonStats.hunger = Math.max(0, pokemonStats.hunger - 0.1);
  pokemonStats.cleanliness = Math.max(0, pokemonStats.cleanliness - 0.08);

  // スタミナは時間とともに回復
  pokemonStats.stamina = Math.min(100, pokemonStats.stamina + 1.9);

  updateStats();  // ゲージを更新
}

// 各アクションの処理
function feedPokemon() {
  const speechBubble = document.getElementById('speechBubble');
  const speechBubbleImage = document.getElementById('speechBubbleImage');
  
  if (!speechBubble || !speechBubbleImage) {
    console.error("吹き出し要素が見つかりませんでした。IDを確認してください。");
    return;
  }

  if (pokemonStats.hunger < 100) {
    pokemonStats.hunger += 10;
    pokemonStats.affection += 5;
    pokemonStats.experience += 20;

    try {
      speechBubbleImage.src = './images/1.png';

      // ポケモンの現在位置に合わせて吹き出しの位置を動的に設定
      const bubbleX = pokemonX + canvas.offsetLeft + canvas.width / 30 + (canvas.width / 2) - (speechBubble.offsetWidth / 2); // 右上に調整
      const bubbleY = verticalOffset + canvas.offsetTop - 20; // ポケモンのY座標に基づき、少し上に表示

      speechBubble.style.left = `${bubbleX}px`;
      speechBubble.style.top = `${bubbleY}px`;

      speechBubble.style.visibility = 'visible';  // 吹き出しを表示
      console.log("ご飯をあげました。吹き出し 1.png を表示中。");

      setTimeout(() => {
        speechBubble.style.visibility = 'hidden'; // 吹き出しを非表示にする
        console.log("吹き出しが非表示になりました。");
      }, 1000);
    } catch (error) {
      console.error("吹き出しを表示中にエラーが発生しました:", error);
    }
  } else {
    showMessageModal("お腹がいっぱいです！");
    try {
      speechBubbleImage.src = './images/2.png';

      // 同様に吹き出しの位置をポケモンの右上に設定
      const bubbleX = pokemonX + canvas.offsetLeft + canvas.width / 30 + (canvas.width / 2) - (speechBubble.offsetWidth / 2);
      const bubbleY = verticalOffset + canvas.offsetTop - 20;

      speechBubble.style.left = `${bubbleX}px`;
      speechBubble.style.top = `${bubbleY}px`;

      speechBubble.style.visibility = 'visible';  // 吹き出しを表示
      console.log("満腹です。吹き出し 2.png を表示中。");

      setTimeout(() => {
        speechBubble.style.visibility = 'hidden';  // 吹き出しを非表示にする
        console.log("吹き出しが非表示になりました。");
      }, 1000);
    } catch (error) {
      console.error("満腹時の吹き出し表示中にエラーが発生しました:", error);
    }
  }

  updateStats(); // ステータスの更新
}





function cleanRoom() {
  if (pokemonStats.cleanliness < 100) {
    pokemonStats.cleanliness += 20;
    pokemonStats.affection += 5;
    pokemonStats.experience += 20; // 経験値も上がる
  } else {
    showMessageModal("部屋はすでに綺麗です！");
  }
  updateStats();
}

function takeWalk() {
  if (pokemonStats.stamina > 0) {
    pokemonStats.stamina -= 20;
    encounterWildPokemon(); // 散歩後に野生ポケモンと遭遇
  } else {
    showMessageModal("スタミナが足りません！");
  }
  updateStats();
}


// レベルに応じて遭遇するフォルダを決定し、すべてのフォルダを考慮
// レベルに応じて遭遇するフォルダを決定する関数
function getAvailableEnemyFolders() {
  let folders = ['enemy'];
  if (pokemonStats.level >= 10) folders.push('enemy2');
  if (pokemonStats.level >= 20) folders.push('enemy3');
  if (pokemonStats.level >= 30) folders.push('enemy4');
  return folders;
}

// 野生のポケモンとの遭遇処理
function encounterWildPokemon() {
  playBattleMusic();  // バトルBGMを再生

  // 利用可能なフォルダを取得
  let folders = getAvailableEnemyFolders(); 
  let folder = folders[Math.floor(Math.random() * folders.length)]; // フォルダリストからランダムに1つ選択

  // 敵ポケモンデータ（画像パスをハードコード）
  const enemyData = {
    enemy: [
      'レディバ', 'アーボ', 'イーブイ', 'ウリムー', 'エイパム', 'エネコ', 'エリキテル', 'エレズン', 'オタチ', 'カゲボウズ',
      'カモネギ', 'キノココ', 'キャタピー', 'コイキング', 'ココドラ', 'コラッタ', 'サッチムシ', 'ジグザグマ', 'スバメ', 'スリープ',
      'タッツー', 'タネボー', 'チルット', 'ディグダ', 'デデンネ', 'トゲピー', 'トサキント', 'ネイティ', 'ハスボー', 'パッチール',
      'バルキー', 'ビードル', 'ピチュー', 'ヒメグマ', 'ビリリダマ', 'フカマル', 'ホーホー', 'ポチエナ', 'ポッポ', 'ポニータ',
      'ポワルン', 'マダツボミ', 'ミノムッチ', 'メリープ', 'ヤンチャム', 'ヨーギラス', 'ヨマワル', 'ラルトス'
    ],
    enemy2: [
      'リオル', 'ウッウ', 'エルフーン', 'オノンド', 'カジリガメ', 'ガバイト', 'ガラルポニータ', 'キマワリ', 'キルリア', 'グレイシア',
      'ゴーリキー', 'コクーン', 'ゴチミル', 'コドラ', 'コノハナ', 'ゴンベ', 'サクラビス', 'サンダース', 'サンドパン', 'シャワーズ',
      'ズガイドス', 'ソーナンス', 'チラチーノ', 'チリーン', 'ドーブル', 'ドロンチ', 'ニドリーノ', 'ニューラ', 'ニョロゾ', 'パウワウ',
      'バオッキー', 'パチリス', 'ビーダル', 'ピカチュウ', 'ピジョン', 'ブイゼル', 'ブースター', 'プラスル', 'ヘイガニ', 'ヘラクロス',
      'ベロリンガ', 'マイナン', 'マッスグマ', 'マホイップ', 'ミミロル', 'ムチュール', 'メタング', 'ユンゲラー', 'ラッキー', 'リーフィア'
    ],
    enemy3: [
      'ローブシン', 'アブソル', 'アマージョ', 'イワーク', 'ウインディ', 'ウーラオス', 'ウォーグル', 'オーロンゲ', 'オノノクス', 'カイリュー',
      'カビゴン', 'ガブリアス', 'ギャラドス', 'ギャロップ', 'キュウコン', 'ギルガルド', 'グソクムシャ', 'クリムガン', 'グレンアルマ', 'クロバット',
      'ゲンガー', 'サーナイト', 'サイドン', 'シビルドン', 'ジャラランガ', 'ストリンダー', 'ソウブレイズ', 'ゾロアーク', 'タチフサグマ', 'チルタリス',
      'デスカーン', 'ドオー', 'ドクロッグ', 'ドラパルト', 'ドラピオン', 'ドレディア', 'トロピウス', 'ナッシー', 'ヌメルゴン', 'バタフリー',
      'ハリテヤマ', 'バンギラス', 'ピジョット', 'フーディン', 'ブーバーン', 'フラージェス', 'フライゴン', 'ヘイラッシャ', 'ヘルガー', 'ボーマンダ',
      'ミロカロス', 'ムーランド', 'ムクホーク', 'ラムパルド', 'リングマ', 'ルージュラ', 'ルカリオ', 'ルガルガン', 'ルンパッパ'
    ],
    enemy4: [
      'レックウザ', 'アルセウス', 'イベルタル', 'エンテイ', 'カイオーガ', 'ギラティナ', 'グラードン', 'ザシアン', 'ザマゼンタ', 'サンダー',
      'ジラーチ', 'スイクン', 'ゼクロム', 'ゼルネアス', 'セレビィ', 'ソルガレオ', 'ダークライ', 'ディアルガ', 'デオキシス', 'パルキア',
      'ファイヤー', 'フリーザー', 'ホウオウ', 'ミュウ', 'ミュウツー', 'ライコウ', 'ラティアス', 'ラティオス', 'ルギア', 'ルナアーラ', 'レシラム'
    ]
  };

  // ポケモン名が存在するかを確認
  let files = enemyData[folder];
  if (!files || files.length === 0) {
    console.error(`敵データが見つかりません: フォルダ ${folder}`);
    return;
  }

  const randomEnemy = files[Math.floor(Math.random() * files.length)];
  if (!randomEnemy) {
    console.error("ランダムに選択されたポケモンが無効です。");
    return;
  }

  enemyPokemon = randomEnemy; // ポケモン名
  const enemyFolder = folder; // フォルダ名

  // 遭遇リストにフォルダ情報を持つポケモンを追加
  if (!encounteredPokemons.some(p => p.name === enemyPokemon && p.folder === enemyFolder)) {
    encounteredPokemons.push({ name: enemyPokemon, folder: enemyFolder });
  }

  // 敵のHPをリセット
  enemyHP = 100;

  // HPバーの表示を初期化
  const enemyHPBar = document.getElementById('enemyHPBar');
  enemyHPBar.style.width = `100%`;
  enemyHPBar.style.backgroundColor = 'green';

  // モンスターボールのアイコンをリセットして表示
  const monsterBallIcon = document.getElementById('monsterBallIcon');
  monsterBallIcon.style.display = 'block'; 
  monsterBallIcon.style.zIndex = '10'; 

  // 捕まえているかどうかでフィルターを適用
  if (caughtPokemons.some(p => p.name === enemyPokemon)) {
    // 捕まえたポケモンの場合はカラー表示
    monsterBallIcon.style.filter = 'none';
  } else {
    // 捕まえていない場合は白黒表示
    monsterBallIcon.style.filter = 'grayscale(100%)';
  }

  // 敵ポケモンの画像を表示
  document.getElementById('enemyName').textContent = enemyPokemon;

  const encodedPokemonName = encodeURIComponent(randomEnemy);
  document.getElementById('enemyPokemonImage').src = `./${enemyFolder}/${encodedPokemonName}.png`;

  document.getElementById('battleModal').style.display = 'block';
  isBattleActive = true;

  // バトルの初期化
  initBattle();
}













// initBattle関数の定義
function initBattle() {
  // ポップアップが表示された後に技名を設定する
  setTimeout(() => {
    const moves = moveSets[selectedPokemon];
    if (moves) {
      document.getElementById('move1').textContent = moves[0]; // 技1
      document.getElementById('move2').textContent = moves[1]; // 技2
    } else {
      console.error('技名が見つかりません');
    }
  }, 100); // 少し遅延を入れてポップアップが表示されてから技名を設定

  // 戦闘コマンドを表示
  document.getElementById('battleCommands').style.display = 'block';
}







function getEnemyFolder() {
  if (pokemonStats.level >= 30) {
    return 'enemy4';
  } else if (pokemonStats.level >= 20) {
    return 'enemy3';
  } else if (pokemonStats.level >= 10) {
    return 'enemy2';
  } else {
    return 'enemy';
  }
}





// 技を使う処理
function useMove(moveNumber) {
  const moveName = moveSets[selectedPokemon][moveNumber - 1];

  // 基本ダメージ
  let baseDamage = Math.floor(Math.random() * 20) + 10;

  // レベルに応じたダメージ倍率を設定
  let damageMultiplier = 1; // デフォルトの倍率は1

  // プレイヤーのレベルによるダメージ倍率の調整
  if (pokemonStats.level >= 30) {
    if (getEnemyFolder() === 'enemy') {
      damageMultiplier = 2.5;
    } else if (getEnemyFolder() === 'enemy2') {
      damageMultiplier = 1.8;
    } else if (getEnemyFolder() === 'enemy3') {
      damageMultiplier = 1.3;
    }
  } else if (pokemonStats.level >= 20) {
    if (getEnemyFolder() === 'enemy') {
      damageMultiplier = 2;
    } else if (getEnemyFolder() === 'enemy2') {
      damageMultiplier = 1.3;
    }
  } else if (pokemonStats.level >= 10) {
    if (getEnemyFolder() === 'enemy') {
      damageMultiplier = 1.3;
    }
  }

  // ダメージ計算に倍率を適用
  const damage = Math.floor(baseDamage * damageMultiplier);

  // ダメージを敵のHPに適用
  enemyHP = Math.max(0, enemyHP - damage);

  // HPバーの更新
  const enemyHPPercentage = (enemyHP / 100) * 100;
  const enemyHPBar = document.getElementById('enemyHPBar');
  enemyHPBar.style.width = `${enemyHPPercentage}%`;
  enemyHPBar.style.backgroundColor = 'green';

  // 敵が倒されたかどうかの判定
  if (enemyHP === 0) {
    showMessageModal(`${enemyPokemon} を倒した！`);
    endBattleWithExperience('win');
    endBattle();
    return;
  }



  // 敵が逃げるかどうかの判定
  const enemyData = encounteredPokemons.find(p => p.name === enemyPokemon); // 現在の敵のフォルダを取得
  let escapeChance = Math.random();

  // フォルダに応じた逃げる確率の設定
  if (enemyData.folder === 'enemy4') {

    if (escapeChance < 0.3) {
      showMessageModal(`${enemyPokemon} に逃げられた！`);
      endBattleWithExperience('enemyRun');
      endBattle();
      return;
    }
  } else if (enemyData.folder === 'enemy3') {
    if (escapeChance < 0.08) {
      showMessageModal(`${enemyPokemon} に逃げられた！`);
      endBattleWithExperience('enemyRun');
      endBattle();
      return;
    }
  } else if (enemyData.folder === 'enemy2') {
    if (escapeChance < 0.05) {
      showMessageModal(`${enemyPokemon} に逃げられた！`);
      endBattleWithExperience('enemyRun');
      endBattle();
      return;
    }
  } else if (enemyData.folder === 'enemy') {
    if (escapeChance < 0.03) {
      showMessageModal(`${enemyPokemon} に逃げられた！`);
      endBattleWithExperience('enemyRun');
      endBattle();
      return;
    }
  }
}





function catchPokemon() {
  let catchRate = 0.1 + ((100 - enemyHP) / 100) * 0.8;

  const enemyFolder = encounteredPokemons.find(p => p.name === enemyPokemon).folder; // 正確なフォルダを取得

  if (enemyFolder === 'enemy4') {
    catchRate *= 0.5; // enemy4のポケモンは捕まえにくい
  }

  const success = Math.random() < catchRate;

  if (success) {
    showMessageModal(`${enemyPokemon} を捕まえた！`, true);

    const pokemonName = decodeURIComponent(enemyPokemon);
    if (!caughtPokemons.some(p => p.name === pokemonName && p.folder === enemyFolder)) {
      caughtPokemons.push({ name: pokemonName, folder: enemyFolder }); // フォルダ情報とともにポケモンを保存
    }

    endBattleWithExperience('catch');
  } else {
    showMessageModal(`${enemyPokemon} は逃げた！`);
    endBattleWithExperience('run');
  }
  endBattle();
}


// 逃げる時の処理
function runAway() {
  showMessageModal("戦闘から逃げた！");
  endBattleWithExperience('run'); // 逃げた時に経験値を追加
  endBattle();
}

// 戦闘終了処理
function endBattle() {
  isBattleActive = false;
  document.getElementById('battleModal').style.display = 'none';
  document.getElementById('battleCommands').style.display = 'none';

  battleMusic.pause();  // バトルBGMを停止

  if (winMusic.paused) {  // winMusicが再生中でない場合のみ通常BGMを再開
    playBGM();
  }
}


// 勝利したときに win.mp3 を再生
function endBattleWithExperience(result) {
  // 経験値の付与
  if (result === 'run') {
    pokemonStats.experience += 20; // プレイヤーが逃げた時
    showMessageModal(`${enemyPokemon} は逃げました！`);
  } else if (result === 'enemyRun') {
    pokemonStats.experience += 20; // 敵が逃げた時
    showMessageModal(`${enemyPokemon} は逃げました！`);
  } else if (result === 'catch') {
    pokemonStats.experience += 40; // 捕まえた時
  } else if (result === 'win') {
    pokemonStats.experience += 60; // 勝利した時
    showMessageModal(`${enemyPokemon} を倒しました！`, true);  // 勝利時に win.mp3 を再生
  }

  // メッセージが表示された後にレベルアップをチェック
  setTimeout(() => {
    checkEvolution();
    updateStats(); // ステータスを更新
  }, 3000);
}

// 進化のチェックをしてレベルアップメッセージを返す関数
function checkEvolution() {
  if (pokemonStats.experience >= 100) {
    pokemonStats.level += 1;
    let levelUpMessage = "レベルアップしました！";

    const evolutions = {
      'ヒトカゲ': 'リザ―ド', 'リザ―ド': 'リザードン',
      'ゼニガメ': 'カメール', 'カメール': 'カメックス',
      'フシギダネ': 'フシギソウ', 'フシギソウ': 'フシギバナ',
      'ヒノアラシ': 'マグマラシ', 'マグマラシ': 'バクフーン',
      'ワニノコ': 'アリゲイツ', 'アリゲイツ': 'オーダイル',
      'チコリータ': 'ベイリーフ', 'ベイリーフ': 'メガニウム',
      'アチャモ': 'ワカシャモ', 'ワカシャモ': 'バシャーモ',
      'ミズゴロウ': 'ヌマクロー', 'ヌマクロー': 'ラグラージ',
      'キモリ': 'ジュプトル', 'ジュプトル': 'ジュカイン',
      'ヒコザル': 'モウカザル', 'モウカザル': 'ゴウカザル',
      'ポッチャマ': 'ポッタイシ', 'ポッタイシ': 'エンペルト',
      'ナエトル': 'ハヤシガメ', 'ハヤシガメ': 'ドダイトス',
      'ポカブ': 'チャオブー', 'チャオブー': 'エンブオー',
      'ミジュマル': 'フタチマル', 'フタチマル': 'ダイケンキ',
      'ツタージャ': 'ジャノビー', 'ジャノビー': 'ジャローダ',
      'フォッコ': 'テールナー', 'テールナー': 'マフォクシー',
      'ケロマツ': 'ゲコガシラ', 'ゲコガシラ': 'ゲッコウガ',
      'ハリマロン': 'ハリボーグ', 'ハリボーグ': 'ブリガロン',
      'ニャビー': 'ニャヒート', 'ニャヒート': 'ガオガエン',
      'アシマリ': 'オシャマリ', 'オシャマリ': 'アシレーヌ',
      'モクロー': 'フクスロー', 'フクスロー': 'ジュナイパー',
      'ホゲータ': 'アチゲータ', 'アチゲータ': 'ラウドボーン',
      'クワッス': 'ウェルカモ', 'ウェルカモ': 'ウェーニバル',
      'ニャオハ': 'ニャローテ', 'ニャローテ': 'マスカーニャ'
    };

    if (pokemonStats.level === 16 || pokemonStats.level === 36) {
      evolvePokemon(evolutions[selectedPokemon]);
    }

    pokemonStats.experience = 0;  // 経験値をリセット
    return levelUpMessage;  // レベルアップメッセージを返す
  }
  return null;
}

function evolvePokemon(evolvedForm) {
  showMessageModal(`${selectedPokemon} は ${evolvedForm} に進化した！`);
  selectedPokemon = evolvedForm; // 進化後のポケモン名に更新

  // ポケモンの画像を更新して再描画
  const img = new Image();
  img.src = `./player/${selectedPokemon}.png`; 
  img.onerror = function() {
    img.src = './player/default.png';  // 404の場合デフォルト画像に切り替える
  };
  img.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
    ctx.drawImage(img, pokemonX, verticalOffset, canvas.width / 2, canvas.height / 2); // 進化後の画像を再描画
  };

  // 進化後のポケモン名を更新
  document.getElementById('pokemonNameDisplay').textContent = selectedPokemon; // 進化後の名前を更新
}




function openPokedex() {
  const pokedexList = document.getElementById('pokedexList');
  pokedexList.innerHTML = ''; // リストをクリア

  const sectionTitles = {
    enemy: "はじまりのとき",
    enemy2: "きぼうのみち",
    enemy3: "しれんのおか",
    enemy4: "でんせつ"
  };

  const folders = ['enemy', 'enemy2', 'enemy3', 'enemy4'];

  folders.forEach(folder => {
    const sectionTitle = sectionTitles[folder];
    const section = document.createElement('div');
    section.innerHTML = `<h3>${sectionTitle}</h3>`;

    // 画像を横並びにするためのコンテナを作成
    const pokemonList = document.createElement('div');
    pokemonList.className = 'pokemon-list';

    // 各フォルダ内のポケモンリストを作成
    const enemyData = {
      enemy: [
        'レディバ', 'アーボ', 'イーブイ', 'ウリムー', 'エイパム', 'エネコ', 'エリキテル', 'エレズン', 'オタチ', 'カゲボウズ',
        'カモネギ', 'キノココ', 'キャタピー', 'コイキング', 'ココドラ', 'コラッタ', 'サッチムシ', 'ジグザグマ', 'スバメ', 'スリープ',
        'タッツー', 'タネボー', 'チルット', 'ディグダ', 'デデンネ', 'トゲピー', 'トサキント', 'ネイティ', 'ハスボー', 'パッチール',
        'バルキー', 'ビードル', 'ピチュー', 'ヒメグマ', 'ビリリダマ', 'フカマル', 'ホーホー', 'ポチエナ', 'ポッポ', 'ポニータ',
        'ポワルン', 'マダツボミ', 'ミノムッチ', 'メリープ', 'ヤンチャム', 'ヨーギラス', 'ヨマワル', 'ラルトス'
      ],
      enemy2: [
        'リオル', 'ウッウ', 'エルフーン', 'オノンド', 'カジリガメ', 'ガバイト', 'ガラルポニータ', 'キマワリ', 'キルリア', 'グレイシア',
        'ゴーリキー', 'コクーン', 'ゴチミル', 'コドラ', 'コノハナ', 'ゴンベ', 'サクラビス', 'サンダース', 'サンドパン', 'シャワーズ',
        'ズガイドス', 'ソーナンス', 'チラチーノ', 'チリーン', 'ドーブル', 'ドロンチ', 'ニドリーノ', 'ニューラ', 'ニョロゾ', 'パウワウ',
        'バオッキー', 'パチリス', 'ビーダル', 'ピカチュウ', 'ピジョン', 'ブイゼル', 'ブースター', 'プラスル', 'ヘイガニ', 'ヘラクロス',
        'ベロリンガ', 'マイナン', 'マッスグマ', 'マホイップ', 'ミミロル', 'ムチュール', 'メタング', 'ユンゲラー', 'ラッキー', 'リーフィア'
      ],
      enemy3: [
        'ローブシン', 'アブソル', 'アマージョ', 'イワーク', 'ウインディ', 'ウーラオス', 'ウォーグル', 'オーロンゲ', 'オノノクス', 'カイリュー',
        'カビゴン', 'ガブリアス', 'ギャラドス', 'ギャロップ', 'キュウコン', 'ギルガルド', 'グソクムシャ', 'クリムガン', 'グレンアルマ', 'クロバット',
        'ゲンガー', 'サーナイト', 'サイドン', 'シビルドン', 'ジャラランガ', 'ストリンダー', 'ソウブレイズ', 'ゾロアーク', 'タチフサグマ', 'チルタリス',
        'デスカーン', 'ドオー', 'ドクロッグ', 'ドラパルト', 'ドラピオン', 'ドレディア', 'トロピウス', 'ナッシー', 'ヌメルゴン', 'バタフリー',
        'ハリテヤマ', 'バンギラス', 'ピジョット', 'フーディン', 'ブーバーン', 'フラージェス', 'フライゴン', 'ヘイラッシャ', 'ヘルガー', 'ボーマンダ',
        'ミロカロス', 'ムーランド', 'ムクホーク', 'ラムパルド', 'リングマ', 'ルージュラ', 'ルカリオ', 'ルガルガン', 'ルンパッパ'
      ],
      enemy4: [
        'レックウザ', 'アルセウス', 'イベルタル', 'エンテイ', 'カイオーガ', 'ギラティナ', 'グラードン', 'ザシアン', 'ザマゼンタ', 'サンダー',
        'ジラーチ', 'スイクン', 'ゼクロム', 'ゼルネアス', 'セレビィ', 'ソルガレオ', 'ダークライ', 'ディアルガ', 'デオキシス', 'パルキア',
        'ファイヤー', 'フリーザー', 'ホウオウ', 'ミュウ', 'ミュウツー', 'ライコウ', 'ラティアス', 'ラティオス', 'ルギア', 'ルナアーラ', 'レシラム'
      ]
    };
    const files = enemyData[folder];

    files.forEach(pokemonName => {
      const encodedPokemonName = encodeURIComponent(pokemonName);
      const listItem = document.createElement('div');

      const caughtPokemon = caughtPokemons.find(p => p.name === pokemonName && p.folder === folder); // 捕まえたポケモンをチェック
      const encounteredPokemon = encounteredPokemons.find(p => p.name === pokemonName && p.folder === folder); // 遭遇したポケモンをチェック

      if (caughtPokemon) {
        // 捕まえたポケモンはカラーで表示
        listItem.innerHTML = `
          <p>${pokemonName}</p>
          <img src="./${folder}/${encodedPokemonName}.png" alt="${pokemonName}">
        `;
      } else if (encounteredPokemon) {
        // 遭遇したポケモンは白黒で表示
        listItem.innerHTML = `
          <p>${pokemonName}</p>
          <img src="./${folder}/${encodedPokemonName}.png" alt="${pokemonName}" style="filter: grayscale(100%);">
        `;
      } else {
        // 遭遇していないポケモンは ??? として表示
        listItem.innerHTML = `
          <p>???</p>
          <img src="./Unknown.png" alt="Unknown">
        `;
      }

      pokemonList.appendChild(listItem);
    });

    section.appendChild(pokemonList);
    pokedexList.appendChild(section);
  });

  document.getElementById('pokedexModal').style.display = 'block';
}













// 図鑑を閉じる
function closePokedex() {
  document.getElementById('pokedexModal').style.display = 'none';
}




// Save game data to local storage
function saveGame() {
  const playerData = {
    playerName: 'プレイヤー1',
    pokemon: selectedPokemon,
    stats: pokemonStats,
    moves: pokemonStats.moves
  };
  localStorage.setItem('playerData', JSON.stringify(playerData));
  showMessageModal('ゲームデータがローカルに保存されました');
}

// Load game data from local storage
function loadGame() {
  const data = JSON.parse(localStorage.getItem('playerData'));
  if (data) {
    selectedPokemon = data.pokemon;
    pokemonStats = data.stats;
    pokemonStats.moves = data.moves;
    document.getElementById('selectedPokemon').src = `./player/${selectedPokemon}.png`;
    updateStats();
  } else {
    showMessageModal('データが見つかりません');
  }
}


// アニメーションとステータス更新を1秒ごとに実行
setInterval(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバス全体をクリア

  animatePokemon(); // まずプレイヤーのポケモンを描画
  animateVisitingPokemon(); // その後に捕まえたポケモンのアニメーションを描画
  updateAutoStats(); // ステータスの自動更新
}, 1000);


// 定期的にポケモンが遊びに来る
setInterval(randomCaughtPokemonVisit, 10000);  // 10秒ごとにランダムなポケモンが遊びに来る


// ゲームのループ
function gameLoop() {
  updateStats();
  checkEvolution();
  requestAnimationFrame(gameLoop);
}

gameLoop();
