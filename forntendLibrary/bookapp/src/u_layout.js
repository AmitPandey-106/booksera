import Link from 'next/link';
import { useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/usernav.module.css'
import { AuthContext } from '@/pages/component/context/authcontext';
import Image from 'next/image';
import NextNProgress from 'nextjs-progressbar';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt  } from "react-icons/fa";

export default function Userlayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [role, setRole] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  // const { authUser, signOut } = useContext(AuthContext);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown state
  };

  const closeDorpMenu = () => {
    setDropdownOpen(false); // Close dropdown when an item is clicked
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleSearch = async (e) => {
    setQuery(e.target.value)
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    if (menuOpen || dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, dropdownOpen]);



  return (
    <div className={styles.container}>
      <NextNProgress
        color="#32CD32"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={false}
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <>
        {/* Desktop Navbar */}
        <nav className={styles.desktop_navbar}>
          <div className={styles.logo}>
            <Link href="/">Library</Link>
          </div>
          <ul className={styles.nav_links}>
            <>
              <li><Link href="/component/library/clglibrary/users/home">Home</Link></li>

              {/* Dropdown for Books */}
              <li className={styles.dropdown}>
                <Link href="#">Books</Link>
                <ul className={styles.dropdown_menu}>
                  <li><Link href="/component/library/clglibrary/users/clgbooks">All Books</Link></li>
                  <li><Link href="/component/library/clglibrary/users/Ebooks">E-books</Link></li>
                  <li><Link href="/component/library/clglibrary/users/Journal">Journal</Link></li>
                  <li><Link href="/component/library/clglibrary/users/others">others</Link></li>
                </ul>
              </li>

              <li><Link href="/component/library/clglibrary/users/profile">Profile</Link></li>
              <li><Link href="/component/about">About Us</Link></li>
            </>
          </ul>

        </nav>

        {/* Mobile Navbar */}
        <nav className={styles.mobile_navbar}>
          <div className={styles.logo}>
            <Link href="/">Library</Link>
          </div>

          <div className={styles.hamburger} onClick={toggleMenu}>
            &#9776;
          </div>

          {/* Sidebar Menu for mobile */}
          <div ref={menuRef} className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
            <button className={styles.close_btn} onClick={closeMenu}>×</button>

            <div className={styles.slide}>
              <div className={styles.upper}>
                {/* <Image className={styles.slideimage} src='/vppcoe_logo.png' alt='user' height={74} width={74}></Image> */}
              </div>
              <ul className={styles.nav_links}>
                <>
                  <div className={styles.ic} onClick={() => { closeMenu(); window.location.href = "/component/library/clglibrary/users/home"; }}>
                    <i className="fas fa-home"></i>
                    <li onClick={closeMenu}><Link href="/component/library/clglibrary/users/home">Home</Link></li>
                  </div>
                  {/* <hr className={styles.line}></hr> */}
                  <div className={styles.ic} onClick={() => { closeMenu(); window.location.href = "/component/library/clglibrary/users/profile"; }}>
                    <i className="fas fa-user"></i>
                    <li onClick={closeMenu}><Link href="/component/library/clglibrary/users/profile">Profile</Link></li>
                  </div>

                  <div className={styles.icb} onClick={() => { toggleDropdown }}>
                    <i className="fas fa-book"></i>
                    <li
                      className={styles.M_dropdown}
                      onClick={toggleDropdown}
                    >
                      Books
                      {dropdownOpen && (
                        <ul className={styles.M_dropdown_menu}>
                          <li onClick={closeMenu}>
                            <Link href="/component/library/clglibrary/users/clgbooks">All Books</Link>
                          </li>
                          <li onClick={closeMenu}>
                            <Link href="/component/library/clglibrary/users/Ebooks">E Books</Link>
                          </li>
                          <li onClick={closeMenu}>
                            <Link href="/component/library/clglibrary/users/borrowedbook">Borrowed Books</Link>
                          </li>
                          <li onClick={closeMenu}>
                            <Link href="/component/about">About Us</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  </div>
                  <div className={styles.ic} onClick={() => { closeMenu(); window.location.href = "/component/about"; }}>
                    <i className="fas fa-info-circle"></i>
                    <li onClick={closeMenu}><p><Link href="/component/about">About Us</Link></p></li>
                  </div>
                  <div className={styles.ic} onClick={() => { setShowPopup(true) }}>
                    <i className="fas fa-right-to-bracket"></i>
                    <li onClick={() => setShowPopup(true)}>Log Out</li>
                  </div>
                </>
              </ul>
            </div>
          </div>
        </nav>
      </>
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
      {/* <main className={styles.main}> */}
      {children}
      {/* </main> */}
      <footer className={styles.footer}>
        <div className={styles.f_div}>

          {/* About Section */}
          <div className={styles.f_about}>
            <h3>BooksEra</h3>
            <p>Suntouch Technology is dedicated to delivering top-notch tech solutions to empower businesses worldwide.</p>
            <a href="https://www.googlemaps.com" target="_blank" rel="noopener noreferrer">
            <FaMapMarkerAlt className="icon" size={30}/>
            </a>
          </div>

          <div className={styles.nav_con}>
            <div className={styles.navigation}>
              <h3>Navigation</h3>
              <p><Link href="/component/library/clglibrary/users/home">Home</Link></p>
              <p><Link href="/component/library/clglibrary/users/clgbooks">All Books</Link></p>
              <p><Link href="/component/about">About Us</Link></p>
              <p><Link href="https://posts-sigma-eight.vercel.app">UserExchange</Link></p>
            </div>

            {/* Contact Us Section */}
            <div className={styles.contact}>
              <h3>Contact Us</h3>
              <p>Email: suntouchtechnology01@gmail.com</p>
              <p>Phone: +91 7506541325</p>
              <p>Address: 295, Chembur, Maharashtra - 74</p>
            </div>
          </div>


          {/* Services Section */}
          <div className={styles.ser_foll}>
            <div className={styles.f_services}>
              <h3>Services</h3>
              <ul>
                <li>Web Development</li>
                <li>App Development</li>
                <li>Cloud Services</li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className={styles.social_media}>
              <h3>Follow Us</h3>
              <div className={styles.icons}>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1877F2" }}>
                  <FaFacebook size={30} />
                </a>
                <a href="https://x.com/SunTouchTech01" target="_blank" rel="noopener noreferrer" style={{ color: "#1DA1F2" }}>
                  <FaTwitter size={30} />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0077B5" }}>
                  <FaLinkedin size={30} />
                </a>
                <a href="https://www.instagram.com/suntouchtechnology01/?hl=en" target="_blank" rel="noopener noreferrer" style={{ color: "#E4405F" }}>
                  <FaInstagram size={30} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <p>© 2025 SunTouch Technology All rights reserved.</p>
      </footer>

    </div>
  )
}
