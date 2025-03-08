import React, { useState, useEffect } from 'react';
import Userlayout from '@/u_layout';
import { useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar'
import SearchAnimation from '../../users/SearchAnimation';

export default function SingleEbook() {
    const router = useRouter();
    const { id } = router.query;
    const [ebook, setEbook] = useState();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    useEffect(() => {
        if (!router.isReady || !id) return;

        const fetchBookDetails = async () => {
            try {
                const res = await fetch(`${backendUrl}/get-ebook/${id}`);
                const data = await res.json();

                if (res.status === 200) {
                    setEbook(data.book);
                } else {
                    console.error(data.message || "Failed to fetch book details");
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        fetchBookDetails();
    }, [router.isReady, id, backendUrl]);

    const handleViewPDF = () => {
        router.push(`/component/library/clglibrary/admins/pdf-viewer/${id}`);
    };

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', 
            padding: '16px', 
            backgroundColor: '#f3f4f6'
        }}>
            <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
            {ebook ? (
                <div style={{
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    padding: '24px',
                    maxWidth: '600px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '16px'
                    }}>{ebook.title}</h1>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{ textAlign: 'left', width: '100%' }}>
                            <p style={{ fontSize: '18px', marginBottom: '6px' }}><strong>Title:</strong> {ebook.title}</p>
                            <p style={{ fontSize: '18px', marginBottom: '6px' }}><strong>Author:</strong> {ebook.author}</p>
                            <p style={{ fontSize: '16px', color: '#666' }}>{ebook.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleViewPDF}
                        style={{
                            marginTop: '20px',
                            width: '100%',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '12px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease-in-out'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                    >
                        View PDF
                    </button>
                </div>
            ) : (
                <SearchAnimation/>
            )}
        </div>
    );
}

SingleEbook.getLayout = function getLayout(page) {
    return <Userlayout>{page}</Userlayout>;
};
