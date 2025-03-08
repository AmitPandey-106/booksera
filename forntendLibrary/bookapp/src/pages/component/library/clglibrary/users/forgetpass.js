import { useState, useEffect } from "react"
import Userlayout from '../../../../../u_layout'
import styles from "@/styles/forgetpass.module.css";
import NextNProgress from 'nextjs-progressbar';


ForgotPassword.getLayout = function getLayout(page) {
    return <Userlayout>{page}</Userlayout>;
  };

  export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${backendUrl}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
        if (response.ok) {
          setMessage('Password reset link sent to your email');
        } else {
          setMessage(data.error || 'Something went wrong');
        }
      } catch (error) {
        setMessage('Server error. Please try again later.');
      }
    };
  
    return (
      <div className='full_container' style={{minHeight:'100vh', display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
      <div className={styles.fg_pass}>
      <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
        <h1>Forgot Password</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
      </div>
    );
  }
  
