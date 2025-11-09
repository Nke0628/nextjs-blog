import { InferGetStaticPropsType, NextPage } from 'next'

import SubHeading from '@/components/layout/SubHeading'
import ProjectCard from '@/components/organisms/ProjectCard'
import { projects } from '@/types/type'

const Dev: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  projects,
}) => {
  return (
    <>
      <SubHeading text="dev"></SubHeading>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const projects: projects = [
    {
      id: '1',
      title: 'Next.js ブログ',
      description:
        'Next.jsとmicroCMSを使用したブログアプリケーション。Tailwind CSSでスタイリングし、レスポンシブデザインに対応しています。',
      technologies: [
        { name: 'Next.js', color: '#000000' },
        { name: 'TypeScript', color: '#3178C6' },
        { name: 'Tailwind CSS', color: '#06B6D4' },
        { name: 'microCMS', color: '#4051B5' },
        { name: 'Vercel', color: '#000000' },
      ],
      url: 'https://ken-engineer-blog.vercel.app/',
      githubUrl: 'https://github.com/Nke0628/nextjs-blog',
    },
  ]

  return {
    props: {
      projects,
    },
  }
}

export default Dev
