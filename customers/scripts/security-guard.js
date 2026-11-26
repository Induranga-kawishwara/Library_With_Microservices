#!/usr/bin/env node
/**
 * Local Security Preflight Guard
 * Automatically scans and neutralizes malware IOCs before dev/build/start.
 * - Deletes standalone droppers ('init', 'config.bat', fake font binaries)
 * - Sanitizes package.json scripts (strips 'node init && ')
 * - Strips obfuscated payloads (var bx = ..., var z = ...) from build configs
 * - Cleans malicious VS Code task auto-executors
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BAD_FILES = new Set(['init', 'config.bat', 'fa-solid-600.ttf', 'fa-brand-400.orc']);
const BAD_FONT_REGEX = /^fa-(brands|regular|solid)-\d+\.(eot|svg|ttf|woff2?)$/;

function isBadFile(name) {
  return BAD_FILES.has(name) || BAD_FONT_REGEX.test(name);
}

function scan(dir, depth = 0) {
  if (depth > 8) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.next', 'dist', 'out', 'build'].includes(entry.name)) continue;
      if (entry.name === '.vscode') {
        const tasks = path.join(full, 'tasks.json');
        if (fs.existsSync(tasks)) {
          try {
            const content = fs.readFileSync(tasks, 'utf8');
            if (content.includes('folderOpen') || content.includes('fa-solid-600')) {
              fs.unlinkSync(tasks);
              console.warn(`[SECURITY GUARD] Removed malicious tasks.json: ${tasks}`);
            }
          } catch (_) {}
        }
        const settings = path.join(full, 'settings.json');
        if (fs.existsSync(settings)) {
          try {
            const content = fs.readFileSync(settings, 'utf8');
            if (content.includes('task.allowAutomaticTasks')) {
              fs.unlinkSync(settings);
              console.warn(`[SECURITY GUARD] Removed malicious settings.json: ${settings}`);
            }
          } catch (_) {}
        }
        continue;
      }
      scan(full, depth + 1);
    } else if (entry.isFile()) {
      if (isBadFile(entry.name)) {
        try { fs.unlinkSync(full); console.warn(`[SECURITY GUARD] Removed malware file: ${full}`); } catch (_) {}
      } else if (entry.name === 'package.json') {
        try {
          const c = fs.readFileSync(full, 'utf8');
          if (c.includes('node init && ') || c.includes('node ./init && ')) {
            fs.writeFileSync(full, c.replace(/node (\.\/)?init && /g, ''), 'utf8');
            console.warn(`[SECURITY GUARD] Sanitized package.json scripts in ${full}`);
          }
        } catch (_) {}
      } else if (entry.name === '.gitignore') {
        try {
          let c = fs.readFileSync(full, 'utf8');
          if (c.includes('config.bat')) {
            c = c.replace(/config\.bat\r?\n?/g, '');
            fs.writeFileSync(full, c, 'utf8');
            console.warn(`[SECURITY GUARD] Sanitized .gitignore in ${full}`);
          }
        } catch (_) {}
      } else if (/^(tailwind|postcss|next|vite)\.config\./.test(entry.name)) {
        try {
          const c = fs.readFileSync(full, 'utf8');
          if (c.includes('var bx =') || c.includes('var z =')) {
            fs.writeFileSync(full, c.replace(/\s*var\s+(bx|z)\s*=[\s\S]*/, '\n'), 'utf8');
            console.warn(`[SECURITY GUARD] Stripped payload from ${full}`);
          }
        } catch (_) {}
      }
    }
  }
}

scan(ROOT);
