const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const async  = require('express-async-await')
const fetch = require('node-fetch') 
var mustacheExpress = require('mustache-express');  
const port = 9000

app.use(express.static(path.join(__dirname, 'js')));
app.set('views', path.join(__dirname, '/pages'));
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

router.get('/',function(req,res){ 
  console.log(__dirname);         
    res.render('index',{name: 'Akshat'});   
    //__dirname : It will resolve to your project folder.
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
        let buildingsServiceResponse = await fetch('https://locations-api.wework.com/api/v2/buildings/'),
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
        res.render('index',{data: buildings},(err,html)=>{
          res.send(html);
        });
      }

      for (let building = 0;building < buildings.length;building++) {
          //console.log(`https://locations-api.wework.com/api/v2/buildings/${id}`);
              let buildingImagesServiceResponse = await fetch(`https://locations-api.wework.com/api/v2/buildings/${buildings[building].id}`),
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
                      belongsToBuilding: belongsToBuilding
                    });
                }
                buildingImages.sort((a,b) => {
                  return a.belongsToBuilding - b.belongsToBuilding;
                });
                //buildings[id].images = buildingJSON.data;
                //console.log(buildings[id]);
      }
      //res.send(buildings);
      //console.log('done with JS logic');
      
      res.render('index',{data: buildings, percentOfWrongImages:(imagesNotBelongingToBuilding/totalImages*100).toFixed(2)},(err,html)=>{
        res.send(html); 
      });

    });

app.use('/', router);
app.listen(port, () => console.log(`RID app listening on port ${port}!`))