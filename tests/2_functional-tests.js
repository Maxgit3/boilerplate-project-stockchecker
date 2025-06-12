const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
suite('Functional Tests', function() {
test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
chai.request(server)
  .get('/api/stock-prices/')
  .query({ stock: 'GOOG'})
  .end((err, res) => {

    assert.equal(res.body.stockData.stock, 'GOOG', 'Stock symbol should be GOOG');
    assert.equal(res.status, 200, 'Response status should be 200');
    assert.exists(res.body.stockData.price, 'Price should be present');
    done();
  });
})

test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
chai.request(server)
  .get('/api/stock-prices/')
  .query({ stock: 'AAPL', like: true })
  .end((err, res) => {

    assert.equal(res.body.stockData.stock, 'AAPL', 'Stock symbol should be AAPL');
    assert.equal(res.status, 200, 'Response status should be 200');
    assert.exists(res.body.stockData.price, 'Price should be present');
    assert.isAtLeast(res.body.stockData.likes, 1, 'Likes should be at least 1');
    done();
  });
})

test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
chai.request(server)
  .get('/api/stock-prices/')
  .query({ stock: 'AAPL', like: true })
  .end((err, res) => {

    assert.equal(res.body.stockData.stock, 'AAPL', 'Stock symbol should be AAPL');
    assert.equal(res.status, 200, 'Response status should be 200');
    assert.exists(res.body.stockData.price, 'Price should be present');
    assert.equal(res.body.stockData.likes, 1, 'Likes should be at least 1');
    done();
  });
})

test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
chai.request(server)
  .get('/api/stock-prices/')
  .query({ stock: ['GOOG', 'MSFT'] })
  .end((err, res) => {

    assert.isArray(res.body.stockData, 'Response should be an array');
    assert.equal(res.body.stockData.length, 2, 'There should be two stocks in the response');
    assert.equal(res.status, 200, 'Response status should be 200');
    assert.exists(res.body.stockData[0].price, 'Price for first stock should be present');
    assert.exists(res.body.stockData[1].price, 'Price for second stock should be present');
    done();
  });
})
test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
chai.request(server)
  .get('/api/stock-prices/')
  .query({ stock: ['GOOG', 'TSLA'], like: true })
  .end((err, res) => {

    assert.isArray(res.body.stockData, 'Response should be an array');
    assert.equal(res.body.stockData.length, 2, 'There should be two stocks in the response');
    assert.equal(res.status, 200, 'Response status should be 200');
    assert.exists(res.body.stockData[0].price, 'Price for first stock should be present');
    assert.exists(res.body.stockData[1].price, 'Price for second stock should be present');
    assert.isNumber(res.body.stockData[0].rel_likes, 'Likes for first stock should be a number');
    assert.isNumber(res.body.stockData[1].rel_likes, 'Likes for second stock should be a number');
    assert.notEqual(res.body.stockData[0].rel_likes, res.body.stockData[1].rel_likes, 'Likes for two stocks should not be equal');
    done();
  });
})

});
