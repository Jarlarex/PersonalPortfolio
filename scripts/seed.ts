/**
 * Seed Script for Sample Blog Posts
 *
 * This script creates sample blog posts in your Firestore database.
 *
 * IMPORTANT: You must be authenticated before running this script.
 *
 * Manual Steps:
 * 1. Create a user in Firebase Console > Authentication
 * 2. Copy the user's UID
 * 3. Update the USER_ID constant below with your UID
 * 4. Run: npm run seed
 *
 * Or run this in a browser console while logged in to get your UID:
 * firebase.auth().currentUser?.uid
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ⚠️ UPDATE THIS WITH YOUR FIREBASE USER ID ⚠️
const USER_ID = 'YOUR_USER_ID_HERE';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample blog posts
const samplePosts = [
  {
    title: 'Getting Started with Next.js 16 and Firebase',
    slug: 'getting-started-nextjs-firebase',
    excerpt:
      'Learn how to build a modern full-stack application with Next.js 16 App Router and Firebase. This comprehensive guide covers setup, authentication, and deployment.',
    content: `# Getting Started with Next.js 16 and Firebase

Welcome to this comprehensive guide on building modern web applications with Next.js 16 and Firebase!

## Why Next.js and Firebase?

Next.js provides an excellent developer experience with features like:
- **Server Components** - Improved performance and SEO
- **App Router** - File-based routing with layouts
- **TypeScript** - Built-in type safety
- **Image Optimization** - Automatic image optimization

Firebase complements Next.js perfectly by offering:
- **Authentication** - Easy user management
- **Firestore** - Scalable NoSQL database
- **Storage** - File hosting with CDN
- **Hosting** - Fast, secure hosting

## Setting Up Your Project

First, create a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
\`\`\`

Then install Firebase:

\`\`\`bash
npm install firebase
\`\`\`

## Firebase Configuration

Create a \`.env.local\` file with your Firebase credentials:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
\`\`\`

Initialize Firebase in \`lib/firebase.ts\`:

\`\`\`typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your config here
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
\`\`\`

## Building Your First Feature

Let's create a simple authentication flow:

1. **Sign Up Component**
2. **Login Component**
3. **Protected Routes**

With Firebase Auth, this becomes straightforward:

\`\`\`typescript
import { signInWithEmailAndPassword } from 'firebase/auth';

async function signIn(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}
\`\`\`

## Conclusion

Next.js and Firebase together provide a powerful, scalable foundation for modern web applications. The combination offers excellent developer experience while maintaining production-ready performance.

Happy coding! 🚀`,
    tags: ['nextjs', 'firebase', 'typescript', 'web-development'],
    authorId: USER_ID,
    published: true,
    readingTime: 8,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    title: 'Building a Markdown Editor with React',
    slug: 'building-markdown-editor-react',
    excerpt:
      'Create a powerful two-pane markdown editor with live preview, syntax highlighting, and image upload functionality using React and TypeScript.',
    content: `# Building a Markdown Editor with React

Markdown editors are essential tools for content creators. In this tutorial, we'll build a feature-rich markdown editor with React.

## Features We'll Build

- ✅ Two-pane layout (editor + preview)
- ✅ Toolbar with formatting buttons
- ✅ Live preview
- ✅ Syntax highlighting
- ✅ Image upload

## Project Setup

\`\`\`bash
npm install react-markdown remark-gfm rehype-highlight
\`\`\`

## The Editor Component

Our editor will have two main parts:

### 1. Textarea for Input

\`\`\`typescript
const [content, setContent] = useState('');

<textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="Write your markdown here..."
/>
\`\`\`

### 2. Live Preview

\`\`\`typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {content}
</ReactMarkdown>
\`\`\`

## Adding a Toolbar

Let's add formatting buttons:

\`\`\`typescript
const insertMarkdown = (before: string, after: string = '') => {
  const textarea = textareaRef.current;
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = content.substring(start, end);
  
  const newContent = 
    content.substring(0, start) +
    before + selectedText + after +
    content.substring(end);
  
  setContent(newContent);
};
\`\`\`

Toolbar buttons:

\`\`\`typescript
<button onClick={() => insertMarkdown('**', '**')}>Bold</button>
<button onClick={() => insertMarkdown('*', '*')}>Italic</button>
<button onClick={() => insertMarkdown('[', '](url)')}>Link</button>
\`\`\`

## Image Upload

For image uploads, we can use Firebase Storage:

\`\`\`typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const handleImageUpload = async (file: File) => {
  const storageRef = ref(storage, \`images/\${file.name}\`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  insertMarkdown(\`![alt text](\${url})\`);
};
\`\`\`

## Styling with Tailwind

Make it look great with Tailwind CSS:

\`\`\`tsx
<div className="grid grid-cols-2 gap-4">
  <textarea className="border rounded p-4" />
  <div className="prose border rounded p-4">
    {/* Preview */}
  </div>
