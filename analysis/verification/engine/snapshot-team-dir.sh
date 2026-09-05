#!/bin/zsh
# Snapshots the live Agent Teams runtime dirs every 5s while they change, so message/config evidence survives session-end cleanup.
TEAM=session-17191e92
SRC_T=$HOME/.claude/teams/$TEAM
SRC_K=$HOME/.claude/tasks/$TEAM
DST=/Users/scottscheferman/nick-salazar-website/analysis/verification/engine/snapshots
mkdir -p "$DST"
last=""
while true; do
  sig=$( { find "$SRC_T" "$SRC_K" -type f -exec stat -f '%N %m %z' {} + 2>/dev/null; } | sort | shasum | cut -c1-12)
  if [[ "$sig" != "$last" ]]; then
    ts=$(date +%Y%m%dT%H%M%S)
    mkdir -p "$DST/$ts"
    cp -R "$SRC_T" "$DST/$ts/teams" 2>/dev/null
    cp -R "$SRC_K" "$DST/$ts/tasks" 2>/dev/null
    echo "$ts $sig" >> "$DST/snapshot.log"
    last="$sig"
  fi
  sleep 5
done
