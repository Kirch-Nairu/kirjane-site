#!/usr/bin/env python3
"""Pre-render six static, semantic pages. Zero build dependencies."""
from pathlib import Path
from html import escape
ROOT = Path(__file__).resolve().parent.parent
ASSET='/assets/visuals/'

NAV=[('Services','/services/'),('Projects','/projects/'),('About','/about/'),('Our Process','/process/')]
SERVICES=[
 ('01','Custom Software Development','Applications built around specific workflows and requirements.','s01-development','Architecture, interfaces, operational tooling'),
 ('02','Process Automation','Reducing repetitive tasks and improving the movement of information.','s02-automation','Rules, approvals, repeatable workflows'),
 ('03','Systems Engineering & Integration','Connecting systems and designing reliable boundaries.','s03-integration','APIs, data movement, connected operations'),
 ('04','Technical Infrastructure & Support','Supporting the environments that dependable software requires.','s04-infrastructure','Deployment, security, maintainability'),
]
STEPS=[('01','Discover','Understand the real work, the people and the constraints.'),('02','Plan & Design','Define the experience, boundaries and system architecture.'),('03','Develop','Build the solution against clear, agreed requirements.'),('04','Validate','Test the behavior, usability and operating assumptions.'),('05','Deliver & Support','Prepare deployment, handover and continuous improvement.')]

ICON_ARROW='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 19 19 5M7 5h12v12"/></svg>'
ICON_DOWN='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4v16m-7-7 7 7 7-7"/></svg>'
ICON_MENU='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8h18M3 16h18"/></svg>'

def link(text, href, kind='text', icon=True):
    cls='link-arrow' if kind=='text' else 'button button-'+kind
    return f'<a class="{cls}" href="{href}"><span>{text}</span>{ICON_ARROW if icon else ""}</a>'

def picture(name, *, cls='', priority=False, mobile=None, extra=''):
    m=f'<source media="(max-width: 680px)" srcset="{ASSET}{mobile}.webp" type="image/webp">' if mobile else ''
    return f'<picture class="{cls}">{m}<img src="{ASSET}{name}.webp" alt="" loading="{"eager" if priority else "lazy"}" decoding="async" {"fetchpriority=\"high\"" if priority else ""} {extra}></picture>'

def section_head(index, title, suffix=''):
    return f'<div class="section-kicker"><span class="kicker-dot"></span><span>{index}</span><span class="kicker-line"></span><span>{title}</span><span class="kicker-suffix">{suffix}</span></div>'

def header(page):
    nav=''.join(f'<a href="{href}" {"aria-current=\"page\"" if page==label else ""}>{label}</a>' for label,href in NAV)
    return f'''<header class="site-header" id="top"><div class="header-inner shell">
      <a class="brand" href="/" aria-label="Kirjane IT Solutions home"><span class="brand-title">KIRJANE</span><span class="brand-sub">IT SOLUTIONS<span class="brand-star" aria-hidden="true">✳</span></span></a>
      <nav id="site-navigation" class="navigation" aria-label="Primary navigation">{nav}<a class="mobile-only mobile-contact" href="/contact/">Let's Talk {ICON_ARROW}</a></nav>
      <a class="header-cta" href="/contact/"><span>LET'S TALK</span>{ICON_ARROW}</a>
      <button class="menu-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" aria-label="Open navigation">{ICON_MENU}</button>
    </div></header>'''

def footer():
    return '''<footer class="footer"><div class="shell">
      <div class="footer-strap"><span>BETTER SYSTEMS START WITH BETTER QUESTIONS.</span><a href="#top" aria-label="Return to top">↑ TOP</a></div>
      <div class="footer-grid"><div><a href="/" class="footer-wordmark">KIRJANE<span class="tm">®</span></a><p>Custom software. Workflow automation.<br>Systems built around the work.</p></div>
      <nav aria-label="Footer navigation"><span class="footer-label">EXPLORE</span><a href="/services/">Services</a><a href="/projects/">Projects</a><a href="/about/">About Us</a><a href="/process/">Our Process</a></nav>
      <div><span class="footer-label">START A CONVERSATION</span><a class="footer-contact" href="/contact/">Tell us what needs to work <span aria-hidden="true">↗</span></a><span class="footer-note">Contact channel pending company verification.</span></div></div>
      <div class="footer-bottom"><span>© 2026 KIRJANE IT SOLUTIONS</span><span>ADAPT. AUTOMATE. EVOLVE.</span><span>DESIGNED AROUND THE WORK.</span></div>
    </div></footer>'''

