import Link from 'next/link'

import TechBadge from '@/components/atoms/TechBadge'
import { project } from '@/types/type'

type Props = {
  project: project
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const CardContent = (
    <div className="group rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      {project.image && (
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {project.technologies.map((tech, index) => (
            <TechBadge key={index} text={tech.name} color={tech.color} />
          ))}
        </div>
      </div>
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
