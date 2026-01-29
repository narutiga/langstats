# LangStats - 言語交換コミュニティ専用 成長分析Bot

## コンセプト

言語交換Discordサーバーの「成長」と「健康状態」を可視化する。
汎用統計ツールではなく、**語学学習コミュニティに特化**した分析を提供。

## ターゲットユーザー

- 言語交換Discordサーバーの管理者
- 国際的なメンバーを抱えるコミュニティ運営者
- 学習者のエンゲージメントを把握したい人

## 競合との差別化

| 競合（Statbot等） | LangStats |
|------------------|-----------|
| 汎用サーバー統計 | 言語学習コミュニティ特化 |
| メッセージ数のみ | 言語別・学習者成長の可視化 |
| 時間帯表示のみ | 国際ユーザー向け最適時間提案 |

### 独自価値（USP）

1. **言語成長トラッキング** - 学習者の投稿言語比率、語彙多様性の変化
2. **国際サーバー最適化** - 時間帯別アクティブ、VC開催の最適時間提案
3. **学習コミュニティKPI** - Learner Engagement Score、Practice Rate

## 収益モデル

| プラン | 価格 | 内容 |
|--------|------|------|
| Free | $0 | 7日間データ、基本統計、週1レポート |
| Pro | $3/月 | 90日データ、CSV出力、言語分析 |
| Server+ | $7/月 | 複数サーバー、高度分析、優先サポート |

## フェーズ別ロードマップ

### Phase 1: 超MVP（価値検証）

**目標**: Webなし・課金なしで「欲しい」を確認する

- [ ] Botでメンバー数を1日1回記録
- [ ] 週1回、Discordチャンネルにレポート投稿
- [ ] `/stats` コマンドで直近データ表示

```
📊 Weekly Server Report - Language Exchange Hub
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 Members: 482 (+12 this week)
💬 Active users: 74
🏆 Top language role: English Learners (156)
📈 Growth rate: +2.5%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**検証指標**:
- 10サーバー以上が継続利用
- 「有料でも使いたい」の声を3件以上獲得

### Phase 2: Webダッシュボード

**条件**: Phase 1で価値が検証できたら

- [ ] Next.js Webダッシュボード
- [ ] Discord OAuth ログイン
- [ ] グラフ表示（メンバー推移、アクティブ率）
- [ ] 言語ロール別統計
- [ ] 時間帯別アクティブ分析

### Phase 3: 収益化

**条件**: Phase 2で継続ユーザーが確保できたら

- [ ] Stripe決済連携
- [ ] サブスクリプション管理
- [ ] Pro/Server+機能の実装
- [ ] CSVエクスポート

### Phase 4: 高度分析（将来）

- [ ] 言語成長スコア
- [ ] Learner Engagement Score
- [ ] Mentor Contribution Score
- [ ] VC最適時間提案
- [ ] 自動インサイト生成

## 技術スタック

### Phase 1（シンプル構成）

```
┌─────────────────┐     ┌─────────────────┐
│  Discord Bot    │────▶│   Supabase      │
│  (Railway)      │     │   (PostgreSQL)  │
└─────────────────┘     └─────────────────┘
```

### Phase 2以降（フル構成）

```
┌─────────────────┐     ┌─────────────────┐
│  Discord Bot    │────▶│   Supabase      │
│  (Railway)      │     │   (PostgreSQL)  │
└─────────────────┘     └────────┬────────┘
                                 │
┌─────────────────┐              │
│  Web Dashboard  │◀─────────────┘
│  (Next.js/Vercel)│
└─────────────────┘
        │
