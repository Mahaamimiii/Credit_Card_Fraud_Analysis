import "./styles.css";
import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    distance_from_home: "",
    distance_from_last_transaction: "",
    ratio_to_median_purchase_price: "",
    online_order: "0",
    used_pin_number: "1",
    used_chip: "1",
    repeat_retailer: "1",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const analyzeTransaction = () => {
    let score = 0;
    let reasons = [];
    let contributions = [];

    const distanceHome = Number(form.distance_from_home);
    const distanceLast = Number(form.distance_from_last_transaction);
    const ratio = Number(form.ratio_to_median_purchase_price);

    if (ratio > 3) {
      score += 30;
      reasons.push("High purchase amount compared to normal behavior");
      contributions.push({ feature: "Purchase Ratio", value: 30 });
    }

    if (distanceLast > 100) {
      score += 25;
      reasons.push("Large distance from last transaction");
      contributions.push({
        feature: "Distance from Last Transaction",
        value: 25,
      });
    }

    if (distanceHome > 500) {
      score += 20;
      reasons.push("Transaction far from home location");
      contributions.push({ feature: "Distance from Home", value: 20 });
    }

    if (form.online_order === "1" && form.used_pin_number === "0") {
      score += 15;
      reasons.push("Online transaction without PIN usage");
      contributions.push({ feature: "Online w/o PIN", value: 15 });
    }

    if (form.used_chip === "0") {
      score += 10;
      reasons.push("Transaction without chip authentication");
      contributions.push({ feature: "No Chip Used", value: 10 });
    }

    if (score > 95) score = 95;

    let risk = "Low Risk";
    let decision = "Allow Transaction ✅";

    if (score >= 70) {
      risk = "High Risk";
      decision = "Flag Transaction 🚨";
    } else if (score >= 40) {
      risk = "Medium Risk";
      decision = "Review Transaction ⚠️";
    }

    setResult({
      probability: `${score}%`,
      risk,
      decision,
      reasons,
      contributions,
    });
  };

  return (
    <div className="app">
      <header>
        <h1>FraudGuard</h1>
        <p>Transaction Risk Analyzer</p>
      </header>

      <div className="container">
        {/* INPUT CARD */}
        <div className="card">
          <h2>Transaction Details</h2>

          <div className="form-group">
            <label>Distance from Home (km)</label>
            <input
              type="number"
              name="distance_from_home"
              value={form.distance_from_home}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Distance from Last Transaction (km)</label>
            <input
              type="number"
              name="distance_from_last_transaction"
              value={form.distance_from_last_transaction}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Purchase Ratio to Median</label>
            <input
              type="number"
              step="0.1"
              name="ratio_to_median_purchase_price"
              value={form.ratio_to_median_purchase_price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Online Order</label>
            <select
              name="online_order"
              value={form.online_order}
              onChange={handleChange}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Used PIN</label>
            <select
              name="used_pin_number"
              value={form.used_pin_number}
              onChange={handleChange}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Used Chip</label>
            <select
              name="used_chip"
              value={form.used_chip}
              onChange={handleChange}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Repeat Retailer</label>
            <select
              name="repeat_retailer"
              value={form.repeat_retailer}
              onChange={handleChange}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          <button onClick={analyzeTransaction}>Analyze Transaction</button>
        </div>

        {/* RESULT CARD */}
        {result && (
          <div className="card result">
            <h2>Fraud Risk Assessment</h2>

            <p
              className={`risk ${
                result.risk === "High Risk"
                  ? "high"
                  : result.risk === "Medium Risk"
                  ? "medium"
                  : "low"
              }`}
            >
              {result.risk}
            </p>

            <p>
              <strong>Fraud Probability:</strong> {result.probability}
            </p>
            <p>
              <strong>Decision:</strong> {result.decision}
            </p>

            <h3>Why was this flagged?</h3>
            <ul>
              {result.reasons.length > 0 ? (
                result.reasons.map((r, i) => <li key={i}>🔴 {r}</li>)
              ) : (
                <li>🟢 No suspicious patterns detected</li>
              )}
            </ul>

            {/* SHAP-style bar chart */}
            <h3>Feature Contribution (SHAP-style)</h3>

            <div className="shap-chart">
              {result.contributions.map((item, i) => (
                <div className="shap-row" key={i}>
                  <span className="shap-label">{item.feature}</span>

                  <div className="shap-bar-container">
                    <div
                      className="shap-bar"
                      style={{ width: `${item.value * 2}%` }}
                    >
                      +{item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>ML-powered Fraud Detection Demo</p>
      </footer>
    </div>
  );
}
