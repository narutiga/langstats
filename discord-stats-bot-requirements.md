# 要件定義書

## LangStats - 言語交換コミュニティ専用 成長分析Bot

| 項目 | 内容 |
|------|------|
| 文書バージョン | 2.5 |
| 作成日 | 2026-01-29 |
| 最終更新 | 2026-01-30 |
| ステータス | ドラフト |

---

## 1. プロジェクト概要

### 1.1 目的
言語交換Discordサーバーの「成長」と「健康状態」を可視化し、管理者の運営判断を支援する。

### 1.2 コンセプト
汎用統計ツールではなく、**語学学習コミュニティに特化**した分析を提供。

### 1.3 独自価値（USP）
1. **成長可視化** - メンバー増減、言語ロール別の成長率
2. **国際サーバー最適化** - 時間帯別アクティブ分析（将来）
3. **学習コミュニティKPI** - Engagement Score（将来）

### 1.4 ターゲットユーザー
- 言語交換Discordサーバーの管理者・モデレーター
- 国際的なメンバーを抱えるコミュニティ運営者
- サーバー規模: 100〜10,000人程度

---

## 2. ビジネス要件

### 2.1 収益目標
- 小規模な収益（副収入レベル）
- 低コスト運用を維持
- Phase 1はコスト$0で検証

### 2.2 料金プラン

| プラン | 月額 | 対象 |
|--------|------|------|
| Free | $0 | 試用・小規模サーバー |
| Pro | $3 | 本格運用したい管理者 |
| Community | $7 | "Built for leaders growing multiple global language communities" |

### 2.3 プラン別機能比較

| 機能 | Free | Pro | Community |
|------|:----:|:---:|:---------:|
| メンバー数推移 | ✓ | ✓ | ✓ |
| ロール別統計 | ✓ | ✓ | ✓ |
| 週次レポート | ✓ | ✓ | ✓ |
| データ保持期間 | 7日 | 90日 | 90日 |
| 対応サーバー数 | 1 | 1 | 5 |
| Webダッシュボード | - | ✓ | ✓ |
| CSVエクスポート | - | ✓ | ✓ |
| 高度分析 | - | - | ✓ |
| 優先サポート | - | - | ✓ |

### 2.4 成功指標

| フェーズ | 指標 |
|---------|------|
| Phase 1 | 10サーバー導入、「有料でも使いたい」3件、リアクション率 20%以上、**定性フィードバック獲得**（例: 「次のレポートが楽しみ」） |
| Phase 2 | 50サーバー導入、WAU 30% |
| Phase 3 | 有料転換率 5%、MRR $100 |

---

## 3. フェーズ別機能要件

### 3.1 Phase 1: 超MVP（価値検証）

**目標**: Webなし・課金なしで「欲しい」を確認する

#### Discord Bot

| ID | 機能 | 優先度 | 説明 |
|----|------|:------:|------|
| BOT-001 | サーバー参加検知 | 必須 | Botがサーバーに追加された際の初期設定処理。ウェルカムメッセージを投稿 |
| BOT-002 | メンバー数取得 | 必須 | 日次でサーバーのメンバー数を取得・記録 |
| BOT-003 | ロール別統計 | 必須 | 言語ロールのメンバー数を記録。対象: ロール名に "english", "japanese", "learner", "native", "学習" を含むもの。**将来改善**: `/config roles` で手動追加、自動検出 + オーバーライド |
| BOT-004 | 週次レポート投稿 | 必須 | 毎週月曜にDiscordチャンネルへレポート投稿 |
| BOT-005 | /setup コマンド | 必須 | レポート投稿先チャンネルを設定。管理者権限必須 |
| BOT-006 | /preview コマンド | 高 | 現時点の統計でレポートをプレビュー表示（投稿はしない） |

#### ウェルカムメッセージ形式

Bot参加時に、システムチャンネルまたはオーナーへDMで投稿:

```
✨ Thanks for adding LangStats!

Use /setup to choose where weekly reports will be posted.
Your first report arrives next Monday 📊

Need help? https://langstats.app/docs
```

#### 週次レポート形式

```
📊 Weekly Growth Report - {サーバー名}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 Members: 482 (+12)
📈 Growth: +2.5%

🏷️ Language Roles:
   English Learners: 156 (+5)
   Japanese Learners: 89 (+3)
   Spanish Learners: 45 (+1)

💡 Insight: Learner roles grew faster than native roles this week.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Found this useful? React with 👍
   Want advanced stats? Reply "PRO"
```

### 3.2 Phase 2: Webダッシュボード

**条件**: Phase 1で価値が検証できたら

**スコープ注意**: 初回リリースはグラフ表示 + 期間選択のみ。機能は段階的に追加し、「重い管理画面」化を避ける。

