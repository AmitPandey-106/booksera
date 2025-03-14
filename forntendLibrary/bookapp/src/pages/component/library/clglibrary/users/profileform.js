import { useState, useEffect, useContext } from 'react';
import styles from '@/styles/StudentProfileForm.module.css';
import { useRouter } from 'next/router';
import { AuthContext } from '@/pages/component/context/authcontext';
import Userlayout from '../../../../../u_layout'
import NextNProgress from 'nextjs-progressbar';


export default function ProfileForm({ initialError }) {
  const [error, setError] = useState(initialError || '');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {authUser} = useContext(AuthContext)
  const [formData, setFormData] = useState({
    userId: authUser?.id || '', 
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    phoneNumber: '',
    studentID: '',
    department: '',
    yearLevel: '',
    libraryCardNumber: '',
  });
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Make sure the token is stored in localStorage or another secure place
        const res = await fetch(`${backendUrl}/get-user-profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Attach the token in the Authorization header
          }
        });

        if (res.status === 401) {
          setError("Unauthorized. Please log in again.");
          return;
        }

        const data = await res.json();
        if (res.status === 200) {
          setFormData(data.profile); // Pre-fill the form with user data
        } else {
          setError(data.message || 'Failed to load profile or plz create profile to form operation!');
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError('An error occurred. Please try again later.');
      }
    };

    fetchData();
  }, [authUser?.id, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (authUser?.id) {
      setFormData((prev) => ({ ...prev, userId: authUser.id }));
    }
  }, [authUser]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    setSuccess(''); // Reset success message
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/user-profile-edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.status === 200) {
        setSuccess(data.message || 'Profile updated successfully!');
        window.location.reload();

      } else {
        setError(data.message || 'Something went wrong.');
        
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred. Please try again later.');
      
    }
    setIsLoading(false);
  };

  return (
    <Userlayout>
     <div className={styles.body}>
     <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
      <div className={styles.card}>
      <h2 className={styles.h2}>Personal Information</h2>
      <div className={styles.tp}>
        <p>tp</p>
        {success && <p className={styles.successMessage}>{success}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>

    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.user_info}>
      <div className={styles.first}>
      <p>First Name</p>  
      <input className={styles.input} type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} />
      <p>Middle Name</p> 
      <input className={styles.input} type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} value={formData.middleName} />
      <p>Last Name</p> 
      <input className={styles.input} type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} />
      <p>DOB</p> 
      <input className={styles.input} type="date" name="dob" placeholder="Date of Birth" onChange={handleChange} value={formData.dob} />
      <p>Gender</p> 
      <select className={styles.input} name="gender" onChange={handleChange} value={formData.gender}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="nonbinary">Non-binary</option>
      </select>
      </div>

      <div className={styles.second}>
      <p>Email Address</p>   
      <input className={styles.input} type="email" name="email" placeholder="Email Address" onChange={handleChange} value={formData.email} />
      <p>Phone Number</p> 
      <input className={styles.input} type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} value={formData.phoneNumber} />
      <p>Student ID</p> 
      <input className={styles.input} type="text" name="studentID" placeholder="Student ID should be in LowerCase" onChange={handleChange} value={formData.studentID} />
      <p>Department</p> 
      <select className={styles.input} name="department" onChange={handleChange} value={formData.department}>
        <option value="">Select your Department</option>
        <option value="IT">IT</option>
        <option value="CS">CS</option>
        <option value="AIDS">AIDS</option>
      </select>
      {/* <input className={styles.input} type="text" name="department" placeholder="Department" onChange={handleChange} value={formData.department} /> */}
      <p>Current Year</p>
      <select className={styles.input} name="yearLevel" onChange={handleChange} value={formData.yearLevel}>
        <option value="">Select your Year</option>
        <option value="first">First Year</option>
        <option value="second">Second Year</option>
        <option value="third">Third Year</option>
        <option value="fourth">Fourth Year</option>
      </select> 
      {/* <input className={styles.input} type="text" name="yearLevel" placeholder="Year Level" onChange={handleChange} value={formData.yearLevel} /> */}
      <p>Library Card Number  </p> 
      <input className={styles.input} type="text" name="libraryCardNumber" placeholder="Library Card Number" onChange={handleChange} value={formData.libraryCardNumber} />
      </div>
      </div>
      <button className={styles.button} type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit Profile'}</button>
    </form>
    </div>
    </div>
    </Userlayout>
  );
}
