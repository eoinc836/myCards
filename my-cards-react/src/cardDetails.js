import {React, useState} from 'react';
import axios from 'axios';
import './cardDetails.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion';
import CardDisplay from './cardDisplay';
function CardDetails(){
    const [cardName, setCardName] = useState('');
    const [cardQnt, setCardQnt] = useState(0);
    const [setCode, setSetCode] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true);


    function toggleCollapse(){
      setIsCollapsed(!isCollapsed);
    };
    const options = [
        { label: "Kashtira Fenrir", value: "kashtira-fenrir"},
        { label: 'Magikuriboh', value: 'magikuriboh' },
        { label: 'Dark Magician', value: 'dark-magician' },
        { label: 'Select Card', value: 'Select Card' },
      ];

    

    const [isSearchBoxActive, setSearchBoxActive] = useState(false);
      
    const handleAutoCompleteChange = () => {
          setSearchBoxActive(true);
        };
      
    const handleBlur = () => {
          setSearchBoxActive(false);
        };
      

    const handleQntChange = (event)=>{
        setCardQnt(parseFloat(event.target.value))
        console.log(event.target.value)
    }

    const handleSetCodeChange = (event)=>{
        setSetCode(event.target.value)
        console.log(event.target.value)
    }

    const handleNameChange = (event)=>{
        setCardName(event.target.value)
        console.log(event.target.value)
    }

      const cardData = {
        'name' :cardName,
        'qnt' : cardQnt,
        'setCode' : setCode,
      }
      
      const addCard = () => {
        axios.post('http://localhost:3000/addCard', cardData) // Adjust the URL to your Flask backend endpoint
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error('Error sending data:', error);
          });
      };

      const removeCard = () => {
        axios.post('http://localhost:3000/removeCard', cardData) // Adjust the URL to your Flask backend endpoint
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error('Error sending data:', error);
          });
      };

    return (
      <div>
        <motion.div
        className={`grid-container`}
        initial={false}
        animate={{ height: isCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <div class="grid-item">
          <input type='text' placeholder='Card Name' onChange={handleNameChange}/>
        </div>
        <div class="grid-item">
          <input type='text' placeholder='Set Code' onChange={handleSetCodeChange}/>
        </div>
        <div class="grid-item">
          <input type='number' onChange={handleQntChange}/>
        </div>
        <div class="grid-item">
          <button onClick={addCard}>Add</button>
        </div>
        <div class="grid-item">
          <button onClick={removeCard}>Remove</button>
        </div>
      </motion.div>
      <div className='search-bar'>
      <Autocomplete
        id='autocomplete-bar'
        onChange={handleAutoCompleteChange}
        options={options}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Name"
            onFocus={handleAutoCompleteChange}
            onBlur={handleBlur}
          />
        )}
      />
    </div>
      <div className='util-bar'>
      <motion.button
          id='toggleButton'
          animate={{ rotate: isCollapsed ? 180 : 360 }} 
          onClick={toggleCollapse}
          transition={{ duration: 0.3, ease: "easeInOut" }}
      >
          <motion.img
              id='toggleImage'
              src="/millenium-puzzle-icon.png"
              alt="collapse button"
              style={{ display: isSearchBoxActive ? 'none' : 'block' }}
          />
      </motion.button>

      </div>
      <CardDisplay isCollapsed={isCollapsed} />
  </div>
  
  
    );
}

export default CardDetails