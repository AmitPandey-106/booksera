import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from './layout';
import styles from '@/styles/BooksReport.module.css';

export default function BooksReport() {
  const router = useRouter();
  const { reports } = router.query;
  const [booksData, setBooksData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filterType, setFilterType] = useState("LOST_BOOKS");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.isReady && reports) {
      try {
        const decodedData = JSON.parse(Buffer.from(reports, 'base64').toString());
        setBooksData(decodedData);
      } catch (error) {
        console.error("Error parsing books data:", error);
      }
    }
  }, [router.isReady, reports]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${backendUrl}/admin-history`);
        if (!response.ok) {
          throw new Error('Failed to fetch history records.');
        }
        const data = await response.json();
        setHistoryData(data.history); // Store full history
        console.log(data.history)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [backendUrl]);

  // **Filtering logic**
  useEffect(() => {
    if (booksData && historyData.length > 0) {
      const bookTitle = booksData.TITLE; // Extract book title from reports

      let filtered = [];

      if (filterType === "LOST_BOOKS") {
        filtered = booksData.LOST_BOOKS || []; // Lost Books Data
      } else if (filterType === "DAMAGED_BOOKS") {
        filtered = booksData.DAMAGED_BOOKS || []; // Damaged Books Data
      } else if (filterType === "REASONS") {
        filtered = historyData.filter(history => history.book.TITLE === bookTitle); // Filter history by book title
      }

      setFilteredBooks(filtered);
    }
  }, [booksData, historyData, filterType]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Library Books Report</h2>

      {/* Filter Buttons */}
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={() => setFilterType("LOST_BOOKS")}>
          Lost Books
        </button>
        <button className={styles.button} onClick={() => setFilterType("DAMAGED_BOOKS")}>
          Damaged Books
        </button>
        <button className={styles.button} onClick={() => setFilterType("REASONS")}>
          Book History
        </button>
      </div>

      {/* Display Data */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : filteredBooks.length > 0 ? (
        <>
          {filterType === "LOST_BOOKS" || filterType === "DAMAGED_BOOKS" ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Student ID</th>
                  <th>Reported Date</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((record, index) => (
                  <tr key={index}>
                    <td>{record.book?.TITLE || booksData?.TITLE}</td>
                    <td>{record.user?.studentId || "N/A"}</td>
                    <td>{record.date ? new Date(record.date).toISOString().split('T')[0] : "N/A"}</td>
                    <td>{record.quantity || "1"}</td>
                    <td>{record.reason || record.status || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
              <tr>
                <th>TOTAL </th>
                <th>{filteredBooks.length}</th>
              </tr>
            </table>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Student ID</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((record, index) => (
                  <tr key={index}>
                    <td>{record.book?.TITLE || "N/A"}</td>
                    <td>{record.user?.firstName || "N/A"}</td>
                    <td>{record.borrowedDate ? new Date(record.borrowedDate).toLocaleDateString() : "N/A"}</td>
                    <td>{record.returnedDate ? new Date(record.returnedDate).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
              <tr>
                <th>TOTAL </th>
                <th>{filteredBooks.length}</th>
              </tr>
            </table>
          )}
        </>
      ) : (
        <p className={styles.noRecords}>No records found.</p>
      )}
    </div>
  );
}

BooksReport.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
