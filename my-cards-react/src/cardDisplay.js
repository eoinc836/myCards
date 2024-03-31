import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {motion} from 'framer-motion';
import './cardDisplay.css';

function CardDisplay({isCollapsed}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const [overlayData, setOverlayData] = useState({});

    useEffect(() => {
        fetchData();
        if (initialLoad) {
            nextPage();
        }
    }, [currentPage]);

    function nextPage() {
        if (initialLoad) {
            setInitialLoad(false)
        } else {
            setCurrentPage(currentPage + 1)
        }
    }

    function previousPage() {
        if (initialLoad) {
            setInitialLoad(false)
        } else {
            setCurrentPage(currentPage - 1)
        }
    }

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000',
        withCredentials: true 
    });

    const fetchData = async () => {
        try {
            const response = await axiosInstance.post('/retrieveImages', {'pageNum': currentPage});
            setOverlayData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const overlays = Object.keys(overlayData)
    return (
        <div>
            <div className='bottom-half'>
                <div className="card-display">
                    {overlays.map((key, index) => (
                        <motion.div
                            className="card-container"
                            key={index}
                            animate={{ scale: isCollapsed ? 1.2 : 1 }}
                        >
                            
                            <motion.div
                            className='overlay'
                            animate={{ scale: isCollapsed ? 1.2 : 1 }}>
                                <p className='set'>{overlayData[key]['set']}</p>
                                <p className='qnt'>{overlayData[key]['qnt']}</p>
                                <p className='price'>€{overlayData[key]['price']}</p>
                            </motion.div>
                            <motion.img
                                className='card-image'
                                id={`card-image-${index}`}
                                src={overlayData[key]['link']}
                                alt={`Image ${index}`}
                                animate={{ scale: isCollapsed ? 1.1 : 1 }}
                                />
                        </motion.div>
                    ))}
            </div>
            <div className="page-controls">
                <button onClick={previousPage}>Previous Page</button>
                <button onClick={nextPage}>Next Page</button>
            </div>
        </div>
    </div>
        
    );
}

export default CardDisplay;
