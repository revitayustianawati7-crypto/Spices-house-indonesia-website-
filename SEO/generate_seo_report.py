#!/usr/bin/env python3
"""
SEO Performance Report Generator — Dreamlab.id
March vs February 2026
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import ListFlowable, ListItem

# Brand Colors
ORANGE = colors.HexColor('#F6911E')
BLUE = colors.HexColor('#4898D3')
DARK = colors.HexColor('#1A1A2E')
LIGHT_GRAY = colors.HexColor('#F5F5F5')
MID_GRAY = colors.HexColor('#E0E0E0')
TEXT_GRAY = colors.HexColor('#555555')
GREEN = colors.HexColor('#27AE60')
RED = colors.HexColor('#E74C3C')
YELLOW = colors.HexColor('#F39C12')
WHITE = colors.white

OUTPUT_PATH = "/Users/revitayustianawati/Desktop/Dreamlab - Work /SEO/SEO_Performance_Report_MarchVsFeb2026.pdf"

def build_styles():
    base = getSampleStyleSheet()

    styles = {}

    styles['cover_title'] = ParagraphStyle(
        'cover_title', fontSize=28, textColor=WHITE,
        fontName='Helvetica-Bold', alignment=TA_CENTER, leading=34
    )
    styles['cover_sub'] = ParagraphStyle(
        'cover_sub', fontSize=13, textColor=WHITE,
        fontName='Helvetica', alignment=TA_CENTER, leading=18
    )
    styles['cover_meta'] = ParagraphStyle(
        'cover_meta', fontSize=10, textColor=colors.HexColor('#FFD580'),
        fontName='Helvetica', alignment=TA_CENTER
    )
    styles['section_title'] = ParagraphStyle(
        'section_title', fontSize=16, textColor=ORANGE,
        fontName='Helvetica-Bold', spaceBefore=18, spaceAfter=6, leading=20
    )
    styles['sub_title'] = ParagraphStyle(
        'sub_title', fontSize=12, textColor=BLUE,
        fontName='Helvetica-Bold', spaceBefore=12, spaceAfter=4, leading=16
    )
    styles['body'] = ParagraphStyle(
        'body', fontSize=9.5, textColor=DARK,
        fontName='Helvetica', leading=14, spaceAfter=4
    )
    styles['body_gray'] = ParagraphStyle(
        'body_gray', fontSize=9, textColor=TEXT_GRAY,
        fontName='Helvetica', leading=13, spaceAfter=3
    )
    styles['label'] = ParagraphStyle(
        'label', fontSize=9, textColor=WHITE,
        fontName='Helvetica-Bold', alignment=TA_CENTER
    )
    styles['badge_green'] = ParagraphStyle(
        'badge_green', fontSize=8, textColor=GREEN,
        fontName='Helvetica-Bold'
    )
    styles['badge_red'] = ParagraphStyle(
        'badge_red', fontSize=8, textColor=RED,
        fontName='Helvetica-Bold'
    )
    styles['badge_yellow'] = ParagraphStyle(
        'badge_yellow', fontSize=8, textColor=YELLOW,
        fontName='Helvetica-Bold'
    )
    styles['note'] = ParagraphStyle(
        'note', fontSize=8.5, textColor=TEXT_GRAY,
        fontName='Helvetica-Oblique', leading=12,
        borderPad=6, backColor=LIGHT_GRAY
    )
    styles['h1_old'] = ParagraphStyle(
        'h1_old', fontSize=8.5, textColor=RED,
        fontName='Helvetica', leading=12
    )
    styles['h1_new'] = ParagraphStyle(
        'h1_new', fontSize=8.5, textColor=GREEN,
        fontName='Helvetica-Bold', leading=12
    )
    styles['kw_tag'] = ParagraphStyle(
        'kw_tag', fontSize=8, textColor=BLUE,
        fontName='Helvetica-Bold'
    )
    styles['footer'] = ParagraphStyle(
        'footer', fontSize=7.5, textColor=TEXT_GRAY,
        fontName='Helvetica', alignment=TA_CENTER
    )
    styles['toc_item'] = ParagraphStyle(
        'toc_item', fontSize=10, textColor=DARK,
        fontName='Helvetica', leading=16, leftIndent=10
    )
    return styles

def header_bar(text, styles, bg=ORANGE):
    data = [[Paragraph(text, styles['label'])]]
    t = Table(data, colWidths=[17*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('ROUNDEDCORNERS', [4,4,4,4]),
    ]))
    return t

def kpi_table(data_rows, styles):
    """data_rows: list of (label, feb_val, mar_val, change, status)"""
    header = [
        Paragraph('Metrik', styles['label']),
        Paragraph('Februari 2026', styles['label']),
        Paragraph('Maret 2026', styles['label']),
        Paragraph('Perubahan', styles['label']),
        Paragraph('Status', styles['label']),
    ]
    rows = [header]
    for label, feb, mar, chg, status in data_rows:
        color = GREEN if '+' in str(chg) else RED
        rows.append([
            Paragraph(label, styles['body']),
            Paragraph(str(feb), styles['body']),
            Paragraph(str(mar), styles['body']),
            Paragraph(str(chg), ParagraphStyle('chg', fontSize=9, textColor=color, fontName='Helvetica-Bold')),
            Paragraph(status, styles['body']),
        ])

    col_w = [5.5*cm, 3*cm, 3*cm, 2.5*cm, 3*cm]
    t = Table(rows, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('BACKGROUND', (0,1), (-1,-1), LIGHT_GRAY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.3, MID_GRAY),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    return t

def page_opt_table(rows_data, styles):
    header = [
        Paragraph('Halaman', styles['label']),
        Paragraph('H1 Saat Ini', styles['label']),
        Paragraph('H1 Rekomendasi', styles['label']),
        Paragraph('Keywords Target', styles['label']),
        Paragraph('Prioritas', styles['label']),
    ]
    rows = [header]
    for page, h1_old, h1_new, kws, priority in rows_data:
        if priority == 'KRITIS':
            p_color = RED
        elif priority == 'TINGGI':
            p_color = ORANGE
        else:
            p_color = GREEN

        rows.append([
            Paragraph(page, styles['body']),
            Paragraph(h1_old, styles['h1_old']),
            Paragraph(h1_new, styles['h1_new']),
            Paragraph(kws, styles['body_gray']),
            Paragraph(priority, ParagraphStyle('pri', fontSize=8, textColor=p_color, fontName='Helvetica-Bold', alignment=TA_CENTER)),
        ])

    col_w = [3.2*cm, 3.5*cm, 3.8*cm, 3.8*cm, 2.2*cm]
    t = Table(rows, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.3, MID_GRAY),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
    ]))
    return t

def h2_table(rows_data, styles):
    header = [
        Paragraph('Halaman', styles['label']),
        Paragraph('H2 Saat Ini', styles['label']),
        Paragraph('H2 Rekomendasi (Tambahan)', styles['label']),
    ]
    rows = [header]
    for page, h2_now, h2_rec in rows_data:
        rows.append([
            Paragraph(page, styles['body']),
            Paragraph(h2_now, styles['body_gray']),
            Paragraph(h2_rec, styles['h1_new']),
        ])
    col_w = [3.5*cm, 6.5*cm, 7*cm]
    t = Table(rows, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BLUE),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.3, MID_GRAY),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def blog_table(rows_data, styles):
    header = [
        Paragraph('Artikel', styles['label']),
        Paragraph('URL Slug', styles['label']),
        Paragraph('Bulan', styles['label']),
        Paragraph('Rekomendasi Optimasi', styles['label']),
    ]
    rows = [header]
    for title, slug, month, rec in rows_data:
        m_color = BLUE if month == 'Feb' else ORANGE
        rows.append([
            Paragraph(title, styles['body']),
            Paragraph(slug, styles['body_gray']),
            Paragraph(month, ParagraphStyle('mon', fontSize=8, textColor=m_color, fontName='Helvetica-Bold', alignment=TA_CENTER)),
            Paragraph(rec, styles['body_gray']),
        ])
    col_w = [4.5*cm, 5*cm, 1.5*cm, 6.5*cm]
    t = Table(rows, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.3, MID_GRAY),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def action_table(rows_data, styles):
    header = [
        Paragraph('#', styles['label']),
        Paragraph('Aksi', styles['label']),
        Paragraph('Halaman / Area', styles['label']),
        Paragraph('Dampak', styles['label']),
        Paragraph('Kesulitan', styles['label']),
        Paragraph('Timeline', styles['label']),
    ]
    rows = [header]
    for num, aksi, area, dampak, kesulitan, timeline in rows_data:
        if dampak == 'Tinggi':
            d_color = RED
        elif dampak == 'Sedang':
            d_color = ORANGE
        else:
            d_color = GREEN
        rows.append([
            Paragraph(str(num), styles['body']),
            Paragraph(aksi, styles['body']),
            Paragraph(area, styles['body_gray']),
            Paragraph(dampak, ParagraphStyle('d', fontSize=8, textColor=d_color, fontName='Helvetica-Bold')),
            Paragraph(kesulitan, styles['body_gray']),
            Paragraph(timeline, styles['body_gray']),
        ])
    col_w = [0.8*cm, 4.5*cm, 3.5*cm, 1.8*cm, 2*cm, 2.9*cm]
    t = Table(rows, colWidths=col_w)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.3, MID_GRAY),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=2*cm,
        rightMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm,
        title="SEO Performance Report - Dreamlab.id - Maret vs Februari 2026",
        author="Dreamlab Marketing Team"
    )

    styles = build_styles()
    story = []

    # ─── COVER PAGE ───────────────────────────────────────────────────────────
    cover_bg = Table(
        [[Paragraph('', styles['body'])]],
        colWidths=[17*cm], rowHeights=[25*cm]
    )
    cover_bg.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK),
    ]))
    story.append(cover_bg)

    # Overlay content (positioned manually with spacers above)
    story.append(Spacer(1, -25*cm))
    story.append(Spacer(1, 3*cm))
    story.append(Paragraph('SEO PERFORMANCE REPORT', styles['cover_title']))
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph('dreamlab.id', ParagraphStyle('cd', fontSize=20, textColor=ORANGE, fontName='Helvetica-Bold', alignment=TA_CENTER)))
    story.append(Spacer(1, 0.6*cm))
    story.append(HRFlowable(width=6*cm, thickness=2, color=ORANGE, spaceAfter=12, hAlign='CENTER'))
    story.append(Paragraph('Laporan Performa SEO', styles['cover_sub']))
    story.append(Paragraph('Maret 2026 vs Februari 2026', ParagraphStyle('cs2', fontSize=15, textColor=ORANGE, fontName='Helvetica-Bold', alignment=TA_CENTER, leading=20)))
    story.append(Spacer(1, 1.5*cm))
    story.append(Paragraph('Analisis Konten Blog | Optimasi Halaman | Rekomendasi H1, H2 & Keywords', styles['cover_sub']))
    story.append(Spacer(1, 2*cm))
    story.append(HRFlowable(width=10*cm, thickness=0.5, color=colors.HexColor('#444466'), spaceAfter=12, hAlign='CENTER'))
    story.append(Paragraph('Tanggal Laporan: 4 April 2026', styles['cover_meta']))
    story.append(Paragraph('Dibuat oleh: Dreamlab Marketing Team', styles['cover_meta']))
    story.append(Paragraph('Catatan: Laporan ini berdasarkan analisis data publik (sitemap, halaman).\nUntuk data traffic aktual, diperlukan akses Google Search Console & Google Analytics.', styles['cover_meta']))

    story.append(PageBreak())

    # ─── SECTION 1: EXECUTIVE SUMMARY ────────────────────────────────────────
    story.append(header_bar('EXECUTIVE SUMMARY', styles))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph(
        'Dreamlab.id menunjukkan aktivitas konten yang aktif pada Februari dan Maret 2026. '
        'Namun, efektivitas SEO masih dapat ditingkatkan secara signifikan melalui optimasi '
        'on-page (H1, H2, keywords), konsolidasi konten duplikat, dan perbaikan teknikal sitemap. '
        'Laporan ini memuat perbandingan konten, audit semua halaman utama, dan action plan terperinci.',
        styles['body']
    ))
    story.append(Spacer(1, 0.3*cm))

    summary_data = [
        ['Indikator', 'Nilai', 'Keterangan'],
        ['Total Blog Artikel (Feb)', '34 artikel', 'Dipublish terutama 22 & 27 Feb'],
        ['Total Blog Artikel (Mar)', '19 artikel', 'Dipublish 20–30 Mar'],
        ['Total Halaman Utama', '12 halaman', 'Services, category pages, dll'],
        ['Total Blog Aktif (All Time)', '151 artikel', 'Sejak Sep 2025'],
        ['SEO Plugin', 'Yoast SEO', 'Sudah terpasang & aktif'],
        ['Masalah Kritis Ditemukan', '5 isu', 'Lihat detail di Bab 3'],
        ['Halaman Perlu Optimasi H1', '3 halaman', '/services/, /parfum/, /decorative/'],
        ['Halaman Perlu Optimasi H2', '6 halaman', 'Semua category pages'],
    ]
    t = Table(summary_data, colWidths=[5.5*cm, 4*cm, 7.5*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.3, MID_GRAY),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.4*cm))

    story.append(Paragraph(
        'CATATAN PENTING: Laporan ini tidak mencantumkan data traffic aktual (sessions, impressions, '
        'klik organik) karena tidak ada akses ke Google Search Console atau Google Analytics. '
        'Untuk menambahkan data tersebut, berikan akses GSC dan data akan diintegrasikan ke laporan berikutnya.',
        styles['note']
    ))

    story.append(PageBreak())

    # ─── SECTION 2: PERBANDINGAN KONTEN FEB VS MAR ───────────────────────────
    story.append(header_bar('SECTION 1: PERBANDINGAN KONTEN BLOG — FEBRUARI vs MARET 2026', styles))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph('1.1 Volume Konten', styles['sub_title']))

    kpi_data = [
        ('Jumlah Artikel Dipublish', '34 artikel', '19 artikel', '-44%', 'Volume Turun'),
        ('Hari Aktif Publish', '2 hari (22 & 27 Feb)', '5 hari (20,25,26,27,30 Mar)', '+150%', 'Distribusi Lebih Baik'),
        ('Avg Artikel/Hari Aktif', '17 artikel/hari', '3-4 artikel/hari', 'Lebih Sehat', 'Lebih Natural'),
        ('Topik Baru (Estimasi)', '70% lokal/kota', '60% edukasi/produk', 'Lebih Variatif', 'Lebih Baik'),
        ('Artikel Lokal (Kota)', '15 artikel', '3 artikel', '-80%', 'Lebih Fokus'),
    ]
    story.append(kpi_table(kpi_data, styles))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph(
        'Catatan: Volume Februari lebih banyak karena mass publishing. Maret lebih sedikit tapi distribusinya '
        'lebih natural dan lebih baik di mata Google. Mass publishing dalam 1-2 hari bisa dianggap sinyal spam.',
        styles['note']
    ))
    story.append(Spacer(1, 0.4*cm))

    story.append(Paragraph('1.2 Artikel Unggulan per Bulan', styles['sub_title']))
    story.append(Paragraph(
        'Artikel-artikel berikut memiliki potensi SEO tinggi berdasarkan keyword di URL slug:',
        styles['body']
    ))
    story.append(Spacer(1, 0.2*cm))

    blog_rows = [
        ('Jasa Maklon Kosmetik BPOM Panduan Lengkap', '/jasa-maklon-kosmetik-bpom-panduan-lengkap/', 'Feb', 'Perpanjang ke 2000+ kata, tambahkan FAQ schema'),
        ('Maklon Kosmetik Jakarta Dreamlab 2026', '/maklon-kosmetik-jakarta-dreamlab-2026/', 'Feb', 'Konsolidasi dengan halaman Jakarta duplikat'),
        ('Pabrik Maklon Kosmetik Surabaya Terlengkap', '/pabrik-maklon-kosmetik-surabaya-terlengkap/', 'Feb', 'Konsolidasi dengan halaman Surabaya duplikat'),
        ('Jasa Maklon Parfum MOQ Rendah', '/jasa-maklon-parfum-moq-rendah/', 'Feb', 'Keyword high intent, optimalkan CTA & konten'),
        ('Biaya Maklon Parfum MOQ Kecil', '/biaya-maklon-parfum-moq-kecil/', 'Feb', 'Keyword commercial, tambahkan tabel harga perkiraan'),
        ('Perusahaan Maklon Kosmetik', '/perusahaan-maklon-kosmetik/', 'Mar', 'Keyword strategis, jadikan pillar page'),
        ('Jasa Maklon Lipstik BPOM Terpercaya', '/jasa-maklon-lipstik-bpom-terpercaya/', 'Mar', 'Tambahkan H2 tentang proses & bahan aktif'),
        ('Pabrik Shampoo Merek Sendiri', '/pabrik-shampoo-merek-sendiri/', 'Mar', 'Link ke halaman /hair-care/ sebagai internal link'),
        ('Jasa Maklon Sabun Mandi Batang', '/jasa-maklon-sabun-mandi-batang/', 'Mar', 'Tambahkan perbandingan MOQ & proses'),
        ('Cara Bangun Brand Deodoran Sendiri', '/cara-bangun-brand-deodoran-sendiri/', 'Mar', 'Konten edukasi bagus, tambahkan CTA ke WA'),
    ]
    story.append(blog_table(blog_rows, styles))
    story.append(Spacer(1, 0.4*cm))

    story.append(Paragraph('1.3 Masalah Konten yang Ditemukan', styles['sub_title']))

    issues = [
        ('Duplikat Halaman Kota', 'KRITIS',
         'Surabaya: 2 URL (/pabrik-parfum-surabaya/ & /pabrik-parfum-surabaya-biaya-2026/). '
         'Jakarta: 2 URL (/maklon-jakarta-terbaik/ & /maklon-kosmetik-jakarta-dreamlab-2026/). '
         'Makassar: 2 URL dengan 1 typo. Google akan kesulitan memilih halaman mana yang harus dirank.'),
        ('Mass Publishing dalam 1 Hari', 'TINGGI',
         'Februari 22 dan 27: masing-masing 10+ artikel publish dalam 1 hari. '
         'Google bisa mendeteksi pola ini sebagai konten AI/spam, berpotensi menurunkan kepercayaan domain.'),
        ('Konten Tipis (Thin Content)', 'TINGGI',
         'Beberapa artikel hanya ~600 kata. Untuk keyword kompetitif seperti "maklon kosmetik pemula" '
         'atau "jasa maklon Jakarta", kompetitor menghasilkan 1.500-3.000 kata.'),
        ('Typo URL', 'SEDANG',
         '/pabrik-parfum-makasar/ menggunakan ejaan salah. Seharusnya "makassar". '
         'URL tidak bisa diubah tanpa redirect 301.'),
    ]

    for title, level, desc in issues:
        if level == 'KRITIS':
            bg = colors.HexColor('#FFF0F0')
            border = RED
        elif level == 'TINGGI':
            bg = colors.HexColor('#FFF8F0')
            border = ORANGE
        else:
            bg = colors.HexColor('#FFFFF0')
            border = YELLOW

        issue_data = [[
            Paragraph(f'[{level}] {title}', ParagraphStyle('it', fontSize=9.5, textColor=border, fontName='Helvetica-Bold')),
        ], [
            Paragraph(desc, styles['body']),
        ]]
        it = Table(issue_data, colWidths=[17*cm])
        it.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('BOX', (0,0), (-1,-1), 1.5, border),
        ]))
        story.append(it)
        story.append(Spacer(1, 0.2*cm))

    story.append(PageBreak())

    # ─── SECTION 3: PAGE OPTIMIZATION — H1 ───────────────────────────────────
    story.append(header_bar('SECTION 2: OPTIMASI HALAMAN UTAMA — H1 & KEYWORDS', styles, bg=BLUE))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph(
        'Berikut audit lengkap semua halaman utama dreamlab.id beserta rekomendasi H1, meta title, '
        'dan keyword target untuk meningkatkan ranking Google.',
        styles['body']
    ))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph('2.1 Audit & Rekomendasi H1 Semua Halaman', styles['sub_title']))

    page_opt_data = [
        (
            '/services/',
            '"Create Your Signature Formula with Dreamlab" (ENGLISH)',
            '"Jasa Maklon Kosmetik BPOM & Halal Terlengkap di Indonesia"',
            'jasa maklon kosmetik, maklon BPOM, maklon halal Indonesia',
            'KRITIS'
        ),
        (
            '/parfum/',
            '"JASA MAKLON PARFUM BPOM & HALAL" (ALL CAPS)',
            '"Jasa Maklon Parfum & Body Mist BPOM Halal — Formula Eksklusif Anda"',
            'jasa maklon parfum, maklon parfum BPOM, maklon body mist',
            'TINGGI'
        ),
        (
            '/decorative/',
            '"Maklon Dekoratif Lengkap BPOM"',
            '"Jasa Maklon Kosmetik Dekoratif BPOM — Lipstik, Foundation, Eyeshadow"',
            'maklon kosmetik dekoratif, maklon lipstik BPOM, maklon foundation',
            'TINGGI'
        ),
        (
            '/skincare-face-care/',
            '"Jasa maklon skincare solusi memudahkanmu mewujudkan brandmu..." (terlalu panjang)',
            '"Jasa Maklon Skincare & Face Care BPOM — Formula Premium Terpercaya"',
            'jasa maklon skincare, maklon face care BPOM, maklon serum',
            'SEDANG'
        ),
        (
            '/body-care/',
            '"Jasa maklon bodycare terlengkap untuk mewujudkan produk perawatan tubuh impianmu"',
            '"Jasa Maklon Body Care BPOM Terlengkap — Lotion, Scrub, Body Wash"',
            'jasa maklon body care, maklon lotion BPOM, maklon body wash',
            'SEDANG'
        ),
        (
            '/hair-care/',
            '"Maklon Hair Care Premium BPOM" (terlalu pendek)',
            '"Jasa Maklon Hair Care & Shampoo BPOM — Solusi Bisnis Perawatan Rambut"',
            'jasa maklon haircare, maklon shampoo BPOM, maklon hair treatment',
            'SEDANG'
        ),
        (
            '/baby-care/',
            '"Maklon Baby Care BPOM & Halal" (sudah cukup baik)',
            '"Jasa Maklon Baby Care Aman BPOM & Halal — Shampoo, Lotion, Body Wash Bayi"',
            'jasa maklon baby care, maklon produk bayi BPOM, maklon shampoo bayi',
            'RENDAH'
        ),
        (
            '/pkrt/',
            '"Jasa Maklon PKRT BPOM" (terlalu pendek)',
            '"Jasa Maklon PKRT BPOM Terpercaya — Hand Sanitizer, Sabun, Disinfektan"',
            'jasa maklon PKRT, maklon hand sanitizer BPOM, maklon sabun cuci',
            'RENDAH'
        ),
    ]
    story.append(page_opt_table(page_opt_data, styles))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph(
        'Keterangan: Merah = H1 bermasalah (harus segera diubah). Hijau = H1 rekomendasi. '
        'KRITIS = perbaiki hari ini. TINGGI = perbaiki minggu ini. SEDANG/RENDAH = perbaiki bulan ini.',
        styles['note']
    ))

    story.append(PageBreak())

    # ─── SECTION 4: H2 RECOMMENDATIONS ──────────────────────────────────────
    story.append(header_bar('SECTION 3: REKOMENDASI H2 UNTUK SEMUA HALAMAN', styles, bg=BLUE))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph(
        'H2 berfungsi sebagai sub-topik yang membantu Google memahami kedalaman konten. '
        'Setiap H2 sebaiknya mengandung keyword LSI (keyword turunan) dari topik utama halaman.',
        styles['body']
    ))
    story.append(Spacer(1, 0.3*cm))

    h2_data = [
        (
            '/services/',
            'Belum terdeteksi H2 yang relevan (H1 dalam bahasa Inggris)',
            '"Layanan Maklon Lengkap dari Formulasi hingga Legalitas"\n"Proses Maklon Dreamlab: Dari Konsep ke Produk Jadi"\n"Kenapa Pilih Dreamlab sebagai Partner Maklon?"\n"FAQ Seputar Jasa Maklon Kosmetik"'
        ),
        (
            '/skincare-face-care/',
            '"Maklon Skincare BPOM & Halal"\n"Maklon Acne Cream"\n"Maklon Moisturizing Cream"',
            '"Maklon Serum Wajah Formula Premium"\n"Cara Memulai Bisnis Skincare dengan MOQ Kecil"\n"Proses Maklon Skincare di Dreamlab"\n"FAQ Maklon Skincare untuk Pemula"'
        ),
        (
            '/body-care/',
            '"Maklon Bodycare Premium BPOM"\n"Maklon Massage Oil"\n"Body Butter" dll.',
            '"Berapa MOQ Maklon Body Care di Dreamlab?"\n"Proses Maklon Body Care dari Formulasi ke Produksi"\n"Keunggulan Body Care Formula Dreamlab"\n"Sertifikasi BPOM & Halal Produk Body Care"'
        ),
        (
            '/hair-care/',
            '"Maklon Hair Gel"\n"Maklon Scalp Care"\n"Maklon Shampoo" dll.',
            '"Tren Produk Hair Care 2026 untuk Bisnis Anda"\n"Maklon Shampoo Custom Formula BPOM"\n"Kenapa Hair Care Lokal Makin Diminati Pasar?"\n"Konsultasi Gratis Maklon Hair Care"'
        ),
        (
            '/parfum/',
            '"Maklon Parfum Body Mist"\n"Maklon Eau de Cologne"\n"Maklon Eau de Parfum"',
            '"Apa Itu Maklon Parfum dan Bagaimana Prosesnya?"\n"Peluang Bisnis Parfum Lokal di Indonesia 2026"\n"Bahan Baku Parfum Berkualitas BPOM di Dreamlab"\n"Harga & MOQ Maklon Parfum"'
        ),
        (
            '/baby-care/',
            '"Maklon Shampoo Baby"\n"Maklon Baby Body Wash" dll.',
            '"Standar Keamanan Produk Bayi: BPOM & Halal"\n"Formula Baby Care Hypoallergenic Dreamlab"\n"Peluang Bisnis Produk Bayi di Indonesia"\n"Konsultasi MOQ Fleksibel Produk Bayi"'
        ),
        (
            '/decorative/',
            '"Maklon Liquid Highlighter"\n"Mascara"\n"Foundation Serum" dll.',
            '"Tren Makeup 2026: Peluang Bisnis Kosmetik Dekoratif"\n"Proses Maklon Lipstik & Makeup BPOM"\n"Bahan Baku Kosmetik Dekoratif Berkualitas"\n"Portfolio Produk Dekoratif Dreamlab"'
        ),
        (
            '/pkrt/',
            '"Maklon Hand Sanitizer"\n"Maklon Hand Wash"\n"Maklon Bar Soap"',
            '"Regulasi PKRT di Indonesia: Panduan untuk Brand Baru"\n"Peluang Bisnis Produk Pembersih Rumah Tangga"\n"Proses Maklon PKRT BPOM di Dreamlab"\n"MOQ & Harga Maklon PKRT"'
        ),
    ]
    story.append(h2_table(h2_data, styles))

    story.append(PageBreak())

    # ─── SECTION 5: KEYWORD TARGET ───────────────────────────────────────────
    story.append(header_bar('SECTION 4: KEYWORD TARGET PER HALAMAN', styles))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph(
        'Keyword di bawah adalah target ranking organik untuk setiap halaman utama. '
        'Keyword primer harus ada di: Title Tag, H1, paragraf pertama, dan URL. '
        'Keyword sekunder sebaiknya ada di H2 dan konten badan halaman.',
        styles['body']
    ))
    story.append(Spacer(1, 0.3*cm))

    kw_data = [
        ['Halaman', 'Keyword Primer', 'Keyword Sekunder', 'Keyword LSI'],
        ['/services/', 'jasa maklon kosmetik', 'maklon kosmetik BPOM\nmaklon halal Indonesia', 'one stop maklon\npabrik kosmetik terpercaya\nmitra maklon kosmetik'],
        ['/skincare-face-care/', 'jasa maklon skincare', 'maklon face care BPOM\nmaklon serum wajah', 'maklon facial wash\nmaklon moisturizer\nbrand skincare sendiri'],
        ['/body-care/', 'jasa maklon body care', 'maklon lotion BPOM\nmaklon body wash', 'maklon body scrub\nmaklon sabun mandi\nproduk perawatan tubuh'],
        ['/hair-care/', 'jasa maklon haircare', 'maklon shampoo BPOM\nmaklon hair treatment', 'maklon kondisioner\nmaklon hair tonic\nbrand shampoo sendiri'],
        ['/parfum/', 'jasa maklon parfum', 'maklon parfum BPOM\nmaklon body mist halal', 'maklon eau de parfum\nmaklon parfum arab\nbisnis parfum lokal'],
        ['/baby-care/', 'jasa maklon baby care', 'maklon produk bayi BPOM\nmaklon shampoo bayi', 'maklon baby wash\nmaklon baby lotion\nproduk bayi halal'],
        ['/decorative/', 'maklon kosmetik dekoratif', 'maklon lipstik BPOM\nmaklon foundation', 'maklon lip cream\nmaklon cushion\nmakeup brand sendiri'],
        ['/pkrt/', 'jasa maklon PKRT', 'maklon hand sanitizer\nmaklon sabun cuci BPOM', 'maklon disinfektan\nmaklon pembersih lantai\nproduk kebersihan BPOM'],
    ]
    kw_col_w = [3*cm, 3.5*cm, 4.5*cm, 6*cm]
    kw_table = Table(kw_data, colWidths=kw_col_w)
    kw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.3, MID_GRAY),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(kw_table)

    story.append(PageBreak())

    # ─── SECTION 6: META TITLE RECOMMENDATIONS ───────────────────────────────
    story.append(header_bar('SECTION 5: REKOMENDASI META TITLE PER HALAMAN', styles, bg=BLUE))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph(
        'Meta Title yang ideal: 50–60 karakter, keyword primer di awal, unik per halaman, '
        'dan mengandung value proposition singkat.',
        styles['body']
    ))
    story.append(Spacer(1, 0.3*cm))

    meta_data = [
        ['Halaman', 'Meta Title Saat Ini', 'Meta Title Rekomendasi', 'Status'],
        [
            '/services/',
            'Dreamlab Maklon Skincare BPOM Untuk Brand Suksesmu',
            'Jasa Maklon Kosmetik BPOM & Halal Terlengkap — Dreamlab',
            'PERLU UPDATE'
        ],
        [
            '/skincare-face-care/',
            'Dreamlab Jasa Maklon Skincare & Face Care Terpercaya',
            'Jasa Maklon Skincare BPOM Terpercaya | Formula Premium — Dreamlab',
            'OK (minor tweak)'
        ],
        [
            '/body-care/',
            'Dreamlab Maklon Body Care BPOM',
            'Jasa Maklon Body Care BPOM Terlengkap — Lotion, Scrub, Sabun',
            'PERLU UPDATE'
        ],
        [
            '/hair-care/',
            'Dreamlab Maklon Haircare Perawatan Rambut Terlengkap',
            'Jasa Maklon Hair Care & Shampoo BPOM Terlengkap — Dreamlab',
            'OK (minor tweak)'
        ],
        [
            '/parfum/',
            'Dreamlab Jasa Maklon Parfum & Body Mist Halal',
            'Jasa Maklon Parfum BPOM & Halal — Body Mist, EDP, Cologne',
            'OK (minor tweak)'
        ],
        [
            '/baby-care/',
            'Dreamlab Maklon Baby Care Terlengkap MOQ Fleksibel',
            'Jasa Maklon Baby Care BPOM & Halal | MOQ Fleksibel — Dreamlab',
            'OK (minor tweak)'
        ],
        [
            '/decorative/',
            'Maklon Kosmetik Dekoratif Terlengkap BPOM',
            'Jasa Maklon Kosmetik Dekoratif BPOM — Lipstik, Foundation, Blush',
            'PERLU UPDATE'
        ],
        [
            '/pkrt/',
            'Dreamlab Jasa Maklon PKRT Terbaik',
            'Jasa Maklon PKRT BPOM Terpercaya — Hand Sanitizer & Sabun',
            'PERLU UPDATE'
        ],
    ]
    meta_col_w = [2.8*cm, 5*cm, 6*cm, 3.2*cm]
    meta_table = Table(meta_data, colWidths=meta_col_w)
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0,0), (-1,-1), 0.3, MID_GRAY),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TEXTCOLOR', (3,1), (3,1), RED),
        ('TEXTCOLOR', (3,3), (3,3), RED),
        ('TEXTCOLOR', (3,6), (3,6), RED),
        ('TEXTCOLOR', (3,7), (3,7), RED),
        ('FONTNAME', (3,1), (3,-1), 'Helvetica-Bold'),
    ]))
    story.append(meta_table)

    story.append(PageBreak())

    # ─── SECTION 7: NEXT STEPS / ACTION PLAN ─────────────────────────────────
    story.append(header_bar('SECTION 6: ACTION PLAN — APA YANG HARUS DILAKUKAN SELANJUTNYA', styles))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph('6.1 Prioritas Segera (Minggu Ini)', styles['sub_title']))

    actions_kritis = [
        (1, 'Ganti H1 halaman /services/ ke Bahasa Indonesia + keyword', '/services/ di WordPress', 'Tinggi', 'Rendah (5 menit)', 'Minggu ini'),
        (2, 'Nonaktifkan e-floating-buttons & cms_block di sitemap Yoast', 'Yoast SEO > Search Appearance', 'Tinggi', 'Rendah (10 menit)', 'Minggu ini'),
        (3, 'Redirect 301 halaman kota duplikat ke 1 URL utama', 'Yoast Redirect / Plugin Redirect', 'Tinggi', 'Sedang (1 jam)', 'Minggu ini'),
        (4, 'Perbaiki typo /pabrik-parfum-makasar/ → redirect ke URL benar', 'Yoast Redirect', 'Sedang', 'Rendah (10 menit)', 'Minggu ini'),
        (5, 'Update H1 /parfum/ — hapus ALL CAPS', '/parfum/ di WordPress', 'Sedang', 'Rendah (5 menit)', 'Minggu ini'),
    ]
    story.append(action_table(actions_kritis, styles))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph('6.2 Prioritas Bulan Ini (April 2026)', styles['sub_title']))

    actions_april = [
        (6, 'Update Meta Title 4 halaman yang perlu diperbarui', 'Services, Body Care, Decorative, PKRT', 'Tinggi', 'Rendah', 'April 2026'),
        (7, 'Tambahkan H2 baru ke semua 8 halaman kategori', 'Semua category pages', 'Tinggi', 'Sedang', 'April 2026'),
        (8, 'Perpanjang 10 artikel blog prioritas ke 1.500+ kata', 'Blog posts terpilih', 'Tinggi', 'Tinggi', 'April 2026'),
        (9, 'Tambahkan FAQ schema ke halaman /services/', 'WordPress + Yoast', 'Sedang', 'Sedang', 'April 2026'),
        (10, 'Audit keyword cannibalization — mapping 1 keyword = 1 halaman', 'Semua 151 artikel', 'Sedang', 'Tinggi', 'April 2026'),
        (11, 'Daftarkan Google Business Profile Dreamlab', 'Google Maps/Business', 'Tinggi', 'Rendah', 'April 2026'),
    ]
    story.append(action_table(actions_april, styles))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph('6.3 Strategi Jangka Panjang (Mei–Juni 2026)', styles['sub_title']))

    actions_long = [
        (12, 'Bangun topical cluster untuk 5 topik utama', 'Blog + halaman kategori', 'Tinggi', 'Tinggi', 'Mei–Jun 2026'),
        (13, 'Optimasi Core Web Vitals (PageSpeed)', 'WordPress + Hosting', 'Sedang', 'Tinggi', 'Mei 2026'),
        (14, 'Mulai kampanye link building ke media kosmetik', 'Outreach eksternal', 'Tinggi', 'Tinggi', 'Mei–Jun 2026'),
        (15, 'Buat halaman /tentang-kami/ dengan kredensial BPOM/Halal', 'WordPress', 'Sedang', 'Sedang', 'Mei 2026'),
        (16, 'Integrasikan Google Search Console — monitor ranking & klik', 'GSC Dashboard', 'Tinggi', 'Rendah', 'Segera'),
    ]
    story.append(action_table(actions_long, styles))

    story.append(PageBreak())

    # ─── SECTION 8: TOPICAL CLUSTER ──────────────────────────────────────────
    story.append(header_bar('SECTION 7: REKOMENDASI TOPICAL CLUSTER KONTEN', styles, bg=BLUE))
    story.append(Spacer(1, 0.3*cm))

    story.append(Paragraph(
        'Topical cluster adalah strategi membangun otoritas topik dengan 1 "pillar page" (halaman utama) '
        'yang didukung beberapa "cluster articles" yang saling interlink. Google menilai situs yang memiliki '
        'cluster lengkap sebagai lebih otoritatif.',
        styles['body']
    ))
    story.append(Spacer(1, 0.3*cm))

    clusters = [
        ('Cluster 1: Maklon Skincare', ORANGE,
         'Pillar: /skincare-face-care/ (update jadi 2.000+ kata)',
         ['Maklon serum wajah custom', 'Biaya maklon skincare 2026', 'Maklon skincare MOQ 100 pcs',
          'Perbedaan maklon vs private label', 'Cara daftar BPOM untuk skincare']),
        ('Cluster 2: Maklon Parfum', BLUE,
         'Pillar: /parfum/ (update jadi 2.000+ kata)',
         ['Biaya maklon parfum per botol', 'Maklon parfum arab Indonesia', 'Maklon body mist viral TikTok',
          'Perbedaan EDP EDT EDP untuk bisnis', 'MOQ maklon parfum terkecil']),
        ('Cluster 3: Bisnis Kosmetik Pemula', ORANGE,
         'Pillar: Buat halaman baru /panduan-bisnis-kosmetik/ atau upgrade artikel existing',
         ['Modal bisnis kosmetik dari nol', 'Cara daftar BPOM produk kosmetik',
          'Maklon vs produksi sendiri', 'Template bisnis plan kosmetik', 'KOL strategy untuk brand baru']),
        ('Cluster 4: Maklon per Kota (Local SEO)', GREEN,
         'Pillar: /services/ + halaman kota individual (1 halaman = 1 kota, konten unik)',
         ['Maklon kosmetik Surabaya', 'Maklon kosmetik Jakarta', 'Maklon kosmetik Bandung',
          'Maklon kosmetik Bali', 'Maklon parfum Makassar']),
    ]

    for cluster_name, c_color, pillar, articles in clusters:
        cluster_data = [
            [Paragraph(cluster_name, ParagraphStyle('cn', fontSize=11, textColor=WHITE, fontName='Helvetica-Bold'))],
            [Paragraph(f'Pillar Page: {pillar}', ParagraphStyle('cp', fontSize=9, textColor=DARK, fontName='Helvetica-Bold', leading=13))],
            [Paragraph('Cluster Articles: ' + ' | '.join(articles), styles['body_gray'])],
        ]
        ct = Table(cluster_data, colWidths=[17*cm])
        ct.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), c_color),
            ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F0F8FF') if c_color == BLUE else colors.HexColor('#FFF5EE')),
            ('BACKGROUND', (0,2), (-1,2), LIGHT_GRAY),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
            ('TOPPADDING', (0,0), (-1,-1), 7),
            ('BOTTOMPADDING', (0,0), (-1,-1), 7),
            ('BOX', (0,0), (-1,-1), 1, c_color),
        ]))
        story.append(ct)
        story.append(Spacer(1, 0.3*cm))

    story.append(PageBreak())

    # ─── SECTION 9: PENUTUP ───────────────────────────────────────────────────
    story.append(header_bar('PENUTUP & LANGKAH BERIKUTNYA', styles))
    story.append(Spacer(1, 0.4*cm))

    story.append(Paragraph('Ringkasan Temuan Utama', styles['sub_title']))

    final_points = [
        ('Konten Blog', 'Maret lebih sedikit tapi lebih terdistribusi baik (19 artikel). Februari banyak (34 artikel) tapi terlalu terkonsentrasi dalam 1-2 hari. Kualitas harus ditingkatkan — rata-rata panjang artikel perlu dinaikkan ke 1.500+ kata.'),
        ('On-Page SEO', 'H1 halaman /services/ harus segera diperbaiki (bahasa Inggris). Halaman /parfum/ menggunakan ALL CAPS. 4 Meta Title perlu diperbarui. Semua halaman kategori perlu H2 tambahan yang lebih kaya keyword.'),
        ('Technical SEO', 'Sitemap kotor (floating buttons, CMS blocks harus dihapus). Duplikat halaman kota harus dikonsolidasi dengan redirect 301. Typo URL harus diperbaiki.'),
        ('Keyword Strategy', 'Dreamlab sudah menarget keyword yang tepat. Perlu konsolidasi agar tidak ada 2 halaman bersaing keyword yang sama. Topical cluster akan meningkatkan otoritas domain.'),
        ('Data yang Dibutuhkan', 'Untuk laporan bulan depan yang lebih akurat, diperlukan akses Google Search Console (data ranking, klik, impressions) dan Google Analytics (traffic, bounce rate, konversi).'),
    ]

    for title, desc in final_points:
        row_data = [[
            Paragraph(title, ParagraphStyle('ft', fontSize=9.5, textColor=BLUE, fontName='Helvetica-Bold')),
            Paragraph(desc, styles['body']),
        ]]
        ft = Table(row_data, colWidths=[3.5*cm, 13.5*cm])
        ft.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), LIGHT_GRAY),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 7),
            ('BOTTOMPADDING', (0,0), (-1,-1), 7),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LINEABOVE', (0,0), (-1,0), 0.5, MID_GRAY),
        ]))
        story.append(ft)
        story.append(Spacer(1, 0.15*cm))

    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width='100%', thickness=1, color=ORANGE, spaceAfter=12))
    story.append(Paragraph(
        'Laporan SEO Performance — dreamlab.id | Maret vs Februari 2026\n'
        'Dibuat: 4 April 2026 | Dreamlab Marketing Team | dreamlab.id',
        styles['footer']
    ))

    # Build
    doc.build(story)
    print(f"PDF berhasil dibuat: {OUTPUT_PATH}")

if __name__ == '__main__':
    build_pdf()