def layout(page,title,desc,body,hero_preload=None):
    preload=(f'<link rel="preload" as="image" href="{ASSET}{hero_preload}.webp" fetchpriority="high">' if hero_preload else '')
    r3_css='<link rel="stylesheet" href="/assets/css/r3-home.css">' if page=='Home' else ''
    r3_js='<script src="/assets/js/r3-home.js" defer></script>' if page=='Home' else ''
    return f'''<!doctype html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark light">
<title>{escape(title)} | Kirjane IT Solutions</title><meta name="description" content="{escape(desc,quote=True)}">
<meta property="og:title" content="{escape(title,quote=True)} — Kirjane IT Solutions"><meta property="og:description" content="{escape(desc,quote=True)}"><meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
{preload}<link rel="stylesheet" href="/assets/css/site.css">{r3_css}<script src="/assets/js/site.js" defer></script>{r3_js}
</head><body data-page="{escape(page)}"><a class="skip-link" href="#main-content">Skip to main content</a><div class="scroll-progress" aria-hidden="true"></div>
{header(page)}<main id="main-content">{body}</main>{footer()}</body></html>'''

def inner_hero(index,eyebrow,title,sub,visual=None,mobile=None):
    bg= picture(visual,cls='page-hero-media',priority=True,mobile=mobile) if visual else ''
    return f'''<section class="inner-hero"><div class="inner-hero-backdrop">{bg}</div><div class="shell inner-hero-grid"><div class="inner-content"><p class="mono eyebrow">{index} / {eyebrow}</p><h1 class="display inner-title">{title}</h1><p class="lede">{sub}</p></div><div class="inner-foot"><span>DESIGN THAT SERVES A PURPOSE.</span><span>SCROLL TO EXPLORE ↓</span></div></div></section>'''

home_hero=f'''<section class="home-hero" aria-labelledby="hero-title">
  {picture('h01-hero-desktop',cls='hero-media',mobile='h02-hero-mobile',priority=True)}
  <div class="r3-hero-light" aria-hidden="true"><span></span><span></span></div>
  <div class="hero-grain" aria-hidden="true"></div>
  <div class="shell hero-contents"><div class="hero-topline mono"><span><b class="signal"></b>SOFTWARE ENGINEERING / AUTOMATION</span><span class="hero-edition">KIRJANE / 2026</span></div>
    <div class="hero-copy"><p class="mono hero-overline" data-reveal>INDEPENDENT THINKING. ENGINEERED RESULTS.</p>
      <h1 class="display" id="hero-title"><span>THE WORK.</span><span class="hero-title-accent">COMES FIRST<span class="hero-stop">.</span></span></h1>
      <div class="hero-support"><div class="hero-support-left"><p class="hero-service">Custom software.<br><span>Workflow automation.</span></p></div><div class="hero-support-right"><p>We develop applications and connected systems around how businesses and organizations actually work.</p><div class="hero-links">{link('Explore our work','/projects/','solid')}{link('What we do','/services/')}</div></div></div>
    </div>
    <div class="r3-hero-chapter mono" aria-hidden="true"><span>01 / 07</span><span class="r3-chapter-dash"></span><span>THE INTRODUCTION</span></div>
    <div class="hero-baseline"><span class="mono">ADAPT. AUTOMATE. EVOLVE.</span><a href="#home-services" class="scroll-invite mono">SCROLL TO EXPLORE {ICON_DOWN}</a><span class="mono hero-foot-right">01 — INTRODUCTION</span></div>
  </div>
</section>'''

