import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/Login.module.css';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const webhookURL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

  const sendLoginNotification = async (email) => {
    const currentTime = new Date().toLocaleString();
    try {
      await axios.post(webhookURL, {
        content: `User **${email}** logged in at **${currentTime}**`,
      });
    } catch (err) {
      console.error('Error sending webhook notification:', err);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      sendLoginNotification(email);

      router.push('/links');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      sendLoginNotification(userEmail);

      router.push('/links');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleEmailLogin}>
        <h1 className={styles.title}>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Login</button>
        <button type="button" className={styles.googleButton} onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
        <p className={styles.link}>
          Don’t have an account?{' '}
          <Link href="/register">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
