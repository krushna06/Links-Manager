import { useState } from 'react';
import styles from '../styles/Links.module.css';
import Modal from '../components/Modal';

const LinksPage = () => {
  const [linksData, setLinksData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddLink = (newLink) => {
    const newId = linksData.length ? linksData[linksData.length - 1].id + 1 : 1;
    setLinksData([...linksData, { id: newId, ...newLink }]);
  };

  const deleteLink = (id) => {
    setLinksData(linksData.filter(link => link.id !== id));
  };

  const openEditModal = (link) => {
    setCurrentLink(link);
    setIsModalOpen(true);
  };

  const filteredLinks = linksData.filter(link =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Links Manager</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>+</button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map(({ id, name, link }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </td>
                <td>
                  <button onClick={() => openEditModal({ id, name, link })}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button onClick={() => deleteLink(id)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setCurrentLink(null);
          }} 
          onSubmit={handleAddLink} 
          currentLink={currentLink}
        />
      </div>
    </div>
  );
};

export default LinksPage;
