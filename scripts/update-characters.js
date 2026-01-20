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

// 2. 定义不同顺位的默认文字配置
const TEXT_CONFIGS = [
  { text: "keep up", x: 148, y: 58, r: -2, s: 47 },          // 第1个
  { text: "nice to meet ya", x: 148, y: 58, r: 0, s: 28 },  // 第2个
  { text: "keep at it!", x: 140, y: 79, r: 2, s: 47 },      // 第3个
  { text: "something", x: 148, y: 58, r: -2, s: 47 }        // 第4个及以后
];

function generateJSON() {
  const charactersData = [];
  let idCounter = 3;

  // 获取所有子文件夹
  const folders = fs.readdirSync(IMG_DIR).filter(f => 
    fs.statSync(path.join(IMG_DIR, f)).isDirectory()
  );

  folders.forEach(charName => {
    const charPath = path.join(IMG_DIR, charName);
    const files = fs.readdirSync(charPath).filter(file => 
      /\.(png|jpe?g|webp)$/i.test(file)
    );

    // 自然排序：airi1, airi2... airi10
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    files.forEach((fileName, index) => {
      // 提取文件名（不含后缀）作为显示名
      const displayName = path.parse(fileName).name.replace(/_/g, ' ');
      
      // 根据索引选择配置（0, 1, 2 分别对应前三个，之后都选索引3）
      const configIndex = index < 3 ? index : 3;
      const defaultText = { ...TEXT_CONFIGS[configIndex] };

      charactersData.push({
        id: String(idCounter++),                               // ID 转为字符串
        name: displayName,                                    // 显示名称
        character: charName.toLowerCase(),                    // 【修复】后端必需字段
        img: `${charName}/${fileName}`,                       // 图片路径
        color: COLOR_MAP[charName.toLowerCase()] || "#FFFFFF", // 颜色
        defaultText: defaultText                               // 动态分配的文字配置
      });
    });
  });

  // 写入文件，使用 4 空格缩进确保清晰
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(charactersData, null, 4), 'utf-8');
  console.log(`✨ 成功！已根据最新规则重新生成 ${charactersData.length} 条记录。`);
}

generateJSON();