import AdminLayout from './layout';
import { useState } from 'react';
import SearchAnimation from '../users/SearchAnimation';
import styles from '@/styles/adminborrow.module.css'
import styless from '@/styles/bookform.module.css';

export default function AdminBorrow() {
  const [formData, setFormData] = useState({
    userId: '',
    bookName: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'bookName' && value.trim()) {
      fetchBookSuggestions(value);
    } else if (name === 'bookName') {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const BorrowbyAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/borrow-by-admin`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: formData.userId,
          booktitle: formData.bookName,
          email: formData.email,
        }),
      });

      const data = await response.json();
      setResponseMessage(data.message || 'An error occurred.');
    } catch (error) {
      setResponseMessage('Failed to send the request.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookSuggestions = async (query) => {
    try {
      const response = await fetch(`${backendUrl}/api/autocomplete-books?q=${query}`);
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, bookName: suggestion });
    setShowSuggestions(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.bookName) newErrors.bookName = 'Book Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await BorrowbyAdmin();
    }
  };

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styless.popupOverlay}>
          <div className={styless.popupContent}>
            <SearchAnimation/>
          </div>
        </div>
      )}
      <div className={styles.card}>
      <h2 className={styles.tittle}>Borrow a Book</h2>
      <div className={styles.tp}>
      {responseMessage && (
        <p style={{ color: responseMessage.includes('Success') ? 'green' : 'red' }}>
          {responseMessage}
        </p>
      )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.user_info}>
        <div>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
          />
          {errors.userId && <span style={{ color: 'red' }}>{errors.userId}</span>}
        </div>
        <div>
          <label htmlFor="bookName">Book Name:</label>
          <input
            type="text"
            id="bookName"
            name="bookName"
            value={formData.bookName}
            onChange={handleChange}
            autoComplete="off"
          />
          {showSuggestions && (
            <ul
              style={{
                border: '1px solid #ccc',
                margin: '0',
                padding: '5px',
                maxHeight: '150px',
                overflowY: 'auto',
                backgroundColor: 'white',
                listStyle: 'none',
              }}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {errors.bookName && <span style={{ color: 'red' }}>{errors.bookName}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
           
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    </div>
    
  );
}

AdminBorrow.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
