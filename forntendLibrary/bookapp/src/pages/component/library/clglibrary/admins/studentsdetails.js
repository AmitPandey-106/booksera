'use client';

import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import AdminLayout from './layout';
import Image from 'next/image';
import SearchAnimation from '../users/SearchAnimation';
import styles from '@/styles/studentsd.module.css';

export default function StudentsDetails() {
    const router = useRouter();
    const { query } = router;
    const [student, setStudent] = useState({});
    const [history, setHistory] = useState([]);
    const defaultImage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const isValidURL = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        if (query.userid) {
            setStudent(query);
            console.log(query);
        }
    }, [query]);

    const fetchHistory = useCallback(async (userImpId) => {
        try {
            const response = await fetch(`${backendUrl}/users/${userImpId}/history`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch history: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched history:', data);
            setHistory(data.history);
        } catch (err) {
            console.error('Error fetching history:', err.message);
        }
    }, [backendUrl]);

    useEffect(() => {
        if (student.userImpId) {
            fetchHistory(student.userImpId);
        }
    }, [student.userImpId, fetchHistory]);

    return (
        <AdminLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Student Details</h1>
                <h2 className={styles.bookCount}>
                    📚 Total Books Borrowed: {history.length}
                </h2>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Register ID:</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{student.userid}</td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.email}</td>
                                <td>{student.role}</td>

                            </tr>
                        </tbody>

                    </table>
                </div>

                {history.length > 0 ? (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Book Image</th>
                                    <th>Borrowed On</th>
                                    <th>Due On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((historyItem) => (
                                    <tr key={historyItem._id}>
                                        <td>{historyItem.book.TITLE}</td>
                                        <td>{historyItem.book.author_name || "Unknown Author"}</td>
                                        <td>
                                            <Image
                                                src={isValidURL(historyItem.book.PHOTO) ? historyItem.book.PHOTO : defaultImage}
                                                alt={historyItem.book.TITLE}
                                                className={styles.bookImage}
                                                width={100}
                                                height={100}
                                            />
                                        </td>
                                        <td>{new Date(historyItem.borrowDate).toLocaleDateString()}</td>
                                        <td>{new Date(historyItem.dueDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No Books have been Borowwed by this Student</p>
                )}
            </div>
        </AdminLayout>
    );
}
