#!/usr/bin/env python3
"""Re-run the copy-integrity sweeps on site/index.html and locate every phrase quoted in copy-audit.md.
Usage: python3 analysis/verification/copy/check-copy.py   (from the repo root)
Exit code 1 if any structural check or hard forbidden term fails."""
import re, sys, subprocess, collections
from pathlib import Path
from html.parser import HTMLParser
ROOT = Path(__file__).resolve().parents[3]
html_path = ROOT / 'site' / 'index.html'
src = html_path.read_text(encoding='utf-8')
lines = src.splitlines()
fail = False

# 1. structure
VOID = {'meta','link','img','source','br','hr','input','wbr'}
class P(HTMLParser):
    def __init__(s): super().__init__(); s.stack=[]; s.ids=collections.Counter(); s.errs=[]; s.heads=[]
    def handle_starttag(s,t,a):
        d=dict(a)
        if 'id' in d: s.ids[d['id']]+=1
        if t in ('h1','h2','h3','h4','h5','h6'): s.heads.append(int(t[1]))
        if t not in VOID: s.stack.append(t)
    def handle_endtag(s,t):
        if not s.stack or s.stack[-1]!=t: s.errs.append(f'mismatch </{t}> stack={s.stack[-3:]}')
        else: s.stack.pop()
p=P(); p.feed(src)
dups=[k for k,v in p.ids.items() if v>1]
jumps=[(a,b) for a,b in zip(p.heads,p.heads[1:]) if b>a+1]
print('STRUCTURE unclosed=%s mismatches=%s dup_ids=%s h1_count=%d heading_jumps=%s' % (p.stack,p.errs,dups,p.heads.count(1),jumps))
if p.stack or p.errs or dups or p.heads.count(1)!=1 or jumps: fail=True
if re.search(r' on[a-z]+="|style=|<font', src): print('INLINE STYLE/HANDLER FOUND'); fail=True

# 2. forbidden terms (hard = must be 0)
hard = ['rare','unusual','command','guarantee','settle','Houston','@','testimonial','trusted by','years of','%','+','seamless','unleash','empower','elevate','NAMS','accredit','decade','most surveyors','responsib','liab','who pays','resolve','decide','authori','unrestricted','dispute','blame','Hargis','Harris','Seacom','Bahri','WFS','SIDA','CNEU','DOL 3796','Sabine','Apex','Lone Star']
soft = {'phone':'allowed only inside the PRE-PUBLICATION DEPENDENCY comment','insur':'allowed only in the general stock-throughput description','endorse':'allowed only as "endorsements and limitations" in the two license-scope sentences (team-lead wording)'}
low = src.lower()
for t in hard:
    n = low.count(t.lower())
    if t in ('CAI','SAMS'): continue
    print(f'HARD {t!r}: {n}'); 
    if n: fail=True
for t in ('CAI','SAMS'):
    n = len(re.findall(r'\b'+t+r'\b', src)); print(f'HARD (whole word) {t!r}: {n}');
    if n: fail=True
for t,why in soft.items():
    hits=[i+1 for i,l in enumerate(lines) if t.lower() in l.lower()]
    print(f'SOFT {t!r}: lines {hits} — {why}')
digits=[i+1 for i,l in enumerate(lines) if re.search(r'[0-9]',l) and not re.search(r'assets/|width=|height=|rows=|data-plate=|<!-- [0-9]+\.|</?h[1-6]',l)]
print('DIGIT lines:', digits)

# 3. locate audit phrases
audit = (ROOT/'analysis/verification/copy/copy-audit.md').read_text(encoding='utf-8')
quoted = re.findall(r'"([^"\n]{12,})"', audit)
missing=[]
for q in quoted:
    q2 = q.replace('…','').strip()
    frag = q2.split('…')[0][:60]
    if frag and frag not in src: missing.append(q)
print('AUDIT phrases checked:', len(quoted), 'not found verbatim:', len(missing))
for m in missing: print('   ~', m[:90])
sys.exit(1 if fail else 0)
