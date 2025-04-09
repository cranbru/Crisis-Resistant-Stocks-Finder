// stock-fetcher.js

// API key management
// I KNOW API KEYS ARE PUBLIC, I MADE THEM ANONYMOUSLY :)
const API_KEYS = [
  "6L6HQ03YI1GQ4PG7",
  "UNHIP6BV0V4WBMUQ",
  "Y0RTFV8W6QSW6XQU",
  "BCAUMS2UN1I1UIC2",
  "570G7YQTA6RWBG84",
  "NRJ6BRBFM69I9JKK"
];
let currentKeyIndex = 0;
const cache = JSON.parse(localStorage.getItem("stockCache") || "{}");

// Local database for Piotroski and Altman Z-Scores
const localData = {
  "AAPL": { piotroski: 7, altman: 5.6 },
  "MSFT": { piotroski: 8, altman: 6.2 },
  "GOOGL": { piotroski: 6, altman: 5.4 },
  "AMZN": { piotroski: 5, altman: 4.8 },
  "TSLA": { piotroski: 4, altman: 3.7 },
  "META": { piotroski: 7, altman: 5.9 },
  "NVDA": { piotroski: 6, altman: 6.0 },
  "BRK.B": { piotroski: 8, altman: 6.5 },
  "JNJ": { piotroski: 7, altman: 5.8 },
  "JPM": { piotroski: 6, altman: 4.9 }
};

async function fetchWithRotation(urlBuilder) {
  for (let i = 0; i < API_KEYS.length; i++) {
    const key = API_KEYS[currentKeyIndex];
    const url = urlBuilder(key);
    const response = await fetch(url);
    const data = await response.json();

    if (!data.Note) return data;

    console.warn(`Key ${key} hit limit, rotating...`);
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  }
  throw new Error("All API keys are throttled.");
}

async function fetchStockData(symbol) {
  const resultBox = document.getElementById("result");
  const fetchBtn = document.getElementById("fetch-stock");

  showLoading(resultBox);
  fetchBtn.disabled = true;
  fetchBtn.innerText = "Loading...";

  try {
    if (cache[symbol]) {
      console.log("Using cached data for:", symbol);
      populateUIFromCache(symbol);
      resultBox.innerText = `✅ Cached data used for ${symbol}.`;
      return;
    }

    const overviewData = await fetchWithRotation(
      key => `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${key}`
    );

    const cashflowData = await fetchWithRotation(
      key => `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${symbol}&apikey=${key}`
    );

    // Calculate FCF
    let fcf = 0;
    if (cashflowData.quarterlyReports && cashflowData.quarterlyReports.length > 0) {
      const report = cashflowData.quarterlyReports[0];
      const operating = report.operatingCashflow ? parseFloat(report.operatingCashflow) : 0;
      const capex = report.capitalExpenditures ? parseFloat(report.capitalExpenditures) : 0;
      fcf = operating - Math.abs(capex);
      fcf = Math.abs(fcf) > 1000000 ? fcf / 1e6 : fcf;
    }

    const betaVal = overviewData.Beta ? parseFloat(overviewData.Beta).toFixed(2) : "0.00";
    const debtVal = overviewData.DebtToEquity ? 
      (parseFloat(overviewData.DebtToEquity) === 0 ? "0.50" : parseFloat(overviewData.DebtToEquity).toFixed(2)) : 
      "0.50";
    const fcfVal = fcf.toFixed(2);

    // Save to cache
    cache[symbol] = {
      beta: betaVal,
      debt: debtVal,
      fcf: fcfVal,
      piotroski: localData[symbol]?.piotroski || 0,
      altman: localData[symbol]?.altman || 0
    };
    localStorage.setItem("stockCache", JSON.stringify(cache));

    populateUIFromCache(symbol);

    const zeroFields = [];
    if (fcfVal == 0) zeroFields.push("Free Cash Flow");
    if (debtVal == 0) zeroFields.push("Debt-to-Equity Ratio");
    if (betaVal == 0) zeroFields.push("Beta");
    showManualEntryReminder(zeroFields);

    resultBox.innerText = `✅ Data fetched for ${symbol}. Values auto-filled where available.`;
  } catch (error) {
    console.error("Fetch error:", error);
    resultBox.innerText = "❌ Failed to fetch data. See console.";
  } finally {
    resetButton(fetchBtn);
  }
}

function populateUIFromCache(symbol) {
  const cached = cache[symbol];
  updateField("beta", cached.beta);
  updateField("debt", cached.debt);
  updateField("fcf", cached.fcf);
  updateField("piotroski", cached.piotroski);
  updateField("altman", cached.altman);
}

