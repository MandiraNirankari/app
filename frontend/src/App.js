import { useState } from "react";
import axios from "axios";

// 🔥 YOUR BACKEND URL
const API = process.env.REACT_APP_API;;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [expenses, setExpenses] = useState([]);

  // LOGIN
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

  // ADD EXPENSE
  const addExpense = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/expenses`,
        { title, amount, category },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setAmount("");
      setCategory("");

      getExpenses();
    } catch (err) {
      console.log(err.response?.data);
      alert("Add failed");
    }
  };

  // GET EXPENSES
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

  // DELETE EXPENSE
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
      <h1 style={styles.heading}>💸 Expense Manager</h1>

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
      </div>

      {/* ADD EXPENSE */}
      <div style={styles.card}>
        <h3>Add Expense</h3>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button style={styles.button} onClick={addExpense}>
          Add Expense
        </button>
      </div>

      {/* LOAD */}
      <button style={styles.getBtn} onClick={getExpenses}>
        Load Expenses
      </button>

      {/* LIST */}
      <div style={styles.list}>
        {expenses.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          expenses.map((e) => (
            <div key={e._id} style={styles.expenseCard}>
              <div>
                <strong>{e.title}</strong>
                <p>
                  ₹{e.amount} • {e.category}
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