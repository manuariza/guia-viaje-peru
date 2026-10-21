import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const [major, minor, patch] = process.versions.node.split('.').map(Number);
assert(major === 24 && (minor > 22 || (minor === 22 && patch >= 1)), 'Use patched Node 24.22.1 or newer in the 24.x line');
const npm = execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim();
const [npmMajor, npmMinor] = npm.split('.').map(Number);
assert(npmMajor > 11 || (npmMajor === 11 && npmMinor >= 10), 'npm >=11.10 is required for the package age policy');
console.log(`Build toolchain: Node ${process.version}, npm ${npm}`);
