import { useState } from "react";
import axios from "axios";

// ✅ FIXED: Direct backend URL (NO env issues)
const API = "https://app-pb6o.onrender.com";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [expenses, setExpenses] = useState([]);

  // 🔥 REGISTER
  const register = async () => {
    try {
      await axios.post(`${API}/api/auth/register`, {
        name: "Student",
        email,
        password,
      });

      alert("Registered successfully. Now login.");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Register failed");
    }
  };

  // 🔥 LOGIN
  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful");
    } catch (err) {
      console.log(err.response?.data);
      alert("Login failed");
    }
  };

  // 🔥 ADD GRIEVANCE
  const addExpense = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/expenses`,
        { subject, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubject("");
      setDescription("");

      getExpenses();
    } catch (err) {
      console.log(err.response?.data);
      alert("Submit failed");
    }
  };

  // 🔥 GET GRIEVANCES
  const getExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(res.data);
    } catch (err) {
      console.log(err.response?.data);
      alert("Fetch failed");
    }
  };

  // 🔥 DELETE
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      getExpenses();
    } catch (err) {
      console.log(err.response?.data);
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎓 Student Grievance System</h1>

      {/* LOGIN */}
      <div style={styles.card}>
        <h3>Login</h3>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={login}>
          Login
        </button>

        {/* 🔥 REGISTER BUTTON */}
        <button
          style={{ ...styles.button, background: "#555", marginTop: "10px" }}
          onClick={register}
        >
          Register
        </button>
      </div>

      {/* ADD GRIEVANCE */}
      <div style={styles.card}>
        <h3>Submit Grievance</h3>

        <input
          style={styles.input}
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button style={styles.button} onClick={addExpense}>
          Submit
        </button>
      </div>

      {/* LOAD */}
      <button style={styles.getBtn} onClick={getExpenses}>
        View Grievances
      </button>

      {/* LIST */}
      <div style={styles.list}>
        {expenses.length === 0 ? (
          <p>No grievances yet</p>
        ) : (
          expenses.map((e) => (
            <div key={e._id} style={styles.expenseCard}>
              <div>
                <strong>{e.subject}</strong>
                <p>
                  {e.description} • {e.status}
                </p>
              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteExpense(e._id)}
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  getBtn: {
    width: "100%",
    padding: "10px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginBottom: "15px",
    cursor: "pointer",
  },
  list: {
    marginTop: "10px",
  },
  expenseCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default App;