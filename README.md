# ドラモンクエスト【戦闘】
JSの練習で作ったドラクエ風のコマンドバトルゲームです。

## ゲームの紹介
ゆるい勇者ご一行が魔王様を倒すゲームです⚔  
難易度はやってみてからのお楽しみ😊

※元々クラスメイトが補修をかけて担任の先生と戦うゲームでしたが、github用に少し作り変えました。

### 操作方法
* マウスでボタンをクリック: 行動の選択
* エンターキー: BGM再生

### ゲームのルール
* 味方がみんなやられちゃうとゲームオーバーです🥺
* 魔王のHPを0にすればクリアです！！
  

### 使用した技術
* JavaScript
* HTML
* CSS

### 工夫した点
* 白黒の背景でシンプルなデザインに。
* 技やキャラクターデザインなどに遊び心を。
* HPだけでなくMPも追加して、考えながら戦えるように。
* 味方の強さの調整。
* ダメージを受けたキャラクターが点滅することで分かりやすいように。

### 苦労した点
* キャラクターの点滅処理
    * ダメージを受けたとき（HPがmax以下の時）に点滅する仕様。→その仕様によりHP回復時と初期化時でも点滅してしまう問題があったが、フラグを設置することで解決。
    * 元々点滅はdisplay:noneとdisplay:blockを繰り返すことで行っていたので、HPバーなどがそのときに動いてしまっていた→displayでなくopacity:0とopacity:1を繰り返すようにすることで解決。
* ブラウザの自動再生ポリシーによるエラー修正
    * 音声ファイルの自動再生がブロックされる問題を、エンターキーを押してから再生を開始するように修正。
  
## インストールと実行方法
1.  リポジトリをクローンします。
    `git clone https://github.com/mon-ina/DRAMONQUEST.git`
2.  `index.html` をブラウザで開きます。

## 今後の改善点
* キャラクターの追加
    * 戦闘前にキャラクターを選べるように。
* 攻撃アニメーションの追加
* 敵の追加
* 会心の一撃の追加

## 作者情報
* mon-ina

## 使用させていただいた素材
* ニコニ・コモンズ https://commons.nicovideo.jp
