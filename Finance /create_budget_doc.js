const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  Header, Footer, PageNumber, HeadingLevel, LevelFormat,
  TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ── color constants ───────────────────────────────────────────────────────────
const NAVY      = "1A3C6E";
const BLUE      = "2E75B6";
const LT_BLUE   = "DEEAF1";
const DK_GREEN  = "1E5631";
const LT_GREEN  = "E2EFDA";
const DK_ORANGE = "B7410E";
const LT_ORANGE = "FCE4D6";
const PURPLE    = "5B2C6F";
const LT_PURPLE = "E8DAEF";
const LT_YELLOW = "FFF2CC";
const WHITE     = "FFFFFF";
const LIGHT_GRAY = "F2F2F2";

// ── helpers ───────────────────────────────────────────────────────────────────
const pt = (n) => n * 2; // half-points
const dxa = (inch) => Math.round(inch * 1440);

function cellBorder(color = "CCCCCC") {
  const s = { style: BorderStyle.SINGLE, size: 4, color };
  return { top: s, bottom: s, left: s, right: s };
}

function noBorder() {
  const s = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: s, bottom: s, left: s, right: s };
}

function shading(fill) {
  return { fill, type: ShadingType.CLEAR };
}

function tc(children, { width, fill, bold, align, color, colspan, vAlign, borders } = {}) {
  return new TableCell({
    width: { size: width || 1000, type: WidthType.DXA },
    shading: fill ? shading(fill) : undefined,
    borders: borders || cellBorder(),
    verticalAlign: vAlign || VerticalAlign.CENTER,
    columnSpan: colspan,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: align || AlignmentType.LEFT,
      children: [new TextRun({
        text: children,
        font: "Arial",
        size: pt(10),
        bold: bold || false,
        color: color || "000000",
      })]
    })]
  });
}

function headerRow(cells, fill = NAVY) {
  return new TableRow({
    tableHeader: true,
    children: cells.map(([text, width, colspan]) =>
      tc(text, { width, fill, bold: true, color: WHITE, align: AlignmentType.CENTER, colspan })
    )
  });
}

function dataRow(cells, fill = WHITE) {
  return new TableRow({
    children: cells.map(([text, width, opts]) =>
      tc(text, { width, fill, ...(opts || {}) })
    )
  });
}

function sectionTitle(text, fill = NAVY) {
  return new Table({
    width: { size: dxa(6.5), type: WidthType.DXA },
    columnWidths: [dxa(6.5)],
    rows: [new TableRow({
      children: [tc(text, {
        width: dxa(6.5),
        fill,
        bold: true,
        color: WHITE,
        align: AlignmentType.CENTER,
        borders: noBorder()
      })]
    })]
  });
}

function spacer(lines = 1) {
  return Array.from({ length: lines }, () =>
    new Paragraph({ children: [new TextRun({ text: "", size: pt(6) })] })
  );
}

function subTitle(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: pt(9), color: "595959", italics: true })]
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 40, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: pt(8.5), color: "2E75B6" })]
  });
}

