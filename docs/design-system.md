# LangStats Design System (v0.1)

> Watching your server grow, one stat at a time ✨

このドキュメントは **LangStats** のブランドイメージをもとにした、
**軽量・一貫性重視・実装しやすさ優先**のミニ・デザインシステムです。

Phase 2 Web / Bot / LP まで共通で使うことを想定しています。

---

## 1. ブランド原則

### コアコンセプト

- Friendly
- Lightweight
- Encouraging
- Quietly smart

### やらないこと

- 威圧的・B2B 感が強い UI
- ダークトーン中心の配色
- 数字を前面に押し出しすぎる表現

> 「分析ツール」ではなく
> **“一緒に成長を見守る存在”**

---

## 2. カラーパレット

### Primary (Brand)

```css
--blue-400: #60a5fa; /* メイン（ロゴ・主要CTA） */
--blue-300: #93c5fd; /* サブ */
--blue-100: #dbeafe; /* 背景アクセント */
```

### Accent (Growth)

```css
--green-400: #4ade80; /* 成長・プラス */
--green-300: #86efac;
```

### Highlight (Sparkle)

```css
--yellow-300: #fcd34d; /* ✨・軽いCTA強調 */
```

### Status (Error / Warning)

```css
--red-400: #f87171;    /* エラー・減少 */
--orange-400: #fb923c; /* 警告 */
```

#### Usage Rules

- Error / Warning は「変化」や「注意」にのみ使用
- 通常の数値表示では使用しない
- 赤は連続使用しない（1画面1箇所まで）

### Neutral

```css
--gray-900: #1f2937; /* 見出し */
--gray-600: #6b7280; /* 本文 */
--gray-400: #9ca3af; /* 補足 */
--white-soft: #f8fafc; /* 背景 */
```

#### ルール

- 同時に使う強調色は **1 色まで**
- グラデーションは **背景用途のみ可**

---

## 3. タイポグラフィ

### フォント

- Primary: **Inter**
- Fallback: system-ui

### サイズガイド

| 用途          | サイズ  | Weight   |
| ------------- | ------- | -------- |
| Page Title    | 24–28px | Semibold |
| Section Title | 18–20px | Medium   |
| Body          | 14–16px | Regular  |
| Meta          | 12–13px | Regular  |

### Line Height (行間)

```css
--line-height-tight: 1.25;   /* 見出し用 */
--line-height-normal: 1.5;   /* 本文用 */
--line-height-relaxed: 1.75; /* 読み物用 */
```

### Letter Spacing (字間)

```css
--letter-spacing-tight: -0.025em; /* 見出し（大きいサイズ） */
--letter-spacing-normal: 0;        /* 標準 */
--letter-spacing-wide: 0.025em;    /* Meta・小さいテキスト */
```

### フォントの読み込み

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## 4. スペーシング

### Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
```

### ルール

- コンポーネント内のマージン・パディング: **4px 単位**
- セクション間のスペース: **8px の倍数**
- モバイルは `space-4` (16px) を基準に
- デスクトップは `space-6` (24px) を基準に

---

## 5. コンポーネント

### Button

#### Primary

主要CTA（Invite / Upgrade）

```css
background: var(--blue-400);
color: white;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
```

**States:**
- Hover: `--blue-500` (1段階暗く)
- Active: `--blue-600`
- Disabled: `opacity: 0.5`, `cursor: not-allowed`

#### Secondary

主要操作の代替（Filter / Switch）

```css
background: transparent;
color: var(--blue-400);
border: 1px solid var(--blue-400);
padding: 12px 24px;
border-radius: 8px;
```

#### Ghost

補助操作（Cancel / Back）

```css
background: transparent;
color: var(--gray-600);
border: 1px solid var(--gray-300);
padding: 12px 24px;
border-radius: 8px;
```

### Card

```css
background: white;
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
```

**Hover:**
```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Badge

```css
background: var(--blue-100);
color: var(--blue-600);
padding: 4px 12px;
border-radius: 16px;
font-size: 12px;
font-weight: 500;
```

**Variants:**
- Success: `--green-100` / `--green-600`
- Warning: `--orange-100` / `--orange-600`
- Error: `--red-100` / `--red-600`

#### Usage Rules

- **Badge**: 状態・属性・短いラベル（例: "New", "Premium", "+5"）
- **Alert**: 行動を促すメッセージ・注意喚起（例: "設定が保存されました"）

### Alert

```css
background: var(--blue-50);
border-left: 4px solid var(--blue-400);
padding: 16px;
border-radius: 8px;
```

**Variants:** Info (blue), Success (green), Warning (orange), Error (red)

---

## 6. グラフ・チャート

### Chart Colors

```css
--chart-line-1: var(--blue-400);   /* メイン */
--chart-line-2: var(--green-400);  /* 成長 */
--chart-line-3: var(--yellow-300); /* アクセント */
--chart-grid: #e5e7eb;             /* グリッド線 */
--chart-label: var(--gray-600);    /* ラベル */
```

### ルール

- 折れ線グラフ: `stroke-width: 2px`
- グリッド線: `stroke-width: 1px`, `opacity: 0.5`
- データポイント: 半径 `4px`
- ホバー時: 半径 `6px`, 外枠 `white 2px`

---

## 7. アイコン

### Icon System

- **Library**: [Heroicons](https://heroicons.com/) (Tailwind CSS 公式)
- **Style**: Outline (線画)
- **Size**: 16px, 20px, 24px
- **Stroke Width**: 1.5–2

### 使用例

```jsx
import { ChartBarIcon } from '@heroicons/react/24/outline';

<ChartBarIcon className="w-6 h-6 text-blue-400" />
```

---

## 8. レイアウト

### Container

```css
max-width: 1200px;
margin: 0 auto;
padding: 0 var(--space-4); /* mobile */
padding: 0 var(--space-6); /* desktop */
```

### Grid

```css
display: grid;
grid-template-columns: repeat(12, 1fr); /* desktop */
grid-template-columns: repeat(4, 1fr);  /* mobile */
gap: var(--space-4);
```

---

## 9. シャドウ

### Elevation

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

### 使用ガイド

- Card: `--shadow-sm` (通常), `--shadow-md` (hover)
- Modal: `--shadow-xl`
- Dropdown: `--shadow-lg`

---

## 10. アニメーション

### Timing

```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### Easing

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### ルール

- ホバー・クリック: `--duration-fast` + `--ease-out`
- モーダル・ドロワー: `--duration-normal` + `--ease-in-out`
- ページ遷移: `--duration-slow` + `--ease-in-out`

---

## 実装ガイド

### Tailwind CSS 設定例

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#60a5fa',
          light: '#93c5fd',
          lighter: '#dbeafe',
        },
        growth: {
          DEFAULT: '#4ade80',
          light: '#86efac',
        },
        sparkle: '#fcd34d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
    },
  },
  plugins: [],
};
```

---

## 更新履歴

- **v0.2** (2026-01-31): Button 命名整理（Outline → Ghost）、Status Color 使用ルール追加、Alert/Badge 使い分け明文化
- **v0.1** (2026-01-31): 初版リリース
