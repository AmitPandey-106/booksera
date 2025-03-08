import React, { useState, useEffect } from 'react';
import AdminLayout from './layout';
import SearchAnimation from '../users/SearchAnimation';

export default function AdminPenaltySection() {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const res = await fetch(`${backendUrl}/user-penalties`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (res.status === 200) {
          setPenalties(data.penalties || []);
          console.log(data.penalties)
        } else {
          console.error('Failed to fetch penalties');
        }
      } catch (error) {
        console.error('Error fetching penalties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPenalties();
  }, [backendUrl]);

  if (loading) {
    return <SearchAnimation/>;
  }

  return (
    <div>
      <h1 style={{margin: '10px 10px 20px'}}>Penalty Details</h1>
      {penalties.length > 0 ? (
        <table style={{ width: '98%', borderCollapse: 'collapse', backgroundColor:'white',marginLeft:'15px' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Student</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Book Title</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Days Overdue</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Penalty Amount</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {penalties.map((penalty) => (
              <tr key={penalty._id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {penalty.user.firstName} {penalty.user.lastName} ({penalty.user.email})
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{penalty.book.TITLE}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{penalty.overdueDays}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>₹{penalty.penaltyAmount}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(penalty.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No penalties recorded.</p>
      )}
    </div>
  );
}

AdminPenaltySection.getLayout = function getLayout(page){
    return <AdminLayout>{page}</AdminLayout>
}