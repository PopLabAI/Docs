# PopLab AI Docs

PopLab AI: [https://poplab.ai](https://poplab.ai)

## Docs

PopLab AI Docs: [https://docs.poplab.ai](https://docs.poplab.ai)

## Project Overview

This is a multilingual documentation website built with Next.js and MDX, supporting Chinese, English, and Japanese.

## Development

### Install Dependencies

```bash
npm install
# or using pnpm
pnpm install
```

### Development Server

```bash
npm run dev
# or using pnpm
pnpm dev
```

### Build Project

```bash
npm run build
# or using pnpm
pnpm build
```

## Internationalization (i18n) Management

The project uses automated internationalization synchronization scripts with the following commands:

### One-time Sync All Language Files

```bash
npm run gen-i18n
# or using pnpm
pnpm gen-i18n
```

### Real-time File Change Monitoring and Auto-sync

```bash
npm run gen-i18n:watch
# or using pnpm
pnpm gen-i18n:watch
```

### Workflow

1. Create and edit source files in the `/src/app/origin` folder
2. Run `npm run gen-i18n:watch` to start real-time monitoring
3. When files are saved, the script automatically syncs to other language directories (`en`, `zh-CN`, `ja-JP`)
4. Manually translate content for each language version as needed

### Supported File Types

- `.mdx` - MDX files
- `.tsx` - TypeScript React files  
- `.ts` - TypeScript files

### Language Mapping

- `en` → `export const locale = 'en'`
- `zh-CN` → `export const locale = 'zh-CN'`
- `ja-JP` → `export const locale = 'ja-JP'`

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Content**: MDX
- **Language**: TypeScript
- **Theming**: next-themes
- **Search**: FlexSearch
- **Animation**: Framer Motion

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── origin/         # Source files directory
│   ├── en/            # English documentation
│   ├── zh-CN/         # Chinese documentation
│   └── ja-JP/         # Japanese documentation
├── components/         # React components
├── lib/               # Utility functions
├── mdx/               # MDX configuration
└── styles/            # Style files
```



