# Locale Synchronization Scripts

这些脚本用于自动同步 `/src/app/origin` 文件夹中的内容到其他语言目录（`en`, `zh-CN`, `ja-JP`），并自动修改每个文件中的 `locale` 值。

## 脚本说明

### 1. 一次性同步脚本 (`sync-locales-once.js`)
- **用途**: 手动同步所有现有文件
- **命令**: `npm run gen-i18n`
- **功能**: 将 `origin` 文件夹中的所有 `.mdx`, `.tsx`, `.ts` 文件复制到其他语言目录，并修改 `export const locale = 'auto'` 为对应的语言值

### 2. 文件监听脚本 (`sync-locales.js`)
- **用途**: 实时监听文件变化并自动同步
- **命令**: `npm run gen-i18n:watch`
- **功能**: 
  - 监听 `origin` 文件夹的变化
  - 当文件被添加、修改或删除时自动同步
  - 支持实时同步，无需手动运行

## 使用方法

### 方法一：手动同步（推荐用于开发时）
```bash
npm run gen-i18n
```

### 方法二：实时监听（推荐用于持续开发）
```bash
npm run gen-i18n:watch
```

## 支持的文件类型
- `.mdx` - MDX 文件
- `.tsx` - TypeScript React 文件  
- `.ts` - TypeScript 文件

## 语言映射
- `en` → `export const locale = 'en'`
- `zh-CN` → `export const locale = 'zh-CN'`
- `ja-JP` → `export const locale = 'ja-JP'`

## 注意事项
1. 脚本会自动创建目标目录（如果不存在）
2. 只有包含 `export const locale = 'auto'` 的文件才会被修改 locale 值
3. 删除 `origin` 文件夹中的文件时，对应的其他语言文件也会被删除
4. 监听模式下按 `Ctrl+C` 可以停止监听

## 工作流程建议
1. 在 `origin` 文件夹中创建和编辑文件
2. 运行 `npm run gen-i18n:watch` 启动实时监听
3. 保存文件时，脚本会自动同步到其他语言目录
4. 根据需要手动翻译各语言版本的内容 