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
