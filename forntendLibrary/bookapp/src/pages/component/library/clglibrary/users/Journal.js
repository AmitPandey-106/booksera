import React from 'react';
import Userlayout from '../../../../../u_layout'

export default function Journal() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      textAlign: 'center',
      fontSize: '20px' 
    }}>
      Journal Page Under Construction
    </div>
  );
}

Journal.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
