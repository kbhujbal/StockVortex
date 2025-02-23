const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5001;
const mongoose = require("mongoose");
const Stock = require("./Models/Stock");
const Portfolio = require("./Models/Portfolio");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// kbhujbal
// 7wxYSOj7XQG92fIo
// mongodb+srv://kbhujbal:7wxYSOj7XQG92fIo@csci571assignment3.vcqnyvb.mongodb.net/?retryWrites=true&w=majority&appName=CSCI571Assignment3
// mongodb+srv://kbhujbal:<password>@csci571assignment3.vcqnyvb.mongodb.net/

// Helper functions Start here

function getYesterdaysDate() {
  const today = new Date();
  let yesterday = new Date(today);

  // Check if today is Sunday (0) or Monday (1)
  if (today.getDay() === 0) {
    // If today is Sunday
    // Set to Friday
    yesterday.setDate(today.getDate() - 2);
  } else if (today.getDay() === 1) {
    // If today is Monday
    // Set to Friday
    yesterday.setDate(today.getDate() - 3);
  } else {
    // Regular previous day
    yesterday.setDate(today.getDate() - 1);
  }

  const yyyy = yesterday.getFullYear();
  let mm = yesterday.getMonth() + 1; // getMonth() returns 0-11
  let dd = yesterday.getDate();

  // mm = mm < 10 ? "0" + mm : mm;
  // dd = dd < 10 ? "0" + dd : dd;

  mm = mm < 10 ? `0${mm}` : mm;
  dd = dd < 10 ? `0${dd}` : dd;

  return `${yyyy}-${mm}-${dd}`;
}

function getTodaysDate() {
  const today = new Date();

  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // getMonth() returns 0-11
  let dd = today.getDate();

  // mm = mm < 10 ? "0" + mm : mm;
  // dd = dd < 10 ? "0" + dd : dd;
  mm = mm < 10 ? `0${mm}` : mm;
  dd = dd < 10 ? `0${dd}` : dd;

  return `${yyyy}-${mm}-${dd}`;
}

function getDateBeforeTwoYears() {
  const today = new Date();
  const twoYearsAgo = new Date(today.setFullYear(today.getFullYear() - 2));

  const yyyy = twoYearsAgo.getFullYear();
  let mm = twoYearsAgo.getMonth() + 1; // getMonth() returns 0-11
  let dd = twoYearsAgo.getDate();

  mm = mm < 10 ? "0" + mm : mm;
  dd = dd < 10 ? "0" + dd : dd;

  return `${yyyy}-${mm}-${dd}`;
}


function getDateBeforeOneWeek() {
  const today = new Date();
  let oneWeekAgo = new Date(today);

  // Subtract 7 days from today
  oneWeekAgo.setDate(today.getDate() - 7);

  const yyyy = oneWeekAgo.getFullYear();
  let mm = oneWeekAgo.getMonth() + 1; // getMonth() returns 0-11
  let dd = oneWeekAgo.getDate();

  mm = mm < 10 ? `0${mm}` : mm;
  dd = dd < 10 ? `0${dd}` : dd;

  return `${yyyy}-${mm}-${dd}`;
}

// Helper functions ends here

// Database setup code starts here
const dbURI =
  "mongodb+srv://kbhujbal:7wxYSOj7XQG92fIo@csci571assignment3.vcqnyvb.mongodb.net/?retryWrites=true&w=majority&appName=CSCI571Assignment3";

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

//const Portfolio = require('./Models/Portfolio'); // Assuming you have a model file for your portfolios
//const Stock = require('./Models/Stock'); // And one for your stocks
// Database setup code ends here

app.get("/api/autocomplete", async (req, res) => {
  const searchText = req.query.q;
  if (!searchText) {
    return res.json([]);
  }

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(
        searchText,
      )}&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
});

