---
description: お題、台本テキスト、または音声ファイルから自動でナレーションとテロップ付きの動画を作成する
---

# 自動動画作成ワークフロー (Auto Video Generation)

このワークフローは、ユーザーから「お題の指定」「台本（テキスト）の提供」「音声ファイルの提供」のいずれかを受けた際に、Remotion動画プロジェクトを自動で組み上げるための手順です。

---

## ⚠️ 全LLM共通：必ず守るルール

### ルール1: `public/` 配下のファイル書き込みは `run_command` のみを使う
`write_to_file` ツールで `public/` 配下（特に `public/audio/story.txt`）にファイルを書こうとすると、
**Remotionのdev server（HMR）がファイル変更を監視しており、ファイルロックが発生してツールがタイムアウトし、無限リトライに陥ります。**

必ず以下のように `run_command`（PowerShell）を使って書き込むこと：

```powershell
# story.txt の書き込み例（PowerShell のヒアストリング構文を使用）
$content = @"
（ここに台本テキストを記述）
"@
[System.IO.File]::WriteAllText(
  "c:\Users\hartm\Desktop\remotion-gemini\public\audio\story.txt",
  $content,
  [System.Text.Encoding]::UTF8
)
Write-Host "story.txt written successfully"
```

**注意:** `Set-Content` は文字コードの問題が出ることがあるため、必ず `[System.IO.File]::WriteAllText` を使うこと。

### ルール2: 長時間コマンドは必ずバックグラウンド実行＋ポーリング
VOICEVOXの音声生成（generate_story_audio.mjs）やWhisperの文字起こし（transcribe.mjs）は
数分かかる場合があり、同期待機するとAIシステムのタイムアウトでハングする。

- `run_command` は `WaitMsBeforeAsync: 500` でバックグラウンドに送る
- その後 `command_status` で定期ポーリング（WaitDurationSeconds: 30〜60）して完了を待つ
- コマンドが完了するまで次のフェーズに進まないこと

### ルール3: 画像生成は Gemini のみ対応
`generate_image` ツールはGeminiでのみ動作する。Claude等の他のLLMを使う場合は
フェーズ3（背景画像生成）をスキップするか、ユーザーに手動で画像を用意してもらうこと。

---

## フェーズ0: VOICEVOXの起動確認

作業を始める前に、VOICEVOXが起動しているか確認する。

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:50021/version" -TimeoutSec 5
```

- 成功したらバージョン番号が返る → 次のフェーズへ進む
- 失敗したら「VOICEVOXを起動してください」とユーザーに依頼して待機する

スピーカー名の確認は以下（node を使うと文字化けしない）：

```bash
node -e "fetch('http://127.0.0.1:50021/speakers').then(r=>r.json()).then(s=>s.forEach(sp=>console.log(sp.name, JSON.stringify(sp.styles.map(st=>({name:st.name,id:st.id}))))))"
```

現在の設定: `scripts/generate_story_audio.mjs` の `SPEAKER_NAME` と `STYLE_NAME` 変数で話者とスタイルを指定。
**「青山龍星」「ノーマル」** が標準設定。ユーザーが別の声を指定した場合はこの変数を変更すること。

---

## フェーズ1: 台本テキストの作成と story.txt への書き込み

ユーザーの入力内容に基づいて台本テキストを確定し、`public/audio/story.txt` に書き込む。

- **A: お題だけを与えられた場合** → AIが台本を考案してから書き込む
- **B: ナレーション用テキストを提供された場合** → そのまま書き込む
- **C: 音声ファイルを提供された場合** → このフェーズをスキップ

**⚠️ 書き込みは必ず `run_command` + PowerShell ヒアストリング構文を使うこと（ルール1参照）。**

台本テキストの注意事項：
- 数字は読みやすいように漢字や平仮名に変換する（例: TOP5 → トップファイブ）
- 記号（「」、※等）は音声で読み上げられないため除去する
- 1行が1つの文になるよう改行する（Whisperの精度向上のため）

---

## フェーズ2: 音声生成（VOICEVOX）

// turbo
```bash
npm run generate-story-audio
```

このコマンドは `public/audio/story.txt` を読み込み、VOICEVOXで行ごとに音声を生成して
`public/audio/story.mp3`（全結合）と `public/audio/story-meta.json`（タイミング情報）を出力する。

**⚠️ バックグラウンド実行＋ポーリングで完了を待つこと（ルール2参照）。**
完了確認: `public/audio/story.mp3` が生成されていることをチェック。

---

## フェーズ3: テロップ（字幕）データの生成（Whisper文字起こし）

// turbo
```bash
node scripts/transcribe.mjs
```

`story.mp3` と `story.txt`（プロンプトとして使用）を元に Whisper.cpp で文字起こしを実行し、
`public/audio/story.json`（キャプションデータ）を生成する。

**⚠️ バックグラウンド実行＋ポーリングで完了を待つこと（ルール2参照）。**
初回実行時はWhisperモデルのダウンロードが発生するためさらに時間がかかる。

---

## フェーズ4: 背景画像の生成と配置（Geminiのみ）

**⚠️ このフェーズは `generate_image` ツールが利用可能なGeminiでのみ実行できる。**
他のLLMの場合はユーザーに手動で画像を `public/images/` に配置してもらうこと。

1. `generate_image` ツールを使って動画の内容に合った背景画像を生成する（3〜5枚程度）
2. 生成した画像を `public/images/1.png`, `2.png`... のような形でコピーする

画像コピーは `run_command` で行う：

```powershell
Copy-Item "C:\path\to\artifact\image.png" -Destination "c:\Users\hartm\Desktop\remotion-gemini\public\images\1.png"
```

---

## フェーズ5: 動画の尺計算とソースコードの更新

1. **尺の計算:** `public/audio/story.json` の最後の要素の `endMs` を読み取る

```bash
node -e "const j=require('./public/audio/story.json'); const last=j[j.length-1]; console.log('endMs:', last.endMs, 'frames:', Math.ceil(last.endMs/1000*30)+60)"
```

2. **ソース更新:**
   - `src/Root.tsx` の `durationInFrames` を計算値に更新する
   - 音声パスや画像パスが `src/CaptionedVideo.tsx`（または該当コンポーネント）で正しいことを確認する

ソースコードの編集は `src/` 配下のため `replace_file_content` / `multi_replace_file_content` ツールを使って問題ない（Remotionのファイル監視はHMRとして正常に動作する）。

---

## 完了報告

以上のフェーズが完了したら、以下をユーザーに報告して終了：

- 生成した台本（または受け取った台本）の内容
- 使用した音声（スピーカー名、スタイル）
- 動画の長さ（durationInFrames とおよその秒数）
- `npm run dev` で Remotion Studio を開いてプレビューできることを案内する
