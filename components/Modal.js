import { useEffect, useState } from 'react';
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose, onSubmit, currentLink }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (currentLink) {
      setName(currentLink.name);
      setLink(currentLink.link);
    } else {
      setName('');
      setLink('');
    }
  }, [currentLink]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, link });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{currentLink ? 'Edit Link' : 'Add Link'}</h2>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${styles.input} input`}
        />
        <label>Link:</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className={`${styles.input} input`}
        />
        <div className={styles.buttonContainer}>
          <button onClick={handleSubmit} className={styles.addButton}>
            {currentLink ? 'Update Link' : 'Add Link'}
          </button>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
