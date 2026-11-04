#!/usr/bin/env bash
# Print whether this repo publishes Pages from GitHub Actions.
# Writes ready=true|false and reason=... to GITHUB_OUTPUT when that file is set.
set -euo pipefail

if [[ -z "${GITHUB_REPOSITORY:-}" ]]; then
  echo "GITHUB_REPOSITORY is required" >&2
  exit 1
fi

err="$(mktemp)"
trap 'rm -f "$err"' EXIT

ready=false
reason="GitHub Pages is not enabled for this repository."

set +e
json="$(gh api "repos/${GITHUB_REPOSITORY}/pages" 2>"$err")"
code=$?
set -e

if [[ "$code" -ne 0 ]]; then
  if grep -Eq '404|Not Found' "$err"; then
    reason="GitHub Pages is not enabled for this repository."
  else
    echo "Could not read the Pages configuration:" >&2
    cat "$err" >&2
    exit 1
  fi
else
  build_type="$(jq -r '.build_type // empty' <<<"$json")"
  if [[ "$build_type" == "workflow" ]]; then
    ready=true
    reason="Pages source is GitHub Actions."
  else
    reason="Pages source is not GitHub Actions (build_type=${build_type:-unknown})."
  fi
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  {
    echo "ready=${ready}"
    echo "reason=${reason}"
  } >>"$GITHUB_OUTPUT"
fi

echo "$reason"
