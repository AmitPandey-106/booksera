import Userlayout from '../../../../../u_layout';
import { useEffect, useState } from 'react';
import styles from '@/styles/ebook.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styless from '../../../../../styles/allbooks.module.css';
import SearchAnimation from './SearchAnimation';
// import NextNProgress from 'nextjs-progressbar;'

export default function Others() {
  const [ebooks, setEBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEBooks, setFilteredEBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categorys, setCategorys] = useState([]);
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

  // Fetch eBooks from the backend API
  useEffect(() => {
    const fetchEBooks = async () => {
      try {
        const response = await fetch(`${backendUrl}/all-ebooks`); // Adjust the URL based on your backend
        if (!response.ok) {
          throw new Error('Failed to fetch eBooks.');
        }
        const data = await response.json();
        setEBooks(data);
        setFilteredEBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategorys = async () => {
      try {
        const res = await fetch(`${backendUrl}/all-categorys`); // Assume an endpoint to get available categories
        const data = await res.json();

        if (res.status === 200) {
          setCategorys(data.category); // Set the available categories
        } else {
          console.error(data.msg || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchEBooks();
    fetchCategorys();
  }, [backendUrl]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = ebooks;

      // Apply category filter if selected
      if (categoryFilter) {
        filtered = filtered.filter((book) => book.category === categoryFilter);
      }

      // Apply search query filter
      if (searchQuery) {
        filtered = filtered.filter(
          (ebook) =>
            ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ebook.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredEBooks(filtered);
    };

    applyFilters();
  }, [searchQuery, categoryFilter, ebooks]);

  // Handle category filter change
  const onCategorySelect = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Handle search input change
  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/ebook`
    });
  };

  return (
    <div className={styles.books_container}>
    {/* <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      /> */}
      {loading && <SearchAnimation/>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.control_bar}>
        <h1>Uploaded eBooks</h1>

        <div className={styles.search}>
        <div className={styles.filter_bar}>
          <select onChange={onCategorySelect} value={categoryFilter}>
            <option value="">Select Category</option>
            {categorys.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.search_bar}>
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        </div>
      </div>

      <div className={styless.books_row}>
        {!loading && !error && filteredEBooks.length > 0 ? (
          filteredEBooks.map((ebook) => (
            <div key={ebook._id} className={styless.book_card} onClick={()=> handleBookClick(ebook)}>
              <div className={styless.book_image}>
              <Image src={isValidURL(ebook.coverImage) ? ebook.coverImage : defaultimage} alt={ebook.title} layout="fill"
                  objectFit="contain"/>
              </div>
              <h2 className={styless.book_title}>{ebook.title}</h2>
              <p className={styless.book_author}>by {ebook.author}</p>
              <p className={styless.bookCategory}>Category: {ebook.category}</p>

              {/* <button
                className={styles.view_pdf_button}
                onClick={() => setSelectedPDF(`http://localhost:8001/${ebook.file}`)}
              >
                View PDF
              </button> */}
            </div>
          ))
        ) : (
          <p>No eBooks available</p>
        )}
      </div>
    </div>
  );
}

// Set layout
Others.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
