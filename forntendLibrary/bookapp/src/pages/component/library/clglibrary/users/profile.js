import Userlayout from '../../../../../u_layout'
import Image from 'next/image'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '@/pages/component/context/authcontext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '@/styles/profile.module.css';
import NextNProgress from 'nextjs-progressbar';
import SearchAnimation from './SearchAnimation'


export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false); // For logout confirmation
  const router = useRouter();
  const { authUser, signOut } = useContext(AuthContext);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          router.push('/signin'); // Redirect if not authenticated
          return;
        }

        const res = await fetch(`${backendUrl}/get-user-profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.status === 200) {
          setProfileData(data.profile);
        } else {
          setError(data.msg || 'Error fetching profile data');
        }
      } catch (err) {
        setError('An error occurred while fetching profile data');
      }
    };

    fetchProfileData();
  }, [router, backendUrl]);

  useEffect(() => {
    const checkRole = () => {
      if (typeof window !== "undefined") {
        const storedRole = localStorage.getItem("role") || "";
        const storedtoken = localStorage.getItem("token") || "";

        if (!storedRole && !storedtoken) {
          router.push("/");
        }
      }
    };

    checkRole(); // Initial check
    const interval = setInterval(checkRole, 2000); // Check every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [router]);

  const handleLogout = () => {
    localStorage.setItem('token', '')
    localStorage.setItem('role', '')
  };

  return (
    <div className={styles.body}>
      {/* <NextNProgress
        color="#32CD32"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      /> */}
      <p style={{textAlign:'center'}}>Please fill user details before Borrowing Books</p>
      <h1 className={styles.h1}>Profile</h1>

      <div className={styles.profile}>
        {/* <Image src="" alt="oops" /> */}
        {profileData ? (
          <div>
            <h2 style={{ color: 'black' }}>Name: {profileData.firstName} {profileData.lastName}</h2>
          </div>
        ) : (
          <p>Unknown User</p>
        )}
        <div className={styles.edit}>
              <Link href={`/component/library/clglibrary/users/profileform`}>Edit</Link>
            </div>
      </div>
      <hr style={{width:'100%'}}></hr>
      <div className={styles.buttons}>
        <h3 className={styles.uinfo}>
          <Link href={'/component/library/clglibrary/users/userinfo'}>User Info</Link>
        </h3>
        <h3 className={styles.cpassword}>
          <Link href={'/component/library/clglibrary/users/changepassword'}>Change Password</Link>
        </h3>
        <h3 className={styles.borrowed_book}>
          <Link href={'/component/library/clglibrary/users/borrowedbook'}>Borrowed Book</Link>
        </h3>
        <h3 className={styles.notif}>
          <Link href={'/component/library/clglibrary/users/notification'}>Notification</Link>
        </h3>
        <h3 className={styles.history}>
          <Link href={'/component/library/clglibrary/users/history'}>History</Link>
        </h3>
        <h3 className={styles.logout}
          onClick={() => setShowPopup(true)} // Show popup on click
        >
          Logout
        </h3>
      </div>

      {/* Logout Confirmation Popup */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <h3>Are you sure you want to log out?</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '5px 20px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                backgroundColor: 'gray',
                color: 'white',
                padding: '5px 20px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Profile.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>
};