app.get("/api/selectSymbol", async (req, res) => {
  const symbol = req.query.symbols;

  if (!symbol) {
    return res.status(400).json({ message: "No symbol provided" });
  }

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(
        symbol,
      )}&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error processing your request:", error);
    res.status(500).json({ message: "Error processing your request" });
  }
});

const isInWatchList = async (symbol) => {
  const watchlistStock = await Stock.findOne({ symbol: symbol });
  return watchlistStock !== null;
};

app.get("/api/chng_stock_15_sec", async (req, res) => {
  // no cache
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const searchText = req.query.agnTckr;
  if (!searchText) {
    return res.json([]);
  }
  // https://finnhub.io/api/v1/quote?symbol=MSFT&token=<API_KEY>
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
        searchText,
      )}&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
    );

    const responseData = {
      ...response.data,
      isInWatchList: await isInWatchList(searchText),
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
});

// To Fetch Data for Summary Chart
app.get("/api/summaryChart", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) {
    return res.status(400).json({ message: "No symbol provided" });
  }

  try {
    const toDate = getTodaysDate();
    const yestDay = getYesterdaysDate();
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(
        symbol
      )}/range/1/hour/${yestDay}/${toDate}?adjusted=true&%20sort=asc&apiKey=QlqVUzeA5fxtwbac2mjhiqiBWUYitU0p`,
    );
    const peers = await axios.get(
      `https://finnhub.io/api/v1/stock/peers?symbol=${encodeURIComponent(
        symbol,
      )}&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
    );

    const combinedSummary = {
      chart_data: response.data,
      peerst: peers.data,
    };

    res.json(combinedSummary);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ message: "Error fetching stock data" });
  }
});

// To fetch data for Top News
app.get("/api/news", async (req, res) => {
  const sYmbol = req.query.news_symbol; // Retrieve the symbol from query parameters

  if (!sYmbol) {
    return res.status(400).json({ message: "No symbol provided" });
  }

  try {
    const toDate = getTodaysDate();
    const weekbfordate = getDateBeforeOneWeek();
    const response = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(
        sYmbol,
      )}&from=${weekbfordate}&to=${toDate}&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
    );
    // console.log(response);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Error fetching news" });
  }
});

// To fetch data for Insights data
app.get("/api/insights", async (req, res) => {
  const syMbol = req.query.insights_symbol; // Retrieve the symbol from query parameters

  if (!syMbol) {
    return res.status(400).json({ message: "No symbol provided" });
  }

  try {
    const response_insights = await axios.get(
      `https://finnhub.io/api/v1/stock/recommendation?symbol=${encodeURIComponent(
        syMbol,
      )}&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
    );
    const insider_sentiments = await axios.get(
      `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${encodeURIComponent(
        syMbol,
      )}&from=2022-01-01&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
    );
    const company_earnings = await axios.get(
      `https://finnhub.io/api/v1/stock/earnings?symbol=${encodeURIComponent(
        syMbol,
      )}&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
    );

    const combinedResponse = {
      insights: response_insights.data,
      sentiments: insider_sentiments.data,
      surprise: company_earnings.data,
    };

    // console.log(insider_sentiments.data);
    // console.log(company_earnings.data);
    res.json(combinedResponse);
  } catch (error) {
    console.error("Error fetching Insights:", error);
    res.status(500).json({ message: "Error fetching Insights" });
  }
});

// To fetch data for Charts
app.get("/api/charts", async (req, res) => {
  const syMbol = req.query.insights_symbol;
  console.log(syMbol);
  if (!syMbol) {
    return res.status(400).json({ message: "No symbol provided" });
  }

  try {
    const two_years_before = getDateBeforeTwoYears();
    const toDate = getTodaysDate();
    const charts_data = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(
        syMbol,
      )}/range/1/day/${two_years_before}/${toDate}?adjusted=true&sort=asc&apiKey=QlqVUzeA5fxtwbac2mjhiqiBWUYitU0p`,
    );

    res.json(charts_data.data);
  } catch (error) {
    console.error("Error fetching Charts Data:", error);
    // res.status(500).json({ message: 'Error fetching Charts' });
  }
});

