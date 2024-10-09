import { useState } from 'react';
import styles from '../styles/Links.module.css';
import Modal from '../components/Modal';

const LinksPage = () => {
  const [linksData, setLinksData] = useState([
    { id: 1, name: 'Google', link: 'https://www.google.com' },
    { id: 2, name: 'GitHub', link: 'https://www.github.com' },
    { id: 3, name: 'Next.js', link: 'https://nextjs.org' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddLink = (newLink) => {
    const newId = linksData.length ? linksData[linksData.length - 1].id + 1 : 1;
    setLinksData([...linksData, { id: newId, ...newLink }]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Links Page</h1>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>+</button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {linksData.map(({ id, name, link }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddLink} 
        />
      </div>
    </div>
  );
};

export default LinksPage;
