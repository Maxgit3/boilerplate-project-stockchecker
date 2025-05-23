'use strict';

const url = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote"
module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      // console.log(req.query)
      if (req.query.stock) {
        const stock = req.query.stock;
        // console.log(stock);
        const like = req.query.like;
        // console.log(like);
        const newURl = url.replace("[symbol]", stock);
        console.log(newURl);
        // app.get(newURl, (req, res) => {
        //   const stockData = res.data;
        //   console.log(stockData);
        //   if (stockData) {
        //     const response = {
        //       stock: stock,
        //       price: stockData.latestPrice,
        //       likes: like ? 1 : 0
        //     };
        //     res.json(response);
        //   } else {
        //     res.status(404).send('Stock not found');
        //   }
        // });
        // Fetch the stock data from the API
        const stockresponse = await fetch(newURl)
        const stockData = await stockresponse.json();
        console.log(stockData);
        return res.json({"stockData": {}})
      }
    });
    
};
