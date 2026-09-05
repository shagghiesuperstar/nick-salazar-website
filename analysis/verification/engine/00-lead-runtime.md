# Lead runtime evidence (captured 2026-09-04T22:35:25.699109-05:00)

## claude --version
2.1.261 (Claude Code)

## Lead process (ps -p $CLAUDE_PID)
```
  PID  PPID ELAPSED STAT COMMAND
39738 39737   04:28 Ss+  claude --model claude-fable-5-1 --effort high --permission-mode acceptEdits --name t_27ed7897 --settings {"teammateMode":"in-process"} Read BUILD-ORDER-t_27ed7897.md and execute it fully using genuine interactive communicating teammates, all Fable 5.1 High. No publish, no external send, original source read-only. Preserve runtime model/team/message evidence. Begin now.
```
Note: the command line shows `--model claude-fable-5-1 --effort high --settings {"teammateMode":"in-process"}` and the prompt passed as an interactive initial message (NOT `-p`). Parent is tmux session `cc-t_27ed7897`.

## Environment (non-secret keys only)
- CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
- CLAUDE_CODE_EFFORT_LEVEL=high
- CLAUDE_EFFORT=high
- CLAUDE_CODE_SUBAGENT_MODEL_FORCE=claude-fable-5-1
- CLAUDE_CODE_SESSION_ID=17191e92-ccb6-4682-8aa7-e34d8338f8e3
- CLAUDE_CODE_BRIDGE_SESSION_ID=session_01Br2rucqfysAmpuTK7RmdHD
- CLAUDE_PID=39738
- CLAUDE_CODE_ENTRYPOINT=cli
- CLAUDE_CODE_CHILD_SESSION=1

## Team config at session start (~/.claude/teams/session-17191e92/config.json)
```json
{
  "name": "session-17191e92",
  "createdAt": 1788579057235,
  "leadAgentId": "team-lead@session-17191e92",
  "leadSessionId": "17191e92-ccb6-4682-8aa7-e34d8338f8e3",
  "members": [
    {
      "agentId": "team-lead@session-17191e92",
      "name": "team-lead",
      "agentType": "team-lead",
      "joinedAt": 1788579057235,
      "tmuxPaneId": "leader",
      "cwd": "/Users/scottscheferman/nick-salazar-website",
      "subscriptions": [],
      "backendType": "in-process"
    }
  ]
}
```

## Docs recheck
https://code.claude.com/docs/en/agent-teams fetched in-session 2026-09-04: teammates require an interactive session (never `-p`); a named Agent call while `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` launches a teammate; team config lives at `~/.claude/teams/{session-<8>}/config.json`, inboxes at `inboxes/<agent>.json`, task list at `~/.claude/tasks/{team}/`; the team config dir is removed at session end (hence the snapshot loop below); `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` applies to teammates; teammates inherit the lead's effort.
