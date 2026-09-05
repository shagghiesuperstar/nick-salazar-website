#!/bin/zsh
# Lead test runner: loopback server → HTTP check → static audit → browser suite → scroll video mp4. Logs everything raw.
set -u
ROOT=/Users/scottscheferman/nick-salazar-website
T=$ROOT/analysis/verification/tests
TS=$(date +%Y%m%dT%H%M%S)
PORT=${PORT:-8123}
LOG=$T/run-$TS.log
exec > >(tee -a "$LOG") 2>&1
echo "== run_all $TS =="
# server (loopback only)
SPID=""
if curl -s -o /dev/null http://127.0.0.1:$PORT/; then echo "reusing existing loopback server on $PORT (not started by this runner)"; else
  zsh "$T/serve.sh" $PORT > "$T/server-$TS.log" 2>&1 &
  SPID=$!; echo "server pid $SPID"
  for i in {1..30}; do curl -s -o /dev/null http://127.0.0.1:$PORT/ && break; sleep 0.3; done
fi
echo "--- listening sockets for $PORT (must be 127.0.0.1 only)"; lsof -nP -iTCP:$PORT -sTCP:LISTEN
echo "--- HTTP check"; python3 "$T/http_check.py" http://127.0.0.1:$PORT/; echo "http_check exit=$?"
echo "--- static audit"; python3 "$T/static_audit.py"; echo "static_audit exit=$?"
echo "--- browser suite"; NODE_PATH=/Users/scottscheferman/.hermes/hermes-agent/node_modules node "$T/browser_suite.mjs" http://127.0.0.1:$PORT/; echo "browser_suite exit=$?"
VP=$(cat "$ROOT/analysis/verification/browser/scroll-video-path.txt" 2>/dev/null)
if [[ -n "$VP" && -f "$VP" ]]; then ffmpeg -y -loglevel error -i "$VP" -vf "scale=1280:-2" -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p "$ROOT/analysis/verification/browser/scroll-capture-1440.mp4" && ls -la "$ROOT/analysis/verification/browser/scroll-capture-1440.mp4"; fi
if [[ -n "$SPID" ]]; then kill $SPID 2>/dev/null; wait $SPID 2>/dev/null; echo "server stopped"; else echo "left existing server running"; fi
echo "== done $TS =="
