# Cowork Task Prompt

Paste this into a Cowork session after granting it access to this repo's root folder.

---

> Look at every receipt in the `receipts/` folder. For each one, extract the vendor, date, category (travel, lodging, meals, or supplies), subtotal, tax, tip/gratuity if present, and total.
>
> Then build `expense-report.csv` in the root of this folder with one row per receipt and these columns, in this order: `Date, Vendor, Category, Subtotal, Tax, Tip, Total, Notes`.
>
> Normalize every date to `YYYY-MM-DD` format, even though the receipts use different formats. Add a final `TOTAL` row summing the Total column. In the Notes column, flag anything unusual — for example the hotel's resort fee, or the client lunch's business purpose.
>
> When you're done, also create `expense-report-summary.md` with a two-sentence summary of total spend by category.

---

## Why this prompt works well

- It names the **exact output filename and location**, so you're not hunting for where Claude saved it.
- It specifies the **column order**, which keeps the CSV consistent across runs.
- It calls out the **date normalization** requirement explicitly, since Cowork will otherwise mirror each receipt's original format.
- It asks for a **second, human-readable summary file**, which is a good pattern any time you want both a machine-readable and a skimmable output from the same task.