| ID | 機能 | 優先度 | 説明 |
|----|------|:------:|------|
| WEB-001 | Discord OAuth認証 | 必須 | Discordアカウントでログイン |
| WEB-002 | サーバー選択 | 必須 | 管理権限のあるサーバーを一覧表示・選択 |
| WEB-003 | メンバー数グラフ | 必須 | 日別のメンバー数推移を折れ線グラフで表示 |
| WEB-004 | ロール別グラフ | 必須 | 言語ロール別のメンバー推移を表示 |
| WEB-005 | 期間選択 | 必須 | 表示する期間を選択（7日/30日/90日） |
| WEB-006 | 時間帯別分析 | 高 | UTC時間帯別のアクティブ率を表示 |
| BOT-005 | /stats コマンド | 中 | Discord内で簡易統計を表示 |

### 3.3 Phase 3: 収益化

**条件**: Phase 2で継続ユーザーが確保できたら

| ID | 機能 | 優先度 | 説明 |
|----|------|:------:|------|
| PAY-001 | Stripeチェックアウト | 必須 | 有料プランへのアップグレード決済 |
| PAY-002 | サブスク管理 | 必須 | 月額課金の自動更新・キャンセル |
| PAY-003 | Webhook処理 | 必須 | 支払い成功/失敗時のプラン更新 |
| WEB-007 | CSVエクスポート | 必須 | 統計データをCSV形式でダウンロード |

### 3.4 Phase 4: 高度分析（将来）

| ID | 機能 | 説明 |
|----|------|------|
| ADV-001 | メッセージ数統計 | チャンネル毎のメッセージ数を集計 |
| ADV-002 | アクティブユーザー | 一定期間内に発言したユーザー数 |
| ADV-003 | 言語成長スコア | 学習者の投稿言語比率の変化 |
| ADV-004 | Engagement Score | 学習コミュニティの健康度を数値化。例: "Server health: 78/100 - Learners are more active this week." **競合差別化ポイント** |
| ADV-005 | VC最適時間提案 | 国際ユーザー向け最適時間の提案 |

---

## 4. 非機能要件

### 4.1 性能

| 項目 | Phase 1 | Phase 2以降 |
|------|---------|-------------|
| データ収集 | 日次（1日1回バッチ） | 日次 |
| レスポンス時間 | - | 3秒以内 |
| 同時接続 | - | 100ユーザー |

### 4.2 可用性

| 項目 | 要件 |
|------|------|
| 稼働率 | 99%以上（月間ダウンタイム: 7時間以内） |
| バックアップ | 日次（Supabaseの自動バックアップ） |

### 4.3 セキュリティ

| 項目 | 要件 |
|------|------|
| 認証 | Discord OAuth 2.0（Phase 2以降） |
| 通信 | HTTPS必須 |
| データアクセス | 管理者権限を持つサーバーのみ閲覧可能 |
| 決済情報 | Stripe側で管理（PCI DSS準拠） |

### 4.4 運用・保守

| 項目 | Phase 1 | Phase 2以降 |
|------|---------|-------------|
| 運用コスト | $0 | $5〜30/月 |
| 監視 | 基本的なエラーログ | エラーログ + アラート |
| デプロイ | 手動 | Git pushによる自動デプロイ |

---

## 5. システム構成

### 5.1 Phase 1 アーキテクチャ

```
┌──────────────────────────────────────────────────────────┐
│                    Discord Bot                           │
│                 (Node.js / Railway)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ イベント監視 │  │ 日次集計    │  │ 週次レポート │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                      Supabase                            │
│                    (PostgreSQL)                          │
│  ┌─────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ guilds  │  │ daily_stats │  │ role_stats  │          │
│  └─────────┘  └─────────────┘  └─────────────┘          │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Phase 2以降 アーキテクチャ

```
┌──────────────────────────────────────────────────────────┐
│                        ユーザー                          │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                   Webダッシュボード                       │
│                   (Next.js / Vercel)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Discord認証  │  │ 統計グラフ   │  │ 決済画面    │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────┬────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌───────────┐ ┌─────────────────┐
│    Supabase     │ │  Discord  │ │     Stripe      │
│   (PostgreSQL)  │ │   OAuth   │ │    (決済)       │
└─────────────────┘ └───────────┘ └─────────────────┘
          ▲
          │
