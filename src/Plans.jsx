import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Plans.css"
import { openRazorpayPopup, subscriptionInitiate } from "./services/razorpay";

const PLAN_CATALOG = {
  monthly: [
    {
      // id: "plan_SpWBDiZTQ1YAuV",
      id: "plan_SpWmRO3kd7BdhU",
      name: "Starter",
      tagline: "Great for individuals",
      storage: "2 TB",
      price: 199,
      period: "/mo",
      cta: "Choose 2 TB",
      features: [
        "Secure cloud storage",
        "Link & folder sharing",
        "Basic support",
      ],
      popular: false,
    },
    {
      // id: "plan_SpWDVlNtzyH0Tt",
      id: "plan_SpWmlkZmb0z5Dm",
      name: "Pro",
      tagline: "For creators & devs",
      storage: "5 TB",
      price: 399,
      period: "/mo",
      cta: "Choose 5 TB",
      features: ["Everything in Starter", "Priority uploads", "Email support"],
      popular: true,
    },
    {
      // id: "plan_SpWD9JjPmg293S",
      id: "plan_SpWn5zGEADk8Ma",
      name: "Ultimate",
      tagline: "Teams & power users",
      storage: "10 TB",
      price: 699,
      period: "/mo",
      cta: "Choose 10 TB",
      features: ["Everything in Pro", "Version history", "Priority support"],
      popular: false,
    },
  ],
  yearly: [
    {
      // id: "plan_SpWBq3I1Ss1KnR",
      id: "plan_SpWo8nRiWe6NBE",
      name: "Starter",
      tagline: "Great for individuals",
      storage: "2 TB",
      price: 1999,
      period: "/yr",
      cta: "Choose 2 TB",
      features: [
        "Secure cloud storage",
        "Link & folder sharing",
        "Basic support",
      ],
      popular: false,
    },
    {
      // id: "plan_SpWCNwaE3uai8H",
      id: "plan_SpWnnAG6spo8Bp",
      name: "Pro",
      tagline: "For creators & devs",
      storage: "5 TB",
      price: 3999,
      period: "/yr",
      cta: "Choose 5 TB",
      features: ["Everything in Starter", "Priority uploads", "Email support"],
      popular: true,
    },
    {
      // id: "plan_SpWD9JjPmg293S",
      id: "plan_SpWodErK6l7l5J",
      name: "Ultimate",
      tagline: "Teams & power users",
      storage: "10 TB",
      price: 6999,
      period: "/yr",
      cta: "Choose 10 TB",
      features: ["Everything in Pro", "Version history", "Priority support"],
      popular: false,
    },
  ],
};

function classNames(...cls) {
  return cls.filter(Boolean).join(" ");
}

function Price({ value }) {
  return (
    <div className="price">
      <span className="currency">₹</span>
      <span className="price-value">{value}</span>
    </div>
  );
}

function PlanCard({ plan, onSelect }) {
  return (
    <div className={`plan-card ${plan.popular ? "popular" : ""}`}>
      {plan.popular && (
        <div className="popular-badge">Most Popular</div>
      )}

      <div className="card-header">
        <div>
          <h3 className="plan-title">{plan.name}</h3>
          <p className="plan-tagline">{plan.tagline}</p>
        </div>

        <span className="storage-badge">
          {plan.storage}
        </span>
      </div>

      <div className="price-section">
        <Price value={plan.price} />
        <span className="period">{plan.period}</span>
      </div>

      <ul className="features-list">
        {plan.features.map((f, i) => (
          <li key={i} className="feature-item">
            <svg
              className="feature-icon"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect?.(plan)}
        className={`plan-button ${plan.popular ? "primary-btn" : "dark-btn"
          }`}
      >
        {plan.cta}
      </button>
    </div>

  );
}

export default function Plans() {
  const navigate = useNavigate()
  const [mode, setMode] = useState("monthly");
  // const [Paymentverified, setPaymentverified] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const plans = PLAN_CATALOG[mode];

  useEffect(() => {
    const razorpayScript = document.querySelector("#razorpay-script");
    if (razorpayScript) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-script";
    document.body.appendChild(script);
  }, []);

  async function handleSelect(plan) {
    const { subscriptionId } = await subscriptionInitiate({ planId: plan.id })
    // console.log(subscriptionId);
    openRazorpayPopup({ subscriptionId })
    setTimeout(() => setErrorMessage(""), 3000);
    // console.log(plan.id);
  }

  return (
    <div className="plans-container">
      <div className="error-message">{errorMessage}</div>
      <header className="plans-header">
        <h1 className="main-title">Choose your plan</h1>
        <Link to="/">Home</Link>
      </header>

      <div className="tabs">
        <button
          onClick={() => setMode("monthly")}
          className={`tab-btn ${mode === "monthly" ? "active-tab" : ""
            }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setMode("yearly")}
          className={`tab-btn ${mode === "yearly" ? "active-tab" : ""
            }`}
        >
          Yearly
          <span className="discount-text">
            (2 months off)
          </span>
        </button>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <PlanCard
            key={`${mode}-${plan.id}`}
            plan={plan}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <p className="helper-text">
        Prices are indicative for demo. Integrate with Razorpay
        Subscriptions to start billing.
      </p>
    </div>

  );
}
