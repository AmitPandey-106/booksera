import Userlayout from "../../u_layout";
import styles from '@/styles/about.module.css';
// import styless from '@/styles/Home.module.css';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import NextNProgress from 'nextjs-progressbar';
import Link from "next/link";


export default function About() {

    const footerRef  = useRef(null);

    const handleExploreClick = () => {
      if (footerRef .current) {
        footerRef .current.scrollIntoView({ behavior: "smooth" });
      }
    };

  return (
    <>
      {/* <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      /> */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />


     <div className={styles.container}>
      <div className={styles.top}>
        <video className={styles.backgroundVideo} autoPlay muted loop>
            <source src="/background/mainbg.mp4" type="video/mp4" />
               Your browser does not support the video tag.
        </video>
        <h1>About Us</h1>
        <h4>Welcome to our BooksEra – your one-stop destination for accessing a vast world of knowledge, resources, and collaboration. Designed with both college students and public library users in mind, our platform seamlessly integrates academic and community-driven resources to enhance your learning experience.</h4>
        </div>

        {/* <div className={styles.images}>
        <Image src="/big1.png" alt="work" width={270} height={250} objectFit="contain" className={styles.pics}/>
        <Image src="/small1.jpg" alt="work" width={250} height={150} objectFit="contain" className={styles.pics}/>
        <Image src="/big2.jpg" alt="work" width={270} height={250} objectFit="contain" className={styles.pics}/>
        <Image src="/small2.jpg" alt="work" width={250} height={150} objectFit="contain" className={styles.pics}/>    
        </div> */}

        <div className={styles.second}>
    
            <Image src="/work.jpg" alt="work" width={600} height={388}
                  objectFit="contain" className={styles.workpic}/>
          
          <div className={styles.side_part1}>
            <h1>We Always Make The Best</h1>
            <p>We are committed to revolutionizing library management by offering seamless and efficient solutions. Our platform simplifies book tracking, borrowing, and inventory management, ensuring libraries run at their best for both staff and users.</p>
            <button onClick={handleExploreClick}>Contact Us</button>
          </div>
        </div>

        <div className={styles.offer}>
          <h1>What We Offer</h1>

          <div className={styles.elements}>
          <div className={styles.clglib}>
          <div>
             <h4>College Library</h4>
             <div className={styles.ps}>
             <p> - College students can log in using their unique ID and password to access all resources available in their respective college libraries.</p>
             <p> - Explore a wide collection of books, e-books, journals, and academic materials tailored to your educational needs.</p>
             <p> - Conveniently book your required materials online and collect them from your college library at your convenience.</p>
             </div>
             </div>
             
            <Image className={styles.Image} src={'/collegelib.jpg'} width={500} height={200} alt="opps"></Image>

          </div>

          <div className={styles.publiclib}>
          <Image className={styles.Image} src={'/publiclib.jpg'} width={700} height={200} alt="opps"></Image>

            <div>
          <h4>Public Library</h4>
          <div className={styles.ps}>
             <p> - College students can log in using their unique ID and password to access all resources available in their respective college libraries.</p>
             <p> - Explore a wide collection of books, e-books, journals, and academic materials tailored to your educational needs.</p>
             <p> - Conveniently book your required materials online and collect them from your college library at your convenience.</p>
             </div>
             </div>
          </div>

          <div className={styles.userlib}>
          <div>
          <h4>User Exchange</h4>
          <div className={styles.ps}>
             <p> - College students can log in using their unique ID and password to access all resources available in their respective college libraries.</p>
             <p> - Explore a wide collection of books, e-books, journals, and academic materials tailored to your educational needs.</p>
             <p> - Conveniently book your required materials online and collect them from your college library at your convenience.</p>
             </div>
             </div>
             <Image className={styles.Image} src={'/userlib.jpg'} width={600} height={200} alt="opps"></Image>
             
          </div>
          </div>
        </div>

        <div className={styles.third}>
          <div className={styles.books}>
            <h1>Our books</h1>
            <p>Our collection spans a wide range of genres, from timeless classics to modern bestsellers, ensuring there something for every reader.</p>
            <p>Meticulously organized and easily accessible, our books are curated to inspire, educate, and entertain.</p>
          </div>

          <div className={styles.achievements}>

            <div className={styles.part1}>
              <div className={styles.one}>
              <h1>4+</h1>
              <p>Years Of Experience</p>
              </div>
              <div className={styles.two}>
              <h1>4+</h1>
              <p>Satisfied Client</p>
              </div>
            </div>

            <div className={styles.part2}>
              <div className={styles.three}>
              <h1>4+</h1>
              <p>Project Done</p>
              </div>
              <div className={styles.four}>
              <h1>4+</h1>
              <p>Certified Award</p>
              </div>
            </div>
          </div>
        </div>

      <div className={styles.ourmission}>
        <div className={styles.text}>
        <h1>Our Mission</h1>
        <p>Our mission is to bridge the gap between students, libraries, and communities by providing an intuitive platform where knowledge is shared, accessed, and celebrated.</p> 
        <p>We aim to promote learning, collaboration, and the joy of reading for everyone, everywhere.</p>
        </div>
        <Image src={'/background/target.png'} width={400} height={380} objectFit="contain" className={styles.targetp} alt="opps"></Image>
      </div>

      <div className={styles.chooseus}>
        <h1>Why Choose Us</h1>
        <div className={styles.points}>
          <div>
          <h4>Comprehensive Resource Access</h4>
          <p>Whether you are a student or a lifelong learner, you will find a rich variety of resources to support your journey.</p>
          </div>
          <div>
          <h4>User-Friendly Interface</h4>
          <p>Easily navigate through our platform to find, book, and share resources with just a few clicks.</p>
          </div>
          <div>
          <h4>Community Engagement</h4>
          <p>Connect with like-minded individuals, share insights, and grow together as a community.</p>
          </div>
        </div>
       
      </div>

      <div className={styles.fourth}>
        <div className={styles.joinus}>
          <p>Join Us Now</p>
          <h1>We Are Always Ready To Take A Perfect Shot</h1>
          <button ref={footerRef}>Get Started</button>
        </div>
        </div>

        
        {/* <footer className={styless.footer} style={{backgroundColor:"#242526", marginTop:'60px'}}>
        <div className={styless.f_div}>

          <div className={styless.f_about}>
            <h3>BooksEra</h3>
            <p>Suntouch Technology is dedicated to delivering top-notch tech solutions to empower businesses worldwide.</p>
            <a href="https://www.googlemaps.com" target="_blank" rel="noopener noreferrer">
              <Image src="/location.png" alt="Facebook" width={24} height={35} />
            </a>
          </div>

          <div className={styless.nav_con}>
            <div className={styless.navigation}>
              <h3>Navigation</h3>
              <p><Link href="/">Home</Link></p>
              <p><Link href="/component/library/clglibrary/users/clgbooks">All Books</Link></p>
              <p><Link href="/component/about">About Us</Link></p>
              <p><Link href="https://posts-sigma-eight.vercel.app">UserExchange</Link></p>
            </div>

            <div className={styless.contact}>
              <h3>Contact Us</h3>
              <p>Email: suntouchtechnology01@gmail.com</p>
              <p>Phone: +91 7506541325</p>
              <p>Address: 295, Chembur, Maharashtra - 74</p>
            </div>
          </div>

          <div className={styless.ser_foll}>
            <div className={styless.f_services}>
              <h3>Services</h3>
              <ul>
                <li>Web Development</li>
                <li>App Development</li>
                <li>Cloud Services</li>
              </ul>
            </div>

            <div className={styless.social_media}>
              <h3>Follow Us</h3>
              <div className={styless.icons}>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/facebook.png" alt="Facebook" width={24} height={24} /> Facebook
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/twitter.png" alt="Twitter" width={24} height={24} /> Twitter
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/linkedin-logo.png" alt="LinkedIn" width={24} height={24} /> LinkedIn
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/instagram.png" alt="Instagram" width={24} height={24} /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        <p>© 2025 SunTouch Technology All rights reserved.</p>
      </footer> */}
        </div>
    </>
  );
}

About.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>
};
