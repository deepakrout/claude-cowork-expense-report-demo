# Claude Cowork Expense Report Demo

A companion project for the Siloscape tutorial **"Turn a Folder of Receipts into an Expense Report with Claude Cowork."**

This repo gives you a realistic (but fake) folder of receipts, a ready-to-use Cowork task prompt, and a small Node.js script to validate whatever expense report Claude produces. Nothing here calls any Anthropic API directly — Cowork itself does the heavy lifting inside Claude Desktop or claude.ai. This repo just gives you something real to point it at.

## What's in here

```
claude-cowork-expense-report-demo/
├── receipts/
│   ├── receipt-001.txt        # Rideshare
│   ├── receipt-002.txt        # Hotel folio
│   ├── receipt-003.txt        # Client lunch
│   └── receipt-004.txt        # Office supplies
├── instructions/
│   └── cowork-task-prompt.md  # The exact prompt used in the tutorial
├── scripts/
│   ├── validate-expense-report.js
│   └── package.json
├── sample-output/
│   └── expense-report-sample.csv
└── README.md
```

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/deepakrout/claude-cowork-expense-report-demo.git
cd claude-cowork-expense-report-demo
```

### 2. Install the validator's dependencies

```bash
cd scripts
npm install
cd ..
```

### 3. Open the folder in Claude Desktop

Start a Cowork session (Pro, Max, Team, or Enterprise plan), grant it access to this repo's root folder, and paste in the prompt from `instructions/cowork-task-prompt.md`.

### 4. Validate the output

Once Cowork writes an `expense-report.csv` into this folder, run:

```bash
node scripts/validate-expense-report.js ./expense-report.csv
```

The script checks column headers, date formats, and that totals add up against the source receipts. Compare it against `sample-output/expense-report-sample.csv` if you want a reference for what a correct run looks like.

## Why this exists

Most Cowork demos wave a hand at "organize your files." This repo is small enough to run in a few minutes but has just enough messiness — mixed date formats, a tax line, a tip that isn't itemized — to show Cowork actually reasoning about receipts rather than doing a trivial copy-paste.

## License

MIT — use this however is useful to you.
