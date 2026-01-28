import Datatable from '@/components/Datatable'
import React from 'react'

export const CoinoverviewFallback = () => {
  return (
    <div className='animate-pulse'>
      <div id='coin-overview'>
        <div className='header'>
          <div className='size-14 md:size-16 rounded-full bg-dark-500' />
          <div className='info gap-2 flex flex-col'>
            <div className='h-5 w-32 bg-dark-500 rounded' />
            <div className='h-8 w-40 bg-dark-500 rounded' />
          </div>
        </div>
      </div>
    </div>
  )
}

export const TrendingcoinFallback = () => {
  const skeletonColumns: DataTableColumn<object>[] = [
    {
      header: 'Name',
      cellClassName: 'name-cell',
      cell: () => (
        <div className='animate-pulse name-link'>
          <div className='name-image bg-dark-500 rounded-full' />
          <div className='name-line bg-dark-500 rounded' />
        </div>
      ),
    },
    {
      header: '24h Price Change',
      cellClassName: 'change-cell',
      cell: () => (
        <div className='animate-pulse flex gap-1 items-center'>
          <div className='change-icon bg-dark-500' />
          <div className='change-line bg-dark-500 rounded' />
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: () => <div className='animate-pulse price-line bg-dark-500 rounded' />,
    },
  ]

  const skeletonData = Array(6).fill(null)

  return (
    <div id='trending-coins-fallback'>
      <h4>Trending Coins</h4>
      <div id='trending-coins'>
        <Datatable
          data={skeletonData}
          columns={skeletonColumns}
          rowKey={(_, index) => index}
          tableClassName='trending-coins-table'
          headerCellClassName='py-3!'
          bodyCellClassName='py-2'
        />
      </div>
    </div>
  )
}

export const CategoriesFallback = () => {
  const skeletonColumns: DataTableColumn<Category>[] = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: () => <div className='category-skeleton bg-dark-500 rounded animate-pulse' />,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: () => (
        <div className='flex gap-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='coin-skeleton bg-dark-500 rounded-full animate-pulse' />
          ))}
        </div>
      ),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: () => (
        <div className='change-cell gap-2 items-center'>
          <div className='change-icon bg-dark-500 animate-pulse' />
          <div className='value-skeleton-sm bg-dark-500 rounded animate-pulse' />
        </div>
      ),
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: () => <div className='value-skeleton-lg bg-dark-500 rounded animate-pulse' />,
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: () => <div className='value-skeleton-md bg-dark-500 rounded animate-pulse' />,
    },
  ]

  const skeletonData = Array(8).fill(null)

  return (
    <div id='categories-fallback'>
      <h4>Top Categories</h4>

      <Datatable
        data={skeletonData}
        columns={skeletonColumns}
        rowKey={(_, index) => index}
        tableClassName='mt-3'
        headerCellClassName='py-3!'
        bodyCellClassName='py-3'
      />
    </div>
  )
}