</div>
\`\`\`

## Conclusion

You now have a fully functional markdown editor! You can extend this with:
- Auto-save functionality
- Export to PDF
- Collaborative editing
- Custom syntax highlighting themes

The possibilities are endless! 📝`,
    tags: ['react', 'markdown', 'typescript', 'tutorial'],
    authorId: USER_ID,
    published: true,
    readingTime: 6,
    createdAt: Timestamp.fromDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ), // 7 days ago
    updatedAt: Timestamp.fromDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ),
  },
  {
    title: 'Advanced TypeScript Patterns for React',
    slug: 'advanced-typescript-patterns-react',
    excerpt:
      'Explore advanced TypeScript patterns and techniques to write more type-safe and maintainable React applications. Learn about generics, utility types, and more.',
    content: `# Advanced TypeScript Patterns for React

TypeScript and React are a powerful combination. This guide explores advanced patterns to leverage TypeScript's full potential in React applications.

## Generic Components

Create reusable components with generics:

\`\`\`typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}

// Usage
<List
  items={users}
  renderItem={(user) => <li>{user.name}</li>}
/>
\`\`\`

## Discriminated Unions

Type-safe state management:

\`\`\`typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function DataDisplay<T>({ state }: { state: AsyncState<T> }) {
  switch (state.status) {
    case 'idle':
      return <div>Not started</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>{/* Use state.data */}</div>;
    case 'error':
      return <div>{state.error.message}</div>;
  }
}
\`\`\`

## Utility Types

Leverage TypeScript's utility types:

\`\`\`typescript
// Make all properties optional
type PartialUser = Partial<User>;

// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit properties
type UserWithoutPassword = Omit<User, 'password'>;

// Make all properties readonly
type ImmutableUser = Readonly<User>;
\`\`\`

## Custom Hooks with TypeScript

Type-safe custom hooks:

\`\`\`typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}
\`\`\`

## Component Props with TypeScript

Advanced prop patterns:

\`\`\`typescript
// Props with children
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Props with render prop
interface DataFetcherProps<T> {
  url: string;
  children: (data: T) => React.ReactNode;
}

// Props extending HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}
\`\`\`

## Conclusion

These patterns help build more maintainable and type-safe React applications. Use them wisely based on your project needs!

*This is a draft post - work in progress* 🚧`,
    tags: ['typescript', 'react', 'advanced', 'patterns'],
    authorId: USER_ID,
    published: false, // This is a draft
    readingTime: 5,
    createdAt: Timestamp.fromDate(
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    ), // 2 days ago
    updatedAt: Timestamp.now(),
  },
];

// Main seed function
async function seed() {
  console.log('🌱 Starting seed script...\n');

  // Validate user ID
  if (USER_ID === 'YOUR_USER_ID_HERE') {
    console.error('❌ Error: Please update USER_ID in scripts/seed.ts');
    console.error('   Get your user ID from Firebase Console > Authentication');
    process.exit(1);
  }

  // Validate Firebase config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Error: Firebase configuration is missing');
    console.error('   Make sure .env.local is configured correctly');
    process.exit(1);
  }

  console.log('📦 Creating sample posts...\n');

  try {
    const postsRef = collection(db, 'posts');

    for (const post of samplePosts) {
      const docRef = await addDoc(postsRef, post);
      const status = post.published ? '✅ Published' : '📝 Draft';
      console.log(`${status}: "${post.title}" (ID: ${docRef.id})`);
    }

    console.log('\n✨ Seed completed successfully!');
    console.log('\nCreated:');
    console.log('- 2 published blog posts');
    console.log('- 1 draft post');
    console.log('\n📍 Next steps:');
    console.log('1. Sign in at http://localhost:3000/login');
    console.log('2. Visit http://localhost:3000/admin to manage posts');
    console.log('3. View published posts at http://localhost:3000/blog');
  } catch (error) {
    console.error('\n❌ Error creating posts:', error);
    console.error('\nTroubleshooting:');
    console.error('- Check Firebase security rules allow writes');
    console.error('- Verify USER_ID is correct');
    console.error('- Ensure Firestore is enabled in Firebase Console');
    process.exit(1);
  }
}

// Run seed function
seed()
  .then(() => {
    console.log('\n👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