┌─────────────────────────────────────────────────────────┐
│                    Discord Bot                          │
│                 (Node.js / Railway)                     │
└─────────────────────────────────────────────────────────┘
```

### 5.3 技術スタック

| レイヤー | 技術 | Phase | 選定理由 |
|----------|------|:-----:|----------|
| Bot Runtime | Node.js 20 | 1 | discord.jsのエコシステム |
| Package Manager | pnpm | 1 | 高速、ディスク効率、厳密な依存管理 |
| Bot Framework | discord.js | 1 | 最も普及、ドキュメント充実 |
| Bot Hosting | Railway | 1 | 無料枠あり、常時起動対応 |
| Database | Turso (SQLite) | 1 | 軽量、無料枠大、Edge対応 |
| ORM | Drizzle ORM | 1 | Turso公式推奨、型安全 |
| Scheduler | GitHub Actions | 1 | 外部cron、Botスリープでも安定 |
| Web Framework | Next.js 14 (App Router) | 2 | フルスタック、Vercel最適化 |
| Web Hosting | Vercel | 2 | 無料枠、自動デプロイ |
| 決済 | Stripe | 3 | サブスク管理が容易 |
| グラフ | Recharts | 2 | React向け、軽量 |

---

## 6. データ設計

### 6.1 ER図

```
┌─────────────┐       ┌─────────────┐
│   users     │       │   guilds    │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ email       │       │ name        │
│ created_at  │       │ owner_id    │
└─────────────┘       │ plan        │
   (Phase 2)          │ report_ch_id│
                      │ stripe_id   │
                      │ created_at  │
                      └──────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              │ 1:N          │ 1:N          │
              ▼              ▼              ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
       │ daily_stats │ │ role_stats  │ │hourly_activity│
       ├─────────────┤ ├─────────────┤ ├─────────────┤
       │ id (PK)     │ │ id (PK)     │ │ id (PK)     │
       │ guild_id(FK)│ │ guild_id(FK)│ │ guild_id(FK)│
       │ date        │ │ date        │ │ date        │
       │ member_count│ │ role_id     │ │ hour        │
       │ created_at  │ │ role_name   │ │ message_cnt │
       └─────────────┘ │ member_count│ │ active_users│
          (Phase 1)    │ created_at  │ │ created_at  │
                       └─────────────┘ └─────────────┘
                          (Phase 1)       (Phase 2)
```

### 6.2 テーブル定義

#### guilds
| カラム | 型 | 制約 | Phase | 説明 |
|--------|-----|------|:-----:|------|
| id | TEXT | PK | 1 | Discord Guild ID |
| name | TEXT | NOT NULL | 1 | サーバー名 |
| owner_id | TEXT | NOT NULL | 1 | オーナーのUser ID |
| report_channel_id | TEXT | | 1 | レポート投稿先チャンネルID |
| plan | TEXT | NOT NULL | 3 | 'free' / 'pro' / 'community' |
| stripe_customer_id | TEXT | | 3 | Stripe顧客ID |
| created_at | TIMESTAMP | NOT NULL | 1 | 登録日時 |

#### daily_stats
| カラム | 型 | 制約 | Phase | 説明 |
|--------|-----|------|:-----:|------|
| id | SERIAL | PK | 1 | 連番 |
| guild_id | TEXT | FK | 1 | サーバーID |
| date | DATE | NOT NULL | 1 | 集計日 |
| member_count | INTEGER | | 1 | メンバー数 |
| created_at | TIMESTAMP | NOT NULL | 1 | 記録日時 |
| **UNIQUE** | (guild_id, date) | | | |

#### role_stats
| カラム | 型 | 制約 | Phase | 説明 |
|--------|-----|------|:-----:|------|
| id | SERIAL | PK | 1 | 連番 |
| guild_id | TEXT | FK | 1 | サーバーID |
| date | DATE | NOT NULL | 1 | 集計日 |
| role_id | TEXT | NOT NULL | 1 | Discord Role ID |
| role_name | TEXT | NOT NULL | 1 | ロール名 |
| member_count | INTEGER | | 1 | そのロールのメンバー数 |
| created_at | TIMESTAMP | NOT NULL | 1 | 記録日時 |
| **UNIQUE** | (guild_id, date, role_id) | | | |

#### hourly_activity（Phase 2以降）
| カラム | 型 | 制約 | Phase | 説明 |
|--------|-----|------|:-----:|------|
| id | SERIAL | PK | 2 | 連番 |
| guild_id | TEXT | FK | 2 | サーバーID |
| date | DATE | NOT NULL | 2 | 集計日 |
| hour | INTEGER | NOT NULL | 2 | 0-23 (UTC) |
| message_count | INTEGER | | 2 | メッセージ数 |
| active_users | INTEGER | | 2 | アクティブユーザー数 |
| created_at | TIMESTAMP | NOT NULL | 2 | 記録日時 |
| **UNIQUE** | (guild_id, date, hour) | | | |

#### users（Phase 2以降）
| カラム | 型 | 制約 | Phase | 説明 |
|--------|-----|------|:-----:|------|
| id | TEXT | PK | 2 | Discord User ID |
| email | TEXT | | 2 | メールアドレス |
| created_at | TIMESTAMP | NOT NULL | 2 | 登録日時 |

---

## 7. 画面一覧

### Phase 1
なし（Discord内レポートのみ）

### Phase 2以降

| ID | 画面名 | Phase | 説明 |
|----|--------|:-----:|------|
| SCR-001 | ランディングページ | 2 | サービス紹介、Bot招待ボタン |
| SCR-002 | ログイン | 2 | Discord OAuthログイン |
| SCR-003 | ダッシュボード | 2 | サーバー���択、統計グラフ表示 |
| SCR-004 | 設定 | 3 | プラン確認、アップグレード |
| SCR-005 | 決済 | 3 | Stripeチェックアウト |

---

## 8. 運用コスト

| サービス | Phase 1 | Phase 2 | Phase 3 |
|---------|---------|---------|---------|
| Railway | $0 | $5/月 | $5/月 |
| Supabase | $0 | $0 | $0〜25/月 |
| Vercel | - | $0 | $0 |
| ドメイン | - | $12/年 | $12/年 |
| **合計** | **$0** | **~$6/月** | **$5〜30/月** |

---

## 9. リスクと対策

| リスク | 影響度 | 対策 |
|--------|:------:|------|
| Discord API Rate Limit | 高 | バッチ集計、キャッシュ活用 |
| 無料ユーザーのサーバー負荷 | 中 | 無料枠の制限を明確に |
| 競合サービスの存在 | 中 | 言語交換特化で差別化 |
| 開発疲れ | 中 | MVP軽量化で早期検証 |
| Stripe手数料 | 低 | $3/$7の価格設定で吸収 |

---

## 10. 用語集

| 用語 | 説明 |
|------|------|
| Guild | Discordにおける「サーバー」の内部呼称 |
| OAuth | 認証プロトコル。Discordアカウントでログインする仕組み |
| Webhook | 外部サービスからの通知を受け取る仕組み |
| 言語ロール | English Learners, Japanese Native等の言語学習関連ロール |
| WAU | Weekly Active Users（週間アクティブユーザー） |
| MRR | Monthly Recurring Revenue（月間経常収益） |

---

## 11. ブランドボイス

### 11.1 Bot のキャラクター

| 項目 | 内容 |
|------|------|
| 名前 | LangStats |
| キャッチコピー | Watching your server grow, one stat at a time ✨ |
| 性格 | 優しくてちょっとおっとりな分析アシスタント |
| トーン | フレンドリー・静か・かわいい |

### 11.2 自己紹介文（Discord Developer Portal）

```
📊 I watch your server grow, one stat at a time ✨
Friendly, lightweight, and made for language communities.

