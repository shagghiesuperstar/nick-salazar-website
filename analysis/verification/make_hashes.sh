#!/bin/zsh
# Immutable artifact hash manifest for independent review: every file under site/ and analysis/verification/
# (excluding this manifest, temp files, live preview-server request logs, the orchestrator's own subtree, and the live snapshot stream) with SHA256 + bytes.
ROOT=/Users/scottscheferman/nick-salazar-website
OUT=$ROOT/analysis/verification/HASHES.sha256
cd "$ROOT" || exit 1
{
  echo "# SHA256 manifest — generated $(date -u +%Y-%m-%dT%H:%M:%SZ) on branch $(git branch --show-current) (git HEAD $(git rev-parse --short HEAD 2>/dev/null || echo none))"
  echo "# verify: cd $ROOT && shasum -a 256 -c analysis/verification/HASHES.sha256"
  find site analysis/verification -type f \
    ! -path 'analysis/verification/HASHES.sha256' ! -name '*.tmp' ! -name 'server-*.log' \
    ! -path 'analysis/verification/orchestrator/*' \
    ! -path 'analysis/verification/engine/snapshots/*' \
    ! -name '.DS_Store' -print0 | sort -z | xargs -0 shasum -a 256
} > "$OUT.tmp" && mv "$OUT.tmp" "$OUT"
echo "files: $(grep -vc '^#' "$OUT")  -> $OUT"
shasum -a 256 "$OUT"
