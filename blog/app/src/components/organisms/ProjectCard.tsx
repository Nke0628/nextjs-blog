import Link from 'next/link'

import TechBadge from '@/components/atoms/TechBadge'
import { project } from '@/types/type'

type Props = {
  project: project
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  const CardContent = (
    <div className="rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      {project.image && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-4 flex-1">{project.description}</p>
        <div className="flex flex-wrap mt-auto">
          {project.technologies.map((tech, index) => (
            <TechBadge key={index} text={tech.name} color={tech.color} />
          ))}
        </div>
      </div>
    </div>
  )

  if (project.url) {
    return (
      <Link href={project.url} target="_blank" rel="noopener noreferrer">
        {CardContent}
      </Link>
    )
  }

  return CardContent
}

export default ProjectCard
