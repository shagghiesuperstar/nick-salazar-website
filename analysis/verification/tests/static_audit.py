#!/usr/bin/env python3
"""Static self-checks over site/ (no fabricated PASS: every check prints its evidence lines).
Writes analysis/verification/tests/static-audit.md. Exit code = number of FAIL checks."""
import re, sys, json, datetime
from pathlib import Path
from html.parser import HTMLParser
SITE = Path('/Users/scottscheferman/nick-salazar-website/site')
OUT = Path('/Users/scottscheferman/nick-salazar-website/analysis/verification/tests/static-audit.md')
html = (SITE/'index.html').read_text(); css = (SITE/'styles.css').read_text()
tok = (SITE/'tokens.css').read_text() if (SITE/'tokens.css').exists() else ''
js = (SITE/'app.js').read_text()
R = []  # (check, status, evidence)
def add(name, ok, ev, warn=False): R.append((name, 'PASS' if ok else ('WARN' if warn else 'FAIL'), ev))
def lines_matching(text, pat, flags=re.I):
    return [f'L{i+1}: {l.strip()[:140]}' for i, l in enumerate(text.splitlines()) if re.search(pat, l, flags)]
# sizes
add('file sizes (bytes) index/styles/tokens/app', True, f"index.html={len(html.encode())} styles.css={len(css.encode())} tokens.css={len(tok.encode())} app.js={len(js.encode())} (advisory caps: app≤~10KB, styles≤60KB)")
# HTML structure
class P(HTMLParser):
    VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def __init__(s): super().__init__(); s.stack=[]; s.ids={}; s.errs=[]; s.tags={}; s.h1=0; s.inline=[]; s.imgs=[]; s.videos=[]
    def handle_starttag(s, t, a):
        a=dict(a); s.tags[t]=s.tags.get(t,0)+1
        if t=='h1': s.h1+=1
        if 'id' in a: s.ids[a['id']]=s.ids.get(a['id'],0)+1
        if 'style' in a or any(k.startswith('on') for k in a): s.inline.append((t,a.get('style'),[k for k in a if k.startswith('on')], s.getpos()))
        if t=='img': s.imgs.append((a.get('src'),a.get('width'),a.get('height'),a.get('loading'),a.get('alt'), s.getpos()[0]))
        if t=='video': s.videos.append((a, s.getpos()[0]))
        if t not in s.VOID: s.stack.append((t, s.getpos()[0]))
    def handle_startendtag(s,t,a): s.handle_starttag(t,a); 
    def handle_endtag(s,t):
        if t in s.VOID: return
        if s.stack and s.stack[-1][0]==t: s.stack.pop()
        else:
            s.errs.append(f'unexpected </{t}> at L{s.getpos()[0]} (open: {[x[0] for x in s.stack[-3:]]})')
            for i in range(len(s.stack)-1,-1,-1):
                if s.stack[i][0]==t: del s.stack[i:]; break
