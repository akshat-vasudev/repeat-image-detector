import React, {useState, useEffect} from 'react';
import './App.css';
import City from './City';
import ImageList from './ImageList';

function App() {
  let [cities, updateCities] = useState([]);
  let [imageToCityMap, updateImageToCityMap] = useState([]);//{'123-123-12344':{address:'123',slug:'ertertert',images:[]}}
  let [openOverlay, updateOpenOverlay] = useState(false);
  let percentOfWrongImagesPerCity = 0;
  useEffect(() => {
      let getGeoGeogroupByCity = async () => {
        let geoGroupCall = await fetch('/getCities');
        let geoGroupJSON = await geoGroupCall.json();
        updateCities(geoGroupJSON.data);
      };
      getGeoGeogroupByCity();
    },[]);

    let fetchImages = (allBuildingsInCity, building = 0, allImages = []) => {
      if(building === allBuildingsInCity.length){
        updateImageToCityMap(allImages);
        return false;
      }
      fetch(`/getBuildingData/${allBuildingsInCity[building]}`).then((buildingServiceResponse) => {
        buildingServiceResponse.json().then((buildingDataJSON) => {
          allImages = [...allImages,...buildingDataJSON.data]
          
          fetchImages(allBuildingsInCity, ++building, allImages);
        });
      }); 
    }
    

    let getImagesForAllBuildingsInTheCity = (city) => {
      let allBuildingsInCity = city[Object.keys(city)[0]].buildingIds;
      fetchImages(allBuildingsInCity);
    }

    let renderCities = () => cities.map((city, i) =>  <City key={i} city={Object.keys(city)} handleUserClick={() => {
      window.scrollTo(0,0);
      updateImageToCityMap([]);
      updateOpenOverlay(true);
      getImagesForAllBuildingsInTheCity(city)}} />);
  return (
    <main className='parent_wrapper'>
      <h1>Repeat Image Detector</h1>
      {openOverlay && <div className='close_button' onClick={() => {updateOpenOverlay(!openOverlay)}}>X</div>}
      {openOverlay && <ImageList buildings={imageToCityMap} percentOfWrongImagesPerCity={percentOfWrongImagesPerCity}/>}
      <section className='list_of_cities'>
        {renderCities()}
      </section>
    </main>
  );
}
export default App;