services_rows=''.join(f'''<button class="service-row {"active" if i==0 else ""}" type="button" role="tab" aria-selected="{"true" if i==0 else "false"}" id="service-tab-{i+1}" aria-controls="service-preview" data-service-select="{i}"><span class="service-id">{no}</span><span class="service-row-body"><strong>{title}</strong><small>{desc}</small></span><span class="service-north">↗</span></button>''' for i,(no,title,desc,im,focus) in enumerate(SERVICES))
home_services=f'''<section class="services-home r3-services-fullbleed" id="home-services" aria-labelledby="r3-services-heading">
  <div class="r3-services-track" data-r3-services-track>
    <div class="r3-services-stage">
      <div class="r3-service-visuals" aria-hidden="true">{''.join(f'<img src="{ASSET}{im}.webp" alt="" decoding="async" loading="lazy" data-service-scene="{i}" class="{"is-current" if i==0 else ""}">' for i,(no,title,desc,im,focus) in enumerate(SERVICES))}</div>
      <div class="r3-service-shade" aria-hidden="true"></div>
      <div class="shell r3-services-layer">
        <div class="r3-service-overline mono"><span>02 / EXPERTISE — WHAT WE BUILD</span><span>CHAPTER 02 <span class="r3-service-divider" aria-hidden="true">/</span> <span data-r3-count>01 / 04</span></span></div>
        <div class="r3-service-layout">
          <div class="r3-services-left">
            <h2 class="display r3-services-title" id="r3-services-heading">LESS FRICTION.<br><em>MORE FUNCTION.</em></h2>
            <p class="r3-services-intro">Custom software and connected systems designed around the work that matters.</p>
            <div class="service-tabs" role="tablist" aria-label="Service disciplines">{services_rows}</div>
          </div>
          <div class="r3-service-detail" id="service-preview" role="tabpanel" tabindex="0" aria-labelledby="service-tab-1">
            <div class="service-preview-caption"><span class="mono">FOCUS / 001</span><p data-service-focus>Architecture, interfaces, operational tooling</p></div>
            <span class="r3-detail-disclosure mono">CONCEPTUAL VISUAL / NOT A CLIENT SCREENSHOT</span>
          </div>
        </div>
        <div class="r3-service-footer"><div class="r3-service-meter" aria-hidden="true"><span></span></div>
          <div class="r3-service-footer-line mono"><span>SCROLL TO EXPLORE <span aria-hidden="true">↓</span> <span class="r3-selection-hint">/ OR SELECT A DISCIPLINE</span></span><a href="/services/">EXPLORE ALL SERVICES <span aria-hidden="true">↗</span></a></div>
        </div>
      </div>
    </div>
  </div>
</section>'''

home_manifest=f'''<section class="manifest-band"><div class="shell manifest-inner"><p>NOT SOFTWARE FOR SOFTWARE'S SAKE.</p><div class="manifest-line"><span>RETHINK THE PROCESS.</span><i aria-hidden="true">✳</i><span>CONNECT THE SYSTEM.</span><i aria-hidden="true">✳</i><span>MAKE IT WORK.</span></div></div></section>'''

process_steps=''.join(f'''<li class="r3-process-step-item"><button type="button" class="r3-process-step {"is-active" if i==0 else ""}" data-r3-process-step="{i}" aria-current="{"step" if i==0 else "false"}" aria-controls="r3-process-detail"><span class="r3-process-step-number mono">{num}</span><strong>{label}</strong></button></li>''' for i,(num,label,desc) in enumerate(STEPS))
home_workflow=f'''<section class="workflow-home r3-process-home" id="home-process" aria-labelledby="r3-process-heading">
  <div class="r3-process-track" data-r3-process-track>
    <div class="r3-process-stage">
      <div class="r3-process-art" aria-hidden="true">
        <img class="r3-process-art-base" src="{ASSET}p01-process.webp" alt="" decoding="async" loading="lazy">
        <img class="r3-process-art-focus" src="{ASSET}p01-process.webp" alt="" decoding="async" loading="lazy">
      </div>
      <div class="r3-process-shade" aria-hidden="true"></div>
      <div class="shell r3-process-layer">
        <div class="r3-process-overline mono"><span>03 / HOW WE APPROACH THE WORK</span><span>CHAPTER 03 <span aria-hidden="true">/</span> <span data-r3-process-count>01 / 05</span></span></div>
        <div class="r3-process-story">
          <div class="r3-process-heading-group"><span class="mono r3-process-eyebrow">THE ENGINEERING JOURNEY / FIVE STAGES</span><h2 class="display" id="r3-process-heading">FROM A HANDOFF<br>TO A <em>SYSTEM.</em></h2><p>From scattered tasks to dependable systems. Follow the decisions that turn a problem into something people can use.</p></div>
          <div class="r3-process-detail" id="r3-process-detail" aria-label="Current engineering stage">
            <span class="r3-process-detail-index mono">STAGE <span data-r3-process-number>01</span> / 05</span>
            <h3 data-r3-process-title>Discover</h3>
            <p data-r3-process-description>Understand the real work, the people and the constraints.</p>
          </div>
        </div>
        <div class="r3-process-bottom">
          <div class="r3-process-meter" aria-hidden="true"><span></span></div>
          <ol class="r3-process-steps" aria-label="Five engineering stages">{process_steps}</ol>
          <div class="r3-process-navigation mono"><span>SCROLL TO FOLLOW THE JOURNEY <span aria-hidden="true">↓</span> <span class="r3-process-select-hint">/ OR SELECT A STAGE</span></span><a href="/process/">SEE OUR PROCESS <span aria-hidden="true">↗</span></a></div>
        </div>
      </div>
    </div>
  </div>
</section>'''

