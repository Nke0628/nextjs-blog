import React from 'react'

import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'

import Container from '@/components/layout/Container'
import SubHeading from '@/components/layout/SubHeading'
import { client } from '@/modules/client'
import { tags } from '@/types/type'

type Props = {
  tags: tags
}

const TagsIndex: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  tags,
}: Props) => {
  return (
    <Container>
      <SubHeading text="tags" />
      <div className="flex flex-wrap gap-2 mt-8">
        {tags.map((tag) => (
          <Link
            href={`/tags/${tag.slug}/page/1`}
            key={tag.id}
            className="group inline-flex items-center rounded-md border border-ink-300 dark:border-ink-700 bg-white/60 dark:bg-ink-900/60 hover:border-primary-400 dark:hover:border-primary-400/60 hover:shadow-glow px-4 py-2 transition-all duration-200"
          >
            <span className="font-mono text-xs text-ink-600 dark:text-ink-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
              <span className="text-primary-500 dark:text-primary-400 mr-0.5">
                #
              </span>
              {tag.name}
            </span>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await client.get({ endpoint: 'categories' })
  return {
    props: {
      tags: data.contents,
    },
  }
}

export default TagsIndex
