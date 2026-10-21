#!/usr/bin/env bash
# Use the reviewed stable Node build for installs/builds, including Vercel.
# This does not change Vercel's separately managed function runtime.
set -euo pipefail
version=24.22.1
if [[ "$(node --version 2>/dev/null || true)" == "v$version" ]]; then
  exec "$@"
fi
case "$(uname -s)-$(uname -m)" in
  Linux-x86_64) platform=linux-x64; checksum=eb6728e77c576a35162c122c45ccadf224d89ff00abc8dae46cc2897c6002d7c ;;
  Darwin-arm64) platform=darwin-arm64; checksum=89c682593d76cd44233fa53b1563264e7de9cbb189cad169135c5b4fadfbc0a7 ;;
  *) echo 'Install Node 24.22.1 for this platform before continuing.' >&2; exit 1 ;;
esac
root="$(cd "$(dirname "$0")/.." && pwd)"
tool="$root/.security-tools/node-v$version-$platform"
if [[ ! -x "$tool/bin/node" ]]; then
  mkdir -p "$root/.security-tools"
  tmp="$(mktemp -d "$root/.security-tools/download.XXXXXX")"
  trap 'rm -rf "$tmp"' EXIT
  curl --fail --location --silent --show-error --proto '=https' --tlsv1.2 \
    "https://nodejs.org/dist/v$version/node-v$version-$platform.tar.gz" -o "$tmp/node.tar.gz"
  if command -v sha256sum >/dev/null; then
    actual="$(sha256sum "$tmp/node.tar.gz" | cut -d ' ' -f 1)"
  else
    actual="$(shasum -a 256 "$tmp/node.tar.gz" | cut -d ' ' -f 1)"
  fi
  [[ "$actual" == "$checksum" ]] || { echo 'Node checksum mismatch' >&2; exit 1; }
  tar -xzf "$tmp/node.tar.gz" -C "$tmp"
  mv "$tmp/node-v$version-$platform" "$tool"
  rm -rf "$tmp"
  trap - EXIT
fi
[[ "$("$tool/bin/node" --version)" == "v$version" ]]
export PATH="$tool/bin:$PATH"
exec "$@"
