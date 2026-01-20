const fs = require('fs');
const path = require('path');

// 1. 完整角色颜色映射表
const COLOR_MAP = {
  airi: "#FB8AAC",
  minori: "#F39E7D",
  akito: "#FF7722",
  an: "#0077BB",
  emu: "#FF66BB",
  ena: "#CCAA88",
  haruka: "#99CCFF",
  honami: "#FF6666",
  ichika: "#33AAEE",
  kaito: "#3366CC",
  kanade: "#BB6688",
  kohane: "#FFB300",
  len: "#FFCC11",
  luka: "#FFBBDD",
  mafuyu: "#7788CC",
  meiko: "#E60012",
  miku: "#33CCBB",
  mizuki: "#E4A8CA",
  nene: "#33CCAA",
  rin: "#FFCC11",
  rui: "#BB88EE",
  saki: "#FFBB11",
  shiho: "#BBDD22",
  shizuku: "#66DDAA",
  touya: "#0077DD",
  tsukasa: "#FFBB22"
};

// 路径配置
const IMG_DIR = path.join(__dirname, '../public/img');
const OUTPUT_PATH = path.join(__dirname, '../src/characters.json');

// 2. 默认文字配置（基于 App.jsx 的渲染逻辑）
const DEFAULT_TEXT_CONFIG = {
  text: "something", // 默认空白文字
  x: 148,    // 画布宽度 296 的中心
  y: 58,    // 底部预设位置
  s: 0,     // 默认字号
  r: 28       // 默认旋转角度

};

function generateJSON() {
  const charactersData = [];
  let idCounter = 1;

  const folders = fs.readdirSync(IMG_DIR).filter(f => 
    fs.statSync(path.join(IMG_DIR, f)).isDirectory()
  );

  folders.forEach(charName => {
    const charPath = path.join(IMG_DIR, charName);
    const files = fs.readdirSync(charPath).filter(file => 
      /\.(png|jpe?g|webp)$/i.test(file)
    );

    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    files.forEach(fileName => {
      // 提取不带后缀的文件名作为显示名称，例如 "Airi_01"
      const displayName = path.parse(fileName).name.replace(/_/g, ' ');

      charactersData.push({
        id: String(idCounter++),              // 插件通常要求 ID 是字符串
        name: displayName,                    // 用于显示的名称 (例如 "Airi 01")
        character: charName.toLowerCase(),     // 【关键修复】插件校验必需的字段 (例如 "airi")
        img: `${charName}/${fileName}`,       
        color: COLOR_MAP[charName.toLowerCase()] || "#FFFFFF",
        defaultText: { ...DEFAULT_TEXT_CONFIG }
      });
    });
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(charactersData, null, 4), 'utf-8'); // 建议用 4 空格缩进，方便查阅
  console.log(`✨ 成功！已修复并生成 ${charactersData.length} 条记录。`);
}

generateJSON();