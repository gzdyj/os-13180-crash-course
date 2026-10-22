const fs=require('fs'),path=require('path');
const root=__dirname;
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const js=['data.js','engines.js','app.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const html=`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#294f40"><meta name="description" content="湖北自考13180操作系统两天冲刺：核心考点、选择练习、算法步骤、简答默写和错题复练。离线可用。"><title>13180 操作系统 · 两天冲刺</title><style>${css}</style></head>
<body><div class="app"><aside class="sidebar"><div class="brand"><div class="brand-icon" aria-hidden="true">▥</div><div><b>两天冲刺</b><span>OS / 13180</span></div></div><div class="nav-label">学习工作台</div><nav class="nav" id="nav" aria-label="学习导航"></nav><div class="side-footer"><div class="side-note"><span class="side-dot"></span>先理解，再练习，再回忆。<p class="tiny" style="margin-top:10px">湖北自考本科 · 操作系统<br>2023 年版教材 · 八章覆盖</p></div></div></aside><div class="workspace"><header class="topbar"><div class="breadcrumb">学习工作台 <span style="margin:0 9px">/</span> <strong id="crumb">今日冲刺</strong></div><div class="timer"><span class="tiny muted">专注</span><span class="timer-time mono" id="focus-clock">25:00</span><button data-action="timer-toggle" id="timer-toggle">开始</button><button data-action="timer-reset" aria-label="重置专注计时">↻</button></div></header><main class="main"><div id="content"></div><footer class="footer"><span>13180 操作系统 · 原创练习，不代表官方试卷</span><span id="save-status">进度自动保存在此浏览器</span></footer><noscript>请启用JavaScript后使用互动练习。本文件不需要联网或安装依赖。</noscript></main></div></div><script>${js}</script></body></html>`;
fs.writeFileSync(path.join(root,'index.html'),html);
fs.writeFileSync(path.join(root,'13180操作系统-两天冲刺.html'),html);
console.log('Built standalone HTML:',Buffer.byteLength(html),'bytes');
