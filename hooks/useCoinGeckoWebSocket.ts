import { useEffect, useRef, useState } from "react";

const WS_URL = `${process.env.NEXT_PUBLIC_COINGECKO_WS_URL}?x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export const useCoinGeckoWebSocket = ({
    coinId,
    poolId,
    liveInterval}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
        const wsRef = useRef<WebSocket | null>(null);
        const subscribed = useRef<Set<string>>(new Set());

        const [price, setPrice] = useState<ExtendedPriceData | null>(null);
        const [trades, setTrades] = useState<Trade[]>([]);
        const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

        const [iswsReady, setIsWsReady] = useState(false);

        useEffect(() => {
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            const send = (payload: Record<string, unknown>) => 
                ws.send(JSON.stringify(payload));

            const handleMessage = (event: MessageEvent) => {
                let msg: WebSocketMessage;
                try {
                    msg = JSON.parse(event.data);
                } catch (error) {
                    console.warn('Failed to parse WebSocket message:', error);
                    return;
                }
                console.log('WebSocket message received:', msg);

                if (msg.type === 'ping') {
                    send({type: 'pong'});
                    return;
                
                }   
            

                if (msg.type === 'confirm_subscription') {
                    if (msg.identifier && typeof msg.identifier === 'string' && msg.identifier.trim()) {
                        try {
                            const { channel} = JSON.parse(msg.identifier);
                            subscribed.current.add(channel);
                            console.log('Subscription confirmed for channel:', channel);
                        } catch (error) {
                            console.warn('Failed to parse subscription identifier:', error);
                        }
                    } else {
                        console.warn('Invalid or missing subscription identifier');
                    }
                }
                if (msg.c === "C1") {
                    setPrice({
                        usd: msg.p ?? 0,
                        coin: msg.i,
                        price: msg.p,
                        change24h: msg.pp,
                        marketCap: msg.m,
                        volume24h: msg.v,
                        timestamp: msg.t,

                    });
                }
                if (msg.c === 'G2') {
                   const newTrade: Trade = {
                      price: msg.pu,
                      value: msg.vo,
                      timestamp: msg.t ?? 0,
                      type: msg.ty,
                      amount: msg.to,
                    };
                    console.log('New trade received:', newTrade);
                    setTrades((prev) => [newTrade, ...prev].slice(0, 7));
                }  
                if (msg.c === 'G3') {
                    const timestamp = msg.t ?? 0;

                    const candle: OHLCData = [
                       timestamp,
                       Number(msg.o ?? 0),
                       Number(msg.h ?? 0),
                       Number(msg.l ?? 0),
                       Number(msg.cl ?? 0),
                    ];

                setOhlcv(candle);
             }
            };
            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsWsReady(true);
            };
            ws.onmessage = handleMessage;
            ws.onclose = () => 
                setIsWsReady(false);
            return () => 
                ws.close();
            
    }, []);

     useEffect(() => {
    if (!iswsReady) return;
    const ws = wsRef.current;
    if (!ws) return;

    const send = (payload: Record<string, unknown>) => ws.send(JSON.stringify(payload));

    const unsubscribeAll = () => {
      subscribed.current.forEach((channel) => {
        send({
          command: 'unsubscribe',
          identifier: JSON.stringify({ channel }),
        });
      });

      subscribed.current.clear();
    };

    const subscribe = (channel: string, data?: Record<string, unknown>) => {
      if (subscribed.current.has(channel)) return;

      send({ command: 'subscribe', identifier: JSON.stringify({ channel }) });
      console.log('Subscribing to:', channel);

      if (data) {
        send({
          command: 'message',
          identifier: JSON.stringify({ channel }),
          data: JSON.stringify(data),
        });
        console.log('Sent data for channel:', channel, data);
      }
    };

    queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);

      unsubscribeAll();

      subscribe('CGSimplePrice', { coin_id: [coinId], action: 'set_tokens' });
    });

    const poolAddress = poolId.replace('_', ':');
    console.log('Pool ID:', poolId, 'Pool Address:', poolAddress);

    if (poolAddress) {
      subscribe('OnchainTrade', {
        'network_id:pool_addresses': [poolAddress],
        action: 'set_pools',
      });

      subscribe('OnchainOHLCV', {
        'network_id:pool_addresses': [poolAddress],
        interval: liveInterval,
        action: 'set_pools',
      });
    } else {
      console.warn('No pool address available');
    }
  }, [coinId, poolId, iswsReady, liveInterval]);

  return {
    price,
    trades,
    ohlcv,
    isConnected: iswsReady,
  };
};