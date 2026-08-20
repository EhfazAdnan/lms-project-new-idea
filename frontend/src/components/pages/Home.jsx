import React from 'react'
import Layout from './common/Layout'
import Hero from './common/Hero'
import FeaturedCategories from './common/FeaturedCategories'

const Home = () => {
  return (
    <div>
      <Layout>
        <Hero />
        <FeaturedCategories />
      </Layout>
    </div>
  )
}

export default Home
