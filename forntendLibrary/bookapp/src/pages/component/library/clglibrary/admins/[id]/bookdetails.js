import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/pages/component/context/authcontext';
import AdminLayout from '../layout';
import Userlayout from '@/u_layout';
import Image from 'next/image';
import styles from "@/styles/bookdetails.module.css";
import { CircularProgress } from "@mui/material";
import SearchAnimation from '../../users/SearchAnimation';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="modal-actions">
        <button onClick={onCancel} className="cancel-button">Cancel</button>
        <button onClick={onConfirm} className="confirm-button">Confirm</button>
      </div>
    </div>
    <style jsx>{`
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .modal-actions button {
        margin: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cancel-button {
        background: #f44336;
        color: white;
      }
      .confirm-button {
        background: #4caf50;
        color: white;
      }
    `}</style>
  </div>
);

export default function BookDetails() {
  const { authUser, profileId } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [bookdetails, setBookdetails] = useState(null);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [recommendations, setRecommendations] = useState([])
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

  const [isProcessing, setIsProcessing] = useState(false); // Loading state

  const handleReportClick = () => {
    if (!bookdetails.book) {
      console.error("Error: No lost books data available!");
      return;
    }

    // Convert object to string and base64 encode it
    const encodedData = Buffer.from(JSON.stringify(bookdetails.book)).toString('base64');

    router.push({
      pathname: '/component/library/clglibrary/admins/booksreport',
      query: { reports: encodedData },
    });
  };

  const handleBorrow = () => {
    setIsProcessing(true); // Start processing

    setTimeout(() => {
      // Simulate fetching user profile ID
      openModal("borrow"); // Open borrow confirmation modal
      setIsProcessing(false); // Stop processing after 2 seconds
    }, 2000);
  };

  const Layout = authUser.role === 'user' ? Userlayout : AdminLayout;
  // console.log(profileId)
  const handleroute = () => {
    router.push('/component/library/clglibrary/users/profileform')
  }

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleCollect = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('../../../../auth/librarysignin'); // Redirect to signin
      return;
    }
    try {
      // Sending a POST request to borrow the book
      const response = await fetch(`${backendUrl}/borrow/${profileId}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsBorrowed(true);

        // Assuming the API sends back the updated book details (including the dueDate)
        setBookdetails((prev) => ({
          ...prev,
          TOTAL_VOL: prev.book.TOTAL_VOL > 0 ? prev.book.TOTAL_VOL - 1 : 0,
        }));

        // Alert success with due date from API response
        alert(`Request Successfully send for "${bookdetails.book.TITLE}"}`);
        window.location.reload();
      } else {
        const errorData = await response.json();
        if (errorData.message) {
          alert(`Error: ${errorData.message}`);
        } else if (!profileId) {
          handleroute();
        }
        else {
          alert("Failed to borrow the book. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      // alert("An unexpected error occurred while trying to borrow the book.");
    }
  }

  const handleWaitlist = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('../../../../auth/librarysignin'); // Redirect to signin
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: profileId, bookId: bookdetails.book._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsWaitlisted(true);
        alert(data.message);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      alert('Failed to join the waitlist. Please try again.');
    }
  };

  const confirmAction = () => {
    if (modalType === 'borrow') handleCollect();
    if (modalType === 'waitlist') handleWaitlist();
    closeModal();
  };

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`${backendUrl}/book/${id}`);
        const data = await res.json();

        if (res.status === 200) {
          setBookdetails(data);
          setRecommendations(data.recommendations)
          setIsBorrowed(false)
        } else {
          console.error(data.message || "Failed to fetch book details");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [router.isReady, id, backendUrl]);
  // console.log(bookdetails)
  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`
    });
  };

  return (
    <Layout>
      <div className={styles.book_details_container}>
        {bookdetails ? (
          <div className={styles.bookdetails}>
            <div className={styles.bookDetailsPage}>
              <h1 className={styles.book_title}>Book Details</h1>

              <div className={styles.section1}>
                <div className={styles.imgCover}>
                  <Image
                    src={bookdetails.book.PHOTO && isValidURL(bookdetails.book.PHOTO) ? bookdetails.book.PHOTO : defaultimage}
                    alt={bookdetails.book.TITLE || "Book Image"}
                    width={200}
                    height={250}
                  />
                </div>

                <div className={styles.bookinfo}>
                  <div className={styles.deepDetails}>
                    <p><strong>Title:</strong> {bookdetails.book.TITLE}</p>
                    <p><strong>Author:</strong> {bookdetails.author}</p>
                    <p><strong>Quantity Available:</strong> {bookdetails.book.TOTAL_VOL}</p>
                    <p><strong>Published On:</strong> 22/2/2022</p>
                    <p className={styles.description}><strong>Description:</strong> A compelling book that provides deep insights into {bookdetails.book.TITLE}. A must-read for all book lovers.</p>

                    <div className={styles.ratings}>
                      <span className={styles.star}>★</span>
                      <span className={styles.star}>★</span>
                      <span className={styles.star}>★</span>
                      <span className={styles.star}>☆</span>
                      <span className={styles.star}>☆</span>
                      <p className={styles.ratingText}>3.0/5.0</p>
                    </div>

                    {authUser.role === 'user' ? (
                      <div className={styles.buttongroup}>
                        <button
                          className={styles.collect_button}
                          onClick={() => openModal('borrow')}
                          disabled={isBorrowed || bookdetails?.quantity === 0 || isProcessing}
                        >
                          {isProcessing ? "Processing..." : isBorrowed ? "Go collect" : "Borrow"}
                        </button>
                        <button
                          className={styles.waitlistbutton}
                          onClick={() => openModal('waitlist')}
                          disabled={isWaitlisted || bookdetails?.quantity > 0}
                        >
                          {isWaitlisted ? "Waitlisted" : "Join Waitlist"}
                        </button>
                      </div>
                    ) : (
                      <div className={styles.buttongroup}>
                        <button className={styles.collect_button} onClick={() => router.push(`/component/library/clglibrary/admins/${id}/editbook`)}>Edit</button>
                        <button className={styles.dl_button} onClick={() => router.push(`/component/library/clglibrary/admins/${id}/editbook?mode=dl`)}>D & L</button>
                        <button className={styles.waitlistbutton} onClick={() => alert("Delete button clicked")}>Delete</button>
                        {authUser.role === 'admin' && (
                          <button className={styles.report_button} onClick={handleReportClick}>
                            Report
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div id="page2" className={`absolute w-full h-full bg-white border border-gray-300 transition-transform duration-1000 origin-left`} style={{ transformOrigin: 'left' }}>
              {recommendations.length > 0 && authUser.role === 'user' && (

                <div className={styles.recommendation}>
                  <div className={styles.cat1}>
                    <h2 className={styles.book_title}>Recommended Books :-</h2>
                  </div>
                  <div className={styles.books_row}>

                    <div className={styles.recommendation_list}>
                      {recommendations.map((recBook) => (
                        <div
                          key={recBook._id}
                          className={styles.recommendation_item}
                          onClick={() => handleBookClick(recBook)}
                        >
                          <Image src={isValidURL(recBook.PHOTO) ? recBook.PHOTO : defaultimage} alt={recBook.TITLE} className={styles.recommendation_image} width={200} height={200} />
                          <p className={styles.recommendation_title}>{recBook.TITLE}</p>
                          <div className={styles.r_ratings}>
                            <span className={styles.r_star}>★</span>
                            <span className={styles.r_star}>★</span>
                            <span className={styles.r_star}>★</span>
                            <span className={styles.r_star}>☆</span>
                            <span className={styles.r_star}>☆</span>
                            <p className={styles.r_ratingText}>3.0/5.0</p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <SearchAnimation></SearchAnimation>
        )}

      </div>
      {showModal && (
        <ConfirmationModal
          title={modalType === 'borrow' ? 'Confirm Borrowing' : 'Confirm Waitlisting'}
          message={
            modalType === 'borrow'
              ? 'Are you sure you want to borrow this book?'
              : 'Are you sure you want to join the waitlist for this book?'
          }
          onConfirm={confirmAction}
          onCancel={closeModal}
        />
      )}
    </Layout>
  );
}

