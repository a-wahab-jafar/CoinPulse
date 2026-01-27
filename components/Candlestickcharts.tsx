'use client';

import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from "@/constant";
import { fetcher } from "@/lib/coingecko.action";
import { convertOHLCData } from "@/lib/utils";
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import { startTransition, use, useEffect, useRef, useState, useTransition } from "react";


const Candlestickcharts = ({data, coinId, children, height=360,
    initialPeriod='daily',
}: CandlestickChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState(initialPeriod);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();

    const fetchOHLCData = async (selectedPeriod: Period) => {
        try {
          const { days } = PERIOD_CONFIG[selectedPeriod];

          const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
             vs_currency: 'usd',
             days,
             precision: 'full'
      });

      setOhlcData(newData ?? []);
        } catch(e) {
            console.error('Error fetching OHLC data:', e);
        }
    }
    const handlePeriodChange = (newPeriod: Period) => {
        if(newPeriod === period) return;

        startTransition(async () => {
            await fetchOHLCData(newPeriod);
            setPeriod(newPeriod);
        });
    };

    useEffect(() => {
        const conatainer = chartContainerRef.current;
        if(!conatainer) return;

        const showTime = ['daily', 'weekly', 'monthly'].includes(period);

        const chart = createChart(conatainer,{...getChartConfig(height, showTime),
            width: conatainer.clientWidth,
        });
        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

        series.setData(convertOHLCData(ohlcData));
        chart.timeScale().fitContent();

        chartRef.current = chart;
        candleSeriesRef.current = series;

        const observer = new ResizeObserver((entries) => {
            if(!entries.length) return;
            chart.applyOptions({width:entries[0].contentRect.width});
        });
        observer.observe(conatainer);

        return () => {
            observer.disconnect();
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        }
    }, [height]);
    useEffect(() => {
        if(!candleSeriesRef.current) return;

        const convertOHLCDataToSeconds = ohlcData.map( 
            (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
        );

        const converted = convertOHLCData(convertOHLCDataToSeconds);
        candleSeriesRef.current.setData(converted);
        chartRef.current?.timeScale().fitContent();
    },[ohlcData, period]);
    

  return (
    <div id='candlestick-chart'>
        <div className='chart-header'>
            <div className='flex-1'>{children}</div>

            <div className="button-group">
                <span className="text-sm mx-2 font-medium text-purple-100/50">period</span>
                {PERIOD_BUTTONS.map(({value, label}) => (
                    <button key={value} className={period === value ? 'config-button-active': 'config-button'} onClick={() => handlePeriodChange(value)} disabled={loading}>{label}</button>
                ))}
            </div>
        </div>
        <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  );
};

export default Candlestickcharts