home_projects=f'''<section class="projects-home section-light"><div class="shell">{section_head('04','WORK / SYSTEMS IN CONTEXT','PROJECT PERSPECTIVE')}
<div class="section-intro-grid"><h2 class="display section-heading dark">BEYOND<br><span class="ink-green">THE INTERFACE.</span></h2><div class="section-aside"><p>Every useful system begins with a problem worth solving. We examine the work behind the screen—from information flow to operational decisions.</p>{link('Explore project thinking','/projects/')}</div></div>
<div class="project-grid"><article class="project-feature">{picture('w01-operations',cls='project-visual')}<div class="project-visual-overlay"><span class="mono">01 / CONCEPT EXAMPLE</span><h3>CONNECTED<br>OPERATIONS</h3><span class="project-arrow">↗</span></div></article><article class="project-feature">{picture('w02-decisions',cls='project-visual')}<div class="project-visual-overlay"><span class="mono">02 / CONCEPT EXAMPLE</span><h3>DECISIONS,<br>MADE VISIBLE.</h3><span class="project-arrow">↗</span></div></article></div>
<p class="disclaimer">Conceptual capability illustrations only. Public client case studies and measured outcomes will be added after verification and permission.</p>
</div></section>'''

home_about=f'''<section class="about-home"><div class="shell">{section_head('05','OUR PHILOSOPHY','ABOUT KIRJANE')}
<div class="about-split"><div class="about-copy"><p class="mono eyebrow">TECHNOLOGY BUILT AROUND THE WORK.</p><h2 class="display section-heading">WE THINK<br>IN SYSTEMS.<br><em>WE BUILD</em><br>FOR PEOPLE.</h2><p>Good engineering starts by understanding the reality behind a requirement. We connect technical discipline with everyday usability, and we validate what we build.</p>{link('Get to know us','/about/','outline')}</div>
<div class="about-art">{picture('a01-about',cls='about-img')}<span class="mono about-art-label">TECHNOLOGY / PEOPLE / PURPOSE</span></div></div></div></section>'''

contact_cta=f'''<section class="closing-cta"><picture class="cta-media"><source media="(max-width: 680px)" srcset="{ASSET}c02-contact-mobile.webp" type="image/webp"><img src="{ASSET}c01-contact-desktop.webp" alt="" loading="lazy" decoding="async"></picture><div class="shell cta-grid"><div><p class="mono eyebrow">06 / HAVE A CHALLENGE?</p><h2 class="display">LET'S BUILD<br><em>WHAT'S NEXT.</em></h2><p>Tell us what needs to change. We'll start with the right questions.</p>{link('Contact Kirjane','/contact/','acid')}</div><span class="mono cta-corner">THE NEXT SYSTEM STARTS HERE. ↗</span></div></section>'''

# R3: editorial chapter divider between Hero and the Services story. Reuses
# the existing chartreuse manifesto band visual treatment; HTML typography only.
home_hero_separator=f'''<section class="manifest-band r3-hero-separator" aria-label="From the work to the solution">
  <div class="shell manifest-inner">
    <p>FROM AN IDEA TO A SYSTEM THAT WORKS.</p>
    <div class="manifest-line"><span>UNDERSTAND THE WORK.</span><i aria-hidden="true">✳</i><span>ENGINEER THE ANSWER.</span><i aria-hidden="true">✳</i><span>BUILD WHAT MATTERS.</span></div>
  </div>
</section>'''

