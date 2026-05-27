import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GoogleLogin,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import "./Auth.css";
import { verifyIdToken } from "./services/googleAuth.js";

const Register = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // serverError will hold the error message from the server
  const [serverError, setServerError] = useState("");

  // otp store
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isverifying, setIsverifying] = useState(false);
  const [isverified, setIsverified] = useState(false);
  const [issending, setIsSending] = useState(false);
  const [countDown, setCountDown] = useState(0);

  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the server error as soon as the user starts typing in Email
    if (name === "email") {
      setServerError("");
      setOtpError("");
      setOtpSent(false);
      setIsverified(false);
      setCountDown(0);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (countDown <= 0) return;
    const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countDown]);

  // Send OTP handler
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setOtpError("Please enter your email first.");
      return;
    }

    setIsSending(true)
    try {
      const response = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        // Show error below the email field (e.g., "Email already exists")
        setOtpError(data.error);
      } else {
        // OTP request sent
        setOtpError("");
        setOtpSent(true)
        setCountDown(60)
      }
    } catch (error) {
      // In case fetch fails
      // console.error("Error:", error);
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setIsSending(false)
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsverifying(true)

    try {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        body: JSON.stringify({ otp, email: formData.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        // Show error below the email field (e.g., "Email already exists")
        setOtpError(data.error);
      } else {
        // OTP verified sucessfull
        setIsverified(true)
        setCountDown(0)
        setOtpError("");
      }
    } catch (error) {
      // In case fetch fails
      // console.error("Error:", error);
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setIsverifying(false)
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false); // reset success if any
    if (!isverified) {
      setOtpError("Please verify your email with OTP before registering.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        // Show error below the email field (e.g., "Email already exists")
        setServerError(data.error);
      } else {
        // Registration success
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      // In case fetch fails
      console.error("Error:", error);
      setServerError("Something went wrong. Please try again.");
    }
  };

  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => console.log(codeResponse),
  //   flow: "auth-code",
  // });

  return (
   <div className="login-page">
    <div className="login-card">
      <h1>Create Account</h1>
      <p className="subtitle">Enter Details to get started</p>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              className="input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email  & OTP*/}
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="otp-wrapper">
              <input
                // If there's a serverError, add an extra class to highlight border
                className={`input ${serverError ? "input-error" : ""}`}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              <button
                className="otp-btn"
                disabled={issending || countDown > 0 || isverified}
                onClick={handleSendOtp}
              >
                {
                  issending ? "Sending..." :
                    countDown > 0
                      ? `${countDown}s`
                      : "Send OTP"
                }
              </button>
            </div>
            {/* Absolutely-positioned error message below email field */}
            {serverError && <span className="error-msg">{serverError}</span>}
          </div>

          {/* Otp & Verify */}
          {otpSent &&
            <div className="form-group">
              <label htmlFor="otp" className="label">
                Enter OTP
              </label>
              <div className="otp-wrapper">
                <input
                  // If there's a otpError, add an extra class to highlight border
                  className={`input ${otpError ? "input-error" : ""}`}
                  type="number"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  required
                />
                <button
                  className="otp-btn"
                  disabled={isverified || isverified}
                  onClick={handleVerifyOtp}
                >
                  {
                    isverifying ? "Verifying..."
                      : isverified
                        ? "Verified"
                        : "Verify OTP"
                  }
                </button>
              </div>
              {/* Absolutely-positioned error message below email field */}
              {otpError && <span className="error-msg">{otpError}</span>}
            </div>
          }

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isverified || isSuccess}
            className={`submit-button ${isSuccess ? "success" : ""}`}
          >
            {isSuccess ? "Registration Successful" : "Register"}
          </button>
        </form>

        {/* Link to the login page */}
        < p className="link-text" >
          Already have an account ? <Link to="/login">Login</Link>
        </p >
        
        {/* or div */}
      <div className="divider">
        <span>Or continue with</span>
      </div>

        {/* google login */}

        <div className="google-login">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const data = await verifyIdToken(credentialResponse.credential)
              if (data.message) {
                navigate("/")
              }
            }}
            shape="pill"
            theme="filled_blue"
            text="continue_with"

            onError={() => {
              console.log("Login Failed");
            }}
          // useOneTap
          />
        </div>

      </div >
    </div>
  );
};

export default Register;
