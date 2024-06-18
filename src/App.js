import { useState, useEffect } from 'react';

import {SideForm, Table} from './components'
import waves from './/assets/waves-purple.png'

import './App.css';

const GREENSPACESURL = 'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records?limit=20'
const FOUNTAINSURL = "https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/fontaines-a-boire/records?limit=20"
const ACTIVITIESURL = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records?limit=20"

function App() {

  //Filter the list of locations by days open
  const filterLocationsbyDay = (locations, selectedDays) => {
    let dayVars = []
    let locationsOpen = []
    selectedDays.forEach(element => {
      const dayVar = 'horaires_'+element
      dayVars.push(dayVar)
    });
    for (var i in locations) {
      const location = locations[i]
      let open=true;
      dayVars.forEach(dayVar => {
        if (Object.hasOwn(location, dayVar) && !location[dayVar]) open=false
        if (location.ouvert_24h === "Oui") open=true
      })
      if (open) locationsOpen.push(location)
    }
    return (locationsOpen)
  }

  //Filter by area Code. This was extremely bothersome since I had to extract the area code from each data set differently. some contained their codes directly in the respective attribute, some were a bit complex (the fountains).
  const [selectedCodes, setselectedCodes] = useState([])
  const filterByCode = (code) => {
    if(selectedCodes.includes(code)) selectedCodes.splice(selectedCodes.indexOf(code), 1)
    else selectedCodes.push(code)
    if (selectedCodes.length === 0) {console.log('empty'); setTable(dataList); return;}
    let locationsNear = []
    for (var i in dataList) {
      const location = dataList[i]
      let near=false;
      switch (dataType) {
        case 'espaces-verts': near =  selectedCodes.includes(location.arrondissement); break;
        case 'fountains': const fountainCode = /^\d+$/.test(location.commune[7]) ? "750" + location.commune.substring(6,8) : "7500" + location.commune.substring(6,7); near = selectedCodes.includes(fountainCode); break;
        case 'activities': near =  selectedCodes.includes(location.arrondissement); break;
        default: console.log("something is deeply wrong")
      }
      if (near) locationsNear.push(location)
      else if (locationsNear.includes(location)) locationsNear = locationsNear.filter(lc => lc !== location)
    }
    setTable(locationsNear)
  }

  //Search through the list of locations
  const handleSearch = (e) => {
    const searchedData = dataList.filter(row => {
      const nom = row.nom ? row.nom: row.modele
      return nom.toLowerCase().includes(e.target.value.toLowerCase())})
    setTable(searchedData)
  }
  
  //Our state variables for the data table
  const [table, setTable] = useState([])
  const [dataList, setDataList] = useState([])
  const [dataType, setDataType] = useState('espaces-verts')
 
  //Call API data and fill in the table
  const fetchData = async (link) => {
    const data = await fetch(link)
    data.json().then(json => {
      setTable(json.results)
      setDataList(json.results)
      return (json.results)
    })
  }
  useEffect(() => {
    fetchData(GREENSPACESURL);
  }, []);
  
  //Handle the user selecting a new data set
  const handleBrowseSelection = (e) => {
    switch(e.target.value) {
      case 'green-spaces': fetchData(GREENSPACESURL); setDataType('espaces-verts'); setselectedCodes([]); break;
      case 'fountains': fetchData(FOUNTAINSURL);setDataType('fountains');setselectedCodes([]); break;
      case 'activities': fetchData(ACTIVITIESURL); setDataType('activities');setselectedCodes([]); break;
      default: console.log(dataType)
    }
  }

  //Check among the fountains which are available
  const checkAvailability = (e) => {
    if (e.target.checked) setTable(table.filter(fountain => fountain.dispo === "OUI"));
    else fetchData(FOUNTAINSURL);
  }

  //Check among activities which are free
  const checkPricing = (e) => {
    if (e.target.checked) setTable(table.filter(activity => activity.payant === "Non"));
    else fetchData(ACTIVITIESURL);
  }

  return (
    <div className="App" style={{display: 'flex', height: '100vh'}}>
      <div className='side-panel' style={{width: '20%', marginTop: '3rem', padding: '0 10px', overflowX: 'scroll'}}>
        <SideForm 
          days={['lundi','mardi','mercredi','jeudi','vendredi','dimanche']} 
          filterByDay={(sd) => setTable(filterLocationsbyDay(dataList,sd))}
          handleSearch={handleSearch}
          handleBrowseSelection={handleBrowseSelection}
          dataType={dataType}
          checkAvailability={checkAvailability}
          checkPricing={checkPricing}
          filterByCode={filterByCode}
        />
      </div>
      <div style={{width: '80%', zIndex: '1'}}>
        <Table dataset={table} />
      </div>
      <div className='bg-container' style={{background: `url(${waves})`, height: '30rem', width: '100vw', position: 'fixed', bottom: '-100px', right: '0', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', opacity: '0.4'}} />
    </div>
  );
}

export default App;
