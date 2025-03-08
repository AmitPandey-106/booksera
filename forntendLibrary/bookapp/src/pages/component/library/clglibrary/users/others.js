import Userlayout from '../../../../../u_layout'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import NextNProgress from 'nextjs-progressbar';
import styles from '../../../../../styles/allbooks.module.css';

export default function Others() {
  const [ebooks, setEBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('viewbook');
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchEBooks = async () => {
      try {
        const response = await fetch(`${backendUrl}/all-ebooks`);
        if (!response.ok) {
          throw new Error('Failed to fetch eBooks.');
        }
        const data = await response.json();
        setEBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEBooks();
  }, [backendUrl]);

  const handleComponent = (value) => {
    setSelectedOption(value);
    router.push(`/component/library/clglibrary/users/${value}`);
  };

  useEffect(() => {
    const currentPath = router.pathname.split('/').pop();
    setSelectedOption(currentPath);
  }, [router.pathname]);

  return (
    <div style={{ width: '100%', padding: '20px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh'}}>
      <NextNProgress color="#32CD32" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
      <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#333', padding: '20px 0' }}>Uploaded eBooks</h1>
      {loading && <p>Loading eBooks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ margin: '10px 0' }}>
        <select
          style={{ margin: "0px 10px", padding: '5px 10px', fontSize: '20px' }}
          value={selectedOption}
          onChange={(e) => handleComponent(e.target.value)}
        >
          <option value="novel">Novel</option>
          <option value="story">Story</option>
          <option value="others">All</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center', marginTop: '20px'}}>
        {!loading && !error && ebooks.length === 0 && <p>No eBooks uploaded yet.</p>}
        {!loading && !error && ebooks.length > 0 ? (
          ebooks.map((ebook) => (
            <div className={styles.book_card} key={ebook._id} >
              <div className={styles.book_image}>
              <Image src={isValidURL(ebook.coverImage) ? ebook.coverImage : defaultimage} alt={ebook.title} layout="fill"
                  objectFit="contain"/>
              </div>
              <h2>{ebook.title}</h2>
              <p>by {ebook.author}</p>
              <p>Category: {ebook.category}</p>
              <p>Price: {ebook.price === 0 ? 'Free' : `$${ebook.price}`}</p>
              <a href={`${backendUrl}/${ebook.file}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>View PDF</a>
            </div>
          ))
        ) : (
          <p>No eBooks available</p>
        )}
      </div>
    </div>
  );
}

Others.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
