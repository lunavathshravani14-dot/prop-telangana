import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

pdf_path = r"c:\Users\lunav\OneDrive\Desktop\BHASKAR FILE\Wipro_Analyst_L1_Resume.pdf"

# Margins: 0.5 inch (36 points) for maximum content fitting and crisp single-page/clean presentation
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=32,
    bottomMargin=32
)

styles = getSampleStyleSheet()

# Custom styles
primary_color = colors.HexColor("#0f4c81")
dark_color = colors.HexColor("#1a1a1a")
body_color = colors.HexColor("#2b2b2b")
gray_color = colors.HexColor("#555555")

name_style = ParagraphStyle(
    'CandidateName',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=21,
    alignment=TA_CENTER,
    textColor=primary_color
)

target_title_style = ParagraphStyle(
    'TargetTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=13,
    alignment=TA_CENTER,
    textColor=dark_color
)

contact_style = ParagraphStyle(
    'ContactInfo',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=11,
    alignment=TA_CENTER,
    textColor=gray_color
)

section_heading_style = ParagraphStyle(
    'SectionHeading',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=12,
    textColor=primary_color,
    spaceBefore=0,
    spaceAfter=0
)

body_style = ParagraphStyle(
    'BodyText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=11.5,
    alignment=TA_JUSTIFY,
    textColor=body_color
)

bold_label_style = ParagraphStyle(
    'BoldLabel',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=11.5,
    textColor=dark_color
)

skill_val_style = ParagraphStyle(
    'SkillVal',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=11.5,
    textColor=body_color
)

bullet_style = ParagraphStyle(
    'BulletText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.3,
    leading=11.2,
    alignment=TA_LEFT,
    textColor=body_color,
    leftIndent=12,
    firstLineIndent=-12
)

entry_title_style = ParagraphStyle(
    'EntryTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=11.5,
    textColor=dark_color
)

entry_date_style = ParagraphStyle(
    'EntryDate',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.3,
    leading=11.5,
    alignment=TA_LEFT,
    textColor=gray_color
)

story = []

# 1. Header
story.append(Paragraph("FIRSTNAME LASTNAME", name_style))
story.append(Spacer(1, 2))
story.append(Paragraph("ANALYST L1 – BUSINESS ANALYST / DATA ANALYST (MEDIA)", target_title_style))
story.append(Spacer(1, 3))
story.append(Paragraph("Chennai, Tamil Nadu, India &nbsp;|&nbsp; +91 98765 43210 &nbsp;|&nbsp; email.address@example.com &nbsp;|&nbsp; linkedin.com/in/yourprofile &nbsp;|&nbsp; github.com/yourprofile", contact_style))
story.append(Spacer(1, 5))
story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=6, spaceBefore=0))

# Helper function for section titles
def add_section_header(title):
    story.append(Paragraph(title.upper(), section_heading_style))
    story.append(Spacer(1, 2))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#d0d7de"), spaceAfter=5, spaceBefore=0))

# 2. Summary
add_section_header("Professional Summary")
summary_text = (
    "Analytical and detail-oriented Analyst with specialized knowledge in business data analysis, operational reporting, and digital media metrics. "
    "Proficient in advanced Microsoft Excel (Pivot Tables, XLOOKUP, Data Validation), SQL, and data visualization tools. "
    "Demonstrated ability to review large datasets for accuracy, identify trends and discrepancies, and translate quantitative findings into clear business insights. "
    "Skilled in documenting workflows, maintaining KPI dashboards, and collaborating with cross-functional teams to fulfill project requirements within tight deadlines."
)
story.append(Paragraph(summary_text, body_style))
story.append(Spacer(1, 6))

# 3. Core Competencies & Skills
add_section_header("Core Competencies & Technical Skills")
skills_data = [
    [
        Paragraph("Data & Quality Analysis:", bold_label_style),
        Paragraph("Data Cleaning, Discrepancy Auditing, Variance Analysis, Trend Identification, Root-Cause Analysis, Data Quality Assurance (QA)", skill_val_style)
    ],
    [
        Paragraph("Media & Business Domain:", bold_label_style),
        Paragraph("Digital Media Metrics (CTR, CPC, Impressions, Reach), Audience Segmentation, Media Spend Reconciliation, Operational Reporting", skill_val_style)
    ],
    [
        Paragraph("Software & Tools:", bold_label_style),
        Paragraph("Microsoft Excel (Advanced: Pivot Tables, XLOOKUP, Nested IFs, Power Query), SQL, Power BI, Tableau, Google Sheets, MS PowerPoint", skill_val_style)
    ],
    [
        Paragraph("Documentation & Collaboration:", bold_label_style),
        Paragraph("Business Requirements Gathering, Standard Operating Procedures (SOPs), KPI Dashboards, Stakeholder Reporting, Jira", skill_val_style)
    ],
]
t_skills = Table(skills_data, colWidths=[140, 400])
t_skills.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ('TOPPADDING', (0,0), (-1,-1), 1),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(t_skills)
story.append(Spacer(1, 6))

# 4. Professional Experience
add_section_header("Professional Experience")

