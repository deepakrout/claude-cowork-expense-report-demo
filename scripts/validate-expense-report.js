#!/usr/bin/env node
/**
 * validate-expense-report.js
 *
 * Sanity-checks a CSV expense report produced by Claude Cowork against
 * the receipts in ./receipts. Not a full accounting audit -- just enough
 * to catch the mistakes that matter: missing rows, malformed dates,
 * and totals that don't add up.
 *
 * Usage:
 *   node scripts/validate-expense-report.js ./expense-report.csv
 */

const fs = require("fs");
const path = require("path");

const REQUIRED_COLUMNS = [
  "Date",
  "Vendor",
  "Category",
  "Subtotal",
  "Tax",
  "Tip",
  "Total",
  "Notes",
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseCsv(raw) {
  return raw
    .trim()
    .split("\n")
    .map(function (line) {
      return line.split(",").map(function (cell) {
        return cell.trim();
      });
    });
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: node validate-expense-report.js <path-to-csv>");
    process.exit(1);
  }

  const fullPath = path.resolve(inputPath);
  if (!fs.existsSync(fullPath)) {
    console.error("File not found: " + fullPath);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(fullPath, "utf8"));
  const header = rows[0];
  const dataRows = rows.slice(1);

  const errors = [];
  const warnings = [];

  REQUIRED_COLUMNS.forEach(function (col, i) {
    if (header[i] !== col) {
      errors.push(
        "Column " + i + ' should be "' + col + '" but found "' +
          (header[i] || "(missing)") + '"'
      );
    }
  });

  let runningTotal = 0;
  let declaredTotalRow = null;

  dataRows.forEach(function (row, i) {
    const lineNo = i + 2; // +1 for header, +1 for 1-index
    const date = row[0];
    const vendor = row[1];
    const category = row[2];
    const subtotal = row[3];
    const tax = row[4];
    const tip = row[5];
    const total = row[6];

    if (vendor && vendor.toUpperCase() === "TOTAL") {
      declaredTotalRow = row;
      return;
    }

    if (!DATE_RE.test(date)) {
      errors.push("Line " + lineNo + ': date "' + date + '" is not YYYY-MM-DD');
    }
    if (!vendor) {
      errors.push("Line " + lineNo + ": missing vendor");
    }
    if (["travel", "lodging", "meals", "supplies"].indexOf((category || "").toLowerCase()) === -1) {
      warnings.push("Line " + lineNo + ': unexpected category "' + category + '"');
    }

    const computed =
      (parseFloat(subtotal) || 0) +
      (parseFloat(tax) || 0) +
      (parseFloat(tip) || 0);
    const stated = parseFloat(total) || 0;

    if (Math.abs(computed - stated) > 0.02) {
      errors.push(
        "Line " + lineNo + ": subtotal+tax+tip (" + computed.toFixed(2) +
          ") doesn't match stated total (" + stated.toFixed(2) + ")"
      );
    }

    runningTotal += stated;
  });

  if (!declaredTotalRow) {
    warnings.push('No summary "TOTAL" row found.');
  } else {
    const declared = parseFloat(declaredTotalRow[6]) || 0;
    if (Math.abs(declared - runningTotal) > 0.02) {
      errors.push(
        "Declared TOTAL row (" + declared.toFixed(2) +
          ") doesn't match sum of line items (" + runningTotal.toFixed(2) + ")"
      );
    }
  }

  console.log("Checked " + dataRows.length + " row(s).");
  console.log("Computed total: $" + runningTotal.toFixed(2));

  if (warnings.length) {
    console.log("\nWarnings:");
    warnings.forEach(function (w) {
      console.log("  - " + w);
    });
  }

  if (errors.length) {
    console.log("\nErrors:");
    errors.forEach(function (e) {
      console.log("  - " + e);
    });
    process.exit(1);
  }

  console.log("\nExpense report looks good.");
}

main();
