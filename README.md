# Personal Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ⚡️ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 📝 TypeScript for type safety
- 🎯 ESLint and Prettier for code quality
- 📱 Fully responsive design
- 🌙 Dark mode support
- 🔍 SEO optimized with metadata

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd PersonalPortfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
PersonalPortfolio/
├── public/
│   └── images/          # Static images
├── src/
│   └── app/
│       ├── globals.css  # Global styles
│       ├── layout.tsx   # Root layout
│       ├── page.tsx     # Home page
│       └── not-found.tsx # 404 page
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Customization

1. Update personal information in `src/app/page.tsx`
2. Replace placeholder images in `public/images/`
3. Modify metadata in `src/app/layout.tsx`
4. Adjust color scheme in `tailwind.config.ts`

## Deployment

This project can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

## License

MIT License - feel free to use this project for your own portfolio!

