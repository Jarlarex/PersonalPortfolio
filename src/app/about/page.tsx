import { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/Container';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Software Developer from Ireland (also known as Jarlarex). Passionate about building web applications, data analysis, and motorsport.',
};

const skills = [
  {
    category: 'Web Development',
    items: [
      'React & Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Firebase & Firestore',
      'REST APIs',
    ],
  },
  {
    category: 'Data & Analysis',
    items: [
      'Data Processing',
      'Database Design',
      'SQL',
      'Data Visualization',
      'Analytics',
      'Performance Optimization',
    ],
  },
  {
    category: 'Tools & Practices',
    items: [
      'Git & GitHub',
      'VS Code',
      'CI/CD',
      'Agile Methodology',
      'Code Review',
      'Testing & Debugging',
    ],
  },
  {
    category: 'Interests',
    items: [
      'Clean Code',
      'Web Apps',
      'Motorsport',
      'Cars & Racing',
      'Tech Blogging',
      'Problem Solving',
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
            Iarfhlaith Feeney (@Jarlarex) · Software Developer from Ireland
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
                Hi! I&apos;m <strong>Iarfhlaith Feeney</strong>, a software developer from Ireland.
                You might know me online as <strong>Jarlarex</strong>. I love building clean,
                efficient web applications and diving into data to solve interesting problems.
              </p>
              <p className="leading-relaxed">
                My passion lies in creating elegant solutions with modern web technologies
                like React, Next.js, and TypeScript. I believe in writing maintainable code,
                optimizing performance, and building tools that make developers&apos; lives easier.
                Whether it&apos;s crafting intuitive user interfaces or architecting robust backend systems,
                I enjoy the full spectrum of software development.
              </p>
              <p className="leading-relaxed">
                Beyond coding, I&apos;m deeply interested in motorsport and cars—there&apos;s something
                about the blend of engineering precision and raw performance that resonates with how
                I approach software. When I&apos;m not at my keyboard, you&apos;ll find me following
                racing series, tinkering with data analysis projects, or writing about tech and
                development on my blog. Always eager to connect with fellow developers and enthusiasts!
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

        {/* Contact & Social Links */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Let&apos;s Connect</h2>
          <p className="mb-6 text-blue-100">
            I&apos;m always open to discussing new projects, collaborating on interesting
            ideas, or just chatting about tech and motorsport.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:iarfhlaithfeeney@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Me
            </a>
            <a
              href="https://x.com/ifeeney32"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @ifeeney32
            </a>
            <a
              href="https://linkedin.com/in/iarfhlaith-feeney/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
