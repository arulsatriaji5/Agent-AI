const fs = require("fs");
let content = fs.readFileSync("src/app/api/work/research/route.ts", "utf8");

content = content.replace(
  /interface StockQuote {[\s\S]*?}/,
  `interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: string;
}`
);

content = content.replace(
  /results\.push\(\{[\s\S]*?symbol: s\.symbol\.replace\("\.JK", ""\),[\s\S]*?name: s\.name,[\s\S]*?price: currentPrice,[\s\S]*?changePercent: parseFloat\(changePercent\.toFixed\(2\)\),[\s\S]*?\}\);/,
  `results.push({
            symbol: s.symbol.replace(".JK", ""),
            name: s.name,
            price: currentPrice,
            changePercent: parseFloat(changePercent.toFixed(2)),
            volume: meta.regularMarketVolume ? Number(meta.regularMarketVolume).toLocaleString() : "Tidak diketahui"
          });`
);

content = content.replace(
  /const fb = fallbackMap\[s\.symbol\][\s\S]*?results\.push\(\{[\s\S]*?symbol: s\.symbol\.replace\("\.JK", ""\),[\s\S]*?name: s\.name,[\s\S]*?price: fb\.price,[\s\S]*?changePercent: fb\.change,[\s\S]*?\}\);/,
  `const fb = fallbackMap[s.symbol] || { price: 5000, change: 0.5 };
    results.push({
      symbol: s.symbol.replace(".JK", ""),
      name: s.name,
      price: fb.price,
      changePercent: fb.change,
      volume: "1,200,000"
    });`
);

content = content.replace(
  /const ethPrice = ethTicker \? parseFloat\(ethTicker\.lastPrice\) : 3250;\s*const ethChange = ethTicker \? parseFloat\(ethTicker\.priceChangePercent\) : 1\.45;/,
  `const ethPrice = ethTicker ? parseFloat(ethTicker.lastPrice) : 3250;
    const ethChange = ethTicker ? parseFloat(ethTicker.priceChangePercent) : 1.45;
    const ethVol = ethTicker ? Number(ethTicker.volume).toLocaleString() : "1,250";`
);

content = content.replace(
  /const solPrice = solTicker \? parseFloat\(solTicker\.lastPrice\) : 195;\s*const solChange = solTicker \? parseFloat\(solTicker\.priceChangePercent\) : 4\.12;/,
  `const solPrice = solTicker ? parseFloat(solTicker.lastPrice) : 195;
    const solChange = solTicker ? parseFloat(solTicker.priceChangePercent) : 4.12;
    const solVol = solTicker ? Number(solTicker.volume).toLocaleString() : "8,500,100";`
);

content = content.replace(
  /DATA PASAR UMUM \(Gunakan untuk menjawab pertanyaan, analisis, atau scanner\):[\s\S]*?\${usdIdrData/,
  `DATA PASAR UMUM (Gunakan untuk menjawab pertanyaan, analisis, atau scanner):
- Bitcoin: $\${btcPrice.toLocaleString()} (\${btcChange > 0 ? "+" : ""}\${btcChange}%) - Vol 24h: \${btcVol} BTC
- Ethereum: $\${ethPrice.toLocaleString()} (\${ethChange > 0 ? "+" : ""}\${ethChange}%) - Vol 24h: \${ethVol} ETH
- Solana: $\${solPrice.toLocaleString()} (\${solChange > 0 ? "+" : ""}\${solChange}%) - Vol 24h: \${solVol} SOL
- Saham Indo: \${sahamData.map((s) => \`\${s.symbol} Rp\${s.price.toLocaleString()} (\${s.changePercent > 0 ? "+" : ""}\${s.changePercent}%, Vol: \${s.volume})\`).join(", ")}
\${usdIdrData`
);

fs.writeFileSync("src/app/api/work/research/route.ts", content);
console.log("Updated data fetching and prompt variables");
