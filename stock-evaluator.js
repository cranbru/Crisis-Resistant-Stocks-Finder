// stock-evaluator.js

// Cache for evaluation results
const evaluationCache = JSON.parse(localStorage.getItem('evaluationCache') || '{}');

function evaluateStock() {
    const symbol = document.getElementById("stock-symbol").value.trim().toUpperCase();
    const piotroski = parseInt(document.getElementById("piotroski").value);
    const altman = parseFloat(document.getElementById("altman").value);
    const beta = parseFloat(document.getElementById("beta").value);
    const fcf = parseFloat(document.getElementById("fcf").value);
    const debt = parseFloat(document.getElementById("debt").value);
  
    let score = 0;
  
    if (piotroski >= 8) score++;
    if (altman > 3) score++;
    if (beta < 1) score++;
    if (fcf > 0) score++;
    if (debt < 1) score++;
  
    let resultText;
    if (score === 5) {
      resultText = "🌟 Extremely Disaster-Proof! Strong fundamentals.";
    } else if (score >= 3) {
      resultText = "✅ Moderately Resilient. Decent fundamentals but could be stronger.";
    } else {
      resultText = "⚠️ Risky. Vulnerable during crises, proceed with caution.";
    }

    const result = resultText + "\nDisaster Resilience Score: " + score + "/5";
    document.getElementById("result").innerText = result;

    // Cache the evaluation result
    if (symbol) {
        evaluationCache[symbol] = {
            result: result,
            timestamp: Date.now(),
            metrics: {
                piotroski,
                altman,
                beta,
                fcf,
                debt,
                score
            }
        };
        localStorage.setItem('evaluationCache', JSON.stringify(evaluationCache));
    }
}

// Optional: Add form validation feedback
function validateInputs() {
    const inputs = document.querySelectorAll("input[type='number']");
    let allValid = true;
    inputs.forEach(input => {
      if (!input.value || isNaN(input.value)) {
        input.style.borderColor = 'red';
        allValid = false;
      } else {
        input.style.borderColor = '#ccc';
      }
    });
    return allValid;
}

// Load cached evaluation if available
function loadCachedEvaluation(symbol) {
    if (evaluationCache[symbol]) {
        const cached = evaluationCache[symbol];
        const age = Date.now() - cached.timestamp;
        const daysOld = Math.floor(age / (1000 * 60 * 60 * 24));

        if (daysOld < 7) { // Only use cache if less than 7 days old
            document.getElementById("result").innerText = cached.result + `\n(Cached from ${daysOld} days ago)`;
            return true;
        }
    }
    return false;
}
  
// Hook validation into the button
document.addEventListener("DOMContentLoaded", () => {
    const evaluateButton = document.getElementById("evaluate");
    const symbolInput = document.getElementById("stock-symbol");

    evaluateButton.addEventListener("click", () => {
        const symbol = symbolInput.value.trim().toUpperCase();
        
        // Try to load cached evaluation first
        if (symbol && loadCachedEvaluation(symbol)) {
            return;
        }

        if (validateInputs()) {
            evaluateStock();
        } else {
            document.getElementById("result").innerText = "❗ Please fill in all the fields with valid numbers.";
        }
    });

    // Clear cache button
    const clearCacheButton = document.createElement('button');
    clearCacheButton.textContent = 'Clear Cache';
    clearCacheButton.style.marginTop = '10px';
    clearCacheButton.onclick = () => {
        localStorage.removeItem('evaluationCache');
        document.getElementById("result").innerText = "✅ Cache cleared successfully.";
    };
    document.querySelector('.result').appendChild(clearCacheButton);
});
  