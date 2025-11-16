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
            className="group inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 transition-all duration-200"
          >
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              #{tag.name}
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
