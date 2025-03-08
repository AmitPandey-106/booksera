import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Userlayout from '@/u_layout';
import SearchAnimation from '../../users/SearchAnimation';

export default function PDFViewer() {
  const router = useRouter();
  const { id } = router.query;
  const [pdfUrl, setPdfUrl] = useState(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!id) return;
  
    const fetchPdf = async () => {
      try {
        const res = await fetch(`${backendUrl}/get-ebook/${id}`);
        const data = await res.json();
  
        if (res.status === 200 && data.book.file) {
          const fileUrl = `${backendUrl}/${data.book.file.replace(/\\/g, '/')}`;
          setPdfUrl(fileUrl);
        } else {
          console.error("Failed to fetch eBook or file is missing");
        }
      } catch (error) {
        console.error("Error fetching eBook:", error);
      }
    };
  
    fetchPdf();
  }, [id, backendUrl]);
  
  // console.log(pdfUrl)

  return (
    <div className="container">
      {/* <h1>PDF Viewer</h1> */}
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="700px"
          // style={{ border: 'none' }}
        ></iframe>
      ) : (
        <SearchAnimation/>
      )}
    </div>
  );
}