home=home_hero+home_hero_separator+home_services+home_manifest+home_workflow+home_projects+home_about+contact_cta

# SERVICES
service_cards=''.join(f'''<article class="discipline" id="service-{i+1}" data-reveal><div class="discipline-text"><div class="discipline-line mono"><span>{no} / 04</span><span>THE PRACTICE</span></div><h2>{title}</h2><p>{desc}</p><p class="discipline-focus"><span>FOCUS</span>{focus}</p></div>{picture(img,cls='discipline-art')}<span class="discipline-num">{no}</span></article>''' for i,(no,title,desc,img,focus) in enumerate(SERVICES))
services=inner_hero('01','SERVICES','ENGINEERING<br><em>THAT WORKS.</em>','From custom applications to the infrastructure behind them, we design technology around actual operational needs.','s01-development')+f'''<section class="disciplines section-light"><div class="shell">{section_head('01—04','OUR DISCIPLINES','WHAT WE BUILD')}{service_cards}</div></section>'''+f'''<section class="statement"><div class="shell"><p class="mono">THE GOAL ISN'T MORE TECHNOLOGY.</p><h2 class="display">IT'S TECHNOLOGY<br>THAT <em>DOES MORE.</em></h2>{link('Explore our process','/process/','solid')}</div></section>'''+contact_cta

# PROJECTS
project_items=[('01','Connected operations','A unified flow can help information travel from an incoming request through the actions that follow.','w01-operations','Intake / Status / Handoff'),('02','Decision visibility','A clear system can make responsibilities, review steps, and the next decision easier to understand.','w02-decisions','Review / Ownership / Next step')]
project_cards=''.join(f'''<article class="case-row"><div class="case-copy"><span class="mono">CONCEPT STUDY / {no}</span><h2>{title}</h2><p>{desc}</p><div class="case-chips">{''.join(f'<span>{v.strip()}</span>' for v in chips.split('/'))}</div><p class="concept-label">Illustrative capability only — not a published client case study.</p></div>{picture(img,cls='case-img')}</article>''' for no,title,desc,img,chips in project_items)
projects=inner_hero('02','PROJECTS','THE THINKING<br><em>BEHIND THE BUILD.</em>','A project is more than an interface. We look at the problem, the architecture, the decisions and the result.','w01-operations')+f'''<section class="case-studies section-light"><div class="shell">{section_head('01—02','CAPABILITIES IN CONTEXT','ILLUSTRATIVE EXAMPLES')}<p class="section-preface">The graphics below demonstrate possible system patterns. Verified projects, permissions, and measurable outcomes are required before publishing named client case studies.</p>{project_cards}</div></section>'''+contact_cta

# ABOUT
about=inner_hero('03','ABOUT US','START WITH<br><em>THE WORK.</em>','Kirjane IT Solutions is focused on software engineering, process automation and connected digital systems for organizations.','a01-about')+f'''<section class="principles section-light"><div class="shell">{section_head('01—03','THE WAY WE THINK','OUR PRINCIPLES')}
<div class="section-intro-grid"><h2 class="display section-heading dark">UNDERSTAND.<br>DESIGN.<br><span class="ink-green">VALIDATE.</span></h2><div class="section-aside"><p>We care about architecture, but also about who uses the system, what problem it addresses and how the work changes after launch.</p></div></div>
<div class="principle-list"><article><span>01</span><div><h3>Understand before building.</h3><p>Begin with people, processes, constraints and actual requirements.</p></div></article><article><span>02</span><div><h3>Design for the people using it.</h3><p>Clarity, accessibility and everyday usefulness matter alongside technical architecture.</p></div></article><article><span>03</span><div><h3>Make the result accountable.</h3><p>Defined acceptance criteria and validation keep engineering grounded in outcomes.</p></div></article></div></div></section>
<section class="about-real"><div class="shell">{section_head('04','THE PEOPLE BEHIND THE WORK','TEAM PROFILES')}
<div class="about-real-grid"><h2 class="display section-heading">HUMAN BY<br><em>DESIGN.</em></h2><div><p>Our team profiles and portraits are being prepared for publication. We won't fill these spaces with fabricated identities or AI-generated employee photos.</p><p class="mono pending-tag">TEAM DIRECTORY / PENDING VERIFICATION</p></div></div></div></section>'''+contact_cta

