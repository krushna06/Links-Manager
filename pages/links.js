import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/Links.module.css';
import AddModal from '../components/AddModal';
import EditModal from '../components/EditModal';

const LinksPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [linksData, setLinksData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength) + '...';
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchLinks = async () => {
      const response = await fetch('/api/links', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.uid}`,
        },
      });
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
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.uid}`,
      },
      body: JSON.stringify(newLink),
    });
    const result = await response.json();
    if (result.success) {
      setLinksData([...linksData, result.data]);
      setIsAddModalOpen(false);
    }
  };

  const handleEditLink = async (updatedLink) => {
    const response = await fetch(`/api/links?id=${currentLink._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.uid}`,
      },
      body: JSON.stringify(updatedLink),
    });
    const result = await response.json();
    if (result.success) {
      setLinksData(
        linksData.map(link => (link._id === currentLink._id ? result.data : link))
      );
      setIsEditModalOpen(false);
      setCurrentLink(null);
    }
  };

  const deleteLink = async (id) => {
    const response = await fetch(`/api/links?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.uid}`,
      },
    });
    if (response.ok) {
      setLinksData(linksData.filter(link => link._id !== id));
    }
  };

  const openEditModal = (link) => {
    setCurrentLink(link);
    setIsEditModalOpen(true);
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
        <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>+</button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name</th>
              <th className={styles.linkCell}>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map((link, index) => (
              <tr key={link._id}>
                <td>{index + 1}</td>
                <td className={styles.nameCell}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </td>
                <td className={styles.linkCell}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    {truncateUrl(link.link, 50)}
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
        <AddModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddLink} 
        />
        <EditModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentLink(null);
          }} 
          onSubmit={handleEditLink} 
          currentLink={currentLink}
        />
      </div>
    </div>
  );
};

export default LinksPage;
