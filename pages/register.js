import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/Login.module.css';

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const webhookURL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

  const sendRegisterNotification = async (email) => {
    const currentTime = new Date().toLocaleString();
    try {
      await axios.post(webhookURL, {
        content: `New user **${email}** registered at **${currentTime}**`,
      });
    } catch (err) {
      console.error('Error sending webhook notification:', err);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      sendRegisterNotification(email);

      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      sendRegisterNotification(userEmail);

      router.push('/links');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleEmailRegister}>
        <h1 className={styles.title}>Register</h1>
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
        <button type="submit" className={styles.button}>Register</button>
        <button type="button" className={styles.googleButton} onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
        <p className={styles.link}>
          Already have an account?{' '}
          <Link href="/">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
