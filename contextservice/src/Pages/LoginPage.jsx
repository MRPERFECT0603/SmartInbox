import { useState } from "react";
import Header from "../components/Header";
import Otter5 from "../assets/otterpeaking.png";
import { useNavigate } from 'react-router-dom';
import { contextRequest } from "../../axios";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log(formData);
      const response = await contextRequest.post("/login", formData);
      setSuccess("Login successful!");
      console.log("Response:", response.data);
      navigate('/dashboard', { state: { email: formData.email } })
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <Header />

    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <div>
                <img
                              src={Otter5}
                              alt="Otter Peaking"
                              className="w-40 "
                              style={{
                                position: "absolute",
                                top: "2%",
                                right: "34%",
                              }}
                  />
                </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}
    </div>

    </div>
  );
}

export default LoginPage;