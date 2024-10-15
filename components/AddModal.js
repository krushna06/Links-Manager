import { useState } from 'react';
import styles from '../styles/Modal.module.css';

const AddModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, link });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setLink('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Add Link</h2>
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
            Add Link
          </button>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
