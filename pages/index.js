import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUsername = process.env.NEXT_PUBLIC_USERNAME;
    const storedPassword = process.env.NEXT_PUBLIC_PASSWORD;

    if (username === storedUsername && password === storedPassword) {
      router.push('/links');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
