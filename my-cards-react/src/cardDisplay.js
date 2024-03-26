import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cardDisplay.css';

function CardDisplay() {
    const [currentPage, setCurrentPage] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const [imageLinks, setImageLinks] = useState([]);
    const [overlayData, setOverlayData] = useState({});
    useEffect(() => {
        fetchData();
        if (initialLoad){
            nextPage();
        }
    }, [currentPage]);

    function nextPage() {
        if (initialLoad){
            setInitialLoad(false)
        } else {
            setCurrentPage(currentPage + 1)
        }  

        console.log(overlayData)
    }

    function previousPage() {
        if (initialLoad){
            setInitialLoad(false)
        } else {
            setCurrentPage(currentPage - 1)
        }  



    }

    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:5000/retrieveImages', {'pageNum': currentPage});
            const newImageLinks = Object.values(response.data);
            setOverlayData(response.data);
            setImageLinks(newImageLinks);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };  

    const overlays = Object.keys(overlayData)

    return (
        <div className='bottom-half'>
            <div className="card-display">
                {overlays.map((key, index) => (
                    
                    <div className="card-container" key={index}>
                        <div className='overlay'>
                            <p className='set'>{overlayData[key]['set']}</p>
        
                            <p className='qnt'>{overlayData[key]['qnt']}</p>

                            <p className='price'>€{overlayData[key]['price']}</p>
                        </div>
                        <img className='card-image' id={`card-image-${index}`} src={overlayData[key]['link']} alt={`Image ${index}`} />
                    </div>
                ))}
            </div>

            <div className="page-controls">
                <button onClick={previousPage}>Previous Page</button>
                <button onClick={nextPage}>Next Page</button>
            </div>
        </div>
    );
}

export default CardDisplay;
