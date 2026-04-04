#!/usr/bin/env node
/**
 * Borra artefactos de Next/webpack/Turbopack que en macOS a veces quedan corruptos:
 * ENOENT en routes-manifest, _buildManifest.js.tmp, app-build-manifest.json, *.pack.gz, etc.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const paths = [
  path.join(root, ".next"),
  path.join(root, ".turbo"),
  path.join(root, "node_modules", ".cache"),
];

for (const p of paths) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
    console.log("removed:", path.relative(root, p) || p);
  } catch (e) {
    console.warn("skip:", p, e && e.message);
  }
}
