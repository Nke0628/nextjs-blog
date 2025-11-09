import Link from 'next/link'

import TechBadge from '@/components/atoms/TechBadge'
import { project } from '@/types/type'

type Props = {
  project: project
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const CardContent = (
    <div className="group rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-soft hover:shadow-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 relative">
      {project.image && (
        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {project.technologies.map((tech, index) => (
            <TechBadge key={index} text={tech.name} color={tech.color} />
          ))}
        </div>
      </div>
      {project.url && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary-600 text-white p-2 rounded-full">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )

  if (project.url) {
    return (
      <Link
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {CardContent}
      </Link>
    )
  }

  return CardContent
}

export default ProjectCard
