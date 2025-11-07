# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-08

### 🎉 Major Updates

#### 🌐 Migrated from Firebase Storage to Cloudinary (FREE)

**Breaking Change:** Firebase Storage completely removed to avoid costs.

**Added:**
- **Cloudinary Integration** - Free image hosting (25GB storage + 25GB bandwidth/month)
  - Unsigned upload preset for client-side uploads
  - Automatic image optimization (WebP, compression, resizing)
  - Global CDN delivery
  - No backend API needed
- **Three-Mode Image Input** - Flexible image handling:
  1. **Upload to Cloudinary** (Production) - File upload → Cloudinary CDN
  2. **External URL** (Production) - Paste any HTTPS image URL
  3. **Inline Data URL** (Dev Only) - Small images <200KB as base64
- **ImageInsertDialog Component** - Beautiful modal with 3 tabs for image insertion
- **Dual Cover Image Input** - Upload OR paste URL on New/Edit Post pages
- **Smart Priority** - Uploaded images take priority over URL input
- **Comprehensive Documentation** - README section on image handling modes

**Removed:**
- All Firebase Storage imports and references
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` environment variable
- Storage initialization in `src/lib/firebase.ts`
- Storage deletion logic in admin dashboard
- Storage security rules from documentation

**Updated:**
- `src/lib/cloudinary.ts` - New upload helper with validation and fallback
- `src/components/MarkdownEditor.tsx` - Image button opens modal dialog
- `src/app/admin/posts/new/page.tsx` - Upload OR URL for cover images
- `src/app/admin/posts/[id]/edit/page.tsx` - Upload OR URL for cover images
- `next.config.mjs` - Added Cloudinary to remotePatterns
- `README.md` - Replaced Storage sections with Cloudinary guide
- `.env.example` - New Cloudinary environment variables

**Benefits:**
- ✅ FREE - No Firebase Storage costs
- ✅ Better Performance - CDN, auto-optimization
- ✅ More Flexible - 3 input modes for different scenarios
- ✅ Dev-Friendly - Fallback for local testing
- ✅ Production-Ready - Clear warnings for dev-only features

#### 🌓 Fixed Dark/Light Mode (SSR-Safe, No Flash)

**Problem:** Theme could flash on page load, not SSR-safe, hydration mismatches.

**Added:**
- **Pre-Hydration Script** - Inline script in `<head>` sets theme before React hydrates
  - Checks `localStorage.theme` for saved preference
  - Falls back to system preference (`prefers-color-scheme`)
  - Sets/removes `dark` class on `<html>` synchronously
  - Prevents any flash of incorrect theme
- **Class-Based Dark Mode** - `darkMode: 'class'` in Tailwind config
- **Comprehensive Documentation** - README section explaining theme system

**Updated:**
- `tailwind.config.ts` - Added `darkMode: 'class'`
- `src/app/layout.tsx` - Added pre-hydration script
- `src/components/ThemeToggle.tsx` - Simplified, reads DOM state
- `README.md` - Added Dark/Light Mode section with testing guide

**Benefits:**
- ✅ Zero Flash - Correct theme on first paint
- ✅ SSR Compatible - Works with server-side rendering
- ✅ Persistent - Remembers choice across sessions
- ✅ System-Aware - Respects OS dark mode preference
- ✅ Accessible - Proper ARIA labels and focus states
- ✅ Deterministic - Predictable, reliable behavior

#### 👤 Personalized for Iarfhlaith Feeney (@Jarlarex)

**Updated Site-Wide:**
- **Metadata** - Title, description, keywords, OG tags
  - Title: "Iarfhlaith Feeney — Portfolio & Blog"
  - Description: "Software Developer from Ireland. Also known online as 'Jarlarex'. Building clean web apps, tinkering with data, and writing about code and cars."
  - Twitter handle: @ifeeney32
- **Home Hero** - Name, tagline, description
- **About Page** - Personal bio, interests, skills, social links
- **Footer** - Description, social links (Twitter, LinkedIn, GitHub, Email)
- **README** - Updated with personalization notes

**Social Links Added:**
- Twitter/X: [@ifeeney32](https://x.com/ifeeney32)
- LinkedIn: [iarfhlaith-feeney](https://linkedin.com/in/iarfhlaith-feeney/)
- Email: iarfhlaithfeeney@gmail.com
- GitHub: [Jarlarex](https://github.com/Jarlarex)

### 📚 Documentation

- Updated README with Cloudinary setup instructions
- Added image handling modes comparison table
- Dark mode system explanation with testing commands
- Personalization guide
- Deployment checklist updated

### 🛠️ Technical Debt

- Removed all Firebase Storage dependencies
- Cleaned up dead imports
- Improved type safety in image handling
- Better error messages and validation

---

## [1.0.0] - 2025-11-07

### 🎉 Initial Release

A complete, production-ready portfolio website with blog functionality, admin dashboard, and Firebase backend.

### ✨ Features

#### Core Features

- **Modern Portfolio Website** - Showcase projects, skills, and experience
- **Full-Featured Blog System** - Create, edit, and publish blog posts
- **Authentication System** - Firebase Auth with email/password
- **Admin Dashboard** - Manage posts, drafts, and published content
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Mode** - Theme toggle with localStorage persistence
- **SEO Optimized** - Dynamic metadata, Open Graph tags, sitemap

#### Content Management

- **Markdown Editor** - Two-pane editor with live preview
- **Formatting Toolbar** - H1/H2/H3, Bold, Italic, Links, Code, Lists, Quotes
- **Image Upload** - Firebase Storage integration for images
- **Draft System** - Save drafts and publish when ready
- **Auto-Save** - Drafts auto-save every 10 seconds
- **Tag System** - Organize posts with tags
- **Slug Management** - URL-safe slugs auto-generated from titles
- **Reading Time** - Automatic calculation from content

#### Blog Features

- **Post Listing** - Paginated list with 10 posts per page
- **Search** - Search posts by title and content
- **Tag Filtering** - Filter posts by tags
- **Reading Progress** - Scroll progress bar on post pages
- **Next/Previous Navigation** - Navigate between adjacent posts
- **Post Cards** - Beautiful post previews with excerpts
- **Cover Images** - Optional cover images for posts

#### Admin Features

- **Post Management Dashboard** - View all posts (drafts + published)
- **Filter Posts** - All/Published/Draft filters
- **Create Posts** - Full markdown editor with preview
- **Edit Posts** - Update existing posts
- **Delete Posts** - Safe deletion with confirmation dialog
- **Stats Dashboard** - Total, published, and draft counts
- **Protected Routes** - Auth required for admin access

#### Technical Features

- **TypeScript** - Full type safety throughout
- **Firebase Integration** - Auth, Firestore, Storage
- **Zod Validation** - Schema validation for data integrity
- **Error Handling** - User-friendly error messages
- **Loading States** - Skeleton screens and spinners
- **Accessibility** - WCAG AA compliant, keyboard navigation
- **Form Validation** - Real-time validation with error messages

### 🎨 User Experience

#### Components

- `Header` - Navigation with theme toggle and auth state
- `Footer` - Footer with links and social media
- `ThemeToggle` - Light/dark mode toggle
- `ReadingProgress` - Scroll progress indicator
- `MarkdownEditor` - Two-pane markdown editor
- `MarkdownRenderer` - Markdown display with syntax highlighting
- `Protected` - Auth guard for protected routes
- `ConfirmDialog` - Accessible confirmation modal
- `PostCard` - Blog post card component
- `TagChip` - Tag display component
- `Pagination` - Pagination controls
- `Container` - Consistent layout wrapper

#### Pages

- `/` - Home page with hero section
- `/about` - About page with bio and skills
- `/projects` - Projects showcase
- `/blog` - Blog index with search and filters
- `/blog/[slug]` - Individual blog post
- `/login` - Sign in page
- `/admin` - Admin dashboard (protected)
- `/admin/posts/new` - Create new post (protected)
- `/admin/posts/[id]/edit` - Edit post (protected)
- `/404` - Friendly 404 page

### 🛠️ Development

#### Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Utility-first CSS
- **Firebase 12** - Backend services
- **React Markdown** - Markdown rendering
- **Zod** - Schema validation
- **date-fns** - Date formatting

#### Developer Experience

- ESLint configuration
- Prettier code formatting
- TypeScript strict mode
- Hot reload in development
- Fast builds with Turbopack
- Type checking script
- Seed script for sample data

### 📚 Documentation

- Comprehensive README.md
- Firebase setup guide
- Firestore indexes documentation
- Security rules examples
- Deployment instructions
- API documentation with JSDoc
- Code examples throughout

### 🔒 Security

- Firebase Authentication
- Protected admin routes
- Firestore security rules
- Storage security rules
- Environment variable validation
- Input sanitization
- XSS protection

### ♿ Accessibility

- Semantic HTML
- ARIA labels and attributes
- Keyboard navigation
- Focus management
- Screen reader support
- Skip to content link
- Color contrast ratios
- Focus visible states

### 🚀 Performance

- Server Components
- Image optimization
- Code splitting
- Lazy loading
- Efficient queries
- Pagination
- Caching strategies

### 📝 Known Issues

None at this time.

### 🔄 Migration Notes

This is the initial release. No migration needed.

### 🙏 Credits

Built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## Future Roadmap

Planned features for future releases:

- [ ] Comment system for blog posts
- [ ] Post categories in addition to tags
- [ ] Email newsletter integration
- [ ] Social media sharing buttons
- [ ] Analytics dashboard
- [ ] RSS feed
- [ ] Sitemap generation
- [ ] Search with Algolia
- [ ] Multi-language support
- [ ] Custom themes
- [ ] Export posts to PDF
- [ ] Scheduled publishing
- [ ] Post revisions history
- [ ] Image optimization pipeline
- [ ] Video embedding support

---

**Questions or suggestions?** Open an issue on [GitHub](https://github.com/Jarlarex/PersonalPortfolio)!
