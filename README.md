# Qinster 牧场 v189

以用户提供的 **Qinster-Ranch-GitHub-v188(1).zip** 中 `game.js`、`index.html` 为玩法基线，更新怪物美术与配色。

- 58 个原创、统一 40×40 像素模型：18 个基础种族 + 40 个派遣限定种族。
- 9 套预生成 atlas：原色、薄荷、绯红、月蓝、紫晶、金辉、极光、琉璃、夜曜。
- 原生索引像素源稿明确标记固定色和可变色，不使用整只滤镜或近似 CSS 遮罩。
- 牧场、怪物盒、亲代 A/B、派遣、图鉴和孵化弹窗共用同一个渲染函数与闪光粒子层。
- 存档仍为 `eggwood-monsters-v3`，物种 ID、tint、specialColor、shiny 语义不变。
- 保留 v188 的配种、生命、家族、商店与派遣规则。

## 运行

GitHub Pages 直接使用根目录 `index.html`。不需要打包；`assets/` 必须一起提交。
本地开发：`npm ci`，然后 `npm run dev`。Vite 只用于本地预览，不是游戏运行依赖。

## 美术维护

`art/sprites.mjs` 定义原创像素图形，`art/sprites.json` 是可逐像素编辑的索引源稿。
`npm run art` 从图形定义重新生成全部源稿与 atlas（会覆盖 JSON 的手工修改）。
若直接编辑 JSON，运行 `python3 scripts/build-atlas.py` 编译即可。

`art/review.html` 是全部 58 × 9 配色的审查表。
`npm test` 检查所有物种、颜色与闪光渲染组合。
构建脚本还逐像素验证固定区域在所有颜色中完全不变。
详见 [审查与方案](docs/art-audit-v189.md)。

仓库内 v169 ZIP 仅为历史附件，不是游戏入口；不要用它覆盖当前源码。
