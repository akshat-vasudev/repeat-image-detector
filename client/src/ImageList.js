import React from 'react';
let ImageList = (props) => {

    let wrongImageCount = 0, totalImageCount = 0;

    let getImageAndCityMarkup = (buildings) => {
        if(buildings.length ===  0){
            return (
                <div className="lds-css ng-scope"><div className="lds-eclipse"><div></div></div></div>
            )
        }

        
        let buildingMarkup = [''];
        let _Els = buildings.map((building, i) => {return (
            
        <article key={i}>
        <div className='building_name' >
                <a href={`http://www.wework.com/buildings/${building.id}`} target='_blank'>{building.address}</a>
        </div>
        <div className='wrong_image_percent'>Repeat Images: {building.percentOfWrongImages}%</div>
        <ul>
        {building.images.map((image, idx) => {
            totalImageCount++;
            if(!image.belongsToBuilding)wrongImageCount++;
            return (<li key={idx}>
                <span className={`belongsToBuilding-${image.belongsToBuilding}`}></span>
                <a target='_blank' href={image.url}>{image.caption.length>0?image.caption:<i>No Caption Provided</i>}</a>
            </li>)})}
        </ul>
        </article>
        )}
        )
        buildingMarkup = [<div key='percentpercity' className='percentPerCity'>Repeat images in all buildings of this city: {(wrongImageCount/totalImageCount*100).toFixed(2)}%</div>,..._Els];
        
        return buildingMarkup;
        
    }

    return (
        [
        <div className="key"><span className="belongsToBuilding-false"></span> = Placeholder image used from another building | <span className="belongsToBuilding-true"></span> = Image belongs to building</div>,
        <div className='disclaimer'>Disclaimer
        <span>The images are classified as 'not belonging to building' (red dot) if the caption for that image contains "Example Shown:". 
        This is the only consistant parameter found across the dataset to determine if the image belongs to a specific building or if another buildings image is being used as a placeholder.
        </span>
        </div>,<section className='list_of_images'>            
            {getImageAndCityMarkup(props.buildings)}
        </section>]
    )
}

export default ImageList;