// ── DOCUMENT ──────────────────────────────────────────────────────────────────
// Content width: A4 (11906 DXA) - 2 * 1260 DXA margin = 9386 → use 9360 for clean numbers
const CW = 9360; // content width in DXA

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: pt(10) } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: pt(18), bold: true, font: "Arial", color: WHITE },
        paragraph: { spacing: { before: 0, after: 0 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: pt(13), bold: true, font: "Arial", color: WHITE },
        paragraph: { spacing: { before: 0, after: 0 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 180 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: dxa(0.875), right: dxa(0.875), bottom: dxa(0.875), left: dxa(0.875) }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 1 } },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "DIGITAL MARKETING BUDGET REPORT  |  April 2026", font: "Arial", size: pt(9), bold: true, color: NAVY }),
              new TextRun({ text: "\t", font: "Arial", size: pt(9) }),
              new TextRun({ text: "Konfidensial – Internal Finance", font: "Arial", size: pt(8.5), color: "888888", italics: true })
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 1 } },
            spacing: { before: 80 },
            children: [
              new TextRun({ text: "Tim Digital Marketing  |  Periode: April 2026", font: "Arial", size: pt(8.5), color: "595959" }),
              new TextRun({ text: "\t", font: "Arial", size: pt(8.5) }),
              new TextRun({ text: "Hal. ", font: "Arial", size: pt(8.5), color: "595959" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: pt(8.5), color: "595959" }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
          })
        ]
      })
    },
    children: [

      // ══════════════════════════════════════════════════════════════════════
      // COVER / JUDUL UTAMA
      // ══════════════════════════════════════════════════════════════════════
      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [CW],
        rows: [
          new TableRow({ children: [tc("DIGITAL MARKETING BUDGET REPORT", { width: CW, fill: NAVY, bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() })] }),
          new TableRow({ children: [tc("Periode: April 2026  |  Tim: Digital Marketing", { width: CW, fill: BLUE, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() })] }),
        ]
      }),

      ...spacer(1),

      // ══════════════════════════════════════════════════════════════════════
      // PEMBUKA / OPENING
      // ══════════════════════════════════════════════════════════════════════
      new Paragraph({
        spacing: { before: 0, after: 120 },
        children: [
          new TextRun({ text: "Kepada Yth.", font: "Arial", size: pt(10) }),
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [new TextRun({ text: "Tim Keuangan (Finance)", font: "Arial", size: pt(10), bold: true })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "Di Tempat", font: "Arial", size: pt(10) })]
      }),

      new Paragraph({
        spacing: { before: 0, after: 160 },
        children: [new TextRun({ text: "Dengan hormat,", font: "Arial", size: pt(10) })]
      }),

      new Paragraph({
        spacing: { before: 0, after: 160 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({
          text: "Melalui dokumen ini, Tim Digital Marketing menyampaikan rincian kebutuhan anggaran untuk periode April 2026. "
              + "Dokumen ini disusun sebagai acuan resmi bagi Tim Keuangan dalam memproses persetujuan dan pencairan dana operasional yang dibutuhkan tim kami.",
          font: "Arial", size: pt(10)
        })]
      }),

      new Paragraph({
        spacing: { before: 0, after: 160 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({
          text: "Anggaran yang diajukan mencakup empat komponen utama, yaitu: (1) langganan tahunan untuk tools desain dan aset kreatif, "
              + "(2) langganan bulanan untuk tools produktivitas dan operasional digital, "
              + "(3) budget iklan digital pada platform Meta Ads, Google Ads, dan TikTok Ads, serta "
              + "(4) kebutuhan lainnya yang meliputi biaya kolaborasi, giveaway, dan pengadaan peralatan produksi konten.",
          font: "Arial", size: pt(10)
        })]
      }),

      new Paragraph({
        spacing: { before: 0, after: 160 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({
          text: "Untuk bulan April 2026, total budget iklan digital yang diajukan adalah sebesar Rp 16.000.000, "
              + "dengan alokasi 60% untuk Meta Ads (Rp 9.600.000), 30% untuk Google Ads (Rp 4.800.000), dan 10% untuk TikTok Ads (Rp 1.600.000) "
              + "sebagai kampanye brand awareness. Beberapa pos biaya lainnya masih dalam proses konfirmasi harga dan akan segera dilengkapi.",
          font: "Arial", size: pt(10)
        })]
      }),

      new Paragraph({
        spacing: { before: 0, after: 200 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({
          text: "Kami mohon kiranya Tim Keuangan dapat meninjau dan memproses pengajuan anggaran ini. "
              + "Apabila terdapat pertanyaan atau diperlukan klarifikasi lebih lanjut, kami siap memberikan informasi tambahan yang dibutuhkan. "
              + "Atas perhatian dan kerja samanya, kami ucapkan terima kasih.",
          font: "Arial", size: pt(10)
        })]
      }),

      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Hormat kami,", font: "Arial", size: pt(10) })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [new TextRun({ text: "Tim Digital Marketing", font: "Arial", size: pt(10), bold: true })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [new TextRun({ text: "April 2026", font: "Arial", size: pt(10), color: "595959" })]
      }),

      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 1 } },
        spacing: { before: 160, after: 160 },
        children: [new TextRun({ text: "" })]
      }),

      ...spacer(1),

      // ══════════════════════════════════════════════════════════════════════
      // OVERVIEW BUDGET  – MAY 2026
      // Grand Total (monthly equivalent):
      //   A setara/bln : 4.403.500 / 12 = 366.958
      //   B monthly    : 2.264.988
      //   C ads        : 16.000.000
      //   D studio     : 835.000
      //   E dreamprener: 750.000
      //   TOTAL        : 20.216.946
      // ══════════════════════════════════════════════════════════════════════
      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [CW],
        rows: [new TableRow({ children: [tc("OVERVIEW BUDGET – MEI 2026", { width: CW, fill: NAVY, bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() })] })]
      }),

      ...spacer(1),

      // col: No(380) | Item(3000) | Qty(480) | Biaya Rp(2300) | Status(1100) | Catatan(2100)
      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [380, 3000, 480, 2300, 1100, 2100],
        rows: [

          headerRow([
            ["NO",  380],
            ["ITEM BIAYA", 3000],
            ["QTY",  480],
            ["BIAYA (Rp)", 2300],
            ["STATUS", 1100],
            ["CATATAN", 2100]
          ], NAVY),

          // ── A: LANGGANAN TAHUNAN ─────────────────────────────────────────
          new TableRow({ children: [
            tc("A", { width: 380,  fill: DK_GREEN, bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("LANGGANAN TAHUNAN  (Setara/bulan = Total Tahunan ÷ 12)", { width: 7980, fill: DK_GREEN, bold: true, color: WHITE, colspan: 5, borders: noBorder() }),
          ]}),
          dataRow([
            ["A1", 380, { align: AlignmentType.CENTER, color: DK_GREEN }],
            ["Envato Elements", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 1.860.175", 2300, { align: AlignmentType.RIGHT, color: DK_GREEN }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Tools desain, aset video & musik", 2100, { color: "595959" }],
          ], WHITE),
          dataRow([
            ["A2", 380, { align: AlignmentType.CENTER, color: DK_GREEN }],
            ["Canva Pro", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 800.000", 2300, { align: AlignmentType.RIGHT, color: DK_GREEN }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Tools desain grafis & konten visual", 2100, { color: "595959" }],
          ], LIGHT_GRAY),
          dataRow([
            ["A3", 380, { align: AlignmentType.CENTER, color: DK_GREEN }],
            ["Domain", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 279.457", 2300, { align: AlignmentType.RIGHT, color: DK_GREEN }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Website hosting", 2100, { color: "595959" }],
          ], WHITE),
          dataRow([
            ["A4", 380, { align: AlignmentType.CENTER, color: DK_GREEN }],
            ["Hosting", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 1.463.868", 2300, { align: AlignmentType.RIGHT, color: DK_GREEN }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Hosting server website", 2100, { color: "595959" }],
          ], LIGHT_GRAY),
          new TableRow({ children: [
            tc("", { width: 380,  fill: LT_GREEN, borders: noBorder() }),
            tc("Subtotal A  (Tahunan)", { width: 3000, fill: LT_GREEN, bold: true, color: DK_GREEN, borders: noBorder() }),
            tc("",  { width: 480,  fill: LT_GREEN, borders: noBorder() }),
            tc("Rp 4.403.500", { width: 2300, fill: LT_GREEN, bold: true, color: DK_GREEN, align: AlignmentType.RIGHT, borders: noBorder() }),
            tc("✓ Confirmed", { width: 1100, fill: LT_GREEN, bold: true, color: DK_GREEN, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("", { width: 2100, fill: LT_GREEN, borders: noBorder() }),
          ]}),
          new TableRow({ children: [
            tc("", { width: 380,  fill: LT_GREEN, borders: noBorder() }),
            tc("Setara / Bulan  (÷ 12)", { width: 3000, fill: LT_GREEN, bold: true, color: DK_GREEN, borders: noBorder() }),
            tc("",  { width: 480,  fill: LT_GREEN, borders: noBorder() }),
            tc("Rp 366.958", { width: 2300, fill: LT_GREEN, bold: true, color: DK_GREEN, align: AlignmentType.RIGHT, borders: noBorder() }),
            tc("", { width: 1100, fill: LT_GREEN, borders: noBorder() }),
            tc("Masuk perhitungan Grand Total", { width: 2100, fill: LT_GREEN, color: DK_GREEN, borders: noBorder() }),
          ]}),

          // ── B: LANGGANAN BULANAN ─────────────────────────────────────────
          new TableRow({ children: [
            tc("B", { width: 380, fill: PURPLE, bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("LANGGANAN BULANAN", { width: 7980, fill: PURPLE, bold: true, color: WHITE, colspan: 5, borders: noBorder() }),
          ]}),
          dataRow([
            ["B1", 380, { align: AlignmentType.CENTER, color: PURPLE }],
            ["ChatGPT (OpenAI) + PPN", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 388.000", 2300, { align: AlignmentType.RIGHT, color: PURPLE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["AI tools – copywriting & riset konten", 2100, { color: "595959" }],
          ], WHITE),
          dataRow([
            ["B2", 380, { align: AlignmentType.CENTER, color: PURPLE }],
            ["Google Workspace  (Maret + April)", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 1.676.988", 2300, { align: AlignmentType.RIGHT, color: PURPLE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Email bisnis, Drive, Docs, Sheets", 2100, { color: "595959" }],
          ], LIGHT_GRAY),
          dataRow([
            ["B3", 380, { align: AlignmentType.CENTER, color: PURPLE }],
            ["Semrush", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 200.000", 2300, { align: AlignmentType.RIGHT, color: PURPLE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Tools SEO", 2100, { color: "595959" }],
          ], WHITE),
          new TableRow({ children: [
            tc("", { width: 380,  fill: LT_PURPLE, borders: noBorder() }),
            tc("Subtotal B", { width: 3000, fill: LT_PURPLE, bold: true, color: PURPLE, borders: noBorder() }),
            tc("",  { width: 480,  fill: LT_PURPLE, borders: noBorder() }),
            tc("Rp 2.264.988", { width: 2300, fill: LT_PURPLE, bold: true, color: PURPLE, align: AlignmentType.RIGHT, borders: noBorder() }),
            tc("✓ Confirmed", { width: 1100, fill: LT_PURPLE, bold: true, color: DK_GREEN, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("", { width: 2100, fill: LT_PURPLE, borders: noBorder() }),
          ]}),

          // ── C: BUDGET IKLAN DIGITAL ──────────────────────────────────────
          new TableRow({ children: [
            tc("C", { width: 380, fill: DK_ORANGE, bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("BUDGET IKLAN DIGITAL", { width: 7980, fill: DK_ORANGE, bold: true, color: WHITE, colspan: 5, borders: noBorder() }),
          ]}),
          dataRow([
            ["C1", 380, { align: AlignmentType.CENTER, color: DK_ORANGE }],
            ["Meta Ads  (60%)", 3000, { bold: true }],
            ["–", 480, { align: AlignmentType.CENTER, color: "888888" }],
            ["Rp 9.600.000", 2300, { align: AlignmentType.RIGHT, bold: true, color: DK_ORANGE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["CPL Rp 17.000  |  ±558 leads", 2100, { color: "595959" }],
          ], WHITE),
          dataRow([
            ["C2", 380, { align: AlignmentType.CENTER, color: DK_ORANGE }],
            ["Google Ads  (30%)", 3000, { bold: true }],
            ["–", 480, { align: AlignmentType.CENTER, color: "888888" }],
            ["Rp 4.800.000", 2300, { align: AlignmentType.RIGHT, bold: true, color: DK_ORANGE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["CPL Rp 50.000  |  ±96 leads", 2100, { color: "595959" }],
          ], LIGHT_GRAY),
          dataRow([
            ["C3", 380, { align: AlignmentType.CENTER, color: DK_ORANGE }],
            ["TikTok Ads  (10%)", 3000, { bold: true }],
            ["–", 480, { align: AlignmentType.CENTER, color: "888888" }],
            ["Rp 1.600.000", 2300, { align: AlignmentType.RIGHT, bold: true, color: DK_ORANGE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Awareness  |  ±100 followers", 2100, { color: "595959" }],
          ], WHITE),
          new TableRow({ children: [
            tc("", { width: 380,  fill: LT_ORANGE, borders: noBorder() }),
            tc("Subtotal C", { width: 3000, fill: LT_ORANGE, bold: true, color: DK_ORANGE, borders: noBorder() }),
            tc("",  { width: 480,  fill: LT_ORANGE, borders: noBorder() }),
            tc("Rp 16.000.000", { width: 2300, fill: LT_ORANGE, bold: true, color: DK_ORANGE, align: AlignmentType.RIGHT, borders: noBorder() }),
            tc("✓ Confirmed", { width: 1100, fill: LT_ORANGE, bold: true, color: DK_GREEN, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("", { width: 2100, fill: LT_ORANGE, borders: noBorder() }),
          ]}),

          // ── D: BUDGET INVENTORY STUDIO ───────────────────────────────────
          new TableRow({ children: [
            tc("D", { width: 380, fill: BLUE, bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("BUDGET INVENTORY STUDIO  (Peningkatan Kualitas Video)", { width: 7980, fill: BLUE, bold: true, color: WHITE, colspan: 5, borders: noBorder() }),
          ]}),
          dataRow([
            ["D1", 380, { align: AlignmentType.CENTER, color: BLUE }],
            ["Background 150cm", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 150.000", 2300, { align: AlignmentType.RIGHT, color: BLUE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Backdrop produksi konten", 2100, { color: "595959" }],
          ], WHITE),
          dataRow([
            ["D2", 380, { align: AlignmentType.CENTER, color: BLUE }],
            ["Tripod Portable", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 200.000", 2300, { align: AlignmentType.RIGHT, color: BLUE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Stabilisasi kamera video & foto", 2100, { color: "595959" }],
          ], LIGHT_GRAY),
          dataRow([
            ["D3", 380, { align: AlignmentType.CENTER, color: BLUE }],
            ["Softbox Lighting", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 385.000", 2300, { align: AlignmentType.RIGHT, color: BLUE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Pencahayaan konten YouTube & sosmed", 2100, { color: "595959" }],
          ], WHITE),
          dataRow([
            ["D4", 380, { align: AlignmentType.CENTER, color: BLUE }],
            ["Stop Contact", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 100.000", 2300, { align: AlignmentType.RIGHT, color: BLUE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Daya listrik peralatan studio", 2100, { color: "595959" }],
          ], LIGHT_GRAY),
          new TableRow({ children: [
            tc("", { width: 380,  fill: LT_BLUE, borders: noBorder() }),
            tc("Subtotal D", { width: 3000, fill: LT_BLUE, bold: true, color: BLUE, borders: noBorder() }),
            tc("",  { width: 480,  fill: LT_BLUE, borders: noBorder() }),
            tc("Rp 835.000", { width: 2300, fill: LT_BLUE, bold: true, color: BLUE, align: AlignmentType.RIGHT, borders: noBorder() }),
            tc("✓ Confirmed", { width: 1100, fill: LT_BLUE, bold: true, color: DK_GREEN, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("", { width: 2100, fill: LT_BLUE, borders: noBorder() }),
          ]}),

          // ── E: DREAMPRENEUR ──────────────────────────────────────────────
          new TableRow({ children: [
            tc("E", { width: 380, fill: "2C3E50", bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("DREAMPRENEUR  (Branding Dreamlab & Awareness – KPI: Social Media Exposure & YouTube)", { width: 7980, fill: "2C3E50", bold: true, color: WHITE, colspan: 5, borders: noBorder() }),
          ]}),
          dataRow([
            ["E1", 380, { align: AlignmentType.CENTER, color: "2C3E50" }],
            ["Dreamlab – Fee Kerjasama Kolaborasi", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["FREE", 2300, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Kolaborasi tanpa biaya di bulan ini", 2100, { color: "595959" }],
          ], WHITE),
          dataRow([
            ["E2", 380, { align: AlignmentType.CENTER, color: "2C3E50" }],
            ["Giveaway Produk kepada Pendengar", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 400.000", 2300, { align: AlignmentType.RIGHT, color: DK_ORANGE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Engagement audience Dreampreneur", 2100, { color: "595959" }],
          ], LIGHT_GRAY),
          dataRow([
            ["E3", 380, { align: AlignmentType.CENTER, color: "2C3E50" }],
            ["Sewa Kamera + Memory + Tripod", 3000, { bold: true }],
            ["1", 480, { align: AlignmentType.CENTER }],
            ["Rp 350.000", 2300, { align: AlignmentType.RIGHT, color: DK_ORANGE }],
            ["✓ Confirmed", 1100, { align: AlignmentType.CENTER, bold: true, color: DK_GREEN }],
            ["Produksi konten video YouTube & sosmed", 2100, { color: "595959" }],
          ], WHITE),
          new TableRow({ children: [
            tc("", { width: 380,  fill: "D5D8DC", borders: noBorder() }),
            tc("Subtotal E", { width: 3000, fill: "D5D8DC", bold: true, color: "2C3E50", borders: noBorder() }),
            tc("",  { width: 480,  fill: "D5D8DC", borders: noBorder() }),
            tc("Rp 750.000", { width: 2300, fill: "D5D8DC", bold: true, color: "2C3E50", align: AlignmentType.RIGHT, borders: noBorder() }),
            tc("✓ Confirmed", { width: 1100, fill: "D5D8DC", bold: true, color: DK_GREEN, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("", { width: 2100, fill: "D5D8DC", borders: noBorder() }),
          ]}),

          // ── GRAND TOTAL ──────────────────────────────────────────────────
          // A(÷12) 366.958 + B 2.264.988 + C 16.000.000 + D 835.000 + E 750.000
          // = 20.216.946
          new TableRow({ children: [
            tc("", { width: 380,  fill: NAVY, borders: noBorder() }),
            tc("GRAND TOTAL ESTIMASI BIAYA BULAN INI", { width: 3480, fill: NAVY, bold: true, color: WHITE, colspan: 2, align: AlignmentType.LEFT, borders: noBorder() }),
            tc("Rp 20.216.946", { width: 2300, fill: NAVY, bold: true, color: LT_YELLOW, align: AlignmentType.RIGHT, borders: noBorder() }),
            tc("✓ Confirmed", { width: 1100, fill: NAVY, bold: true, color: LT_YELLOW, align: AlignmentType.CENTER, borders: noBorder() }),
            tc("Annual setara/bln + Monthly + Ads + Studio + Dreampreneur", { width: 2100, fill: NAVY, color: LT_BLUE, borders: noBorder() }),
          ]}),
        ]
      }),

      ...spacer(1),

      // ── LEGENDA STATUS ───────────────────────────────────────────────────
      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [CW],
        rows: [new TableRow({ children: [
          new TableCell({
            width: { size: CW, type: WidthType.DXA },
            shading: shading(LT_BLUE),
            borders: cellBorder(BLUE),
            margins: { top: 80, bottom: 80, left: 160, right: 120 },
            children: [
              new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "KETERANGAN STATUS & CATATAN:", font: "Arial", size: pt(9), bold: true, color: NAVY })] }),
              new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 20 }, children: [new TextRun({ text: "✓ Confirmed  = Angka sudah pasti, sesuai data yang diberikan Tim Digital Marketing.", font: "Arial", size: pt(8.5), color: DK_GREEN, bold: true })] }),
              new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 20 }, children: [new TextRun({ text: "TBD (To Be Determined)  = Harga belum dikonfirmasi, perlu dilengkapi sebelum pengajuan anggaran final.", font: "Arial", size: pt(8.5), color: "888888" })] }),
              new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 0  }, children: [new TextRun({ text: "Latar kuning = sel yang perlu diisi Tim Digital Marketing dengan harga aktual (invoice / kuitansi).", font: "Arial", size: pt(8.5), color: "595959" })] }),
            ]
          })
        ]})]
      }),

      ...spacer(2),

      // ══════════════════════════════════════════════════════════════════════
      // BAGIAN 1: LANGGANAN TAHUNAN
      // ══════════════════════════════════════════════════════════════════════
      sectionTitle("1.  LANGGANAN TAHUNAN  (Annual Subscriptions)", DK_GREEN),
      subTitle("Biaya berikut dibayar satu kali dalam setahun. Kolom 'Setara/Bulan' digunakan untuk alokasi laporan bulanan."),
      ...spacer(1),

      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [2100, 2800, 1820, 1820, 820],
        rows: [
          headerRow([
            ["NAMA TOOLS", 2100],
            ["KATEGORI / FUNGSI", 2800],
            ["BIAYA TAHUNAN (Rp)", 1820],
            ["SETARA / BULAN (Rp)", 1820],
            ["CATATAN", 820]
          ], DK_GREEN),
          dataRow([
            ["Envato Elements", 2100, { bold: true }],
            ["Template Desain, Aset Video, Musik Royalti-bebas", 2800],
            ["", 1820, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["(auto: harga ÷ 12)", 1820, { align: AlignmentType.CENTER, color: "888888" }],
            ["Isi harga aktual", 820, { color: "888888" }]
          ], WHITE),
          dataRow([
            ["Canva Pro", 2100, { bold: true }],
            ["Desain Grafis, Konten Visual, Presentasi", 2800],
            ["", 1820, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["(auto: harga ÷ 12)", 1820, { align: AlignmentType.CENTER, color: "888888" }],
            ["Isi harga aktual", 820, { color: "888888" }]
          ], LIGHT_GRAY),
          new TableRow({
            children: [
              tc("TOTAL BIAYA TAHUNAN", { width: 4900, fill: DK_GREEN, bold: true, color: WHITE, align: AlignmentType.CENTER, colspan: 2, borders: noBorder() }),
              tc("(isi harga aktual dahulu)", { width: 1820, fill: DK_GREEN, color: LT_GREEN, align: AlignmentType.CENTER, borders: noBorder() }),
              tc("(isi harga aktual dahulu)", { width: 1820, fill: DK_GREEN, color: LT_GREEN, align: AlignmentType.CENTER, borders: noBorder() }),
              tc("", { width: 820, fill: DK_GREEN, borders: noBorder() }),
            ]
          })
        ]
      }),

      ...spacer(2),

      // ══════════════════════════════════════════════════════════════════════
      // BAGIAN 2: LANGGANAN BULANAN
      // ══════════════════════════════════════════════════════════════════════
      sectionTitle("2.  LANGGANAN BULANAN  (Monthly Subscriptions)", PURPLE),
      ...spacer(1),

      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [2200, 3000, 1960, 2200],
        rows: [
          headerRow([
            ["NAMA TOOLS", 2200],
            ["KATEGORI / FUNGSI", 3000],
            ["BIAYA BULANAN (Rp)", 1960],
            ["CATATAN", 2200]
          ], PURPLE),
          dataRow([
            ["ChatGPT (OpenAI)", 2200, { bold: true }],
            ["AI Tools – Copywriting, Riset Konten, Ide Kreatif", 3000],
            ["", 1960, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["ChatGPT Plus / Team Plan", 2200, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["Domain", 2200, { bold: true }],
            ["Hosting Website / Landing Page Marketing", 3000],
            ["", 1960, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Domain .com / .id (cek invoice bulanan)", 2200, { color: "595959" }]
          ], LIGHT_GRAY),
          dataRow([
            ["Google Workspace", 2200, { bold: true }],
            ["Email Bisnis, Google Drive, Docs, Sheets", 3000],
            ["", 1960, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Per user / bulan", 2200, { color: "595959" }]
          ], WHITE),
          new TableRow({
            children: [
              tc("TOTAL LANGGANAN BULANAN", { width: 5200, fill: PURPLE, bold: true, color: WHITE, align: AlignmentType.CENTER, colspan: 2, borders: noBorder() }),
              tc("(isi harga aktual dahulu)", { width: 1960, fill: PURPLE, color: LT_PURPLE, align: AlignmentType.CENTER, borders: noBorder() }),
              tc("", { width: 2200, fill: PURPLE, borders: noBorder() }),
            ]
          })
        ]
      }),

      ...spacer(2),

      // ══════════════════════════════════════════════════════════════════════
      // BAGIAN 3: BUDGET IKLAN DIGITAL
      // ══════════════════════════════════════════════════════════════════════
      sectionTitle("3.  BUDGET IKLAN DIGITAL  (Digital Ads Budget)", DK_ORANGE),
      ...spacer(1),

      // Total budget box
      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [4000, 2560, 2800],
        rows: [new TableRow({
          children: [
            tc("TOTAL BUDGET IKLAN BULAN INI:", { width: 4000, fill: LT_ORANGE, bold: true, color: DK_ORANGE, borders: cellBorder(DK_ORANGE) }),
            tc("Rp 16.000.000", { width: 2560, fill: LT_YELLOW, bold: true, color: DK_ORANGE, align: AlignmentType.RIGHT, borders: cellBorder(DK_ORANGE) }),
            tc("(dapat diubah sesuai bulan berjalan)", { width: 2800, fill: LT_ORANGE, color: "595959", borders: cellBorder(DK_ORANGE) }),
          ]
        })]
      }),

      ...spacer(1),

      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [1800, 1300, 2060, 1700, 1700, 800],
        rows: [
          headerRow([
            ["PLATFORM", 1800],
            ["ALOKASI (%)", 1300],
            ["BUDGET (Rp)", 2060],
            ["CPL – Cost/Lead (Rp)", 1700],
            ["ESTIMASI LEADS", 1700],
            ["TUJUAN", 800]
          ], DK_ORANGE),
          dataRow([
            ["Meta Ads", 1800, { bold: true }],
            ["60%", 1300, { align: AlignmentType.CENTER, bold: true, color: DK_ORANGE }],
            ["Rp 9.600.000", 2060, { align: AlignmentType.RIGHT, bold: true }],
            ["Rp 178.000", 1700, { align: AlignmentType.RIGHT }],
            ["± 54 leads", 1700, { align: AlignmentType.CENTER, color: DK_GREEN }],
            ["Lead Gen", 800, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["Google Ads", 1800, { bold: true }],
            ["30%", 1300, { align: AlignmentType.CENTER, bold: true, color: DK_ORANGE }],
            ["Rp 4.800.000", 2060, { align: AlignmentType.RIGHT, bold: true }],
            ["Rp 45.000", 1700, { align: AlignmentType.RIGHT }],
            ["± 106 leads", 1700, { align: AlignmentType.CENTER, color: DK_GREEN }],
            ["Lead Gen", 800, { color: "595959" }]
          ], LIGHT_GRAY),
          dataRow([
            ["TikTok Ads", 1800, { bold: true }],
            ["10%", 1300, { align: AlignmentType.CENTER, bold: true, color: DK_ORANGE }],
            ["Rp 1.600.000", 2060, { align: AlignmentType.RIGHT, bold: true }],
            ["– (Awareness)", 1700, { align: AlignmentType.CENTER, color: "888888" }],
            ["Tidak diukur", 1700, { align: AlignmentType.CENTER, color: "888888" }],
            ["Awareness", 800, { color: "595959" }]
          ], WHITE),
          new TableRow({
            children: [
              tc("TOTAL", { width: 1800, fill: DK_ORANGE, bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() }),
              tc("100%", { width: 1300, fill: DK_ORANGE, bold: true, color: WHITE, align: AlignmentType.CENTER, borders: noBorder() }),
              tc("Rp 16.000.000", { width: 2060, fill: DK_ORANGE, bold: true, color: WHITE, align: AlignmentType.RIGHT, borders: noBorder() }),
              tc("", { width: 1700, fill: DK_ORANGE, borders: noBorder() }),
              tc("", { width: 1700, fill: DK_ORANGE, borders: noBorder() }),
              tc("", { width: 800,  fill: DK_ORANGE, borders: noBorder() }),
            ]
          })
        ]
      }),

      ...spacer(1),
      note("Catatan: CPL = Cost Per Lead. Estimasi leads = Budget ÷ CPL. TikTok Ads digunakan untuk Brand Awareness, tidak memiliki target CPL."),

      ...spacer(2),

      // ══════════════════════════════════════════════════════════════════════
      // BAGIAN 4: KEBUTUHAN LAINNYA
      // ══════════════════════════════════════════════════════════════════════
      sectionTitle("4.  KEBUTUHAN LAINNYA  (Other Budget Needs)", NAVY),
      ...spacer(1),

      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [1700, 2800, 600, 2060, 2200],
        rows: [
          headerRow([
            ["KATEGORI", 1700],
            ["ITEM / KETERANGAN", 2800],
            ["QTY", 600],
            ["ESTIMASI BIAYA (Rp)", 2060],
            ["CATATAN", 2200]
          ], NAVY),
          dataRow([
            ["Kolaborasi", 1700, { bold: true, color: BLUE }],
            ["Dreamlab – Fee Kerjasama", 2800],
            ["1", 600, { align: AlignmentType.CENTER }],
            ["", 2060, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Kerjasama dengan Klik Media – konfirmasi nilai kontrak", 2200, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["Kolaborasi", 1700, { bold: true, color: BLUE }],
            ["Klik Media – Fee Kerjasama", 2800],
            ["1", 600, { align: AlignmentType.CENTER }],
            ["", 2060, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Konfirmasi nilai kontrak / MOU", 2200, { color: "595959" }]
          ], LIGHT_GRAY),
          dataRow([
            ["Marketing", 1700, { bold: true, color: DK_ORANGE }],
            ["Giveaway Produk (Hadiah Konten)", 2800],
            ["1", 600, { align: AlignmentType.CENTER }],
            ["Rp 300.000", 2060, { align: AlignmentType.RIGHT, color: DK_ORANGE }],
            ["Estimasi ~Rp 300.000 per item (angka dapat berubah)", 2200, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["Marketing", 1700, { bold: true, color: DK_ORANGE }],
            ["Giveaway Karyawan (Internal)", 2800],
            ["1", 600, { align: AlignmentType.CENTER }],
            ["", 2060, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Qty & nilai sesuai keputusan manajemen", 2200, { color: "595959" }]
          ], LIGHT_GRAY),
          dataRow([
            ["Peralatan", 1700, { bold: true, color: DK_GREEN }],
            ["Background Seamless (Selambu)", 2800],
            ["1", 600, { align: AlignmentType.CENTER }],
            ["", 2060, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Verifikasi harga aktual ke supplier", 2200, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["Peralatan", 1700, { bold: true, color: DK_GREEN }],
            ["Softbox Lighting", 2800],
            ["1 unit", 600, { align: AlignmentType.CENTER }],
            ["", 2060, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Verifikasi harga aktual ke supplier", 2200, { color: "595959" }]
          ], LIGHT_GRAY),
          new TableRow({
            children: [
              tc("TOTAL KEBUTUHAN LAINNYA", { width: 5100, fill: NAVY, bold: true, color: WHITE, align: AlignmentType.CENTER, colspan: 3, borders: noBorder() }),
              tc("(isi semua harga dahulu)", { width: 2060, fill: NAVY, color: LT_BLUE, align: AlignmentType.CENTER, borders: noBorder() }),
              tc("", { width: 2200, fill: NAVY, borders: noBorder() }),
            ]
          })
        ]
      }),

      ...spacer(1),
      note("Catatan: Sel berlatar kuning = perlu diisi harga aktual. Konfirmasi harga background (selambu) dan softbox ke supplier sebelum pengajuan anggaran."),

      ...spacer(2),

      // ══════════════════════════════════════════════════════════════════════
      // BAGIAN 5: DREAMPRENEUR – BRANDING & AWARENESS DREAMLAB
      // ══════════════════════════════════════════════════════════════════════
      sectionTitle("5.  PROGRAM DREAMPRENEUR – Branding & Awareness Dreamlab", "2C3E50"),

      ...spacer(1),

      // Latar belakang
      new Paragraph({
        spacing: { before: 0, after: 100 },
        children: [new TextRun({ text: "Latar Belakang", font: "Arial", size: pt(11), bold: true, color: "2C3E50" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 140 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({
          text: "Program Dreampreneur merupakan inisiatif kolaborasi strategis Dreamlab yang dirancang untuk memperluas jangkauan brand "
              + "dan membangun awareness di ekosistem digital. Melalui program ini, Dreamlab hadir tidak hanya sebagai penyedia layanan, "
              + "tetapi juga sebagai komunitas dan ruang inspirasi bagi para pelaku bisnis dan kreator konten. "
              + "Pada bulan April 2026, Tim Digital Marketing mengalokasikan sejumlah kebutuhan anggaran khusus untuk mendukung "
              + "eksekusi program Dreampreneur secara optimal.",
          font: "Arial", size: pt(10)
        })]
      }),

      // Tujuan
      new Paragraph({
        spacing: { before: 0, after: 100 },
        children: [new TextRun({ text: "Tujuan Program", font: "Arial", size: pt(11), bold: true, color: "2C3E50" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 80 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({
          text: "Seluruh aktivitas dalam program Dreampreneur bulan ini diarahkan pada dua tujuan utama:",
          font: "Arial", size: pt(10)
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { before: 0, after: 60 },
        children: [new TextRun({
          text: "Branding Dreamlab — membangun dan memperkuat identitas Dreamlab di benak target audiens melalui konten berkualitas, "
              + "kolaborasi dengan mitra media, serta aktivasi giveaway yang mendorong interaksi langsung dengan komunitas.",
          font: "Arial", size: pt(10)
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { before: 0, after: 140 },
        children: [new TextRun({
          text: "Awareness — menjangkau audiens baru yang belum mengenal Dreamlab melalui distribusi konten organik dan berbayar "
              + "di berbagai platform digital, dengan fokus utama pada social media dan YouTube.",
          font: "Arial", size: pt(10)
        })]
      }),

      // Kebutuhan anggaran dreampreneur
      new Paragraph({
        spacing: { before: 0, after: 100 },
        children: [new TextRun({ text: "Rincian Kebutuhan Anggaran Dreampreneur", font: "Arial", size: pt(11), bold: true, color: "2C3E50" })]
      }),

      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [1700, 3200, 1760, 2700],
        rows: [
          headerRow([
            ["ITEM", 1700],
            ["KETERANGAN", 3200],
            ["EST. BIAYA (Rp)", 1760],
            ["TUJUAN", 2700]
          ], "2C3E50"),
          dataRow([
            ["Fee Dreamlab", 1700, { bold: true }],
            ["Biaya kerjasama kolaborasi program Dreampreneur", 3200],
            ["", 1760, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Produksi & distribusi konten, branding Dreamlab", 2700, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["Fee Klik Media", 1700, { bold: true }],
            ["Amplifikasi konten & jangkauan publikasi media", 3200],
            ["", 1760, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Awareness & social media exposure", 2700, { color: "595959" }]
          ], LIGHT_GRAY),
          dataRow([
            ["Giveaway Produk", 1700, { bold: true }],
            ["Hadiah konten untuk engagement audiens Dreampreneur", 3200],
            ["Rp 300.000", 1760, { align: AlignmentType.RIGHT, color: DK_ORANGE }],
            ["Engagement, brand recall, viral potential", 2700, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["Background Seamless", 1700, { bold: true }],
            ["Selambu backdrop untuk produksi konten video & foto", 3200],
            ["", 1760, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Kualitas visual konten YouTube & sosial media", 2700, { color: "595959" }]
          ], LIGHT_GRAY),
          dataRow([
            ["Softbox Lighting", 1700, { bold: true }],
            ["1 unit lampu softbox untuk produksi konten indoor", 3200],
            ["", 1760, { align: AlignmentType.RIGHT, fill: LT_YELLOW }],
            ["Kualitas visual konten YouTube & sosial media", 2700, { color: "595959" }]
          ], WHITE),
        ]
      }),

      ...spacer(2),

      // KPI
      new Paragraph({
        spacing: { before: 0, after: 100 },
        children: [new TextRun({ text: "KPI & Target Impact", font: "Arial", size: pt(11), bold: true, color: "2C3E50" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 80 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({
          text: "Keberhasilan program Dreampreneur bulan April 2026 akan diukur berdasarkan indikator-indikator berikut:",
          font: "Arial", size: pt(10)
        })]
      }),

      new Table({
        width: { size: CW, type: WidthType.DXA },
        columnWidths: [200, 2200, 3400, 3560],
        rows: [
          headerRow([
            ["#", 200],
            ["KPI", 2200],
            ["INDIKATOR UKUR", 3400],
            ["PLATFORM / CHANNEL", 3560]
          ], "2C3E50"),
          dataRow([
            ["1", 200, { align: AlignmentType.CENTER, bold: true }],
            ["Social Media Exposure", 2200, { bold: true, color: BLUE }],
            ["Reach, impressions, engagement rate, pertumbuhan follower", 3400],
            ["Instagram, Facebook, TikTok", 3560, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["2", 200, { align: AlignmentType.CENTER, bold: true }],
            ["YouTube Content Output", 2200, { bold: true, color: DK_ORANGE }],
            ["Jumlah video tayang, views, watch time, subscriber baru", 3400],
            ["YouTube Channel Dreamlab", 3560, { color: "595959" }]
          ], LIGHT_GRAY),
          dataRow([
            ["3", 200, { align: AlignmentType.CENTER, bold: true }],
            ["Brand Awareness Dreamlab", 2200, { bold: true, color: DK_GREEN }],
            ["Brand recall, traffic website, mention & share organik", 3400],
            ["Semua platform digital", 3560, { color: "595959" }]
          ], WHITE),
          dataRow([
            ["4", 200, { align: AlignmentType.CENTER, bold: true }],
            ["Giveaway Engagement", 2200, { bold: true, color: PURPLE }],
            ["Jumlah partisipan, komentar, tag & repost konten giveaway", 3400],
            ["Instagram, TikTok", 3560, { color: "595959" }]
          ], LIGHT_GRAY),
        ]
      }),

      ...spacer(1),

      // penutup dreampreneur
      new Paragraph({
        spacing: { before: 80, after: 80 },
        alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({
          text: "Dengan dukungan anggaran yang memadai, program Dreampreneur diharapkan menjadi katalisator pertumbuhan brand Dreamlab "
              + "di kuartal kedua 2026 — menghasilkan konten bernilai tinggi, memperluas jangkauan audiens, "
              + "serta memperkuat posisi Dreamlab sebagai brand terpercaya di industri.",
          font: "Arial", size: pt(10), italics: true, color: "444444"
        })]
      }),

    ]
  }]
});

// ── SAVE ──────────────────────────────────────────────────────────────────────
const outPath = "/Users/revitayustianawati/Desktop/Lovely Work /Finance /Budget_Digital_Marketing_April_2026.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("Saved:", outPath);
}).catch(err => { console.error(err); process.exit(1); });
