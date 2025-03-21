import Userlayout from '../../../../../u_layout'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '@/pages/component/context/authcontext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '@/styles/userinfo.module.css';
import NextNProgress from 'nextjs-progressbar';
import SearchAnimation from './SearchAnimation'


export default function Userinfo() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          router.push('/signin'); // Redirect if not authenticated
          return;
        }

        const res = await fetch(`${backendUrl}/get-user-profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.status === 200) {
          const Id = data.profile._id;
          setProfileData(data.profile);
        } else {
          setError(data.msg || 'Error fetching profile data');
        }
      } catch (err) {
        setError('An error occurred while fetching profile data');
      }
    };

    fetchProfileData();
  }, [router, backendUrl]);

  return (
    <div style={{minHeight:'100vh'}}>
      <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
      <div className={styles.profile}>
        {profileData ? (
          <div className={styles.uinfo}>

          <div className={styles.first}>
          {/* <h3>First Name</h3> */}
          <div>
          <h1 className={styles.uname}> {profileData.firstName} {profileData.lastName}</h1>
          </div>

          <div className={styles.midN}> 
          <h2>l</h2>
          <div> 
          <h3>Middle Name</h3>
          <p className={styles.mname}>{profileData.middleName}</p>
          </div>
          </div>

          
          <div className={styles.dob}>
          <h2>l</h2>
          <div>
          <h3>DOB</h3>
          <p className={styles.dob}>{new Date(profileData.dob).toISOString().split('T')[0]}</p>
          </div>
          </div>

          <div className={styles.gen}>
          <h2>l</h2>
          <div>
          <h3>Gender</h3>
          <p className={styles.ugender}>{profileData.gender}</p>
          </div>
          </div>
          </div>

          <div className={styles.vertical}></div>

          <div className={styles.second}>
          {/* <h1 className={styles.umail}>email: {profileData.email}</h1>
          <h1 className={styles.uphone}>Phone: {profileData.phoneNumber}</h1>
          <h1 className={styles.us_id}>StudentId: {profileData.studentID}</h1>
          <h1 className={styles.udept}>Department: {profileData.department}</h1>
          <h1 className={styles.uyr}>Year: {profileData.yearLevel}</h1>
          <h1 className={styles.ulib_card}>libraryCard: {profileData.libraryCardNumber}</h1> */}

         <div>
          <h1 className={styles.od}>Other Details</h1>
         </div>

          <div className={styles.email}> 
          <h2>l</h2>
          <div> 
          <h3>Email</h3>
          <p className={styles.umail}>{profileData.email}</p>
          </div>
          </div>

          
          <div className={styles.phone}>
          <h2>l</h2>
          <div>
          <h3>Phone Number</h3>
          <p className={styles.uphone}>{profileData.phoneNumber}</p>
          </div>
          </div>

          <div className={styles.sid}>
          <h2>l</h2>
          <div>
          <h3>Student Id</h3>
          <p className={styles.us_id}>{profileData.studentID}</p>
          </div>
          </div> 

          <div className={styles.dept}>
          <h2>l</h2>
          <div>
          <h3>Department</h3>
          <p className={styles.udept}>{profileData.department}</p>
          </div>
          </div> 

          <div className={styles.yr}>
          <h2>l</h2>
          <div>
          <h3>Year</h3>
          <p className={styles.uyr}>{profileData.yearLevel}</p>
          </div>
          </div>  

          <div className={styles.lc}>
          <h2>l</h2>
          <div>
          <h3>LibraryCard</h3>
          <p className={styles.ulib_card}>{profileData.libraryCardNumber}</p>
          </div>
          </div>         
          </div>

        </div>
        ):(
          <SearchAnimation/>
        )}
      </div>
      {/* <hr></hr> */}
    </div>
  )
}

Userinfo.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>
}
