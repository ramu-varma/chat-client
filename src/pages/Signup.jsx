import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/signup`, form);
      alert('Signup successful! Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Signup</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="name" placeholder="Name" required onChange={handleChange} style={styles.input} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={styles.input} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} style={styles.input} />
          <button type="submit" style={styles.button}>Signup</button>
          <p style={styles.linkText}>
            Already have an account?{' '}
            <Link to="/" style={{ color: '#007bff', fontWeight: 500, textDecoration: 'none' }}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f2f5',
    padding: 20,
  },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  button: {
    background: '#007bff',
    color: '#fff',
    padding: 12,
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
    transition: '0.3s',
  },
  linkText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
  },
};

export default Signup;
