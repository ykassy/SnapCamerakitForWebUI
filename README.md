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
│   ├── remoteAPI.js   # Remote API設定
│   └── settings.js    # 設定ファイル
├── webpack.config.js  # Webpack設定
└── package.json       # 依存関係
```

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

### Lensの変更

`src/settings.js` または `src/main.js` でLens IDを変更できます。

```javascript
const lensById = await cameraKit.lensRepository.loadLens(
  'YOUR_LENS_ID',
  'YOUR_GROUP_ID'
);
```

### API Tokenの設定

`src/settings.js` でSnap Camera KitのAPI Tokenを設定してください。

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

