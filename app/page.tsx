import Categories from '@/components/home/Categories'
import Coinoverview from '@/components/home/Coinoverview'
import Trendingcoin from '@/components/home/Trendingcoin'
import {
  CategoriesFallback,
  CoinoverviewFallback,
  TrendingcoinFallback,
} from '@/components/home/fallback'
import React from 'react'
import { Suspense } from 'react'

const page = async () => {
  return (
    <main className='main-container'>
      <section className='home-grid'>
        <Suspense fallback={<CoinoverviewFallback />}>
          <Coinoverview />
        </Suspense>

        <Suspense fallback={<TrendingcoinFallback />}>
          <Trendingcoin />
        </Suspense>
      </section>

      <section className='w-full mt-7 space-y-4'>
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  )
}

export default page
