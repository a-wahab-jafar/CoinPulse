import { fetcher } from '@/lib/coingecko.action';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

const Coinoverview = async () => {
const coin =  await fetcher<CoinDetailsData>('coins/bitcoin', {
     dex_pair_format: 'symbol'
  });
  return (
        <div id='coin-overview'>
          <div className='header pt-2'>
            <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
            <div className='info'>
              <p>{coin.name} / {coin.symbol.toUpperCase()}</p>
              <h2>{formatCurrency(coin.market_data.current_price.usd)}</h2>
            </div>
          </div>
        </div>
  )
}

export default Coinoverview