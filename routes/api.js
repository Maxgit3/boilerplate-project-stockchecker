'use strict';

const fetch = require('node-fetch');
const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const stockLikeSchema = new mongoose.Schema({
  stock: { type: String, required: true },
  hashedIp: { type: String, required: true},
});

const StockLike = mongoose.model('StockLike', stockLikeSchema);

const url = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote"
module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      console.log(req.query)
      if (!Array.isArray(req.query.stock)) {
        const stock = req.query.stock;
        // console.log(typeof stock);

        const like = req.query.like;
        // console.log(like);

        const clientIp = req.ip;
        const hashedIp = crypto.createHash('sha256').update(clientIp).digest('hex');

        const newURl = url.replace("[symbol]", stock);
        // console.log(newURl);
        let returnLike = 0
        if (like && like === "true") {
          const existing = await StockLike.findOne({ stock, hashedIp });
          // console.log(existing)
        if (!existing) {
          await StockLike.create({ stock, hashedIp });
        }
        }
        // Count total likes for this stock
        returnLike = await StockLike.countDocuments({ stock });

        // console.log(typeof returnLike);
        // Fetch the stock data from the API
        const stockresponse = await fetch(newURl)
        const stockData = await stockresponse.json();
        // console.log(stockData);
        if (stockData === "Unknown symbol") {
          return res.status(404).json({"stockData":'Stock not found'});
        }

        return res.send({stockData: {stock: stockData.symbol.toUpperCase(), price: Number(stockData.latestPrice), likes: returnLike}});
      }

      if (Array.isArray(req.query.stock)) {
        const stock1 = req.query.stock[0];
        const stock2 = req.query.stock[1];

        const clientIp = req.ip;
        const hashedIp = crypto.createHash('sha256').update(clientIp).digest('hex');

        const newURl1 = url.replace("[symbol]", stock1);
        const newURl2 = url.replace("[symbol]", stock2);

        let returnLike1 = 0;
        let returnLike2 = 0;

        if (req.query.like && req.query.like === "true") {
          const existing1 = await StockLike.findOne({ stock: stock1, hashedIp });
          if (!existing1) {
            await StockLike.create({ stock: stock1, hashedIp });
          }
          returnLike1 = await StockLike.countDocuments({ stock: stock1 });

          const existing2 = await StockLike.findOne({ stock: stock2, hashedIp });
          if (!existing2) {
            await StockLike.create({ stock: stock2, hashedIp });
          }
          returnLike2 = await StockLike.countDocuments({ stock: stock2 });
        }

        returnLike1 = returnLike1 - returnLike2;
        returnLike2 = returnLike2 - returnLike1;
        // Fetch the stock data from the API
        const [stockData1, stockData2] = await Promise.all([
          fetch(newURl1).then(res => res.json()),
          fetch(newURl2).then(res => res.json())
        ]);

        if (stockData1 === "Unknown symbol" || stockData2 === "Unknown symbol") {
          return res.status(404).json({"stockData":'Stock not found'});
        }

        return res.send({
          stockData: [
            {stock: stockData1.symbol.toUpperCase(), price: Number(stockData1.latestPrice), rel_likes: returnLike1},
            {stock: stockData2.symbol.toUpperCase(), price: Number(stockData2.latestPrice), rel_likes: returnLike2}
          ]
        });
      }
    });
    
};
