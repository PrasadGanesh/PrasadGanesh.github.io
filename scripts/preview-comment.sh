#!/usr/bin/env bash
# Create or update the sticky preview comment on a pull request.
set -euo pipefail

: "${GH_TOKEN:?}"
: "${GITHUB_REPOSITORY:?}"
: "${PR_NUMBER:?}"
: "${STATUS:?}"

if ! [[ "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
  echo "Bad pull request number: $PR_NUMBER" >&2
  exit 1
fi

origin="$(node --input-type=module -e "import { siteOrigin } from './site-origin.mjs'; console.log(siteOrigin)")"
url="${origin}/pr-${PR_NUMBER}/"
marker="<!-- pages-preview -->"

setup="$(cat <<EOF
### One-time step

Open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

That is the only required click. No secret is used.

- A push to \`master\` publishes ${origin}/
- A pull request from this repository publishes ${url}

The publish workflow runs from \`master\`, so the link stays a 404 until this workflow is on \`master\` and the Pages source is GitHub Actions. Fork pull requests are not published.
EOF
)"

case "$STATUS" in
  published)
    sha_line=""
    if [[ -n "${SHA:-}" ]]; then
      sha_line=" from \`${SHA}\`"
    fi
    body="$(printf '**Preview:** %s\n\nPublished%s.\n\n%s\n' "$url" "$sha_line" "$marker")"
    ;;
  removed)
    body="$(printf 'Preview removed. %s is deleted on the next publish.\n\n%s\n' "$url" "$marker")"
    ;;
  fork)
    body="$(printf 'No preview was published. Previews are only built for pull requests opened from %s, because publishing a fork would put that HTML on the public site.\n\n%s\n' "$GITHUB_REPOSITORY" "$marker")"
    ;;
  built)
    if [[ "${PAGES_READY:-false}" == "true" ]]; then
      body="$(printf '**Preview:** %s\n\nThe build succeeded. Publishing runs from \`master\` and deploys this URL onto GitHub Pages.\n\n%s\n\n%s\n' "$url" "$setup" "$marker")"
    else
      body="$(printf '**Preview:** %s\n\nThe build succeeded. Publishing is skipped until the Pages source is GitHub Actions, so this URL is not live yet.\n\n%s\n\n%s\n' "$url" "$setup" "$marker")"
    fi
    ;;
  *)
    echo "Unknown STATUS=$STATUS" >&2
    exit 1
    ;;
esac

comment_id="$(
  gh api "repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments?per_page=100" \
    --jq ".[] | select(.body | contains(\"${marker}\")) | .id" | head -n 1
)"

if [[ -n "$comment_id" ]]; then
  gh api --method PATCH "repos/${GITHUB_REPOSITORY}/issues/comments/${comment_id}" -f body="$body" >/dev/null
else
  gh api --method POST "repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments" -f body="$body" >/dev/null
fi

echo "Updated preview comment on #${PR_NUMBER}"
