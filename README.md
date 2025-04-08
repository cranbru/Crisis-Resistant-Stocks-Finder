# Crisis-Resistant Stocks Finder

Crisis-Resistant Stocks Finder - A web application that helps investors identify stocks resilient to market crises like pandemics or economic downturns. Analyzes key financial metrics including Piotroski Score, Altman Z-Score, Beta, Free Cash Flow, and Debt-to-Equity Ratio to evaluate stock resilience. Built with vanilla JavaScript and uses Alpha Vantage API for real-time stock data.

## 🌟 Features

- **Real-time Stock Data**: Fetches current stock data using Alpha Vantage API
- **Comprehensive Analysis**: Evaluates multiple financial metrics:
  - Piotroski Score
  - Altman Z-Score
  - Beta (Volatility)
  - Free Cash Flow
  - Debt-to-Equity Ratio
- **Smart Caching**: Implements client-side caching to reduce API calls
- **User-Friendly Interface**: Clean, intuitive design with helpful tooltips
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Alpha Vantage API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cranbru/disaster-proof-stock-checker.git
```

2. Navigate to the project directory:
```bash
cd disaster-proof-stock-checker
```

3. Open `index.html` in your browser or deploy to your preferred hosting service.

## 💡 How to Use

1. **Enter Stock Symbol**
   - Type a stock symbol (e.g., AAPL, MSFT)
   - Use the suggestion box for quick selection

2. **Fetch Data**
   - Click "Fetch Stock Data" to get current metrics
   - Some values may need manual entry

3. **Evaluate Resilience**
   - Fill in any missing values
   - Click "Check Resilience" for analysis
   - View detailed results and score

## 📊 Evaluation Criteria

The tool evaluates stocks based on five key metrics:

1. **Piotroski Score** (≥ 8 is strong)
2. **Altman Z-Score** (> 3 indicates safety)
3. **Beta** (< 1 shows lower volatility)
4. **Free Cash Flow** (positive is good)
5. **Debt-to-Equity Ratio** (< 1 is favorable)

## 🔧 Technical Details

- Built with vanilla JavaScript
- Uses Alpha Vantage API for stock data
- Implements client-side caching with localStorage
- Responsive design with CSS
- Error handling and loading states

## 📚 Resources

Find financial metrics on:
- [Screener.in](https://www.screener.in/)
- [Tickertape](https://www.tickertape.in/)
- [Yahoo Finance](https://finance.yahoo.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Abhinav Gupta**
- LinkedIn: [Abhinav Gupta](https://www.linkedin.com/in/abhinav-gupta-772972322/)
- GitHub: [cranbru](https://github.com/cranbru)

## 🙏 Acknowledgments

- Alpha Vantage for providing stock data API
- All contributors and users of the application 
