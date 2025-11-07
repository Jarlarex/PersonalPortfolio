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
- 🔥 Firebase integration (Auth, Firestore, Storage)
- ✅ Zod schema validation
- 📚 Utility libraries (slug generation, reading time calculation)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jarlarex/PersonalPortfolio.git
cd PersonalPortfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (required for full functionality):

**a. Create a Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Authentication, Firestore Database, and Storage in the Firebase Console

**b. Get your Firebase configuration:**
   - In Firebase Console, go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Copy the configuration values

**c. Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   ```

**d. Add your Firebase configuration to `.env.local`:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   > **Note:** Never commit `.env.local` to version control. It's already in `.gitignore`.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   ├── app/
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Home page
│   │   └── not-found.tsx # 404 page
│   └── lib/
│       ├── firebase.ts  # Firebase initialization
│       ├── posts.ts     # Firestore data layer for posts
│       ├── validators.ts # Zod schemas for validation
│       ├── slug.ts      # Slug generation utilities
│       └── time.ts      # Time/date utilities
├── .env.example         # Environment variables template
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Firebase Setup

This project uses Firebase for:
- **Authentication**: User login and registration
- **Firestore**: NoSQL database for storing blog posts and data
- **Storage**: File uploads and media storage

### Firebase Security Rules

After setting up Firebase, configure security rules:

**Firestore Rules** (Database > Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules** (Storage > Rules):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Required Firestore Indexes

The blog post queries require composite indexes. Create these in Firebase Console (Firestore Database > Indexes):

**Index 1: Published posts ordered by creation date**
- Collection: `posts`
- Fields indexed:
  - `published` (Ascending)
  - `createdAt` (Descending)

**Index 2: Published posts filtered by tag**
- Collection: `posts`
- Fields indexed:
  - `published` (Ascending)
  - `tags` (Arrays)
  - `createdAt` (Descending)

**Index 3: Published posts for adjacent navigation (previous)**
- Collection: `posts`
- Fields indexed:
  - `published` (Ascending)
  - `createdAt` (Descending)

**Index 4: Published posts for adjacent navigation (next)**
- Collection: `posts`
- Fields indexed:
  - `published` (Ascending)
  - `createdAt` (Ascending)

**Index 5: User's posts by update time**
- Collection: `posts`
- Fields indexed:
  - `authorId` (Ascending)
  - `updatedAt` (Descending)

> **Note:** Firebase will prompt you to create indexes automatically when you run queries that require them. Click the provided link in the error message to auto-generate the index.

## Library Utilities

### Firebase (`src/lib/firebase.ts`)
- Safe Firebase initialization with environment validation
- Exports `auth`, `db`, `storage` instances
- Helper functions: `isFirebaseInitialized()`, `getFirebaseInstances()`

### Validators (`src/lib/validators.ts`)
- Zod schemas for type-safe post creation/updates
- Validation helpers with error handling
- TypeScript types: `CreatePost`, `UpdatePost`, `PostMetadata`

### Slug (`src/lib/slug.ts`)
- `slugify()`: Convert text to URL-safe slugs
- `generateSlug()`: Generate slugs with length limits
- `ensureUniqueSlug()`: Make slugs unique
- `isValidSlug()`: Validate slug format

### Time (`src/lib/time.ts`)
- `calculateReadingTime()`: Estimate reading time from text
- `formatDate()`: Format dates for display
- `formatRelativeTime()`: "2 days ago" formatting
- `getReadingTimeText()`: "5 min read" formatting
- `parseFirestoreTimestamp()`: Convert Firestore timestamps

### Posts (`src/lib/posts.ts`)
- `listPublishedPosts()`: Get paginated published posts with filtering
- `getPostBySlug()`: Fetch a single post by slug
- `getAdjacentPosts()`: Get previous/next posts for navigation
- `createPost()`: Create a new blog post
- `updatePost()`: Update an existing post
- `deletePost()`: Delete a post
- `listAllMyPosts()`: Get all posts by a user
- Full TypeScript types and JSDoc documentation

## Customization

1. Update personal information in `src/app/page.tsx`
2. Replace placeholder images in `public/images/`
3. Modify metadata in `src/app/layout.tsx`
4. Adjust color scheme in `tailwind.config.ts`
5. Configure Firebase security rules for your use case

## Deployment

This project can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jarlarex/PersonalPortfolio)

## License

MIT License - feel free to use this project for your own portfolio!

