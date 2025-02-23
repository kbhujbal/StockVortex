# **StockVortex - MERN Stock Market App** 📈💹  
*A modern, real-time stock market tracking and trading application built with the MERN stack.*

## 🚀 Overview  
TickrFlow is a full-stack stock market application that allows users to:  
✅ Search for stock details by entering a ticker symbol.  
✅ View real-time stock prices and historical variations (1, 3, 6, 12 months).  
✅ Buy and sell stocks with a user-friendly trading interface.  
✅ Stay updated with the latest news related to the searched stock.  

## 🛠 Tech Stack  
- **Frontend:** React.js, Redux, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **API Integration:** Finnhub API, Polygon.io API, Highcharts API  

## 🎯 Features  
- 🔎 **Real-time Stock Search**: Enter a ticker symbol to fetch details instantly.  
- 📊 **Historical Price Chart**: Visualizes stock price changes over multiple timeframes.  
- 💰 **Buy & Sell Functionality**: Simulated trading experience with stock transactions.  
- 📰 **Stock Market News**: Displays the latest financial news about a company.  
- 🔐 **User Authentication**: Secure login/signup using JWT & bcrypt.  
- ⭐ **Watchlist**: Add and manage favorite stocks.  
- 📈 **Portfolio Tracking**: Manage stock investments with profit/loss calculations.  

 

## 📂 Installation & Setup  
1. **Clone the repository:**  
   ```sh
   git clone https://github.com/yourusername/stock-search.git
   cd stock-search
   ```

2. **Install dependencies:**  
   - Backend:  
     ```sh
     cd backend
     npm install
     ```
   - Frontend:  
     ```sh
     cd frontend
     npm install
     ```

3. **Set up environment variables:**  
   - Create a `.env` file in the backend and add:  
     ```sh
     MONGO_URI=your_mongodb_connection_string
     FINNHUB_API_KEY=your_finnhub_api_key
     POLYGON_API_KEY=your_polygon_api_key
     JWT_SECRET=your_jwt_secret
     ```

4. **Run the application:**  
   - Start the backend server:  
     ```sh
     cd backend
     npm start
     ```
   - Start the frontend:  
     ```sh
     cd frontend
     npm start
     ```

5. **Access the app:**  
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 APIs Used  
- **Finnhub API**: Fetch stock details, historical data, news, recommendation trends.  
- **Polygon.io API**: Fetch detailed stock historical price data.  
- **Highcharts API**: Create interactive stock price charts.  

## 📌 Contributing  
Feel free to fork the repository, create a feature branch, and submit a pull request. Contributions are welcome!

---