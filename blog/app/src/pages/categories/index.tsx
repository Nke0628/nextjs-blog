import { InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'

import Badge from '@/components/atoms/Badge'
import SubHeading from '@/components/layout/SubHeading'
import { client } from '@/modules/client'
import { categories } from '@/types/type'

type Props = {
  categories: categories
}

const Categories: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  categories,
}: Props) => {
  return (
    <>
      <SubHeading text="カテゴリー"></SubHeading>
      <div className="py-8 md:w-3/5 mx-auto text-center">
        {categories.map((categorie) => (
          <Link
            key={categorie.id}
            href={{
              pathname: '/articles',
              query: { category_id: categorie.id },
            }}
          >
            <Badge text={categorie.name} key={categorie.id}></Badge>
          </Link>
        ))}
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const data = await client.get({ endpoint: 'categories' })
  return {
    props: {
      categories: data.contents,
    },
  }
}

export default Categories
