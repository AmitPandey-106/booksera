import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Userlayout from '../../../../../u_layout';
import Image from 'next/image';
import NextNProgress from 'nextjs-progressbar';

NotificationDetails.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default function NotificationDetails() {
  const router = useRouter();
  const { id } = router.query; // Get the notification ID from the query
  const [notification, setNotification] = useState(null);
  const defaultImage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchNotificationDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/notifications/details/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch notification details: ${response.statusText}`);
        }

        const data = await response.json();
        setNotification(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching notification details:', error);
      }
    };

    fetchNotificationDetails();
  }, [id, backendUrl]);

  if (!id) {
    return <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>Loading notification id...</p>;
  }

  if (!notification) {
    return <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>Loading notification details...</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', fontFamily: 'Arial, sans-serif',minHeight:'100vh' }}>
      <NextNProgress
        color="#32CD32"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      
      <h2 style={{ textAlign: 'center', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Notification Details</h2>
      
      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#555' }}>
        <strong>Title:</strong> {notification.detailedNotification?.title || 'N/A'}
      </p>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Image
          src={
            isValidURL(notification.detailedNotification?.book?.PHOTO) &&
            notification.detailedNotification?.book?.PHOTO !== 'NULL'
              ? notification.detailedNotification.book.PHOTO
              : defaultImage
          }
          alt={notification.detailedNotification?.book?.TITLE || 'Book Image'}
          width={150}
          height={150}
          style={{ borderRadius: '10px', boxShadow: '0px 2px 8px rgba(0,0,0,0.2)' }}
        />
      </div>

      <p style={{ fontSize: '16px', color: '#333' }}>
        <strong>Message:</strong> {notification.detailedNotification?.message || 'N/A'}
      </p>

      <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginTop: '10px', boxShadow: '0px 2px 5px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#444' }}>
          <strong>Book Title:</strong> {notification.detailedNotification?.book?.TITLE || 'N/A'}
        </p>
        <p style={{ fontSize: '16px', color: '#444' }}>
          <strong>Author:</strong> {notification.author || 'N/A'}
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginTop: '10px', boxShadow: '0px 2px 5px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#444' }}>
          <strong>User:</strong>{' '}
          {notification.detailedNotification.user?.firstName || 'N/A'} {notification.detailedNotification.user?.lastName || 'N/A'}
        </p>
        <p style={{ fontSize: '16px', color: '#444' }}>
          <strong>Return Date:</strong>{' '}
          {notification.detailedNotification.user.userId ? new Date(notification.detailedNotification.user.userId).toLocaleString() : 'N/A'}
        </p>
        <p style={{ fontSize: '16px', color: '#444' }}>
          <strong>Penalty:</strong> {notification.detailedNotification.user.penalty || 'None'}
        </p>
      </div>
    </div>
  );
}
