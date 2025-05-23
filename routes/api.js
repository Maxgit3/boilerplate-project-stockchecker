'use strict';

const fetch = require('node-fetch');
const crypto = require('crypto');
const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const stockLikeSchema = new mongoose.Schema({
  stock: { type: String, required: true },
  hashedIp: { type: String, required: true },
});

const StockLike = mongoose.model('StockLike', stockLikeSchema);

const url = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote"
module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      // console.log(req.query)
      if (req.query.stock) {
        const stock = req.query.stock;
        // console.log(typeof stock);

        const like = req.query.like;
        console.log(like);

        const clientIp = req.ip;
        const hashedIp = crypto.createHash('sha256').update(clientIp).digest('hex');

        const newURl = url.replace("[symbol]", stock);
        // console.log(newURl);
        let returnLike = 0
        if (like && like === "true") {
          // const existing = await StockLike.findOne({ stock, hashedIp });
        if (!existing) {
          // await StockLike.create({ stock, hashedIp });
        }
        }
        // Count total likes for this stock
        // returnLike = await StockLike.countDocuments({ stock });

        console.log(typeof returnLike);
        // Fetch the stock data from the API
        const stockresponse = await fetch(newURl)
        const stockData = await stockresponse.json();
        console.log(stockData);
        if (stockData === "Unknown symbol") {
          return res.status(404).json({"stockData":'Stock not found'});
        }

        return res.send({stockData: {stock: stockData.symbol.toUpperCase(), price: Number(stockData.latestPrice), likes: returnLike}});
      }
    });
    
};
