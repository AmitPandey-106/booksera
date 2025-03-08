import Link from "next/link";
import Image from "next/image";
import styles from "./styles/first_layout.module.css"
import { useContext, useEffect, useState, useRef} from 'react';
import Home from "./pages";
import NextNProgress from 'nextjs-progressbar'
import { useRouter } from "next/router";

export default function Layout({ children }) {
  // const router = useRouter();
  // const navigate = (pathname) => {
  //     return() => {
  //         router.push(pathname);
  //     }
  // };
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState("");
  const menuRef = useRef(null);
  const router = useRouter();

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role") || ""); // Get role or set empty string
    }
  }, []);

  const loginCheck = () => {
    if (role === "admin") {
      router.push("/component/library/clglibrary/admins/home");
    } else if (role === "user") {
      router.push("/component/library/clglibrary/users/home");
    } else {
      router.push("/auth/librarysignin");
    }
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
    <>
      <NextNProgress
        color="#32CD32"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <Image className={styles.logoImage} src="/logo.jpg" alt="Logo" height={50} width={50} />
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/auth/librarysignin">Public Library</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/component/about">About</Link>
            </li>
            <li className={styles.navItem} onClick={loginCheck}>
              <Link href="#">Library</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="https://posts-sigma-eight.vercel.app">UserExchange</Link>
            </li>
          </ul>
          {/* <a onClick={navigate("/")}>Home</a>
            <br></br>
            <a onClick={navigate("/login")}>Login</a>
            <br></br>
            <a onClick={navigate("/about")}>About</a> */}
        </nav>

        {/* Mobile Navbar */}
        <nav className={styles.mobile_navbar}>
          <div className={styles.logo}>
            <Link href="/">Library</Link>
          </div>

          <div className={styles.hamburger} onClick={toggleMenu}>
            ☰
          </div>

          {/* Sidebar Menu for mobile */}
          <div ref={menuRef} className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
            <button className={styles.close_btn} onClick={closeMenu}>×</button>

            <div className={styles.slide}>
              <div className={styles.upper}>
                <Image className={styles.slideimage} src='/logo.jpg' alt='user' height={74} width={74}></Image>
              </div>
              <ul className={styles.nav_links}>
                <>
                  <div className={styles.ic} onClick={() => { closeMenu(); window.location.href = "/"; }}>
                    <i className="fas fa-home"></i>
                    <li><Link href="/">Home</Link></li>
                  </div>
                  {/* <hr className={styles.line}></hr> */}
                  <div className={styles.ic} onClick={() => { closeMenu(); window.location.href = "https://posts-sigma-eight.vercel.app"; }}>
                    <div className={styles.icu}><i class="fas fa-right-left"></i> <i class="fas fa-user"></i></div>
                    <li onClick={closeMenu}><Link href="https://posts-sigma-eight.vercel.app">UserExchange</Link></li>
                  </div>

                  <div className={styles.ic} onClick={() => { loginCheck(); closeMenu(); window.location.href = "#"; }}>
                    <i className="fas fa-book"></i>
                    <li onClick={closeMenu}><Link href="#">Library</Link></li>
                  </div>

                  <div className={styles.ic} onClick={() => { closeMenu(); window.location.href = "/component/about"; }}>
                    <i className="fas fa-info-circle"></i>
                    <li onClick={closeMenu}><p><Link href="/component/about">About</Link></p></li>
                  </div>
                  <div className={styles.ic} onClick={() => { closeMenu(); window.location.href = "/auth/librarysignin"; }}>
                    <i className="fas fa-right-to-bracket"></i>
                    <li onClick={closeMenu}><Link href="/auth/librarysignin">Public Library</Link></li>
                  </div>
                </>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      
      <main className={styles.main}>{children}</main>
    </>

  )
}