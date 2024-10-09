import styles from '../styles/Links.module.css';

const LinksPage = () => {
  const linksData = [
    { id: 1, name: 'Google', link: 'https://www.google.com' },
    { id: 2, name: 'GitHub', link: 'https://www.github.com' },
    { id: 3, name: 'Next.js', link: 'https://nextjs.org' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Links Page</h1>
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
      </div>
    </div>
  );
};

export default LinksPage;
