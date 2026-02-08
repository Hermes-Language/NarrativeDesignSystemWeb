# Hermes Narrative Design System

> Make your app more narrative.

##  快速入门

### Install

```bash
# 克隆仓库
git clone https://github.com/Hermes-Language/NarrativeDesignSystem.git
cd NarrativeDesignSystem

# 安装依赖
pnpm install
```

### Start

#### 启动 Storybook
用于独立开发和调试 UI 组件，支持实时预览和触屏模拟。
```bash
pnpm storybook
```
访问 `http://localhost:6006` 查看交互式文档及组件预览。

#### 启动 SvelteKit 主应用
用于测试组件在完整应用环境下的表现。
```bash
pnpm dev
```

### 核心文件结构

- `src/lib/components/`: **核心组件库**。所有的 UI 逻辑（Timeline, StateSwitch 等）都在这里。
- `src/stories/`: **Storyboard 配置文件**。用于编写组件的演示用例。
- `README.md` & `STORYBOARD.md`: 项目与开发文档。

### 构建与打包

```bash
# 检查类型与代码格式
pnpm check
pnpm lint

# 导出静态 Storyboard
pnpm build-storybook

# 打包组件库
pnpm build
```


