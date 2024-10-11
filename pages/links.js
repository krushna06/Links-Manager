import { useState, useEffect } from 'react';
import styles from '../styles/Links.module.css';
import Modal from '../components/Modal';

const LinksPage = () => {
  const [linksData, setLinksData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      const response = await fetch('/api/links');
      const result = await response.json();
      if (result.success) {
        setLinksData(result.data);
      }
    };

    fetchLinks();
  }, []);

  const handleAddLink = async (newLink) => {
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLink),
    });
    const result = await response.json();
    if (result.success) {
      setLinksData([...linksData, result.data]);
    }
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
            {filteredLinks.map(({ _id, name, link }) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{name}</td>
                <td>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </td>
                <td>
                  <button onClick={() => openEditModal({ _id, name, link })}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button onClick={() => deleteLink(_id)}>
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
