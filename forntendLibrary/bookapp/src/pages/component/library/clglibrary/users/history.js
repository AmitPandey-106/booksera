import React, { useContext, useState, useEffect } from 'react';
import Userlayout from '../../../../../u_layout'
import { AuthContext } from '@/pages/component/context/authcontext';
import Image from 'next/image';
import styles from '@/styles/borrowedbooks.module.css';
import NextNProgress from 'nextjs-progressbar';
import SearchAnimation from './SearchAnimation';


export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useContext(AuthContext);
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
    if (!authUser || !authUser.id) {
      // Wait until authUser and authUser.id are available
      console.warn('Auth user or ID not available yet.');
      return;
    }

    const fetchHistory = async () => {
      try {
        console.log(`Fetching history for user ID: ${authUser.id}`);
        const response = await fetch(`${backendUrl}/users/${authUser.id}/history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch history: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched history:', data);
        setHistory(data.history);
      } catch (err) {
        console.error('Error fetching history:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (authUser?.id) {
      fetchHistory();
    }
  }, [authUser, backendUrl]);

  if (!authUser || !authUser.id) return <p>Loading user information...</p>;
  if (loading) return <div style={{ display: 'flex', marginLeft:'50px', height: '100%', width: '100%' }}>
            <SearchAnimation />
          </div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.borr_book}>
      <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
      <h2>Borrowed History</h2>

      {history.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Author</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Book Image</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Borrowed On</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Due On</th>
            </tr>
          </thead>
          <tbody>
            {history.map((history) => (
              <tr key={history._id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{history.book.TITLE}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{history.book.author_name || "Unknown Author"}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <Image src={isValidURL(history.book.PHOTO) ? history.book.PHOTO : defaultimage} alt={history.book.TITLE} className="book-image" width={100} height={100} />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(history.borrowDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(history.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <SearchAnimation/>
      )}
    </div>
  );
}

History.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
