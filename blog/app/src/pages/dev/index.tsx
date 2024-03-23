import { InferGetStaticPropsType, NextPage } from 'next'

import SubHeading from '@/components/layout/SubHeading'

const Dev: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({}) => {
  return (
    <>
      <SubHeading text="dev"></SubHeading>
      <div className="mx-auto md:px-5 py-12 md:max-w-5xl">工事中</div>
    </>
  )
}

export const getStaticProps = async () => {
  return {
    props: {},
  }
}

export default Dev
