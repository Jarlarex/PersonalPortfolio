# Personal Portfolio

A modern, full-featured portfolio website with blog, admin dashboard, and Firebase backend.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-11-orange?style=flat&logo=firebase)

## 📋 Overview

A production-ready portfolio website featuring a blog with markdown editor, authentication system, admin dashboard, and full Firebase integration. Built with modern web technologies and best practices for performance, accessibility, and SEO.

**Live Demo:** [yourportfolio.com](https://yourportfolio.com)

## ✨ Features

### Core Features

- 🏠 **Modern Portfolio** - Showcase projects, skills, and experience
- 📝 **Full-Featured Blog** - Markdown editor with live preview
- 🔐 **Authentication** - Firebase Auth with protected routes
- 📊 **Admin Dashboard** - Manage posts, drafts, and content
- 🖼️ **Image Upload** - Firebase Storage integration
- 🔍 **Search & Filter** - Tag filtering and search functionality
- 📄 **Pagination** - Efficient content browsing

### Technical Features

- ⚡️ **Next.js 16** - App Router with Server Components
- 🎨 **Tailwind CSS** - Utility-first styling with dark mode
- 📱 **Fully Responsive** - Mobile-first design
- 🌙 **Theme Toggle** - Light/dark mode with localStorage
- 📈 **Reading Progress** - Scroll progress indicator
- ♿ **Accessible** - WCAG AA compliant, keyboard navigation
- 🔍 **SEO Optimized** - Dynamic metadata, OG tags, sitemap
- 🚀 **Performance** - Optimized builds, lazy loading
- 🎯 **Type-Safe** - Full TypeScript coverage
- ✅ **Validated** - Zod schema validation
- 💾 **Auto-Save** - Draft auto-save every 10 seconds

### Content Management

- ✍️ **Markdown Editor** - Two-pane with live preview
- 🛠️ **Formatting Toolbar** - Headers, bold, italic, links, code, lists
- 🖼️ **Media Upload** - Drag & drop image upload
- 📝 **Draft System** - Save and publish workflow
- 🏷️ **Tag System** - Organize content with tags
- 🔗 **Slug Management** - Auto-generated URL-safe slugs
- 📊 **Reading Time** - Automatic calculation
- 📅 **Timestamps** - Created/updated tracking

## 🛠️ Tech Stack

**Frontend:**

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [Zod](https://zod.dev/) - Schema validation
- [date-fns](https://date-fns.org/) - Date formatting

**Backend:**

- [Firebase Auth](https://firebase.google.com/docs/auth) - Authentication
- [Firestore](https://firebase.google.com/docs/firestore) - Database
- [Firebase Storage](https://firebase.google.com/docs/storage) - File storage

**Developer Tools:**

- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting
- [TypeScript](https://www.typescriptlang.org/) - Type checking

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Firebase Account** - [Sign up](https://firebase.google.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Jarlarex/PersonalPortfolio.git
   cd PersonalPortfolio
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Firebase:**

   a. **Create a Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the wizard
   - Choose a project name and configure settings

   b. **Enable Firebase services:**
   - **Authentication:** Go to Authentication > Sign-in method
     - Enable "Email/Password" provider
   - **Firestore:** Go to Firestore Database
     - Click "Create database"
     - Start in production mode (we'll add rules later)
     - Choose a location close to your users

   c. **Get your Firebase configuration:**
   - In Firebase Console, go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click the web icon `</>` to add a web app
   - Register app (nickname: "Portfolio Website")
   - Copy the `firebaseConfig` object

   d. **Create environment file:**

   ```bash
   cp .env.example .env.local
   ```

   e. **Add your Firebase configuration to `.env.local`:**

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

   ⚠️ **Important:** Never commit `.env.local` to version control!

4. **Configure Firebase Security Rules:**

   **Firestore Rules** (Firestore Database > Rules):

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow anyone to read published posts
       match /posts/{postId} {
         allow read: if true;
         // Only authenticated users can write
         allow create: if request.auth != null;
         // Only the author can update/delete their own posts
         allow update, delete: if request.auth != null &&
           request.auth.uid == resource.data.authorId;
       }
     }
   }
   ```

   **Storage Rules** (Storage > Rules):

   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Anyone can read
       match /{allPaths=**} {
         allow read: if true;
       }
       // Only authenticated users can upload
       match /blog-images/{imageId} {
         allow write: if request.auth != null;
       }
       match /blog-covers/{imageId} {
         allow write: if request.auth != null;
       }
     }
   }
   ```

6. **Create your first user:**

   You need to create a user account to access the admin dashboard:

   **Option A: Firebase Console (Recommended)**
   - Go to Firebase Console > Authentication > Users
   - Click "Add user"
   - Enter email and password
   - Click "Add user"

   **Option B: Sign-up page (if you implement one)**
   - Navigate to `/login` after starting the dev server
   - Use Firebase Auth SDK to create account

6. **Run the development server:**

   ```bash
   npm run dev
   ```

7. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Sign in at [http://localhost:3000/login](http://localhost:3000/login)
   - Access admin at [http://localhost:3000/admin](http://localhost:3000/admin)

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server
npm run seed         # Create sample blog posts (requires auth)

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # Check TypeScript types
```

## 🗂️ Project Structure

```
PersonalPortfolio/
├── public/
│   ├── images/              # Static images (avatar, OG images)
│   └── robots.txt           # SEO crawler rules
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/           # Admin dashboard
│   │   │   ├── page.tsx     # Post management
│   │   │   └── posts/       # Create/edit routes
│   │   ├── blog/            # Blog routes
│   │   │   ├── page.tsx     # Blog index
│   │   │   └── [slug]/      # Post detail
│   │   ├── about/           # About page
│   │   ├── projects/        # Projects page
│   │   ├── login/           # Login page
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── not-found.tsx    # 404 page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Container.tsx    # Layout wrapper
│   │   ├── Header.tsx       # Navigation
│   │   ├── Footer.tsx       # Footer
│   │   ├── Protected.tsx    # Auth guard
│   │   ├── MarkdownEditor.tsx    # Markdown editor
│   │   ├── MarkdownRenderer.tsx  # Markdown display
│   │   ├── ThemeToggle.tsx       # Dark mode toggle
│   │   ├── ReadingProgress.tsx   # Scroll progress
│   │   ├── ConfirmDialog.tsx     # Confirmation modal
│   │   ├── PostCard.tsx          # Blog post card
│   │   ├── TagChip.tsx           # Tag display
│   │   └── Pagination.tsx        # Pagination controls
│   └── lib/                 # Utilities
│       ├── firebase.ts      # Firebase initialization
│       ├── auth.ts          # Auth helpers
│       ├── posts.ts         # Post CRUD operations
│       ├── validators.ts    # Zod schemas
│       ├── slug.ts          # Slug utilities
│       └── time.ts          # Date/time utilities
├── scripts/
│   └── seed.ts              # Sample data seed script
├── .env.example             # Environment template
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── package.json
├── CHANGELOG.md
└── README.md
```

## 🔥 Required Firestore Indexes

The blog queries require composite indexes. Firebase will prompt you to create them automatically when needed. Click the link in the error message, or create them manually:

### Index 1: Published posts by date

- **Collection:** `posts`
- **Fields:**
  - `published` (Ascending)
  - `createdAt` (Descending)

### Index 2: Published posts by tag

- **Collection:** `posts`
- **Fields:**
  - `published` (Ascending)
  - `tags` (Array-contains)
  - `createdAt` (Descending)

### Index 3: User's posts by date

- **Collection:** `posts`
- **Fields:**
  - `authorId` (Ascending)
  - `updatedAt` (Descending)

### Index 4: Adjacent posts (previous)

- **Collection:** `posts`
- **Fields:**
  - `published` (Ascending)
  - `createdAt` (Descending)
  - `slug` (Ascending)

### Index 5: Adjacent posts (next)

- **Collection:** `posts`
- **Fields:**
  - `published` (Ascending)
  - `createdAt` (Ascending)
  - `slug` (Ascending)

**Pro Tip:** When you run queries that need indexes, Firebase provides a direct link in the error message to auto-create the index. This is the easiest method!

## 📝 Creating Sample Content

After creating your first user, you can create sample blog posts:

**Option 1: Use the admin interface**

1. Sign in at `/login`
2. Navigate to `/admin`
3. Click "New Post"
4. Fill in the form and publish

**Option 2: Run the seed script**

```bash
npm run seed
```

This will create 2 published posts and 1 draft (requires authentication setup).

**Manual steps for seed script:**

1. Sign in to your app to get authenticated
2. Get your user ID from Firebase Console > Authentication
3. Update `scripts/seed.ts` with your user ID
4. Run `npm run seed`

## 🖼️ Image Handling - Three Input Modes

The project supports **three ways to add images**, both in the **Markdown Editor** (for content images) and **Cover Image field** (on New/Edit Post pages):

### 1. 🌐 Upload to Cloudinary (Recommended for Production)

**Where:** Markdown Editor "Upload" tab, or "Upload from Computer" button on post forms

**How it works:**
- Click upload button or choose file
- Image uploads to Cloudinary via unsigned preset
- Returns optimized CDN URL with automatic compression
- URL inserted into markdown or set as cover image

**Best for:** Production use, permanent hosting, automatic optimization

**Example result:** `![image](https://res.cloudinary.com/your-cloud/image/upload/v123/blog-images/image.jpg)`

### 2. 🔗 External URL

**Where:** Markdown Editor "URL" tab, or URL input field on post forms

**How it works:**
- Paste any HTTPS image URL
- Validates URL format
- Inserts directly into markdown or cover field
- No upload needed

**Best for:** Images already hosted elsewhere, quick testing, external CDN images

**Example:** Paste `https://example.com/photo.jpg` directly

### 3. 📦 Inline Data URL (Dev Only)

**Where:** Markdown Editor "Inline" tab only

**How it works:**
- Select image file < 200KB
- Converts to base64 data URL
- Embeds directly in markdown content
- ⚠️ Increases document size significantly

**Best for:** Local development, testing without Cloudinary configured

**⚠️ Warning:** This mode is **development-only**. Do not use in production:
- Increases database document size
- No optimization or compression
- Slows down page loads
- Console warning shown if Cloudinary not configured

### How to Choose

| Mode | Production | Development | Best Use Case |
|------|-----------|-------------|---------------|
| **Upload to Cloudinary** | ✅ Yes | ✅ Yes | Permanent hosting, auto-optimization |
| **External URL** | ✅ Yes | ✅ Yes | Already-hosted images, external CDN |
| **Inline Data URL** | ❌ No | ✅ Yes | Quick testing without Cloudinary |

### Cover Image Priority

On New/Edit Post pages, if you provide **both** an upload and a URL:
- **Uploaded image takes priority**
- URL input is cleared when file is uploaded
- This prevents confusion about which image will be used

### Markdown Editor Dialog

Click the 🖼️ **Image** button in the toolbar to open the dialog with three tabs:

1. **Upload Tab:** File picker → Cloudinary → inserts `![alt](cloudinary-url)`
2. **URL Tab:** Paste URL + alt text → inserts `![alt](your-url)`
3. **Inline Tab:** File picker <200KB → inserts `![alt](data:image/...)`

### Production Setup

For production deployments:
1. ✅ Configure Cloudinary (cloud name + upload preset)
2. ✅ Use Upload or External URL modes only
3. ❌ Do not rely on Inline mode (it will warn in console)

## 🚀 Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jarlarex/PersonalPortfolio)

### Manual Deployment

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy:**

   ```bash
   vercel
   ```

4. **Add environment variables:**
   - Go to your project in Vercel Dashboard
   - Navigate to Settings > Environment Variables
   - Add all variables from `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
     ```

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### Post-Deployment Checklist

- [ ] Update Firebase authorized domains (Authentication > Settings > Authorized domains)
- [ ] Add your domain: `your-domain.vercel.app`
- [ ] Verify Cloudinary environment variables are set in Vercel
- [ ] Update `metadataBase` in `src/app/layout.tsx` with your domain
- [ ] Update sitemap URL in `public/robots.txt`
- [ ] Test authentication on production
- [ ] Verify image uploads work (should use Cloudinary, not fallback)
- [ ] Check all routes are accessible

## 📸 Screenshots

Example screenshots are available in `/public/images/`:

- `avatar.jpg` - Profile picture
- `og-default.jpg` - Default Open Graph image

To add your own:

1. Replace images in `/public/images/`
2. Update references in code if filenames change
3. Recommended sizes:
   - Avatar: 300x300px
   - OG Image: 1200x630px

## 🎨 Customization

### Personal Information

1. **Update name and tagline:**
   - Edit `src/app/page.tsx` (home page)
   - Edit `src/app/about/page.tsx` (about page)

2. **Update metadata:**
   - Edit `src/app/layout.tsx` (site-wide metadata)
   - Update title, description, keywords
   - Update social media handles

3. **Update domain:**
   - Replace `https://yourportfolio.com` throughout the codebase
   - Update in `src/app/layout.tsx`
   - Update in `public/robots.txt`

### Styling

1. **Colors:**
   - Edit `tailwind.config.ts` to change color palette
   - Primary: blue-600, Secondary: purple-600

2. **Fonts:**
   - Add Google Fonts in `src/app/layout.tsx`
   - Update Tailwind config for custom fonts

3. **Dark Mode:**
   - Customize in `src/app/globals.css`
   - Adjust colors with `dark:` variants

### Features

- Add more pages in `src/app/`
- Create custom components in `src/components/`
- Extend Firebase functionality in `src/lib/`

## 🛠️ Development

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint --fix

# Format code
npm run format

# Type check
npm run type-check
```

### Best Practices

- ✅ Use TypeScript for all new files
- ✅ Add JSDoc comments to functions
- ✅ Follow existing code style
- ✅ Test changes before committing
- ✅ Keep components small and focused
- ✅ Use semantic HTML
- ✅ Ensure accessibility

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)
- Backend by [Firebase](https://firebase.google.com/)

---

**Questions or issues?** Please open an issue on GitHub or contact me at [your-email@example.com]

Made with ❤️ by [Your Name]