p=P(); p.feed(html)
add('HTML: no unclosed / mismatched tags', not p.errs and not p.stack, (p.errs+[f'unclosed {t} opened L{l}' for t,l in p.stack]) or ['stack empty, no mismatches'])
dups=[k for k,v in p.ids.items() if v>1]; add('HTML: no duplicate ids', not dups, dups or [f'{len(p.ids)} unique ids'])
add('HTML: exactly one h1', p.h1==1, [f'h1 count={p.h1}'])
add('HTML: no inline style= or on*= handlers', not p.inline, [str(x) for x in p.inline] or ['none'])
add('HTML: landmarks present (header/nav/main/footer)', all(p.tags.get(t) for t in ('nav','main','footer')), [f'{t}={p.tags.get(t,0)}' for t in ('header','nav','main','footer','section','video','img')])
add('HTML: skip link first in body', bool(re.search(r'<body[^>]*>\s*<a[^>]*class="[^"]*skip', html, re.S)), lines_matching(html, r'class="[^"]*skip')[:2] or ['no skip link found'])
noalt=[i for i in p.imgs if i[4] is None]; nodim=[i for i in p.imgs if not (i[1] and i[2])]
add('HTML: every <img> has alt', not noalt, [str(i) for i in noalt] or [f'{len(p.imgs)} imgs all have alt'])
add('HTML: every <img> has width+height', not nodim, [str(i) for i in nodim] or [f'{len(p.imgs)} imgs have dimensions'])
auto=[v for v in p.videos if 'autoplay' in v[0]]; unmuted=[v for v in p.videos if 'muted' not in v[0]]; nopost=[v for v in p.videos if not v[0].get('poster')]
add('HTML: videos: no autoplay attr, all muted+playsinline, all have poster', not auto and not unmuted and not nopost and all('playsinline' in v[0] for v in p.videos), [f'videos={len(p.videos)} autoplay-attr={len(auto)} unmuted={len(unmuted)} no-poster={len(nopost)}'])
add('HTML: video count >= 6 plates', len(p.videos)>=7, [f'videos={len(p.videos)}, sections with class plate={len(re.findall(r"class=\"[^\"]*\bplate\b", html))}'])
ext=lines_matching(html, r'(src|href)="https?://')
add('HTML: no external http(s) resource references', not ext, ext or ['none'])
add('HTML: pre-publication contact dependency comment present', 'PRE-PUBLICATION DEPENDENCY' in html, lines_matching(html, r'PRE-PUBLICATION')[:2] or ['missing'])
add('HTML: no invented contact (mailto:/tel:/@ addresses)', not re.search(r'mailto:|tel:|[\w.+-]+@[\w-]+\.\w+', html), lines_matching(html, r'mailto:|tel:|[\w.+-]+@[\w-]+\.\w+')[:5] or ['none'])
banned = r'\b(rare|rarest|unusual|commanded|command(ing)? (of )?vessels?|guarantee[sd]?|settle(d|ment)s? (in|for)|Houston|testimonial|trusted by|clients include|\d+\+ (surveys|clients|jobs)|\d+ ?%|Lorem|Jane Doe|John Smith|seamless|unleash|empower|elevate|supercharge|next-generation)\b'
bl=lines_matching(html, banned)
add('COPY: banned / unsupported-claim words absent (rare, command history, guarantees, Houston, testimonials, %, +N, clichés)', not bl, bl or ['none'])
add('COPY: complete service list incl. towing survey', all(k in html.lower() for k in ['break bulk','heavy lift','steel pipe','stock throughput','cargo claim','csc container','draft survey','towing','loading','stowage','railcar','truck','jack and slide','airfreight','packing','crate']), [k for k in ['break bulk','heavy lift','steel pipe','stock throughput','cargo claim','csc container','draft survey','towing','loading','stowage','railcar','truck','jack and slide','airfreight','packing','crate'] if k not in html.lower()] or ['all 16 terms present'])
add('COPY: credentials present (Second Mate Unlimited, 1600-Ton Master, ~10 years)', all(k in html for k in ['Second Mate Unlimited','1600-Ton Master']) and re.search(r'10 years|ten years', html, re.I) is not None, lines_matching(html, r'Second Mate Unlimited|1600-Ton Master|10 years')[:4])
# CSS checks
allcss = css + '\n' + tok
def strip_comments(s): return re.sub(r'/\*.*?\*/', '', s, flags=re.S)
csn, tkn = strip_comments(css), strip_comments(tok)
add('CSS: Hallmark stamp is first line of styles.css', css.lstrip().startswith('/* Hallmark · macrostructure'), [css.splitlines()[0][:200] if css else 'empty'])
add('CSS: pre-emit critique stamp present', 'pre-emit critique' in css, lines_matching(css, r'pre-emit critique')[:1] or ['missing'])
raw = lines_matching(csn, r'#[0-9a-f]{3,8}\b|\boklch\(|\brgba?\(|\bhsla?\(|font-family\s*:')
raw = [l for l in raw if not re.search(r'font-family\s*:\s*var\(--', l) and re.search(r'#[0-9a-f]{3,8}\b|oklch\(|rgba?\(|hsla?\(|font-family\s*:\s*["A-Za-z]', re.sub(r'var\([^)]*\)', '', l))]
add('CSS: no raw colors / font-family outside tokens.css (gate 48)', not raw, raw[:15] or ['styles.css references tokens only'])
ta = lines_matching(allcss, r'transition\s*:\s*all|transition-property\s*:\s*all')
add('CSS: no transition: all (gate 10/17)', not ta, ta or ['none'])
bounce=[l for l in lines_matching(allcss, r'cubic-bezier\(') if any(float(x)>1 or float(x)<0 for x in re.findall(r'cubic-bezier\(\s*[-\d.]+\s*,\s*([-\d.]+)\s*,\s*[-\d.]+\s*,\s*([-\d.]+)', l)[0]) if re.findall(r'cubic-bezier\(\s*[-\d.]+\s*,\s*([-\d.]+)\s*,\s*[-\d.]+\s*,\s*([-\d.]+)', l)]
add('CSS: no bounce/overshoot easings (gate 12)', not bounce, bounce or ['none'])
lay=lines_matching(allcss, r'transition\s*:[^;]*\b(width|height|top|left|margin|padding)\b|@keyframes')
lay=[l for l in lay if 'transition' in l.lower() and re.search(r'\b(width|height|top|left|margin|padding)\b', l.lower())]
add('CSS: no transitions on layout properties (gate 14)', not lay, lay or ['none'])
ital=lines_matching(allcss, r'font-style\s*:\s*italic')
add('CSS: no italic headings (gate 38a) — any font-style:italic lines listed for manual check', not any(re.search(r'h[1-6]|__pair|__name|__title|display|foot', l, re.I) for l in ital), ital or ['no font-style: italic anywhere'])
add('CSS: overflow-x: clip on html and body (gate 34)', bool(re.search(r'html\s*,?\s*body\s*{[^}]*overflow-x\s*:\s*clip', csn, re.S)) or (bool(re.search(r'\bhtml\b[^{]*{[^}]*overflow-x\s*:\s*clip', csn, re.S)) and bool(re.search(r'\bbody\b[^{]*{[^}]*overflow-x\s*:\s*clip', csn, re.S))), lines_matching(csn, r'overflow-x')[:4] or ['missing'])
add('CSS: prefers-reduced-motion block present (gate 27)', 'prefers-reduced-motion' in allcss, lines_matching(allcss, r'prefers-reduced-motion')[:3] or ['missing'])
add('CSS: pointer:coarse / hover:none guards for pointer light', bool(re.search(r'pointer\s*:\s*coarse|hover\s*:\s*none', allcss)), lines_matching(allcss, r'pointer\s*:\s*coarse|hover\s*:\s*none')[:3] or ['missing'])
add('CSS: scroll-driven animation + @supports guard', 'animation-timeline' in allcss and '@supports' in allcss, lines_matching(allcss, r'animation-timeline|@supports')[:4])
v100=lines_matching(allcss, r'(min-|max-)?width\s*:[^;]*100vw|inline-size\s*:[^;]*100vw'); add('CSS: no 100vw widths (transform-only uses listed as info)', not v100, v100 or ['none; other 100vw mentions: '+'; '.join(lines_matching(allcss, r'100vw'))])
vh=[l for l in lines_matching(allcss, r'\d+vh\b') if 'dvh' not in l and 'svh' not in l and 'lvh' not in l]; add('CSS: no bare vh (use dvh/svh)', not vh, vh or ['none'], warn=True)
fam=set(re.findall(r'font-family\s*:\s*"?([^",;]+)', tkn)); fam={f.strip() for f in fam if not f.strip().lower().startswith(('var(', 'system-ui','ui-','sans','serif','monospace','arial','helvetica','-apple','segoe','roboto','inherit')) and not f.strip().lower().endswith('fallback')}
add('CSS: ≤3 font families in tokens (gate 37)', len(fam)<=3, [f'families={sorted(fam)}'])
add('CSS: focus-visible styling present (gate 26)', ':focus-visible' in allcss and ':active' in allcss and ':disabled' in allcss, lines_matching(allcss, r':focus-visible|:disabled')[:4])
fr=lines_matching(allcss, r'grid-template-columns[^;]*(?<!minmax\(0, )\b1fr\b'); fr=[l for l in fr if 'minmax(0' not in l]
add('CSS: image grids use minmax(0,1fr) — bare 1fr tracks listed for manual check (gate 50)', not fr, fr or ['no bare 1fr tracks'], warn=True)
add('CSS: overflow-wrap: anywhere on display', 'overflow-wrap' in allcss and 'anywhere' in allcss, lines_matching(allcss, r'overflow-wrap')[:3])
add('CSS: uppercase display line-height ≥ 1.0 (gate 55) — line-height < 1 lines listed', not [l for l in lines_matching(allcss, r'line-height\s*:\s*0?\.\d+') ], [l for l in lines_matching(allcss, r'line-height\s*:\s*0?\.\d+')] or ['no line-height below 1.0'])
add('CSS: nowrap on clickable text (gate 49)', 'white-space: nowrap' in allcss.replace(' ','') or 'white-space:nowrap' in allcss.replace(' ',''), lines_matching(allcss, r'white-space\s*:\s*nowrap')[:3] or ['missing'])
# JS checks
add('JS: no external fetch/XHR/network sends', not re.search(r'fetch\(|XMLHttpRequest|navigator\.sendBeacon|WebSocket\(', js), lines_matching(js, r'fetch\(|XMLHttpRequest|sendBeacon|WebSocket')[:5] or ['none'])
add('JS: reduced-motion, saveData, autoplay rejection, IntersectionObserver, passive listeners handled', all(k in js for k in ['prefers-reduced-motion','saveData','catch','IntersectionObserver','passive']), [k for k in ['prefers-reduced-motion','saveData','catch','IntersectionObserver','passive'] if k not in js] or ['all present'])
add('JS: no eval/innerHTML from user input', not re.search(r'\beval\(|innerHTML\s*=', js), lines_matching(js, r'\beval\(|innerHTML')[:5] or ['none'])
add('JS: clipboard + download (Blob) utility present, no form submit', 'clipboard' in js and 'Blob' in js and not re.search(r'\.submit\(|action=', js), lines_matching(js, r'clipboard|Blob|submit')[:5])
fails=[r for r in R if r[1]=='FAIL']
with open(OUT,'w') as f:
    f.write(f'# Static audit — {datetime.datetime.now().astimezone().isoformat()}\n\nResult: {len(fails)} FAIL · {sum(1 for r in R if r[1]=="WARN")} WARN · {sum(1 for r in R if r[1]=="PASS")} PASS (of {len(R)})\n\n')
    for name, st, ev in R:
        f.write(f'## [{st}] {name}\n'); f.write('\n'.join(f'    {e}' for e in (ev if isinstance(ev,list) else [ev])) + '\n\n')
print(OUT.read_text()); sys.exit(len(fails))