# Job 1
row1 = [
    Paragraph("<b>Associate Analyst / Data Analyst Intern</b> – Global Solutions Pvt Ltd", entry_title_style),
    Paragraph("Jun 2024 – Present | Chennai, India", entry_date_style)
]
t_job1 = Table([row1], colWidths=[370, 170])
t_job1.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_job1)

bullets_job1 = [
    "&bull; <b>Collected and audited 30,000+ monthly records</b> across operational and digital media feeds, maintaining 99.4% data integrity.",
    "&bull; <b>Identified critical data discrepancies and patterns</b> across third-party reporting feeds; escalated anomalies to resolve ingestion errors.",
    "&bull; <b>Automated weekly and monthly reporting cycles</b> utilizing advanced Excel (XLOOKUP, Pivot Tables, Conditional Formatting), saving 4+ hours/week.",
    "&bull; <b>Designed and maintained interactive KPI dashboards</b> in Power BI and Excel to track media delivery schedules and variance metrics.",
    "&bull; <b>Partnered with cross-functional project leads</b> to gather requirements, document Standard Operating Procedures (SOPs), and report status."
]
for b in bullets_job1:
    story.append(Paragraph(b, bullet_style))
    story.append(Spacer(1, 1.5))

story.append(Spacer(1, 4))

# Job 2
row2 = [
    Paragraph("<b>Operations & Data Trainee</b> – Apex Technologies", entry_title_style),
    Paragraph("Jan 2024 – May 2024 | Chennai, India", entry_date_style)
]
t_job2 = Table([row2], colWidths=[370, 170])
t_job2.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_job2)

bullets_job2 = [
    "&bull; <b>Reviewed raw business data for consistency</b>, applying validation checks to eliminate duplicate entries and standardize key fields.",
    "&bull; <b>Prepared ad-hoc analytical summaries and decks</b> for stakeholder meetings, tracking metrics against established quality standards.",
    "&bull; <b>Maintained project issue logs and documentation</b>, supporting operational teams in meeting milestone deadlines."
]
for b in bullets_job2:
    story.append(Paragraph(b, bullet_style))
    story.append(Spacer(1, 1.5))

story.append(Spacer(1, 6))

# 5. Selected Projects
add_section_header("Selected Projects")

# Project 1
p1_row = [
    Paragraph("<b>Media Campaign Performance & Audience Trend Dashboard</b>", entry_title_style),
    Paragraph("Excel, SQL, Power BI", entry_date_style)
]
t_p1 = Table([p1_row], colWidths=[370, 170])
t_p1.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_p1)

p1_bullets = [
    "&bull; <b>Analyzed 45,000+ multi-channel digital ad records</b> (display, search, social) to evaluate engagement patterns, CTR, and CPC trends.",
    "&bull; <b>Engineered an automated reporting model</b> featuring dynamic slicers, trend charts, and cost-per-acquisition (CPA) calculations.",
    "&bull; <b>Delivered actionable insights</b> that recommended reallocating underperforming ad spend, driving a projected 16% conversion lift."
]
for b in p1_bullets:
    story.append(Paragraph(b, bullet_style))
    story.append(Spacer(1, 1.5))

story.append(Spacer(1, 4))

# Project 2
p2_row = [
    Paragraph("<b>Automated Business Data Reconciliation & Quality Tool</b>", entry_title_style),
    Paragraph("Advanced Excel & VBA", entry_date_style)
]
t_p2 = Table([p2_row], colWidths=[370, 170])
t_p2.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_p2)

p2_bullets = [
    "&bull; <b>Constructed an automated data reconciliation model</b> using conditional validation rules to detect null values and format anomalies.",
    "&bull; <b>Reduced manual auditing time by 35%</b>, preventing calculation discrepancies across recurring monthly operational datasets."
]
for b in p2_bullets:
    story.append(Paragraph(b, bullet_style))
    story.append(Spacer(1, 1.5))

story.append(Spacer(1, 6))

# 6. Education
add_section_header("Education")
edu_row = [
    Paragraph("<b>Bachelor of Technology / Bachelor of Science / BCA</b> – University / College Name", entry_title_style),
    Paragraph("Graduation: 2024 | CGPA: 8.4/10", entry_date_style)
]
t_edu = Table([edu_row], colWidths=[370, 170])
t_edu.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 1),
]))
story.append(t_edu)
story.append(Paragraph("Relevant Coursework: Database Management Systems (DBMS), Business Statistics, Data Analysis, Software Engineering", ParagraphStyle('Coursework', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=10, textColor=gray_color)))
story.append(Spacer(1, 6))

# 7. Certifications
add_section_header("Certifications")
certs_text = (
    "&bull; <b>Microsoft Excel:</b> Advanced Formulas, Pivot Tables & Data Analysis &nbsp;&nbsp;|&nbsp;&nbsp; "
    "&bull; <b>Google Data Analytics:</b> Professional Certificate &nbsp;&nbsp;|&nbsp;&nbsp; "
    "&bull; <b>SQL & Business Intelligence:</b> Foundations"
)
story.append(Paragraph(certs_text, ParagraphStyle('Certs', parent=styles['Normal'], fontName='Helvetica', fontSize=8.3, leading=11, textColor=body_color)))

# Build document
doc.build(story)
print(f"Successfully generated PDF at: {pdf_path}")
print(f"File size: {os.path.getsize(pdf_path)} bytes")
