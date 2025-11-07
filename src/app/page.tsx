import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/Container';

export default function Home() {
  return (
    <Container
      as="main"
      id="main-content"
      className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-12"
    >
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200 dark:border-gray-800">
            <Image
              src="/images/avatar.jpg"
              alt="Profile Avatar"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl md:text-7xl">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Name
          </span>
        </h1>
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-400 sm:text-2xl">
          Full-Stack Developer & Creative Problem Solver
        </p>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          I build modern web applications with cutting-edge technologies.
          Passionate about clean code, user experience, and continuous learning.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Read My Blog
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            View Projects
          </Link>
        </div>
      </div>
    </Container>
  );
}

