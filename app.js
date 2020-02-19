const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const fetch = require('node-fetch') 
const port = process.env.PORT || 9000
const locationsApiAuthHeaders = {
  headers: {
    Authorization: `Basic ${process.env.LOCATIONS_API_AUTH}`,
    Origin: (process.env.SITE_URL || 'www-staging.wework.com').replace(/^(https?:|)\/\//, '')
  }
};

app.use(express.static(path.join(__dirname, 'client/build')));

router.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

router.get('/getCities:id?',async (req,res) => { 
    const fetchURL = `https://locations-api.wework.com/api/v1/geogroupings/${req.params.id ? req.params.id : ''}`;
    let geoGroupingServiceResponse = await fetch(fetchURL, locationsApiAuthHeaders),
    geoGroupingJSON = await geoGroupingServiceResponse.json(),
    geoGroupingByCity = [];
    geoGroupingJSON.geogroupings.filter(group => {
      if(group.type.toLowerCase() === 'marketgeo'){
        geoGroupingByCity.push({[group.name]:{
          buildingIds: group.buildings
        }});
        return true;
      }else{
        return false;
      }
    });
    res.send({data:geoGroupingByCity});
  });

  router.get('/getBuildingData/:id?', async (req,res) => {      
      debugger;
      let buildingId = req.params.id,  
      totalImages = 0,
      imagesNotBelongingToBuilding = 0,
      buildings = [];
      if(buildingId){ 
        buildings[0] = {  
            id: buildingId,
            images:[]
        }
      }else{
        let buildingsServiceResponse = await fetch('https://locations-api.wework.com/api/v2/buildings/',locationsApiAuthHeaders),
        buildingsJSON = await buildingsServiceResponse.json(),
        buildingsList = buildingsJSON.buildings,
        numberOfBuildings = buildingsList.length;   
        
        for (let i = 0; i < numberOfBuildings; i++) {
            let _building = buildingsList[i];
            
              buildings.push({
                  id: _building.id,
                  address:_building.name,
                  slug:_building.slug,          
                  images:[]//{imageID:does image belong to this building?}
              });
            
        }
      }

      if(!buildingId){
        res.send({data: buildings});
      }

      for (let building = 0;building < buildings.length;building++) {
              let buildingImagesServiceResponse = await fetch(`https://locations-api.wework.com/api/v2/buildings/${buildings[building].id}`, locationsApiAuthHeaders),
              buildingImages = buildings[building].images,
                buildingImagesJSON = await buildingImagesServiceResponse.json(),
                buildingImagesData = buildingImagesJSON.building.images;
                totalImages += buildingImagesData.length;
                buildings[building].address = buildingImagesJSON.building.address;
                for (let images = 0; images < buildingImagesData.length; images++) {
                  let belongsToBuilding = buildingImagesData[images].caption.toLowerCase().indexOf('example shown:') === -1;
                  if(!belongsToBuilding)imagesNotBelongingToBuilding++;
                    buildingImages.push({
                      id:buildingImagesData[images].id,
                      url:buildingImagesData[images].url,
                      belongsToBuilding: belongsToBuilding,
                      caption:buildingImagesData[images].caption.replace('example shown: ','').replace('Example shown: ','')
                    });
                }
                buildingImages.sort((a,b) => {
                  return a.belongsToBuilding - b.belongsToBuilding;
                });

                buildings[building].percentOfWrongImages = (imagesNotBelongingToBuilding/totalImages*100).toFixed(2)
      }
      
      res.send({data: buildings});

    });

app.use('/', router);
app.listen(port, () => console.log(`RID app listening on port ${port}!`))