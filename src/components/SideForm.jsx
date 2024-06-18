import React from 'react'
import { useState } from 'react'

import { FormControl, TextField, Checkbox, Select, MenuItem, InputLabel } from '@mui/material';

const SideForm = ({days, filterByDay, handleSearch, handleBrowseSelection, dataType, checkAvailability, checkPricing, filterByCode}) => {

    //Day filtering variables
    const [selectedDays, setSelectedDays] = useState([])
    let daysChecked = []

    //A function to filter the table based on days selected, works in collab with another function in App.js
    const handleDayChange = (day) => {
        if (selectedDays.includes(day)) {
            daysChecked = selectedDays.filter(selectedDay => selectedDay !== day)
        } else {
            daysChecked = [...selectedDays, day]
            // I tried to push but it's a state variable so this made more sense as it updates by setState
        }
        setSelectedDays(daysChecked)
        filterByDay(daysChecked)
    }

    //State variables for selecting a data set
    const [selectValue, setSelectValue] = useState('green-spaces')
    const greenSpacesValue = 'green-spaces'
    const fountainsValue = 'fountains'
    const activitiesValue = 'activities'

    //handle selection of data set, with collob of App.js
    const handleSelection = (e) => {
        setSelectValue(e.target.value)
        handleBrowseSelection(e);
    }

    //Filter through locations by their neighbourhood : arrondissement
    const areaCodes = ["75010","75011","75012","75013","75014","75015","75016","75017","75018","75019","75020","75021"]
    

    //There exists a filter for each data set since they differ greatly and require different approaches to filter through
  return (
    <FormControl fullWidth style={{display: 'flex', flexDirection: 'column', rowGap: '1.5rem', fontSize: '0.8rem'}}>
        <InputLabel id="data-set-select-label" sx={{marginTop: '5px'}}>Browse</InputLabel>
        <Select labelId="data-set-select-label" name="data-set" value={selectValue} label="Browse" id="data-select" onChange={handleSelection} size='small' sx={{color: '#5f259f', '&.Mui-checked': { color: '#5f259f'}}}>
            <MenuItem value={greenSpacesValue} selected>Espaces Verts</MenuItem>
            <MenuItem value={fountainsValue}>Fontaines</MenuItem>
            <MenuItem value={activitiesValue}>Equipements et Activités</MenuItem>
        </Select>
        <div className='refreshable-content' style={{display: 'flex', flexDirection: 'column', rowGap: '1rem'}} key={dataType}>
            <div className='search-field'><TextField sx={{color: '#5f259f', '&.Mui-focused': {color: '#5f259f !important'}}} id="outlined-basic" label="Search" variant="outlined" size='small' style={{width: '80%', textAlign: 'center', fontFamily: 'Nexa'}} onChange={handleSearch} /></div>
            
            {dataType==='espaces-verts' && 
            <div className='day-selection-field'>
                <h4 style={{marginTop: '0.5rem'}}>jours ouverts:</h4>
                {days.map(day => (
                    <label key={day} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '2rem'}}>
                        <Checkbox sx={{color: '#5f259f', '&.Mui-checked': { color: '#5f259f'}}} onChange={() => handleDayChange(day)}  style={{fontSize: '0.7rem', marginLeft: '-10px'}} />
                        <p style={{fontSize: '0.8rem', marginTop: '3px'}}> {day}</p>
                    </label>
                ))}
            </div>
            }

            {dataType==='fountains' && 
            <div style={{marginLeft: '-15px'}}>
                <Checkbox sx={{color: '#5f259f', '&.Mui-checked': { color: '#5f259f'}}} style={{fontSize: '0.7rem'}} onChange={checkAvailability} />
                Available now
            </div>
            }

            {dataType==='activities' && 
            <div style={{marginLeft: '-15px'}}>
                <Checkbox sx={{color: '#5f259f','&.Mui-checked': { color: '#5f259f'}}} style={{fontSize: '0.7rem'}} onChange={checkPricing} />
                For Free
            </div>
            }
            <div className='area-code-selection' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <h4>Où?</h4>
                <div className='area-codes' style={{display: 'flex', minHeight: '200px',flexWrap: 'wrap', justifyContent: 'center'}}>
                    {areaCodes.map(code => (
                        <label key={code} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: '5px'}}>
                            <Checkbox sx={{color: '#5f259f', '&.Mui-checked': { color: '#5f259f'}, maxHeight: '32px'}} onChange={() => filterByCode(code)}  style={{fontSize: '0.7rem', marginLeft: '-10px'}} />
                            <p style={{fontSize: '0.8rem', marginTop: '3px'}}> {code}</p>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    </FormControl>
  )
}

export default SideForm