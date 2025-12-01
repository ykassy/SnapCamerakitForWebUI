# Snap Camera Kit for Web UI

Snap Camera Kit for Webを使用したAR体験アプリケーションです。ブラウザ上でLens（ARエフェクト）を表示し、写真撮影・動画録画機能を提供します。

## 特徴

- 📸 **写真撮影機能** - AR体験中の静止画をキャプチャ
- 🎥 **動画録画機能** - AR体験を動画として録画
- 🎨 **Lens対応** - Snap Camera KitのLens（ARエフェクト）を表示
- 📱 **レスポンシブ対応** - スマートフォン・タブレット・PCに対応
- 🔊 **効果音** - 撮影・録画時に効果音を再生
- 🎯 **マーカートラッキング対応** - マーカー検出に対応したLensに対応

## 技術スタック

- **Snap Camera Kit for Web** - AR体験の実装
- **Webpack** - ビルドツール
- **Vanilla JavaScript** - フレームワークなしのシンプルな実装
- **CSS3** - モダンなUIデザイン

## セットアップ

### 必要な環境

- Node.js (v14以上推奨)
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run serve
```

開発サーバーは `http://localhost:9000` で起動します。

### ビルド

```bash
npm run build
```

ビルドされたファイルは `docs/` ディレクトリに出力されます。

## 使用方法

1. 開発サーバーを起動
2. ブラウザで `http://localhost:9000` にアクセス
3. カメラ・マイクの許可を求められたら許可
4. AR STARTボタンをクリックしてAR体験を開始
5. 撮影ボタンで写真撮影、長押しで動画録画

## プロジェクト構成

```
SnapCamerakitForWebUI/
├── docs/              # 公開用ファイル
│   ├── assets/        # 画像・GIFファイル
│   ├── *.html         # HTMLファイル
│   ├── *.css          # スタイルシート
│   └── *.js           # JavaScriptファイル
├── src/               # ソースコード
│   ├── main.js        # メインエントリーポイント
│   ├── remoteAPI.js   # Remote API実装（オプション）
│   └── settings.js    # 設定ファイル（API Token、Lens ID等）
├── webpack.config.js  # Webpack設定
└── package.json       # 依存関係
```

**ファイル説明：**

- `src/main.js` - Camera Kitの初期化、カメラ制御、撮影機能の実装
- `src/settings.js` - API Token、Lens ID、Remote API設定など
- `src/remoteAPI.js` - Remote APIの実装（マーカー検出時のリダイレクト機能など）
  - `useRemoteAPI: true` の場合のみ使用されます
  - マーカー検出イベントを処理し、指定URLにリダイレクトします

## 主要機能

### ローディング画面
- Camera Kitの初期化中に表示
- カスタムGIFアニメーション

### モーダル画面
- AR体験開始前の確認画面
- カスタムデザインのボタン

### 撮影機能
- **写真撮影**: タップで静止画をキャプチャ
- **動画録画**: 長押し（0.3秒以上）で動画録画開始
- **プレビュー**: 撮影後すぐにプレビュー表示
- **シェア機能**: 撮影した写真・動画をシェア

### カメラ切り替え
- フロントカメラ ↔ バックカメラの切り替え

## カスタマイズ

### 初期設定（必須）

`src/settings.js` を開いて、以下の値を設定してください：

#### 1. API Tokenの設定

Snap Camera Kit の管理画面（https://camera-kit.snapchat.com/）からAPI Tokenを取得して設定します。

```javascript
apiToken: "YOUR_API_TOKEN_HERE",
```

#### 2. Lens IDの設定

使用したいLensのIDとGroup IDを設定します。Lens Studioで公開したLensのIDを取得してください。

```javascript
lensID:  "YOUR_LENS_ID_HERE",
groupID: "YOUR_GROUP_ID_HERE",
```

#### 3. Remote APIの設定（オプション）

Remote APIを使用する場合は、以下の設定を行います：

```javascript
// Remote API の Spec ID（Snapの管理画面から取得）
remoteAPISpecId: "YOUR_REMOTE_API_SPEC_ID_HERE",

// マーカー検出時のリダイレクト先URL
redirectUrl: "https://example.com/",

// Remote API を有効化
useRemoteAPI: true,
```

**Remote APIについて：**

- Remote APIを使用すると、マーカー検出などのイベントをサーバー側で処理できます
- `src/remoteAPI.js` にRemote APIの実装が含まれています
- マーカー検出時に指定したURLにリダイレクトする機能が実装されています
- 使用しない場合は `useRemoteAPI: false` に設定してください

**設定例：**

```javascript
export const Settings = {
  config: {
    apiToken: "eyJhbGciOiJIUzI1NiIs...",  // 実際のトークン
    lensID:  "205d7d5c-e0ba-4a3a-b39e-727bed44880d",
    groupID: "7d12e244-25e7-4cdf-bd2d-5f6a47a19a6e",
    remoteAPISpecId: "770201df-924a-4bf3-8099-146a93d9f07f",  // Remote API使用時のみ
    redirectUrl: "https://example.com/",  // Remote API使用時のみ
    useRemoteAPI: false,  // true にすると Remote API が有効化されます
  },
};
```

## ブラウザ対応

- ✅ Chrome (最新版)
- ✅ Safari (最新版)
- ✅ Firefox (最新版)
- ✅ Edge (最新版)
- ✅ モバイルブラウザ (iOS Safari, Chrome for Android)

## ライセンス

ISC

## 注意事項

- カメラ・マイクの許可が必要です
- HTTPS環境またはlocalhostでのみ動作します
- Snap Camera KitのAPI Tokenが必要です
- `src/settings.js` のトークンやIDは実際の値に置き換えてください（デフォルトはダミー値です）
- Remote APIを使用する場合は、`useRemoteAPI: true` に設定し、`remoteAPISpecId` を設定してください

## 開発者向け情報

### ビルド最適化

本プロジェクトは本番環境用に最適化されています：
- JavaScriptのminification
- 不要なファイルの削除
- 画像ファイルの最適化

### デバッグ

開発モードで起動すると、詳細なログがコンソールに表示されます。

```bash
npm run start
```

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 更新履歴

### v1.0.0
- 初回リリース
- 基本的なAR体験機能
- 写真撮影・動画録画機能
- レスポンシブ対応