Use /setup to start receiving weekly reports!
```

### 11.3 メッセージスタイルガイド

| 場面 | スタイル | 例 |
|------|---------|-----|
| 週次レポート | 絵文字控えめ、データ中心、最後に軽いCTA | 「📊 Weekly Growth Report」 |
| 設定完了 | 短く、ポジティブ | 「Weekly reports will be posted to #channel.」 |
| エラー | 丁寧、解決策を提示 | 「Failed to save settings. Please try again.」 |
| 確認メッセージ | フレンドリー、期待感 | 「The first report will be posted next Monday.」 |

### 11.4 絵文字の使い方

- **使う**: 📊 👥 📈 🏷️ ✨ 💬 👍
- **使わない**: 過度な装飾、複数連続、文中への乱用
- **原則**: 見出しや区切りに1つ、本文には基本使わない

---

## 12. 改訂履歴

| バージョン | 日付 | 内容 |
|------------|------|------|
| 1.0 | 2026-01-29 | 初版作成 |
| 2.0 | 2026-01-29 | フェーズ構成を見直し。Phase 1を超軽量MVPに変更。3段階価格プラン導入。ロール別統計を追加。 |
| 2.1 | 2026-01-29 | Phase 1 KPIに行動指標追加。週次レポートにCTA追加。ロール検出仕様を明文化。Communityプランにタグライン追加。 |
| 2.2 | 2026-01-29 | パッケージマネージャをpnpmに変更。SchedulerをGitHub Actionsに変更。 |
| 2.3 | 2026-01-29 | ブランドボイス（Bot キャラクター、メッセージスタイルガイド）を追加。 |
| 2.4 | 2026-01-30 | Phase 1に/setup, /previewコマンド追加。成功指標に定性指標追加。ロール検出の将来改善を明記。Phase 2スコープ注意を追加。ADV-004説明拡充。 |
| 2.5 | 2026-01-30 | ウェルカムメッセージ追加。週次レポートにInsight行追加。Communityプランのタグライン強化。 |