┌───────▼─────────┐
│     Stripe      │
│   (決済・課金)   │
└─────────────────┘
```

### 技術選定

| コンポーネント | 技術 | 理由 |
|---------------|------|------|
| Bot | Node.js + discord.js | エコシステム充実 |
| Botホスティング | Railway | 無料枠あり |
| データベース | Supabase (PostgreSQL) | 無料枠大、認証機能付き |
| Webフロント | Next.js | React + API Routes一体化 |
| Webホスティング | Vercel | 無料枠、デプロイ簡単 |
| 決済 | Stripe | サブスク管理が簡単 |
| グラフ描画 | Recharts | 軽量で十分 |

### 負荷対策

- **バッチ集計**: リアルタイムではなく1日1回の定時集計（コスト削減）
- **キャッシュ活用**: 頻繁なAPIコールを避ける
- **レートリミット対応**: discord.jsの自動リトライ機能を活用

## データベース設計

```sql
-- サーバー情報
CREATE TABLE guilds (
  id TEXT PRIMARY KEY,          -- Discord Guild ID
  name TEXT,
  owner_id TEXT,
  plan TEXT DEFAULT 'free',     -- 'free' | 'pro' | 'server_plus'
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 日次統計
CREATE TABLE daily_stats (
  id SERIAL PRIMARY KEY,
  guild_id TEXT REFERENCES guilds(id),
  date DATE,
  member_count INTEGER,
  message_count INTEGER,
  active_users INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(guild_id, date)
);

-- 言語別統計（Phase 2以降）
CREATE TABLE language_stats (
  id SERIAL PRIMARY KEY,
  guild_id TEXT REFERENCES guilds(id),
  date DATE,
  language_role_id TEXT,        -- Discord Role ID
  language_name TEXT,           -- 'English Learners' etc.
  member_count INTEGER,
  message_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(guild_id, date, language_role_id)
);

-- 時間帯別アクティブ（Phase 2以降）
CREATE TABLE hourly_activity (
  id SERIAL PRIMARY KEY,
  guild_id TEXT REFERENCES guilds(id),
  date DATE,
  hour INTEGER,                 -- 0-23 (UTC)
  message_count INTEGER,
  active_users INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(guild_id, date, hour)
);

-- ユーザー（管理者）
CREATE TABLE users (
  id TEXT PRIMARY KEY,          -- Discord User ID
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 運用コスト

| サービス | Phase 1 | Phase 2以降 |
|---------|---------|-------------|
| Railway | $0 | $5/月（常時起動） |
| Supabase | $0 | $0〜$25/月 |
| Vercel | - | $0 |
| ドメイン | - | ~$12/年 |
| **合計** | **$0** | **$5〜30/月** |

## 実装ステップ（Phase 1）

1. **Discord Bot 基盤作成**
   - Bot作成・トークン取得
   - 基本的なイベントハンドリング
   - サーバー参加/退出時の処理

2. **データベースセットアップ**
   - Supabaseプロジェクト作成
   - guilds, daily_stats テーブル作成

3. **統計収集機能**
   - 日次バッチ処理（cron）
   - メンバー数記録

4. **レポート機能**
   - `/stats` コマンド実装
   - 週次レポート自動投稿

5. **テスト運用**
   - 自分のサーバーで検証
   - フィードバック収集

## 集客案

### Phase 1（検証期）
- 知人の言語交換サーバーに導入依頼
- 小規模コミュニティで反応確認

### Phase 2以降（拡大期）
- Discord Bot一覧サイト（top.gg等）への登録
- Reddit r/languagelearning での紹介
- Twitter/Xでの発信
- 言語交換コミュニティへの直接アプローチ

## リスクと対策

| リスク | 対策 |
|-------|------|
| Discord API制限 | バッ���集計、キャッシュ活用 |
| 競合（Statbot等） | 言語交換特化で差別化 |
| 無料ユーザーのみ | Phase 1で課金意欲を確認してから実装 |
| 開発疲れ | MVP軽量化で早期検証 |

## 成功指標

| フェーズ | 指標 |
|---------|------|
| Phase 1 | 10サーバー導入、「有料でも使いたい」3件 |
| Phase 2 | 50サーバー導入、WAU 30% |
| Phase 3 | 有料転換率 5%、MRR $100 |

## 次のアクション

1. ~~サービス名を決める~~ → **LangStats**（仮）
2. Discord Developer Portalでアプリ作成
3. Supabaseプロジェクト作成
4. Phase 1 Bot基盤のコーディング開始
