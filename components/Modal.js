import { useState } from 'react';
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && link) {
      onSubmit({ name, link });
      setName('');
      setLink('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Add Link</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <label>Link:</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.addButton}>Add Link</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
