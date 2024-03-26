import {React, useState} from 'react';
import axios from 'axios';
import './cardDetails.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function CardDetails(){
    const [cardName, setCardName] = useState('');
    const [cardQnt, setCardQnt] = useState(0);
    const [setCode, setSetCode] = useState('');
    const [cardCondition, setCardCondition] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    function toggleCollapse(){
      setIsCollapsed(!isCollapsed);
    };
    const options = [
        { label: "Kashtira Fenrir", value: "kashtira-fenrir"},
        { label: 'Magikuriboh', value: 'magikuriboh' },
        { label: 'Dark Magician', value: 'dark-magician' },
        { label: 'Select Card', value: 'Select Card' },
      ];

      const handleAutoCompleteChange = (event, value) => {
        console.log(value); // Check what value is being received
        if (value) {
            setCardName(value.label); // Set the label of the selected option as cardName
        }
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

    const handleConditionChange = (event) => {
        setCardCondition(event.target.value)
        console.log(event.target.value)
    }

      const cardData = {
        'name' :cardName,
        'qnt' : cardQnt,
        'setCode' : setCode,
        'condition' : cardCondition
      }
      
      const addCard = () => {
        axios.post('http://localhost:5000/addCard', cardData) // Adjust the URL to your Flask backend endpoint
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error('Error sending data:', error);
          });
      };

      const removeCard = () => {
        axios.post('http://localhost:5000/removeCard', cardData) // Adjust the URL to your Flask backend endpoint
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error('Error sending data:', error);
          });
      };

    return (
      <div>
      <div className={`grid-container ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="grid-item">
        
                <input type='text' placeholder='Card Name'
                onChange={handleNameChange}/>


            </div>
            <div className="grid-item">
                <input type='text' placeholder='Set Code'
                onChange={handleSetCodeChange}/>
            </div>
            <div className="grid-item">
                <select name="condition" id="conditions"
                onChange={handleConditionChange}>
                    <option value="nm">Near Mint</option>
                    <option value="ex">Excellent</option>
                    <option value="lp">Light Play</option>
                    <option value="hp">Heavy Play</option>
                </select>   
            </div>
            <div className="grid-item">
                <input type='number'
                    onChange={handleQntChange}
                />
            </div>
            <div className="grid-item">
                <button onClick={addCard}>Add</button>
                <button onClick={removeCard}>Remove</button>
            </div>
        </div>
         <div>
         <Autocomplete
                onChange={handleAutoCompleteChange}
                options={options}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} placeholder="Name" />}
                />
          <button onClick={toggleCollapse}>Toggle Collapse</button>
         </div>
         
      </div>
    );
}

export default CardDetails