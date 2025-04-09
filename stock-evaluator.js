// stock-evaluator.js

// Function to evaluate stock resilience
function evaluateStock(symbol, metrics) {
  const { piotroski, altman, beta, fcf, debt } = metrics;
  
  // Validate inputs
  if (!validateInputs(metrics)) {
    return null;
  }

  // Calculate resilience score (0-100)
  let score = 0;
  let reasons = [];

  // Piotroski Score (max 30 points)
  if (piotroski >= 7) {
    score += 30;
    reasons.push("Excellent Piotroski Score (7-9) indicating strong financial health");
  } else if (piotroski >= 5) {
    score += 20;
    reasons.push("Good Piotroski Score (5-6) showing moderate financial strength");
  } else {
    reasons.push("Low Piotroski Score (<5) suggesting potential financial weaknesses");
  }

  // Altman Z-Score (max 20 points)
  if (altman > 3.0) {
    score += 20;
    reasons.push("Strong Altman Z-Score (>3.0) indicating very low bankruptcy risk");
  } else if (altman > 1.8) {
    score += 15;
    reasons.push("Moderate Altman Z-Score (1.8-3.0) showing acceptable bankruptcy risk");
  } else {
    reasons.push("Low Altman Z-Score (<1.8) suggesting higher bankruptcy risk");
  }

  // Beta (max 15 points)
  if (beta < 0.8) {
    score += 15;
    reasons.push("Low Beta (<0.8) indicating lower volatility than the market");
  } else if (beta < 1.2) {
    score += 10;
    reasons.push("Moderate Beta (0.8-1.2) showing market-average volatility");
  } else {
    reasons.push("High Beta (>1.2) indicating higher volatility than the market");
  }

  // Free Cash Flow (max 20 points)
  if (fcf > 1000) {
    score += 20;
    reasons.push("Strong Free Cash Flow (>$1B) providing financial flexibility");
  } else if (fcf > 0) {
    score += 15;
    reasons.push("Positive Free Cash Flow showing ability to generate cash");
  } else {
    reasons.push("Negative Free Cash Flow indicating potential cash flow issues");
  }

  // Debt-to-Equity Ratio (max 15 points)
  if (debt < 0.5) {
    score += 15;
    reasons.push("Low Debt-to-Equity Ratio (<0.5) showing conservative leverage");
  } else if (debt < 1.0) {
    score += 10;
    reasons.push("Moderate Debt-to-Equity Ratio (0.5-1.0) indicating balanced leverage");
  } else {
    reasons.push("High Debt-to-Equity Ratio (>1.0) suggesting aggressive leverage");
  }

  // Determine resilience level
  let resilience;
  if (score >= 80) {
    resilience = "Highly Resilient";
  } else if (score >= 60) {
    resilience = "Moderately Resilient";
  } else if (score >= 40) {
    resilience = "Somewhat Resilient";
  } else {
    resilience = "Low Resilience";
  }

  return {
    symbol,
    score,
    resilience,
    reasons,
    metrics
  };
}

// Function to validate inputs
function validateInputs(metrics) {
  const { piotroski, altman, beta, fcf, debt } = metrics;
  
  if (piotroski === undefined || piotroski < 0 || piotroski > 9) {
    showError("Please enter a valid Piotroski Score (0-9)");
    return false;
  }
  
  if (altman === undefined || isNaN(altman)) {
    showError("Please enter a valid Altman Z-Score");
    return false;
  }
  
  if (beta === undefined || isNaN(beta)) {
    showError("Please enter a valid Beta value");
    return false;
  }
  
  if (fcf === undefined || isNaN(fcf)) {
    showError("Please enter a valid Free Cash Flow value");
    return false;
  }
  
  if (debt === undefined || isNaN(debt) || debt < 0) {
    showError("Please enter a valid Debt-to-Equity Ratio");
    return false;
  }
  
  return true;
}

// Function to show error message
function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// Add click event listener to evaluate button
document.getElementById('evaluate').addEventListener('click', function() {
  const symbol = document.getElementById('stock-symbol').value.trim();
  if (!symbol) {
    showError('Please enter a stock symbol first');
    return;
  }

  const metrics = {
    piotroski: parseFloat(document.getElementById('piotroski').value),
    altman: parseFloat(document.getElementById('altman').value),
    beta: parseFloat(document.getElementById('beta').value),
    fcf: parseFloat(document.getElementById('fcf').value),
    debt: parseFloat(document.getElementById('debt').value)
  };

  const result = evaluateStock(symbol, metrics);
  
  if (result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <h3>${symbol.toUpperCase()} - ${result.resilience}</h3>
      <p>Overall Score: ${result.score}/100</p>
      <ul>
        ${result.reasons.map(reason => `<li>${reason}</li>`).join('')}
      </ul>
    `;
    resultDiv.classList.add('highlight');
  }
});
  