// Database Routes Starts Here

// To save in watchlist
app.post("/api/watchlist", (req, res) => {
  const { symbol, name } = req.body; // Extract symbol and name from the request body

  // Here you would typically handle the received data, such as saving it to a database
  console.log("Adding to watchlist:", symbol, name);

  async function createDocument() {
    const newStock = new Stock({
      symbol: symbol,
      name: name,
    });
    try {
      const result = await newStock.save();
      console.log(result);
      res.status(200).json({ message: "Data Insertedˀz" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }

  createDocument();
});

// To remove symbol from watchlist
app.delete("/api/watchlist/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    await Stock.findOneAndDelete({ symbol: symbol });

    res.status(200).json({ message: "Symbol Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete symbol" });
  }
});

// To add and update portfolio data for a symbol
app.post("/api/portfolio", async (req, res) => {
  const { symbol, price, quantity, name } = req.body;

  // Check if quantity is a valid number
  if (isNaN(quantity)) {
    return res.status(400).json({ message: "Quantity must be a number" });
  }

  try {
    // Fetch portfolio with the given symbol
    let curPortfolio = await Portfolio.findOne({ symbol: symbol });

    if (!curPortfolio) {
      // If portfolio doesn't exist, create a new one
      const newPortfolio = new Portfolio({
        symbol: symbol,
        price: price,
        name: name,
        quantity: parseInt(quantity), // Parse quantity to ensure it's a number
      });
      await newPortfolio.save(); // Save the new portfolio to the database
      res.status(200).json(newPortfolio);
    } else {
      // If portfolio already exists, update its quantity and price
      const updatedQuantity = curPortfolio.quantity + parseInt(quantity);
      const updatedPrice = curPortfolio.price + parseFloat(price);

      // Update the portfolio
      curPortfolio = await Portfolio.findOneAndUpdate(
        { symbol: symbol },
        { quantity: updatedQuantity, price: updatedPrice },
        { new: true },
      );

      res.status(200).json(curPortfolio);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save in Portfolio" });
  }
});
// To sell shares

app.post("/api/portfolio/sell", async (req, res) => {
  const { symbol, quantity, price } = req.body;

  try {
    const filter = { symbol: symbol };
    const curPortfolio = await Portfolio.findOne(filter);
    const updatedData = {
      quantity: curPortfolio.quantity - quantity,
      price: curPortfolio.price - price,
    };
    const result = await Portfolio.findOneAndUpdate(filter, updatedData, {
      new: true,
    });
    res.status(200).json(result);
  } catch {
    res.status(400).json({ message: "Failed to sell shares" });
  }
});

// delete portfolio
app.delete("/api/portfolio/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    await Portfolio.deleteOne({ symbol: symbol });
    res.status(200).json({ message: "Portfolio deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete Portfolio" });
  }
});

// To get Portfolio data for a symbol

app.get("/api/shares/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const shares = await Portfolio.findOne({ symbol: symbol });
    res.status(200).json(shares);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve shares" });
  }
});

// To get portfolio data with stock data
app.get("/api/portfolios", async (req, res) => {
  try {
    const portfolios = await Portfolio.find({});
    const portfolioWithStockData = [];
    await Promise.all(
      portfolios.map(async (portfolio) => {
        const stockData = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
            portfolio.symbol,
          )}&token=cmte1vhr01qqtangp710cmte1vhr01qqtangp71g`,
        );
        const responseData = await stockData.data;
        const newData = { portfolio: portfolio, stockData: responseData };
        portfolioWithStockData.push(newData);
      }),
    );

    return res.status(200).json(portfolioWithStockData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve portfolios" });
  }
});

// To get watchlist data
app.get("/api/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve stocks" });
  }
});

// Database Routes Ends Here

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
