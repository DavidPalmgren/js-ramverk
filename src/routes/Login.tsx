import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiAddress = import.meta.env.VITE_API_ADDRESS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiAddress}/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;
        localStorage.setItem('Bearer', token);
        navigate('/');
        return;
      } else {
        const errorText = await response.text(); // raw is better for debugging lulw
        console.error(`Error: ${response.status} - ${errorText}`);
      }
      throw new Error();
    } catch (errorMsg) {
      setError(`Failed`);
    }
  };

  return (
    <div className="auth-wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button-blue2">
          Login
        </button>

        {error && <p className="error-message">{error}</p>}
        <Link to="/signup">No account?</Link>
      </form>
    </div>
  );
}
