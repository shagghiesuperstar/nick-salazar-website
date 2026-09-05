#!/usr/bin/env python3
"""Fetch index.html from the loopback server, extract every referenced local URL (src/href/poster/srcset,
CSS url() and @import in stylesheets, fonts), request each, and log status/size/content-type.
Also records the raw HTTP response head for / . Exit 1 on any non-200 or any external (non-loopback) reference."""
import re, sys, json, urllib.request, urllib.parse, datetime
from html.parser import HTMLParser
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8123/'
OUT = '/Users/scottscheferman/nick-salazar-website/analysis/verification/tests/http-check'
refs = set(); external = set()
class P(HTMLParser):
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for k in ('src', 'href', 'poster', 'data-src'):
            if a.get(k): refs.add((tag, a[k]))
        if a.get('srcset'):
            for part in a['srcset'].split(','): refs.add((tag, part.strip().split()[0]))
def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'http-check'})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read(); return r.status, r.headers.get('Content-Type'), len(body), body
    except urllib.error.HTTPError as e: return e.code, None, 0, b''
    except Exception as e: return f'ERR {e}', None, 0, b''
st, ct, n, body = get(BASE)
html = body.decode('utf-8', 'replace'); P().feed(html)
# stylesheet url()/@import
css_refs = set()
for tag, u in list(refs):
    if u.endswith('.css'):
        s2, c2, n2, b2 = get(urllib.parse.urljoin(BASE, u))
        for m in re.findall(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', b2.decode('utf-8', 'replace')): css_refs.add((f'css:{u}', urllib.parse.urljoin(u, m)))
        for m in re.findall(r'@import\s+(?:url\()?["\']([^"\']+)', b2.decode('utf-8', 'replace')): css_refs.add((f'css:{u}', urllib.parse.urljoin(u, m)))
refs |= css_refs
rows = []; bad = 0
for tag, u in sorted(refs, key=lambda x: x[1]):
    if u.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:')): continue
    pu = urllib.parse.urlparse(u)
    if pu.scheme in ('http', 'https') and not u.startswith(BASE): external.add((tag, u)); continue
    full = urllib.parse.urljoin(BASE, u.split('#')[0])
    s, c, n, _ = get(full); rows.append({'tag': tag, 'url': u, 'status': s, 'type': c, 'bytes': n})
    if s != 200: bad += 1
import subprocess
head = subprocess.run(['curl', '-sS', '-i', '--max-time', '20', BASE], capture_output=True, text=True).stdout.split('\r\n\r\n')[0]
rep = {'checked': datetime.datetime.now().astimezone().isoformat(), 'base': BASE, 'index_status': st, 'index_bytes': len(body), 'refs': rows, 'external_refs': sorted(external), 'non200': bad}
open(OUT+'.json', 'w').write(json.dumps(rep, indent=2))
with open(OUT+'.log', 'w') as f:
    f.write(f'# HTTP check {rep["checked"]} against {BASE}\n\n## Raw response head for /\n{head}\n\n## Referenced local resources ({len(rows)})\n')
    for r in rows: f.write(f"{r['status']}\t{r['bytes']:>9}\t{r['type']}\t{r['tag']}\t{r['url']}\n")
    f.write(f'\nnon-200: {bad}\nexternal (non-loopback) references: {len(external)}\n' + '\n'.join(f'  {t} {u}' for t, u in sorted(external)) + '\n')
print(open(OUT+'.log').read()); sys.exit(1 if (bad or external or st != 200) else 0)
