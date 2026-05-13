// Build a self-contained srt-t2s.html from OpenCC's TSCharacters.txt
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, 'TSCharacters.txt'), 'utf8');
const map = {};
for (const line of src.split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue;
  const [trad, simps] = line.split('\t');
  if (!trad || !simps) continue;
  const simp = simps.split(/\s+/)[0];
  if (trad !== simp) map[trad] = simp;
}
console.log('Mapping entries:', Object.keys(map).length);

const json = JSON.stringify(map);
fs.writeFileSync(path.join(__dirname, 't2s.json'), json, 'utf8');

const count = Object.keys(map).length;

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)">
<title>SRT 繁体转简体</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
    max-width: 720px;
    margin: 0 auto;
    padding: 16px 16px 80px;
    color: #222;
    background: #fff;
    line-height: 1.6;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  h1 { font-size: 18px; margin: 0 0 4px; font-weight: 600; }
  .hint { color: #888; font-size: 13px; margin-bottom: 16px; }
  .controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f5f7;
    border-radius: 10px;
  }
  .row { display: flex; gap: 10px; align-items: center; }
  .row label { font-size: 14px; color: #555; white-space: nowrap; }
  input[type="file"], select {
    font-size: 16px;
    padding: 8px;
    border: 1px solid #d0d0d0;
    border-radius: 6px;
    background: #fff;
    color: inherit;
    min-width: 0;
    flex: 1;
  }
  select { flex: 0 1 auto; }
  button {
    font-size: 15px;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    background: #2563eb;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
  }
  button:disabled { background: #b0b0b0; cursor: not-allowed; }
  button:active:not(:disabled) { background: #1d4ed8; }
  .status { font-size: 13px; color: #0a7; min-height: 18px; }
  .status.err { color: #c33; }
  .reader { display: none; }
  .reader.show { display: block; }
  .entry { margin: 0 0 16px; padding: 0 0 12px; border-bottom: 1px solid #eee; }
  .entry:last-child { border-bottom: none; }
  .time { font-size: 12px; color: #999; font-family: ui-monospace, Consolas, monospace; margin-bottom: 4px; }
  .text { font-size: 17px; line-height: 1.75; color: inherit; white-space: pre-wrap; word-break: break-word; }
  .toolbar {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-top: 1px solid #eee;
    display: none;
  }
  .toolbar.show { display: block; }
  .toolbar-inner { max-width: 720px; margin: 0 auto; }
  @media (prefers-color-scheme: dark) {
    body { background: #1a1a1a; color: #e5e5e5; }
    .controls { background: #2a2a2a; }
    input[type="file"], select { background: #1a1a1a; color: #e5e5e5; border-color: #444; }
    .entry { border-color: #2e2e2e; }
    .time { color: #777; }
    .hint { color: #888; }
    .toolbar { background: rgba(26,26,26,0.95); border-top-color: #2e2e2e; }
  }
</style>
</head>
<body>
  <h1>SRT 繁体转简体</h1>
  <div class="hint">本地转换,字典来自 OpenCC,共 ${count} 条字符映射</div>

  <div class="controls">
    <input type="file" id="file" accept=".srt,.txt,text/plain">
    <div class="row">
      <label for="encoding">源文件编码</label>
      <select id="encoding">
        <option value="utf-8">UTF-8</option>
        <option value="gbk">GBK</option>
        <option value="big5">Big5</option>
        <option value="utf-16">UTF-16</option>
      </select>
    </div>
    <div class="status" id="status"></div>
  </div>

  <div class="reader" id="reader"></div>

  <div class="toolbar" id="toolbar">
    <div class="toolbar-inner">
      <button id="download">下载简体 SRT</button>
    </div>
  </div>

<script>
const T2S = ${json};

function convert(text) {
  let out = '';
  for (const ch of text) out += T2S[ch] || ch;
  return out;
}

function parseSRT(text) {
  const entries = [];
  const blocks = text.replace(/\\r\\n?/g, '\\n').split(/\\n\\s*\\n/);
  const timeRe = /^(\\d{1,2}:\\d{2}:\\d{2}[,.]\\d{3})\\s*-->\\s*(\\d{1,2}:\\d{2}:\\d{2}[,.]\\d{3})/;
  for (const block of blocks) {
    const lines = block.split('\\n').map(s => s.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    let i = 0;
    if (/^\\d+$/.test(lines[0])) i = 1;
    let time = '';
    if (lines[i] && timeRe.test(lines[i])) {
      const m = lines[i].match(timeRe);
      time = m[1] + ' → ' + m[2];
      i++;
    }
    const textLines = lines.slice(i);
    if (textLines.length === 0) continue;
    entries.push({ time, text: textLines.join('\\n') });
  }
  return entries;
}

const fileInput = document.getElementById('file');
const encodingSel = document.getElementById('encoding');
const reader = document.getElementById('reader');
const status = document.getElementById('status');
const toolbar = document.getElementById('toolbar');
const downloadBtn = document.getElementById('download');

let convertedText = '';
let originalName = 'converted.srt';

function render(entries) {
  reader.innerHTML = '';
  const frag = document.createDocumentFragment();
  for (const e of entries) {
    const div = document.createElement('div');
    div.className = 'entry';
    if (e.time) {
      const t = document.createElement('div');
      t.className = 'time';
      t.textContent = e.time;
      div.appendChild(t);
    }
    const txt = document.createElement('div');
    txt.className = 'text';
    txt.textContent = e.text;
    div.appendChild(txt);
    frag.appendChild(div);
  }
  reader.appendChild(frag);
  reader.classList.add('show');
  toolbar.classList.add('show');
}

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  originalName = file.name.replace(/\\.srt$/i, '') + '.zh-CN.srt';
  status.className = 'status';
  status.textContent = '读取中…';
  try {
    const buf = await file.arrayBuffer();
    const decoder = new TextDecoder(encodingSel.value, { fatal: false });
    const text = decoder.decode(buf);
    convertedText = convert(text);
    const entries = parseSRT(convertedText);
    render(entries);
    status.textContent = '已加载 ' + entries.length + ' 条字幕';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    status.className = 'status err';
    status.textContent = '错误:' + err.message;
  }
});

downloadBtn.addEventListener('click', () => {
  if (!convertedText) return;
  const bom = '\\uFEFF';
  const blob = new Blob([bom + convertedText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = originalName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'srt-t2s.html'), html, 'utf8');
console.log('Wrote srt-t2s.html and t2s.json');
