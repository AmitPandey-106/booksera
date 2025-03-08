import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/searchfilter.module.css';
import Userlayout from '../../../../../u_layout'
import ClgBooks from './clgbooks';

const SearchPopup = ({ type, onClose }) => {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]); // State for storing subjects
  const [formData, setFormData] = useState({ bookName: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [subjectShowSuggestions, setSubjectShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const subjectInputRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // Fetch available subjects
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/subjects`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data.map((subject) => subject.SUB_NAME)); // Update subjects state
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, [backendUrl]);

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ bookName: value }); // Update book name in formData

    if (value.length > 1) {
      // Only fetch suggestions if input length > 1
      fetchBookSuggestions(value); 
    } else {
      setSuggestions([]); // Clear suggestions if input length is less than 2
      setShowSuggestions(false);
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Auto-focus input when component mounts
    }

  },); 

  // Fetch book suggestions based on input
  const fetchBookSuggestions = async (query) => {
    try {
      const endpoint = type === 'title' ? 'autocomplete-books' : 'autocomplete-author';
      const response = await fetch(`${backendUrl}/api/${endpoint}?q=${query}`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ bookName: suggestion });
    setSuggestions([]);
    setShowSuggestions(false);
    searchBooks(suggestion);
  };

  const handleSubjectSelect = (selectedSubject) => {
    setSubject(selectedSubject);
    setSubjectShowSuggestions(false);
    searchBooks(selectedSubject); // Run the search immediately
  };

  // Search books based on input query and subject
  const searchBooks = async (query) => {
    setLoading(true);
    try {
        const searchPagePath = "/component/library/clglibrary/users/srchfilterbooks";
        const url = `${backendUrl}/search-by-filter?subname=${subject}&query=${query}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to search books');
        }
        
        const data = await response.json();

        // Update the session storage (optional)
        sessionStorage.setItem("searchedBooks", JSON.stringify(data));

        // If user is already on the search results page, update URL instead of pushing a new route
        if (router.pathname === searchPagePath) {
            router.push({
                pathname: searchPagePath,
                query: { searched: true, subname: subject, title: query },
            }, undefined, { shallow: true });
        } else {
            router.push({
                pathname: searchPagePath,
                query: { searched: true, subname: subject, title: query },
            });
        }

        onClose(); // Close the popup after search

    } catch (error) {
        console.error('Error searching books:', error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
  if (inputRef.current) {
    inputRef.current.focus(); // Auto-focus input when component mounts
  }
}, []);
  
  // Fetch subjects when component mounts
  useEffect(() => {
    if (type === 'subject') {
      fetchSubjects(); // Fetch subjects only when type is 'subject'
    }
  }, [fetchSubjects, type]);

  return (
    <div className={styles.container}>
      <div className={styles.search_input}>
        {type === 'subject' ? (
          // Subject input display
          <div ref={subjectInputRef} className={styles.subject_input_container}>
            <input 
              ref={inputRef}
              type="text"
              placeholder="Search by subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubjectSelect(subject);
                }
              }}
              onFocus={() => setSubjectShowSuggestions(true)}
            />
            {subjectShowSuggestions && (
              <div className={styles.suggestions}>
                {subjects
                  .filter((s) => s.toLowerCase().includes(subject.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSubjectSelect(suggestion)}
                      className={styles.suggestion_item}
                    >
                      {suggestion}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          // Default search input
          <div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search here..."
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSuggestionClick(formData.bookName);
                }
              }}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={styles.suggestion_item}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SearchPopup.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default SearchPopup;
