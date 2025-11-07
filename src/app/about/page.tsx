import { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn more about my background, skills, and experience in web development.',
};

const skills = [
  {
    category: 'Frontend',
    items: [
      'React & Next.js',
      'TypeScript',
      'Tailwind CSS',
      'HTML5 & CSS3',
      'Responsive Design',
      'Accessibility (a11y)',
    ],
  },
  {
    category: 'Backend',
    items: [
      'Node.js',
      'Firebase & Firestore',
      'REST APIs',
      'Authentication',
      'Database Design',
      'Server-Side Rendering',
    ],
  },
  {
    category: 'Tools & Practices',
    items: [
      'Git & GitHub',
      'VS Code',
      'npm & package management',
      'Agile Methodology',
      'Code Review',
      'Testing & Debugging',
    ],
  },
  {
    category: 'Design',
    items: [
      'UI/UX Principles',
      'Figma',
      'Design Systems',
      'Color Theory',
      'Typography',
      'Prototyping',
    ],
  },
];

export default function AboutPage() {
  return (
    <Container as="main" id="main-content" className="py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Full-Stack Developer passionate about building exceptional digital
            experiences
          </p>
        </div>

        {/* Bio Section */}
        <div className="mb-16">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="flex-shrink-0">
              <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-4 border-gray-200 shadow-lg dark:border-gray-800">
                <Image
                  src="/images/avatar.jpg"
                  alt="Profile picture"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 space-y-4 text-gray-600 dark:text-gray-400">
              <p className="text-lg leading-relaxed">
                Hi! I&apos;m a passionate full-stack developer with a love for
                creating beautiful, functional, and accessible web applications.
                With expertise in modern JavaScript frameworks and a keen eye
                for design, I strive to build products that users love.
              </p>
              <p className="leading-relaxed">
                My journey in web development started several years ago, and
                since then, I&apos;ve been continuously learning and adapting to
                new technologies. I believe in writing clean, maintainable code
                and following best practices to deliver high-quality solutions.
              </p>
              <p className="leading-relaxed">
                When I&apos;m not coding, you can find me exploring new
                technologies, contributing to open-source projects, or sharing
                my knowledge through blog posts and tutorials. I&apos;m always
                excited to collaborate on interesting projects and connect with
                fellow developers.
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Skills & Expertise
          </h2>

          <div className="grid gap-8 sm:grid-cols-2">
            {skills.map((skillGroup) => (
              <div
                key={skillGroup.category}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center text-gray-600 dark:text-gray-400"
                    >
                      <svg
                        className="mr-3 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Let&apos;s Work Together</h2>
          <p className="mb-6 text-blue-100">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </Container>
  );
}
