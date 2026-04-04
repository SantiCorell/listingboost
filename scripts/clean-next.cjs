#!/usr/bin/env node
/**
 * Borra artefactos de Next/webpack que en macOS a veces quedan corruptos
 * (ENOENT en routes-manifest, fallos al renombrar *.pack.gz en .next/cache).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const paths = [
  path.join(root, ".next"),
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