function updateField(id, value) {
  const input = document.getElementById(id);
  input.value = value;
  input.classList.add("highlight");
  setTimeout(() => input.classList.remove("highlight"), 1200);
}

function showManualEntryReminder(zeroFields = []) {
  const manualFields = ["piotroski", "altman"];
  let missing = [...zeroFields];
  manualFields.forEach(id => {
    const field = document.getElementById(id);
    if (field && (parseFloat(field.value) === 0 || field.value === "")) {
      missing.push(field.placeholder || id);
    }
  });
  if (missing.length > 0) {
    const resultBox = document.getElementById("result");
    resultBox.innerText += `\n⚠️ Please enter: ${missing.join(", ")}`;
  }
}

function showLoading(container) {
  container.innerHTML = `<span class="loader">⏳</span> Fetching data...`;
}

function resetButton(btn) {
  btn.disabled = false;
  btn.innerText = "Fetch Stock Data";
}

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const fetchBtn = document.getElementById("fetch-stock");
  const symbolInput = document.getElementById("stock-symbol");
  
  if (!symbolInput) {
    return;
  }

  fetchBtn.addEventListener("click", () => {
    const symbol = symbolInput.value.trim().toUpperCase();
    if (symbol) fetchStockData(symbol);
  });

  symbolInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchBtn.click();
  });

  // Floating suggestion box with styling and table format
  const suggestionBox = document.createElement("div");
  suggestionBox.id = "suggestion-box";
  suggestionBox.style.position = "absolute";
  suggestionBox.style.zIndex = "999";
  suggestionBox.style.background = "#f4f0fa";
  suggestionBox.style.border = "2px solid #7d3cff";
  suggestionBox.style.borderRadius = "10px";
  suggestionBox.style.padding = "12px";
  suggestionBox.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
  suggestionBox.style.display = "none";
  suggestionBox.style.minWidth = "250px";
  suggestionBox.style.fontFamily = "Arial, sans-serif";

  suggestionBox.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #7d3cff; color: white;">
          <th style="padding: 8px; text-align: left;">Company</th>
          <th style="padding: 8px; text-align: left;">Symbol</th>
        </tr>
      </thead>
      <tbody>
        <tr class="symbol-link" data-symbol="AAPL" style="cursor: pointer;"><td style="padding: 8px;">Apple</td><td>AAPL</td></tr>
        <tr class="symbol-link" data-symbol="MSFT" style="cursor: pointer;"><td style="padding: 8px;">Microsoft</td><td>MSFT</td></tr>
        <tr class="symbol-link" data-symbol="GOOGL" style="cursor: pointer;"><td style="padding: 8px;">Alphabet</td><td>GOOGL</td></tr>
        <tr class="symbol-link" data-symbol="AMZN" style="cursor: pointer;"><td style="padding: 8px;">Amazon</td><td>AMZN</td></tr>
        <tr class="symbol-link" data-symbol="TSLA" style="cursor: pointer;"><td style="padding: 8px;">Tesla</td><td>TSLA</td></tr>
        <tr class="symbol-link" data-symbol="META" style="cursor: pointer;"><td style="padding: 8px;">Meta</td><td>META</td></tr>
        <tr class="symbol-link" data-symbol="NVDA" style="cursor: pointer;"><td style="padding: 8px;">NVIDIA</td><td>NVDA</td></tr>
        <tr class="symbol-link" data-symbol="BRK.B" style="cursor: pointer;"><td style="padding: 8px;">Berkshire Hathaway</td><td>BRK.B</td></tr>
        <tr class="symbol-link" data-symbol="JNJ" style="cursor: pointer;"><td style="padding: 8px;">Johnson & Johnson</td><td>JNJ</td></tr>
        <tr class="symbol-link" data-symbol="JPM" style="cursor: pointer;"><td style="padding: 8px;">JPMorgan Chase</td><td>JPM</td></tr>
      </tbody>
    </table>
  `;
  
  document.body.appendChild(suggestionBox);

  symbolInput.addEventListener("focus", () => {
    const rect = symbolInput.getBoundingClientRect();
    suggestionBox.style.left = `${rect.right + 10}px`;
    suggestionBox.style.top = `${window.scrollY + rect.top}px`;
    suggestionBox.style.display = "block";
  });

  symbolInput.addEventListener("blur", () => {
    setTimeout(() => suggestionBox.style.display = "none", 150);
  });

  suggestionBox.querySelectorAll(".symbol-link").forEach(row => {
    row.addEventListener("click", () => {
      symbolInput.value = row.dataset.symbol;
      suggestionBox.style.display = "none";
    });
  });
});
