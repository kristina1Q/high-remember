# 忆词 HighRemember

<div align="center">

![忆词 HighRemember](public/splash.png)

### 🌿 心之所向 · 历历在目 · 艾宾浩斯智能记忆与美学单词应用

[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.3-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.5-119eff.svg?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

</div>

---

## 📖 项目简介

**忆词 (HighRemember)** 是一款融合了**艾宾浩斯记忆遗忘曲线理论**、**语境化构词拓展**与**沉浸式美学视界**的高效英语词汇学习工具。

无论是准备出国考试、考研英语、四六级，还是日常词汇进阶，忆词都能通过智能调度、权威发音、变形拓展与个性化视觉伴读，让每一个单词真正印刻进脑海。支持 Web 网页端与 Android 原生手机 App。

---

## ✨ 核心特性

### 1. 🧠 科学严谨的艾宾浩斯遗忘曲线调度
- **智能推进轮次**：新词存入后自动排入复习周期：`第 2 天` → `第 4 天` → `第 7 天` → `第 15 天` → `完全熟记`；
- **分流机制**：
  - **记住**：自动跃升下一记忆阶段；
  - **未记住**：自动打上生词标记并归集至生词库，不打乱整体复习节奏；
  - **熟记**：直接标记为完全攻克，移出日常训练。

### 2. 📚 动词时态与形容词形态智能解析引擎
- **动词时态全系覆盖**：
  - 过去式 (Past Tense)
  - 过去分词 (Past Participle)
  - 现在分词 / 进行时 (Present Participle `-ing`)
  - 第三人称单数 (Third-person Singular `-s/-es`)
- **形容词副词形态拓展**：
  - 自动智能推导副词形式 (Adverb，如 *aesthetic → aesthetically*, *resilient → resiliently*)；
- **自愈形态引擎**：内置 100+ 高频不规则词典与屈折语法引擎，无论是新增单词、在线查词还是历史数据加载，形态变化均 100% 自动对齐自愈。

### 3. 🔊 多模态双轨高保真语音发音
- **单词真人原声**：单个词汇采用权威词典真人高保真发音录音；
- **例句原生引擎**：例句朗读集成 Android 系统底层 `@capacitor-community/text-to-speech`（`android.speech.tts.TextToSpeech`），零网络延迟、离线可用，彻底解决网页端手势过期与接口报错。

### 4. 🎨 电影级美学开屏与壁纸视觉系统
- **艺术开屏过渡**：
  - **黑场破晓**：纯黑静止后柔和拉开幕布；
  - **Ken Burns 推镜**：慢镜头景深推进，金粉微粒浮动升腾；
  - **黑到白晨光跃迁**：纯净白光弥漫全屏，无缝淡入应用主界面；
  - 支持右上角倒计时跳过与任意轻触即跳过。
- **自定义壁纸与磨砂玻璃**：
  - 支持手机相册图片上传、双指缩放拖动裁剪构图；
  - 实时调节背景模糊度 (Blur) 与卡片遮罩浓度 (Overlay Opacity)；
  - 支持浅色/暗夜模式自由切换。

### 5. 🎯 未记住生词库与专项闪卡集训
- 训练中未能一次记住的词汇自动归集于此；
- 提供沉浸式专项闪卡翻转训练，各个击破遗忘短板；
- 支持在生词库中快捷发音、跟读例句、移出生词库或直接标为熟记。

### 6. 🔒 离线优先与一键数据备份迁移
- **数据完全本地化**：学习进度与词库全量存储于手机本地，保护用户隐私；
- **原生文件保存与系统级分享**：支持 Android 原生目录保存、通过微信/QQ/备忘录一键导出分享；
- **智能导入防重**：支持一键导入 JSON 备份，智能合并重复词条并自动修正旧版本数据。

---

## 🛠️ 技术架构

- **核心框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite 8](https://vitejs.dev/)
- **样式方案**：[Tailwind CSS v4](https://tailwindcss.com/)
- **移动端跨平台**：[Capacitor 8](https://capacitorjs.com/)
  - `@capacitor-community/text-to-speech`（原生 TTS 引擎）
  - `@capacitor/filesystem`（原生沙盒文件存取）
  - `@capacitor/share`（系统原生分享调用）
- **图标与特效**：`lucide-react`、`canvas-confetti`

---

## 🚀 快速上手

### 环境要求
- [Node.js](https://nodejs.org/) >= 18.0.0
- npm >= 9.0.0
- (可选，打包 Android APK 时需要) [Android Studio](https://developer.android.com/studio) 及 Android SDK 30+

### 1. 克隆仓库
```bash
git clone https://github.com/kristina1Q/high-remember.git
cd high-remember
```

### 2. 安装依赖
```bash
npm install
```

### 3. 本地开发调试
```bash
npm run dev
```
打开浏览器访问控制台输出的地址（如 `http://localhost:5173/`）。

### 4. 生产构建打包
```bash
npm run build
```

---

## 📱 Android 原生打包与同步

本项目使用 Capacitor 深度集成了 Android 原生功能：

```bash
# 1. 构建 Web 资源
npm run build

# 2. 同步 Web 构建产物至 Android 原生项目
npx cap sync android

# 3. 使用 Android Studio 打开工程进行打包
npx cap open android
```

在 Android Studio 中点击 **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)** 即可直接生成真机安装包。

---

## 📂 项目结构概览

```
high-remember/
├── android/                   # Capacitor 生成的 Android Studio 原生项目
│   ├── app/
│   │   └── src/main/AndroidManifest.xml  # 原生权限与系统 TTS 服务声明
├── public/                    # 静态公开资源 (favicon, icons, splash 等)
├── src/
│   ├── assets/                # 核心静态艺术资产 (splash.png 4K 原画)
│   ├── components/            # UI 组件层
│   │   ├── tabs/              # 单词库、未记住词库、训练模块页面
│   │   ├── SplashScreen.tsx   # 电影级黑白过渡开屏动画组件
│   │   ├── WordFormsBadge.tsx # 动词时态与形容词副词形态组件
│   │   ├── WordDetailModal.tsx# 单词详情归档与读句弹窗
│   │   ├── DataBackupModal.tsx# 数据备份、导出与导入自愈弹窗
│   │   └── ...
│   ├── services/              # 核心业务服务 (TTS语音、词典API、本地存储)
│   ├── types/                 # TypeScript 类型定义
│   ├── utils/                 # 工具函数 (形态解析引擎、拼写高亮匹配)
│   ├── App.tsx                # 应用主入口与调度中枢
│   ├── index.css              # Tailwind 全局样式与自定义关键帧动画
│   └── main.tsx               # React 挂载点
├── capacitor.config.json      # Capacitor 配置文件
├── package.json
└── vite.config.ts             # Vite 构建配置
```

---

## 📄 开源许可证

本项目采用 [MIT License](LICENSE) 授权，欢迎自由学习、使用与二次开发。
