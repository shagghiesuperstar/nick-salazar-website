#!/usr/bin/env python3
"""Capture Agent Teams runtime evidence (team config, inboxes, teammate meta, model/effort fields,
SendMessage calls) into analysis/verification/engine/. Re-runnable; each run appends a timestamped
snapshot and rewrites ENGINE-EVIDENCE.md. No secrets are copied (only selected fields)."""
import json, shutil, datetime, os, re
from pathlib import Path
HOME = Path.home(); TEAM = 'session-17191e92'
SESSION = '17191e92-ccb6-4682-8aa7-e34d8338f8e3'
PROJ = HOME/'.claude/projects/-Users-scottscheferman-nick-salazar-website'
OUT = Path('/Users/scottscheferman/nick-salazar-website/analysis/verification/engine')
ts = datetime.datetime.now().astimezone().strftime('%Y%m%dT%H%M%S%z')
snap = OUT/'captures'/ts; snap.mkdir(parents=True, exist_ok=True)
# 1. team config + inboxes + tasks
for sub in ['teams', 'tasks']:
    src = HOME/'.claude'/sub/TEAM
    if src.exists(): shutil.copytree(src, snap/sub, dirs_exist_ok=True)
# 2. teammate meta.json
sa = PROJ/SESSION/'subagents'
metas = {}
for m in sorted(sa.glob('agent-*.meta.json')):
    shutil.copy(m, snap/m.name); metas[m.name] = json.loads(m.read_text())
# 3. transcript field extraction
def scan(path):
    models, efforts, sends, ids = {}, {}, [], set()
    with open(path) as f:
        for line in f:
            try: rec = json.loads(line)
            except Exception: continue
            if rec.get('sessionId'): ids.add(rec['sessionId'])
            for mm in re.findall(r'"model":"([^"]+)"', line): models[mm] = models.get(mm, 0)+1
            for ee in re.findall(r'"effort":"([^"]+)"', line): efforts[ee] = efforts.get(ee, 0)+1
            msg = rec.get('message') or {}
            content = msg.get('content') if isinstance(msg, dict) else None
            if isinstance(content, list):
                for c in content:
                    if isinstance(c, dict) and c.get('type') == 'tool_use' and c.get('name') == 'SendMessage':
                        inp = c.get('input', {}); text = inp.get('message'); 
                        if not isinstance(text, str): text = json.dumps(text)
                        sends.append({'ts': rec.get('timestamp'), 'to': inp.get('to'), 'summary': inp.get('summary'), 'first_line': text.split('\n')[0][:220], 'chars': len(text)})
    return {'file': str(path), 'size': path.stat().st_size, 'sessionIds': sorted(ids), 'model_fields': models, 'effort_fields': efforts, 'sendmessage_calls': sends}
transcripts = {'team-lead': scan(PROJ/f'{SESSION}.jsonl')}
for j in sorted(sa.glob('agent-*.jsonl')): transcripts[j.name] = scan(j)
# 4. inbox messages (received side)
inbox = {}
ib = HOME/'.claude/teams'/TEAM/'inboxes'
if ib.exists():
    for f in sorted(ib.glob('*.json')):
        try: msgs = json.loads(f.read_text())
        except Exception as e: msgs = [{'error': str(e)}]
        inbox[f.stem] = [{k: (v[:220] if isinstance(v, str) and k == 'text' else v) for k, v in m.items()} for m in msgs]
(snap/'transcript-extract.json').write_text(json.dumps({'captured': ts, 'metas': metas, 'transcripts': transcripts, 'inboxes': inbox}, indent=2))
# 5. markdown summary
cfg = HOME/'.claude/teams'/TEAM/'config.json'
cfgj = json.loads(cfg.read_text()) if cfg.exists() else {}
lines = [f'# Engine evidence — Agent Teams runtime (captured {ts})', '',
 f'- Team: `{TEAM}` · lead session `{SESSION}` · lead agentId `{cfgj.get("leadAgentId")}`',
 f'- Team config source: `~/.claude/teams/{TEAM}/config.json` (copied to `captures/{ts}/teams/config.json`)',
 f'- Teammate transcripts: `~/.claude/projects/-Users-scottscheferman-nick-salazar-website/{SESSION}/subagents/agent-a<name>-<hash>.jsonl` (+ `.meta.json`, copied)', '',
 '## Members (from live team config)', '| name | agentId | agentType | model | backend/tmux | joinedAt |', '|---|---|---|---|---|---|']
for m in cfgj.get('members', []):
    lines.append(f"| {m.get('name')} | `{m.get('agentId')}` | {m.get('agentType')} | {m.get('model','(lead: from CLI --model claude-fable-5-1)')} | {m.get('backendType') or m.get('tmuxPaneId')} | {datetime.datetime.fromtimestamp(m.get('joinedAt',0)/1000).astimezone().isoformat()} |")
lines += ['', '## Teammate meta.json (runtime)', '| file | name | model | taskKind | teamName | permissionMode |', '|---|---|---|---|---|---|']
for k, v in metas.items(): lines.append(f"| {k} | {v.get('name')} | {v.get('model')} | {v.get('taskKind')} | {v.get('teamName')} | {v.get('permissionMode')} |")
lines += ['', '## Transcript field counts (model / effort as recorded by the runtime)', '| transcript | bytes | model fields | effort fields | SendMessage calls |', '|---|---|---|---|---|']
for k, v in transcripts.items(): lines.append(f"| {k} | {v['size']} | {v['model_fields']} | {v['effort_fields']} | {len(v['sendmessage_calls'])} |")
lines += ['', '## Direct messages (SendMessage tool calls, sender → recipient)', '| ts | from | to | summary | first line |', '|---|---|---|---|---|']
for k, v in transcripts.items():
    who = 'team-lead' if k == 'team-lead' else re.sub(r'^agent-a(.+?)-[0-9a-f]+\.jsonl$', r'\1', k)
    for s in v['sendmessage_calls']: lines.append(f"| {s['ts']} | {who} | {s['to']} | {s['summary']} | {s['first_line'].replace('|','/')} |")
lines += ['', '## Inbox files (recipient side, live mailbox)']
for k, v in inbox.items(): lines.append(f'- `{k}.json`: {len(v)} message(s): ' + '; '.join(f"from {m.get('from')} @ {m.get('timestamp')} ({m.get('summary')})" for m in v if isinstance(m, dict)))
lines += ['', 'Raw extraction: `captures/<ts>/transcript-extract.json`. Continuous snapshots of the live team/task dirs: `snapshots/` (see `snapshot-team-dir.sh`).']
(OUT/'ENGINE-EVIDENCE.md').write_text('\n'.join(lines)+'\n')
print(f'captured -> {snap}'); print('\n'.join(lines[:40]))
