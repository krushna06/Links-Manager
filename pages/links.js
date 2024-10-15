import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/Links.module.css';
import Modal from '../components/Modal';

const truncateUrl = (url, maxLength = 50) => {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength) + '...';
};

const LinksPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [linksData, setLinksData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchLinks = async () => {
      const response = await fetch('/api/links');
      const result = await response.json();
      if (result.success) {
        setLinksData(result.data);
      }
    };

    if (user) {
      fetchLinks();
    }
  }, [user]);

  const handleAddLink = async (newLink) => {
    if (currentLink) {
      const response = await fetch(`/api/links?id=${currentLink._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLink),
      });
      const result = await response.json();
      if (result.success) {
        setLinksData(linksData.map(link => link._id === currentLink._id ? result.data : link));
      }
    } else {
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
    }
  };

  const deleteLink = async (id) => {
    const response = await fetch(`/api/links?id=${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setLinksData(linksData.filter(link => link._id !== id));
    }
  };

  const openEditModal = (link) => {
    setCurrentLink(link);
    setIsModalOpen(true);
  };

  const filteredLinks = linksData.filter(link =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

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
              <th>Sr. No.</th>
              <th>Name</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map((link, index) => (
              <tr key={link._id}>
                <td>{index + 1}</td>
                <td>{link.name}</td>
                <td className={styles.linkCell}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    {truncateUrl(link.link, 50)} {/* Truncate the URL for display */}
                  </a>
                </td>
                <td>
                  <button onClick={() => openEditModal({ _id: link._id, name: link.name, link: link.link })}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button onClick={() => deleteLink(link._id)}>
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
