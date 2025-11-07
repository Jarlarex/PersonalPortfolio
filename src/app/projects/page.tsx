import { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of web development projects, from full-stack applications to frontend showcases.',
};

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'A full-featured e-commerce platform with product management, shopping cart, and secure checkout. Built with Next.js, Stripe, and Firebase.',
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Firebase'],
    demoLink: '/projects/ecommerce',
    githubLink: 'https://github.com/Jarlarex',
    featured: true,
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'Collaborative task management application with real-time updates, team workspaces, and advanced filtering. Powered by React and Firestore.',
    tags: ['React', 'Firestore', 'Tailwind CSS', 'Real-time'],
    demoLink: '/projects/task-manager',
    githubLink: 'https://github.com/Jarlarex',
    featured: true,
  },
  {
    id: 3,
    title: 'Portfolio CMS',
    description:
      'Content management system for portfolio websites with markdown support, image optimization, and SEO tools. Built with Next.js and Sanity.',
    tags: ['Next.js', 'Sanity CMS', 'MDX', 'SEO'],
    demoLink: '/projects/portfolio-cms',
    githubLink: 'https://github.com/Jarlarex',
    featured: false,
  },
  {
    id: 4,
    title: 'Weather Dashboard',
    description:
      'Beautiful weather dashboard with forecasts, interactive maps, and location search. Integrates with multiple weather APIs for accurate data.',
    tags: ['React', 'APIs', 'Charts', 'Geolocation'],
    demoLink: '/projects/weather-dashboard',
    githubLink: 'https://github.com/Jarlarex',
    featured: false,
  },
  {
    id: 5,
    title: 'Social Media Analytics',
    description:
      'Analytics platform for social media metrics with data visualization, export capabilities, and automated reports. Built for content creators.',
    tags: ['Next.js', 'Chart.js', 'PostgreSQL', 'Analytics'],
    demoLink: '/projects/social-analytics',
    githubLink: 'https://github.com/Jarlarex',
    featured: true,
  },
  {
    id: 6,
    title: 'Recipe Finder',
    description:
      'Discover and save recipes with advanced search, dietary filters, and cooking timer. Features user accounts and personal recipe collections.',
    tags: ['React', 'Firebase Auth', 'API Integration', 'PWA'],
    demoLink: '/projects/recipe-finder',
    githubLink: 'https://github.com/Jarlarex',
    featured: false,
  },
];

export default function ProjectsPage() {
  return (
    <Container as="main" id="main-content" className="py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Projects
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            A collection of projects showcasing my skills in web development,
            from concept to deployment
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              {project.featured && (
                <div className="absolute right-4 top-4 z-10">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Featured
                  </span>
                </div>
              )}

              <div className="flex-1 p-6">
                <h2 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                  {project.title}
                </h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex gap-4">
                  <Link
                    href={project.demoLink}
                    className="flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg
                      className="mr-1.5 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Demo
                  </Link>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <svg
                      className="mr-1.5 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Want to see more?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Check out my GitHub for more projects and open-source contributions.
          </p>
          <a
            href="https://github.com/Jarlarex"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Visit GitHub Profile
          </a>
        </div>
      </div>
    </Container>
  );
}

