import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.pdfgen import canvas
from docx import Document
from docx.shared import Inches, Pt, RGBColor

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        # Top Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 842 - 24, "AETHERIA: THE HUNTER'S PROTOCOL")
            self.setFont("Helvetica", 8)
            self.drawRightString(595 - 36, 842 - 24, "Life RPG Master Plan — Web Hackathon 2026")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 842 - 28, 595 - 36, 842 - 28)
        # Bottom Footer
        self.setFont("Helvetica", 8)
        self.drawString(36, 20, "Confidential — Prepared for Hackathon Pair Programming & Team Review")
        self.drawRightString(595 - 36, 20, f"Page {self._pageNumber} of {page_count}")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(36, 28, 595 - 36, 28)
        self.restoreState()


def build_pdf(filename="D:/Web Hackathon/idea.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=34,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    primary_color = colors.HexColor("#0F172A")
    accent_indigo = colors.HexColor("#4F46E5")
    text_dark = colors.HexColor("#1E293B")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=21,
        textColor=colors.white
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#CBD5E1")
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#38BDF8")
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=14,
        textColor=primary_color,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=text_dark,
        spaceAfter=3
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=text_dark,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=2
    )

    callout_danger_style = ParagraphStyle(
        'Danger',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#991B1B")
    )

    table_header_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=text_dark
    )

    code_style = ParagraphStyle(
        'Code',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=8.8,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # ==================== PAGE 1: VISION, THEME & TECH STACK ====================
    header_data = [
        [Paragraph("AETHERIA: THE HUNTER'S PROTOCOL", title_style)],
        [Paragraph("Full-Stack 'Life RPG' Hackathon Blueprint, Game Architecture & Winning Strategy", subtitle_style)],
        [Paragraph("TARGET: Web Hackathon 2026 &nbsp;|&nbsp; STACK: Next.js 15, PostgreSQL, Framer Motion &nbsp;|&nbsp; PERSISTENCE: 100% Cloud DB", meta_style)]
    ]
    header_table = Table(header_data, colWidths=[523])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#0B0F19")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6))

    danger_text = (
        "<b>CRITICAL ZERO-TOLERANCE WARNING:</b> Submissions relying solely on <i>localStorage</i> for data persistence, "
        "having broken/inaccessible live links, crashing during evaluation, having fewer than 3 chronological git commits, "
        "or omitting the 90–180s walkthrough video (&lt;100MB) receive an <b>AUTOMATIC ZERO</b>. Our architecture strictly eliminates all 6 disqualification vectors."
    )
    danger_table = Table([[Paragraph(danger_text, callout_danger_style)]], colWidths=[523])
    danger_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FEF2F2")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#EF4444")),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(danger_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("1. Core Problem & Creative Direction", h1_style))
    story.append(Paragraph(
        "Standard productivity tools and habit trackers fail because real habits suffer from <b>delayed gratification</b> "
        "(hitting the gym, reading, or coding takes months to see results). Video games hook players through "
        "<b>instant feedback loops, clear progression systems, and tangible rewards</b>. Our mission is to build a full-stack Life RPG application bridging this gap.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Thematic Concept: 'Solo Leveling / Dark Fantasy Hunter Guild'</b> — Judges explicitly warned that generic SaaS or unstyled CRUD apps will receive low marks. We implement:",
        body_style
    ))

    theme_bullets = [
        "<b>Cohesive RPG Vocabulary:</b> Tasks &rarr; <i>Quests & Bounties (Rank E to S)</i>; Points &rarr; <i>Gold & Mana Crystals</i>; Habits &rarr; <i>Daily Rites & Streaks</i>; Store &rarr; <i>Guild Black Market</i>.",
        "<b>Alive & Tactile Feedback:</b> Built-in retro audio SFX (blade swing on complete, coin chime, fanfare on level-up with mute toggle). Floating +XP/+Gold spring physics flying to top navigation.",
        "<b>Celebratory Milestone Modals:</b> Screen dimming, spinning animated hunter badge, and particle confetti burst via <code>canvas-confetti</code>.",
        "<b>Zero-Lag Native Feel:</b> Optimistic UI updates (checkmarks complete in 0ms; backend syncs asynchronously) and skeleton screens."
    ]
    for b in theme_bullets:
        story.append(Paragraph(f"&bull; {b}", bullet_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("2. Technical Architecture & Tech Stack", h1_style))
    tech_data = [
        [Paragraph("Layer", table_header_style), Paragraph("Technology Choice", table_header_style), Paragraph("Evaluation Advantage / Value", table_header_style)],
        [Paragraph("<b>Framework</b>", table_cell_style), Paragraph("Next.js 15 (App Router, React 19, TypeScript)", table_cell_style), Paragraph("Unified frontend & backend API routes, fast SSR, zero CORS issues, instant Vercel deploy.", table_cell_style)],
        [Paragraph("<b>UI & Styling</b>", table_cell_style), Paragraph("Tailwind CSS + shadcn/ui + Lucide Icons", table_cell_style), Paragraph("Dark mode by default, accessible Radix primitives with full keyboard navigation (Tab/Enter).", table_cell_style)],
        [Paragraph("<b>Animations</b>", table_cell_style), Paragraph("Framer Motion + Canvas-Confetti", table_cell_style), Paragraph("Spring micro-interactions, celebratory level-up popups, floating XP feedback.", table_cell_style)],
        [Paragraph("<b>Database & ORM</b>", table_cell_style), Paragraph("PostgreSQL (Supabase / Neon Cloud) + Prisma", table_cell_style), Paragraph("<b>100% Real DB Persistence</b> across hard refreshes and cross-device sync. Relational user isolation.", table_cell_style)],
        [Paragraph("<b>Audio Engine</b>", table_cell_style), Paragraph("Web Audio API / Howler.js", table_cell_style), Paragraph("Zero-latency retro game audio effects with header mute toggle switch.", table_cell_style)],
        [Paragraph("<b>Deployment</b>", table_cell_style), Paragraph("Vercel (App) + Supabase (Database)", table_cell_style), Paragraph("Public HTTPS live URL required for hackathon submission with 99.9% uptime.", table_cell_style)],
    ]
    tech_table = Table(tech_data, colWidths=[70, 200, 253])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(tech_table)

    story.append(PageBreak())

    # ==================== PAGE 2: PROGRESSION, KILLER FEATURES & SCHEMA ====================
    story.append(Paragraph("3. RPG Progression Engine & Game Mathematics", h1_style))
    story.append(Paragraph(
        "<b>Non-Linear Leveling Formula:</b> Each subsequent level requires progressively more XP: "
        "<code>XP_Req(Level) = Math.floor(100 &times; Level^1.5)</code>",
        body_style
    ))

    prog_data = [
        [Paragraph("Level Jump", table_header_style), Paragraph("XP Needed", table_header_style), Paragraph("Cumulative XP", table_header_style), Paragraph("Psychological Motivation", table_header_style)],
        [Paragraph("Level 1 &rarr; 2", table_cell_style), Paragraph("100 XP", table_cell_style), Paragraph("100 XP", table_cell_style), Paragraph("Instant early gratification within first 2 completed tasks", table_cell_style)],
        [Paragraph("Level 2 &rarr; 3", table_cell_style), Paragraph("283 XP", table_cell_style), Paragraph("383 XP", table_cell_style), Paragraph("Requires completing a moderate quest chain", table_cell_style)],
        [Paragraph("Level 5 &rarr; 6", table_cell_style), Paragraph("1,118 XP", table_cell_style), Paragraph("3,089 XP", table_cell_style), Paragraph("Established daily routine threshold", table_cell_style)],
        [Paragraph("Level 9 &rarr; 10", table_cell_style), Paragraph("2,700 XP", table_cell_style), Paragraph("11,400 XP", table_cell_style), Paragraph("Prestige Hunter status / elite milestone", table_cell_style)],
    ]
    prog_table = Table(prog_data, colWidths=[80, 80, 95, 268])
    prog_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(prog_table)
    story.append(Spacer(1, 5))

    story.append(Paragraph("<b>The 5 Core Hunter Attributes:</b>", body_style))
    attr_bullets = [
        "<b>Strength (STR):</b> Gym, workouts, weightlifting, physical sports.",
        "<b>Intellect (INT):</b> Coding, technical studying, reading textbooks, problem solving.",
        "<b>Vitality (VIT):</b> Sleep consistency, hydration (8 glasses), meal prepping, meditation.",
        "<b>Agility (AGI):</b> Speed chores, inbox zero, swift errands, tidying workspace.",
        "<b>Charisma (CHA):</b> Team standups, public speaking, networking, attending meetups."
    ]
    for b in attr_bullets:
        story.append(Paragraph(f"&bull; {b}", bullet_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("4. Hackathon-Winning 'Killer Features' (The Wow-Factor)", h1_style))
    killer_data = [
        [
            Paragraph("<b>1. Weekly Boss Raid: 'The Procrastination Demon'</b><br/>"
                      "A weekly boss with 3,000 HP (e.g. <i>Malakor the Sloth</i>). Every completed quest strikes the boss with "
                      "attack damage equal to the quest's XP output + user Strength bonus. Slaying the boss before the countdown drops rare loot chests and guild badges.", table_cell_style),
            Paragraph("<b>2. Guild Black Market & Real-World Rewards</b><br/>"
                      "Spend earned Gold on: (a) <i>Virtual Relics:</i> Scroll of Focus (+10% INT XP), Aegis Shield (Streak Freeze); and "
                      "(b) <i>Real-Life Custom Rewards:</i> Users set up personal rewards ('1 hr Gaming' = 100 Gold, 'Order Pizza' = 350 Gold) bridging game loot to real life!", table_cell_style)
        ],
        [
            Paragraph("<b>3. Hunter Rank Difficulty Tiers (E &rarr; S)</b><br/>"
                      "Quests have difficulty ratings: E-Rank (10 XP, 5 Gold), C-Rank (35 XP, 15 Gold), A/S-Rank Boss Milestones (150+ XP, 80 Gold). "
                      "Visual rank badges mirror Solo Leveling hunter licenses.", table_cell_style),
            Paragraph("<b>4. Accessibility & Command Palette (Ctrl+K)</b><br/>"
                      "Fully compliant with accessibility guidelines. Press <code>Ctrl+K</code> or <code>C</code> for instant quest modal; "
                      "navigate quests via <code>Tab</code>, mark complete via <code>Space</code>. 100% responsive bottom-bar on mobile devices.", table_cell_style)
        ]
    ]
    killer_table = Table(killer_data, colWidths=[258, 258])
    killer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (0, 0), 1, colors.HexColor("#EF4444")),
        ('BOX', (1, 0), (1, 0), 1, colors.HexColor("#F59E0B")),
        ('BOX', (0, 1), (0, 1), 1, colors.HexColor("#8B5CF6")),
        ('BOX', (1, 1), (1, 1), 1, colors.HexColor("#06B6D4")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(killer_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("5. Database Schema & Data Integrity Model", h1_style))
    schema_code = (
        "Users (id [UUID], email [STRING], password_hash [STRING], created_at [TIMESTAMP])\n"
        "  ├── Character (id, user_id, name, title, level, current_xp, gold, streak_count, last_active_date)\n"
        "  ├── Attributes (character_id, str_xp, int_xp, vit_xp, agi_xp, cha_xp)\n"
        "  ├── Quests (id, user_id, title, description, category, rank, xp_reward, gold_reward, status, is_daily, due_date)\n"
        "  ├── Inventory (id, user_id, item_id, equipped [BOOL], acquired_at)\n"
        "  ├── ShopItems (id, name, description, cost, type, stat_boost, icon_slug)\n"
        "  └── BossRaid (id, user_id, name, max_hp, current_hp, deadline, reward_gold, defeated [BOOL])"
    )
    schema_table = Table([[Paragraph(f"<pre>{schema_code}</pre>", code_style)]], colWidths=[523])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#0F172A")),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor("#E2E8F0")),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(schema_table)

    story.append(PageBreak())

    # ==================== PAGE 3: DISQUALIFICATION, VIDEO SCRIPT & ROLES ====================
    story.append(Paragraph("6. Zero-Tolerance Disqualification Compliance Matrix", h1_style))
    disq_data = [
        [Paragraph("Rule", table_header_style), Paragraph("Official Disqualification Trigger", table_header_style), Paragraph("Our Absolute Prevention Countermeasure", table_header_style)],
        [Paragraph("<b>Broken Links</b>", table_cell_style), Paragraph("Private GitHub repo or 404 live link at judging.", table_cell_style), Paragraph("Verify public permissions on repo; Vercel deployment with SSL and custom health check endpoint.", table_cell_style)],
        [Paragraph("<b>Fake Persistence</b>", table_cell_style), Paragraph("App relies solely on <code>localStorage</code>.", table_cell_style), Paragraph("All mutations write to PostgreSQL. State proven preserved upon hard refresh (Ctrl+F5).", table_cell_style)],
        [Paragraph("<b>Build/Deploy Failure</b>", table_cell_style), Paragraph("App crashes on load in production deployment.", table_cell_style), Paragraph("Strict TypeScript checks and local production build test (<code>npm run build</code>) prior to git push.", table_cell_style)],
        [Paragraph("<b>Console/Runtime Crash</b>", table_cell_style), Paragraph("Unhandled exceptions or blank-screen crashes.", table_cell_style), Paragraph("React Error Boundaries on all routes; comprehensive Zod schema validation on all API endpoints.", table_cell_style)],
        [Paragraph("<b>Invalid Repository</b>", table_cell_style), Paragraph("Fewer than 3 commits, missing backend, code dump.", table_cell_style), Paragraph("Maintain 15+ clean chronological commits following conventional commit specifications.", table_cell_style)],
        [Paragraph("<b>Video Faults</b>", table_cell_style), Paragraph("Missing, requires login, >100MB, or outside 90-180s.", table_cell_style), Paragraph("Strict 120s walkthrough video, encoded as ~25MB MP4, public unlisted YouTube + in repo.", table_cell_style)],
    ]
    disq_table = Table(disq_data, colWidths=[80, 190, 253])
    disq_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#991B1B")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#FEF2F2")]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(disq_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("7. Walkthrough Video Script (Strictly 120 Seconds / Under 100MB)", h1_style))
    video_steps = [
        "<b>0:00 - 0:20 (Authentication & Status):</b> Show signup/login screen. Click 'Demo Hunter' button for instant entry. Highlight character status bar (Level 1 Novice, 0 XP, 50 Starter Gold).",
        "<b>0:20 - 0:50 (Add & Complete Quest):</b> Create a new B-Rank Quest ('Build Auth API', category: Intellect). Mark it complete: show floating <code>+75 XP</code>, audio chime, and boss taking damage.",
        "<b>0:50 - 1:15 (Level Up Celebration):</b> Complete second quest to cross the XP threshold. Trigger confetti, sound fanfare, and animated Level Up modal showing stat boosts.",
        "<b>1:15 - 1:35 (Persistence Proof):</b> <b>Perform a hard browser refresh (Ctrl+F5)</b>. Explicitly show that XP, Level, Gold, and completed status remain intact from PostgreSQL.",
        "<b>1:35 - 2:00 (Shop & Boss Raid):</b> Visit Guild Market, purchase a Relic with earned Gold, show the Boss HP bar, and demonstrate responsive mobile view."
    ]
    for v in video_steps:
        story.append(Paragraph(f"&bull; {v}", bullet_style))

    story.append(Spacer(1, 6))

    story.append(Paragraph("8. Suggested Team Work Distribution (Editable)", h1_style))
    team_data = [
        [
            Paragraph("<b>Teammate A: Frontend, Theming & UI</b><br/>"
                      "&bull; Dark theme palette, typography, layout<br/>"
                      "&bull; Framer Motion spring physics & confetti modal<br/>"
                      "&bull; Retro audio effects integration with sound toggle<br/>"
                      "&bull; Mobile responsive navigation & command palette", table_cell_style),
            Paragraph("<b>Teammate B: Backend, Database & Game Logic</b><br/>"
                      "&bull; PostgreSQL schema setup (Prisma / Supabase)<br/>"
                      "&bull; Auth session management & Quest CRUD endpoints<br/>"
                      "&bull; Server-side non-linear XP & streak validation<br/>"
                      "&bull; Boss raid damage calculation & shop transaction API", table_cell_style)
        ]
    ]
    team_table = Table(team_data, colWidths=[258, 258])
    team_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(team_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at {filename}")


def build_docx(filename="D:/Web Hackathon/idea.docx"):
    doc = Document()

    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)

    title = doc.add_paragraph()
    run = title.add_run("AETHERIA: THE HUNTER'S PROTOCOL")
    run.font.name = "Arial"
    run.font.size = Pt(22)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)

    subtitle = doc.add_paragraph()
    sub_run = subtitle.add_run("Full-Stack 'Life RPG' Hackathon Blueprint, Architecture & Winning Strategy\n")
    sub_run.font.size = Pt(12)
    sub_run.font.italic = True
    meta_run = subtitle.add_run("TARGET: Web Hackathon 2026 | STACK: Next.js 15, PostgreSQL, Framer Motion | PERSISTENCE: 100% Cloud DB")
    meta_run.font.size = Pt(9.5)
    meta_run.font.bold = True
    meta_run.font.color.rgb = RGBColor(79, 70, 229)

    warn_p = doc.add_paragraph()
    warn_run = warn_p.add_run("CRITICAL ZERO-TOLERANCE WARNING:\n")
    warn_run.font.bold = True
    warn_run.font.color.rgb = RGBColor(220, 38, 38)
    warn_p.add_run(
        "Submissions relying solely on localStorage for data persistence, having broken/inaccessible live links, "
        "crashing during basic usage, having fewer than 3 chronological git commits, or omitting the 90–180s walkthrough video (<100MB) "
        "receive an AUTOMATIC ZERO. Our architecture strictly eliminates all 6 disqualification vectors."
    )

    doc.add_heading("1. Core Problem & Thematic Direction", level=1)
    doc.add_paragraph(
        "Standard productivity tools and to-do lists suffer from delayed gratification (studying, working out, or coding takes months to see results). "
        "Video games hook players through instant tactile feedback loops, transparent progression, and tangible rewards. "
        "Our mission is to bridge this gap with an engaging full-stack Life RPG web application."
    )
    doc.add_paragraph("Theme: Solo Leveling / Dark Fantasy Hunter Guild")
    doc.add_paragraph("• Cohesive RPG Vocabulary: Quests & Bounties (E to S Rank), Gold & Mana Crystals, Daily Rites & Streaks, Guild Black Market.", style='List Bullet')
    doc.add_paragraph("• Alive & Tactile: Built-in 8-bit/synthesized audio (with mute switch), floating +XP/+Gold numbers, celebratory level-up modal with confetti.", style='List Bullet')
    doc.add_paragraph("• Zero-Lag UX: Optimistic UI updates with instant checkmarks and background database sync.", style='List Bullet')

    doc.add_heading("2. Technical Architecture & Tech Stack", level=1)
    table = doc.add_table(rows=1, cols=3)
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = "Layer"
    hdr_cells[1].text = "Technology Choice"
    hdr_cells[2].text = "Evaluation Advantage"

    tech_rows = [
        ("Framework", "Next.js 15 (App Router, React 19, TS)", "Unified frontend + backend API routes, fast SSR, zero CORS."),
        ("UI & Styling", "Tailwind CSS + shadcn/ui + Lucide", "Dark mode by default, accessible Radix UI keyboard navigation."),
        ("Animations", "Framer Motion + Canvas-Confetti", "Spring physics, floating XP numbers, celebratory level-up modal."),
        ("Database & ORM", "PostgreSQL (Supabase / Neon) + Prisma", "100% Real DB persistence across hard refreshes and devices."),
        ("Audio Engine", "Web Audio API / Howler.js", "Zero-latency retro game sound effects with mute toggle."),
        ("Deployment", "Vercel + Supabase Cloud", "Public live HTTPS link with 99.9% uptime.")
    ]
    for r in tech_rows:
        row_cells = table.add_row().cells
        row_cells[0].text = r[0]
        row_cells[1].text = r[1]
        row_cells[2].text = r[2]

    doc.add_heading("3. RPG Progression Engine & Game Mathematics", level=1)
    doc.add_paragraph("Non-Linear Leveling Formula: Required XP = Math.floor(100 * Level^1.5)")
    doc.add_paragraph("• Level 1 -> 2: 100 XP (Instant gratification in first 2 tasks)", style='List Bullet')
    doc.add_paragraph("• Level 2 -> 3: 283 XP", style='List Bullet')
    doc.add_paragraph("• Level 5 -> 6: 1,118 XP", style='List Bullet')
    doc.add_paragraph("• Level 9 -> 10: 2,700 XP (Prestige achievement)", style='List Bullet')

    doc.add_paragraph("5 Core Hunter Attributes:")
    doc.add_paragraph("• Strength (STR): Workouts, gym, sports, physical labor.", style='List Bullet')
    doc.add_paragraph("• Intellect (INT): Coding, studying, technical reading, problem solving.", style='List Bullet')
    doc.add_paragraph("• Vitality (VIT): Hydration, sleep consistency, meditation, meal prep.", style='List Bullet')
    doc.add_paragraph("• Agility (AGI): Speed chores, inbox zero, swift errands.", style='List Bullet')
    doc.add_paragraph("• Charisma (CHA): Team meetings, public speaking, networking.", style='List Bullet')

    doc.add_heading("4. Hackathon-Winning 'Killer Features'", level=1)
    doc.add_paragraph("1. Weekly Boss Raid ('The Procrastination Demon'): 3,000 HP boss damaged by completed quests based on XP + Strength. Drops rare loot chests and guild badges upon defeat.")
    doc.add_paragraph("2. Guild Black Market: Dual economy allowing virtual item purchases (Focus Scroll, Streak Freeze) AND real-world custom rewards ('1 hr Gaming' = 100 Gold).")
    doc.add_paragraph("3. Hunter Rank Difficulty Tiers: E-Rank (10 XP, 5 Gold) to S-Rank (150+ XP, 80 Gold).")
    doc.add_paragraph("4. Keyboard Command Palette (Ctrl+K): Press C for quest creation, Tab/Enter/Space for keyboard navigation.")

    doc.add_heading("5. Database Schema & Data Integrity Model", level=1)
    doc.add_paragraph(
        "Users (id [UUID], email, password_hash, created_at)\n"
        "  ├── Character (id, user_id, name, title, level, current_xp, gold, streak_count, last_active_date)\n"
        "  ├── Attributes (character_id, str_xp, int_xp, vit_xp, agi_xp, cha_xp)\n"
        "  ├── Quests (id, user_id, title, description, category, rank, xp_reward, gold_reward, status, is_daily, due_date)\n"
        "  ├── Inventory (id, user_id, item_id, equipped, acquired_at)\n"
        "  ├── ShopItems (id, name, description, cost, type, stat_boost, icon_slug)\n"
        "  └── BossRaid (id, user_id, name, max_hp, current_hp, deadline, reward_gold, defeated)"
    )

    doc.add_heading("6. Zero-Tolerance Disqualification Compliance", level=1)
    doc.add_paragraph("• Broken Links: Verify public GitHub repo + live Vercel link.")
    doc.add_paragraph("• Fake Persistence: 100% PostgreSQL database storage verified by hard refresh (Ctrl+F5).")
    doc.add_paragraph("• Build Failure: Run 'npm run build' locally before pushing.")
    doc.add_paragraph("• Runtime Crashes: React Error Boundaries + Zod input validation.")
    doc.add_paragraph("• Invalid Repo: 15+ clean chronological commits with descriptive messages.")
    doc.add_paragraph("• Video: Strictly 90–180s (aiming for 120s), under 100MB, public link.")

    doc.add_heading("7. 120-Second Walkthrough Video Script", level=1)
    doc.add_paragraph("0:00 - 0:20: Demo Hunter login and initial character stats overview.")
    doc.add_paragraph("0:20 - 0:50: Create and complete a B-Rank quest, show floating XP and boss damage.")
    doc.add_paragraph("0:50 - 1:15: Complete second quest to trigger Level Up modal with confetti and fanfare.")
    doc.add_paragraph("1:15 - 1:35: Perform HARD BROWSER REFRESH (Ctrl+F5) to prove database persistence.")
    doc.add_paragraph("1:35 - 2:00: Buy item in Black Market, inspect Boss HP bar, show mobile responsiveness.")

    doc.add_heading("8. Suggested Team Work Distribution", level=1)
    doc.add_paragraph("• Teammate A (Frontend/UI): Theme layout, Framer Motion animations, level-up modal, audio effects, mobile nav.")
    doc.add_paragraph("• Teammate B (Backend/DB): PostgreSQL setup, Auth endpoints, Quest CRUD, XP curve logic, Boss damage API.")
    doc.add_paragraph("• Teammate C (Polish/Demo): Shop mechanics, keyboard command palette, walkthrough video recording & editing.")

    doc.save(filename)
    print(f"Successfully generated DOCX at {filename}")


if __name__ == "__main__":
    build_pdf("D:/Web Hackathon/idea.pdf")
    build_docx("D:/Web Hackathon/idea.docx")