# PROCESS
process_list=''.join(f'''<article class="process-row"><span class="process-num">{no}</span><div class="process-description"><h2>{title}</h2><p>{desc}</p></div><span class="process-mark">↗</span></article>''' for no,title,desc in STEPS)
process=inner_hero('04','OUR PROCESS',"THERE'S A METHOD<br><em>TO MAKING IT WORK.</em>",'A practical, testable journey from understanding the problem to delivering the system.','p01-process')+f'''<section class="process-main section-light"><div class="shell">{section_head('01—05','A CLEAR ENGINEERING PATH','FROM DISCOVERY TO DELIVERY')}
<div class="process-layout"><div><h2 class="display section-heading dark">WORK THAT<br><span class="ink-green">HOLDS UP.</span></h2><p>We translate operational needs into concrete requirements, make considered technical decisions, build the result, and validate it against what was agreed.</p>{picture('p01-process',cls='process-side-art')}</div><div class="process-rows">{process_list}</div></div></div></section>'''+contact_cta

# CONTACT
contact=inner_hero('05','CONTACT','THE NEXT STEP<br><em>STARTS HERE.</em>','Have a software, automation or systems challenge? Start by outlining what you need to make work.','c01-contact-desktop','c02-contact-mobile')+f'''<section class="contact-main section-light"><div class="shell">{section_head('01','START A CONVERSATION','INQUIRIES')}
<div class="contact-layout"><div><h2 class="display section-heading dark">TELL US<br><span class="ink-green">THE PROBLEM.</span></h2><p>A useful first conversation begins with the work: who's involved, where things slow down, and what a better outcome would look like.</p><div class="contact-directions"><p class="mono">WHAT TO PREPARE</p><ul><li>The process or problem you're trying to improve</li><li>Who will use the system and where</li><li>Any deadlines, constraints or existing tools</li></ul></div></div>
<div class="form-shell"><div class="form-head"><span class="mono">NEW PROJECT INQUIRY</span><span class="mono">IN PREPARATION / 2026</span></div>
<form aria-describedby="contact-status"><fieldset disabled><label>YOUR NAME<input type="text" name="name" placeholder="Your name"></label><label>WORK EMAIL<input type="email" name="email" placeholder="name@organization.com"></label><label>WHAT ARE YOU WORKING ON?<textarea name="message" rows="5" placeholder="Tell us what needs to change..."></textarea></label><button class="button button-solid" type="submit">Send inquiry ↗</button></fieldset></form>
<p id="contact-status" class="form-notice" role="status">This inquiry form is being prepared and is not accepting messages yet. A verified company inbox and privacy information are required before activation.</p></div></div></div></section>'''

not_found=f'''<section class="notfound"><div class="shell"><p class="mono eyebrow">404 / PAGE NOT FOUND</p><h1 class="display">THIS PATH<br><em>DOESN'T EXIST.</em></h1><p>The link may be outdated, but the work continues.</p>{link('Return home','/','solid')}</div></section>'''

pages={
 '.':('Home','Custom software, automation, and connected digital systems built around the way businesses and organizations work.',home,'h01-hero-desktop'),
 'services':('Services','Custom software development, process automation, systems integration, and technical infrastructure support.',services,'s01-development'),
 'projects':('Project Thinking','Explore illustrative software and operations concepts. Verified client case studies pending publication approval.',projects,'w01-operations'),
 'about':('About Us','Kirjane IT Solutions builds software and connected systems with people and practical workflows at the center.',about,'a01-about'),
 'process':('Our Process','Discover, plan, develop, validate, deliver and support. Explore how Kirjane approaches engineering challenges.',process,'p01-process'),
 'contact':('Contact','Start with the problem to solve. Inquiry channel pending company verification.',contact,'c01-contact-desktop'),
}
for folder,(title,desc,content,preload) in pages.items():
    dest=ROOT if folder=='.' else ROOT/folder
    dest.mkdir(parents=True,exist_ok=True)
    (dest/'index.html').write_text(layout(title,title,desc,content,preload),encoding='utf-8')
(ROOT/'404.html').write_text(layout('404','Page Not Found','The requested page could not be found.',not_found),encoding='utf-8')
print('Generated:',*[str(x/'index.html') for x in (ROOT,*[ROOT/i for i in pages if i!='.'])],sep='\n')
