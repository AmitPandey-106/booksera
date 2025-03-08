import React, { useState, useEffect, useContext, useRef } from 'react';
import Userlayout from '../../../../../u_layout'
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCallback } from 'react';
import styles from '../../../../../styles/allbooks.module.css';
import booksrch from "./../../../../../../public/booksrch.json";
import { FaSearch } from 'react-icons/fa';
import { AuthContext } from '@/pages/component/context/authcontext';
import SearchPopup from './searchpop';

export default function Searchedbooks() {
  const router = useRouter();
  const [searchType, setSearchType] = useState(''); // Tracks which input is clicked
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [showSearchFilter, setShowSearchFilter] = useState(true);
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const popupRef = useRef();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  useEffect(() => {
    const searchData = router.query.data ? JSON.parse(router.query.data) : JSON.parse(sessionStorage.getItem("searchedBooks") || "[]");
    setBooks(searchData);
  }, [router.query]);
  

  const fetchBooks = useCallback(() => {
    setLoading(true);
    try {
      // Get data from sessionStorage
      const storedData = sessionStorage.getItem("searchedBooks");
      if (storedData) {
        setBooks(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/subjects`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data.map((subject) => subject.SUB_NAME));
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, [backendUrl]);
  
  useEffect(() => {
    fetchBooks();
    fetchSubjects();
  }, [router.query,currentPage, fetchBooks, fetchSubjects]);
  // popup for search
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleCloseSearchFilter = () => {
    setShowSearchFilter(false); // Set to false to hide the SearchFilterBooks component
  };
    useEffect(()=>{
    const handleBack = () => {
      if (window.history.length > 2) {
        router.replace("/component/library/clglibrary/users/clgbooks"); // Redirect to a safe fallback page
      } else {
        router.back();
      }
    }
    window.addEventListener('popstate', handleBack);

  return () => {
    window.removeEventListener('popstate', handleBack);
  };
  },[router])

  const handleClosePopup = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsPopupOpen(false); // Close popup if clicked outside
      setSearchType(''); // reset search
    }
  };

  useEffect(() => {
    fetchBooks();  // Initial fetch when component mounts

    // Listen for back button event
    const handleBackButton = () => {
      fetchBooks();  // Refetch books when back button is clicked
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [router.query, fetchBooks]);

  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClosePopup);
    } else {
      document.removeEventListener('mousedown', handleClosePopup);
    }

    return () => {
      document.removeEventListener('mousedown', handleClosePopup);
    };
  }, [isPopupOpen]);

  const openPopup = () => {
    setShowSearchFilter(true);
  };  

  const handleInputFocus = (type) => {
    setSearchType(type);
    setShowSearchFilter(true)
    setIsPopupOpen(false)
  };

  const searchBooks = async () => {

    setLoading(true);
    try {
      const url = `${backendUrl}/search-by-filter?subname=${subject}&query=${query}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`,
    });
  };

  return (
    <div className={styles.books_container}>
      <div className={styles.control_bar}>
        <h1>All Books</h1>
        <div>
          {/* Search Icon */}
          <div className={styles.filter} onClick={togglePopup}>
            <FaSearch className={styles.search_icon} />
          </div>

          {/* Initial Popup */}
          {isPopupOpen && (
            <div className={styles.popup_backdrop}>
              <div ref={popupRef} className={styles.popup}>
                <div
                  className="type_of_search"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <div>
                    <label className="label" style={{ fontSize: '12px' }}>
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Search book by title"
                      className={styles.popup_input}
                      onClick={openPopup}
                      onFocus={() => handleInputFocus('title')}
                    />
                  </div>
                  <span style={{ marginTop: '13px' }}>or</span>
                  <div>
                    <label className="label" style={{ fontSize: '12px' }}>
                      Author
                    </label>
                    <input
                      type="text"
                      placeholder="Search book by author"
                      className={styles.popup_input}
                      onClick={openPopup}
                      onFocus={() => handleInputFocus('author')}
                    />
                  </div>
                </div>
                <label className="label" style={{ fontSize: '12px' }}>
                  Subject filter
                </label>
                <input
                  type="text"
                  placeholder="Filter books by subject..."
                  className={styles.popup_input}
                  onClick={openPopup}
                  onFocus={() => handleInputFocus('subject')}
                />
                <button
                  onClick={togglePopup}
                  className={styles.popup_button}
                >
                  Search
                </button>
              </div>
            </div>
          )}

        </div>
        <button className={styles.submit_button} onClick={searchBooks}>
          Search
        </button>

      </div>
      {loading && <div className={styles.loadingOverlay}>

        <p>Loading...</p>
      </div>}

      <div className={styles.books_row}>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className={styles.book_card} onClick={() => handleBookClick(book)}>
              <div className={styles.book_image}>
                <Image
                  src={isValidURL(book.PHOTO) ? book.PHOTO : defaultimage}
                  alt={book.TITLE}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h2 className={styles.book_title}>{book.TITLE}</h2>
              <p className={styles.book_author}>by {book.authorName || 'Unknown Author'}</p>
              <p className={styles.book_quantity}>Available: {book.TOTAL_VOL}</p>
            </div>
          ))
        ) : (
          <p>No Book found</p>
        )}
      </div>
      {books.length > 10 ?
        (
          <div className={styles.pagination}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        ) : (
          ''
        )}
      {searchType && showSearchFilter && (
        <div className={styles.single_input}>
          <SearchPopup type={searchType} onClose={handleCloseSearchFilter} />
        </div>
      )}
    </div>
  );
}

Searchedbooks.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};