import React, { useState, useEffect } from "react";
import styles from "../../../../../styles/layout.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';

export default function AdminLayout({ children }) {
  const [showDot, setShowDot] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const reloadPage = () => {
    window.location.reload();
  };
  

  // Fetch member count and pending requests count
  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await fetch(`${backendUrl}/borrow-requests/count-pending`);
        const data = await response.json();
        setShowDot(data.count);  // Set the member count
      } catch (error) {
        console.error("Error fetching member count:", error);
      }
    };
    const fetchWaitCount = async () => {
      try {
        const response = await fetch(`${backendUrl}/waitlist-requests/count-pending`);
        const data = await response.json();
        setShowDot(data.count);  // Set the member count
      } catch (error) {
        console.error("Error fetching member count:", error);
      }
    };

    fetchRequestCount();
    fetchWaitCount();

    // Poll for updates every 60 seconds (for the pending requests count)
    const interval = setInterval([fetchRequestCount, fetchWaitCount], 60000);
    return () => clearInterval(interval);  // Cleanup interval on unmount
  }, [backendUrl]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const checkRole = () => {
      if (typeof window !== "undefined") {
        const storedRole = localStorage.getItem("role") || "";
        const storedtoken = localStorage.getItem("token") || "";
        setRole(storedRole);

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
    <div className={styles.container}>
      <NextNProgress
        color="#32CD32"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <header className={styles.header} style={{ backgroundColor: "#4A90E8" }}>
        <h1>Admin Dashboard</h1>
      </header>
      <div className={styles.body}>
        <nav className={styles.sidebar}>
          <ul>
            <li>
              <Link href="/component/library/clglibrary/admins/home">Dashboard</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/member" replace>Members</Link>
            </li>
            {/* Dropdown Menu for Add Books */}
            <li className={styles.dropdown}>
              <div
                className={styles.dropdownToggle}
                onClick={toggleDropdown}
              >
                Add Books
              </div>
              {dropdownOpen && (
                <ul className={styles.dropdownMenu}>
                  <li>
                    <Link href="/component/library/clglibrary/admins/addbook" replace>
                      Add Books
                    </Link>
                  </li>
                  <li>
                    <Link href="/component/library/clglibrary/admins/addebook" replace>
                      Add E-Books
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/viewbook" replace>View Books</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/updatebook" replace>Update borrows</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/getbrequest" replace>
                Request Book
                {showDot && <span className={styles.blueDot}></span>}
              </Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/adminborrow" replace>Admin Borrow</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/history" replace>History</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/penalties" replace>Penalties</Link>
            </li>
            
            <li>
              <button onClick={() => setShowPopup(true)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", backgroundColor: 'Red', height: '35px', width: '150px', borderRadius: '10px' }}>
                Log Out
              </button>
            </li>

            <li>
              <button
                onClick={reloadPage}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center',
                  color: 'blue',  
                  textDecoration: 'underline',
                  height: '35px', width: '150px',
                  backgroundColor: '#BDBEBE',
                  borderRadius: '10px'
                }}
              >
                Reload Page
              </button>
            </li>
          </ul>
        </nav>

        <main className={styles.main}>
          {children}
        </main>
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

      <footer className={styles.footer}>
        <p>© 2025 SunTouch Technology.technology All rights reserved.</p>
      </footer>
    </div>
  );
}
