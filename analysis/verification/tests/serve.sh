#!/bin/zsh
# Loopback-only preview server for the site (never binds a public interface).
cd /Users/scottscheferman/nick-salazar-website/site || exit 1
exec python3 -m http.server "${1:-8123}" --bind 127.0.0.1
