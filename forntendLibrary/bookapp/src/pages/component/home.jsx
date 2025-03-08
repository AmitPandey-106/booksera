import styles from '@/styles/mHome.module.css';
import { useRouter } from 'next/router';
import Image from "next/image";
import { useContext, useEffect, useState, useRef } from 'react';
import NextNProgress from 'nextjs-progressbar'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const libraryRef = useRef(null);

  const fullText = "WELCOME TO BOOKSERA";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }, 100); // Adjust speed of typing
      return () => clearTimeout(timeout);
    }
  }, [index]);

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

  const handleExploreClick = () => {
    if (libraryRef.current) {
      libraryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <NextNProgress
        color="#32CD32"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />

      <header className={styles.header}>
        <Image src="/logo.jpg" alt="BookSera Logo" width={60} height={60} style={{ borderRadius: '50%' }} />
        <h1 className={styles.headerTitle}>BOOKSERA</h1>
        {/* <button className={styles.knowUsBtn}>Know us</button> */}
      </header>
      <div className={styles.videoContainer}>
        {/* Background Video */}
        <video className={styles.backgroundVideo} autoPlay muted loop>
          <source src="/background/mainbg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Main Content (Including Layout) */}
        <div className={styles.contentOverlay}>
          <div className={styles.container}>
            {/* Text Section */}
            <div className={styles.text}>
              <h1>
                {displayedText.split(" ").map((word, i) => (
                  <span key={i} className={word === "BOOKSERA" ? styles.highlight : ""}>
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <p>Explore a vast collection of books, resources, and exchange options.</p>
              <button className={styles.exploreButton} onClick={handleExploreClick}>Explore</button>
            </div>


            {/* Library Options in a Single Column */}
            <div ref={libraryRef} className={styles.libraryColumn}>
              <div className={styles.libraryItem} onClick={loginCheck}>
                <div className={styles.boxLibrary}>College Library</div>
                <p className={styles.libraryDesc}>
                  The College Library System allows students to browse available books, check their status, and borrow them seamlessly.
                  Users can also view book details and track borrowed books, ensuring a smooth and efficient library experience. 📚✨
                </p>
              </div>


              <div className={styles.libraryItem} onClick={() => router.push('/auth/librarysignin')}>
                <div className={styles.boxLibrary}>Public Library</div>
                <p className={styles.libraryDesc}>The Public Library System provides access to a wide collection of books for all users.
                  Readers can browse, borrow, and explore available books, making it easy to enjoy reading anytime. 📖✨</p>
              </div>
              <div className={styles.libraryItem} onClick={() => router.push('https://posts-sigma-eight.vercel.app')}>
                <div className={styles.boxLibrary}>User Exchange</div>
                <p className={styles.libraryDesc}>The Book Exchange Platform allows users to buy, sell,
                  or exchange books with others. Easily find books you need or share your own with the community! 📚🔄</p>
              </div>
              <div className={styles.libraryItem} onClick={() => router.push('/component/about')}>
                <div className={styles.boxLibrary}>About Us</div>
                <p className={styles.libraryDesc}>Welcome to our Library & Book Exchange Platform,
                  your one-stop solution for accessing and sharing books. Whether you are a student looking for college library books,
                  a reader exploring public libraries, or someone interested in exchanging books with others,
                  we provide a seamless experience to discover, borrow, and share knowledge. 📚✨</p>
              </div>
            </div>


          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.container}>

          {/* Left Section - Brand Info */}
          <div className={styles.footerSection}>
            <h2>BOOKSERA</h2>
            <p>Discover,Borrow, Buy, Sell, and Exchange Books Seamlessly.</p>
            <p>&copy; {new Date().getFullYear()} SunTouch Technology. All rights reserved.</p>
          </div>

          {/* Middle Section - Quick Links */}
          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/component/about">About Us</Link></li>
              <li onClick={loginCheck}><Link href="#">College Library</Link></li>
              <li><Link href="https://posts-sigma-eight.vercel.app">Book Exchange</Link></li>
            </ul>
          </div>

          {/* Right Section - Contact */}
          <div className={styles.footerSection}>
            <h3>Contact Us</h3>
            <p>Email: suntouchtechnology01@gmail.com</p>
            <p>Phone: +91 7506541325</p>
            <p>Address: Chembur, Mumbai - 74, Maharashtra, India.</p>
          </div>

          {/* Social Media Section */}
          <div className={styles.footerSection}>
            <h3>Follow Us</h3>
            <div style={{ display: "flex", gap: "10px" }} className={styles.socialIcons}>
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
      </footer>
    </>
  );
}
