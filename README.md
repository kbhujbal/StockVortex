StockVortex - MERN Stock Market App 📈💹
A modern, real-time stock market tracking and trading application built with the MERN stack.

🚀 Overview
TickrFlow is a full-stack stock market application that allows users to:
✅ Search for stock details by entering a ticker symbol.
✅ View real-time stock prices and historical variations (1, 3, 6, 12 months).
✅ Buy and sell stocks with a user-friendly trading interface.
✅ Stay updated with the latest news related to the searched stock.

🛠 Tech Stack
Frontend: React.js, Redux, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB
API Integration: Alpha Vantage / Yahoo Finance / Finnhub API (for stock data & news)
🎯 Features
🔎 Real-time Stock Search: Enter a ticker symbol to fetch details instantly.
📊 Historical Price Chart: Visualizes stock price changes over multiple timeframes.
💰 Buy & Sell Functionality: Simulated trading experience with stock transactions.
📰 Stock Market News: Displays the latest financial news about a company.
🔐 User Authentication: Secure login/signup using JWT & bcrypt.



📂 Installation & Setup
Clone the repository:

sh
Copy
Edit
git clone https://github.com/yourusername/tickrflow.git
cd tickrflow
Install dependencies:

Backend:
sh
Copy
Edit
cd backend
npm install
Frontend:
sh
Copy
Edit
cd frontend
npm install
Set up environment variables:

Create a .env file in the backend and add:
sh
Copy
Edit
MONGO_URI=your_mongodb_connection_string
API_KEY=your_stock_market_api_key
JWT_SECRET=your_jwt_secret
Run the application:

Start the backend server:
sh
Copy
Edit
cd backend
npm start
Start the frontend:
sh
Copy
Edit
cd frontend
npm start
Access the app:

Open http://localhost:3000 in your browser.
📌 Contributing
Feel free to fork the repo, create a feature branch, and submit a PR. Contributions are welcome!

