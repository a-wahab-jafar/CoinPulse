import { fetcher } from '@/lib/coingecko.action';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import { CoinoverviewFallback } from './fallback';
import Candlestickcharts from '@/components/Candlestickcharts';
const Coinoverview = async () => {
  try{
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('coins/bitcoin', {
        dex_pair_format: 'symbol'
      }),
      fetcher<OHLCData[]>('coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        precision: 'full',
      }),
    ]);

  return (
        <div id='coin-overview'>
          <Candlestickcharts data={coinOHLCData} coinId='bitcoin'>
           <div className='header pt-2'>
            <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
            <div className='info'>
              <p>{coin.name} / {coin.symbol.toUpperCase()}</p>
              <h2>{formatCurrency(coin.market_data.current_price.usd)}</h2>
            </div>
          </div>
          </Candlestickcharts>
        </div>
    );
  } catch(error){
    console.error("Error fetching coin overview:", error);
    return <CoinoverviewFallback />;
  }
};

export default Coinoverview;