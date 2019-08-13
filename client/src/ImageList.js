import React from 'react';
let ImageList = (props) => {

    let wrongImageCount = 0, totalImageCount = 0, percentOfWrongImagesPerCity = 0;

    let getImageAndCityMarkup = (buildings) => {
        if(buildings.length ===  0){
            return (
                <div className="lds-css ng-scope"><div className="lds-eclipse"><div></div></div></div>
            )
        }

        
        let buildingMarkup = buildings.map((building, i) => 
        <article key={i}>
        <div className='building_name' >
                {building.address}
        </div>
        <div className='wrong_image_percent'>Wrong Images: {building.percentOfWrongImages}%</div>
        <ul>
        {building.images.map((image, idx) => {
            totalImageCount++;
            if(!image.belongsToBuilding)wrongImageCount++;
            return (<li key={idx}>
                <span className={`belongsToBuilding-${image.belongsToBuilding}`}></span>
                <a target='_blank' href={image.url}>{image.id}</a>
                {/* <button className='btn' data-clipboard-text={image.url}>Copy URL</button>
                <button className='btn' data-clipboard-text={image.id}>Copy UUID</button> */}
            </li>)})}
        </ul>
        </article>
        );
        debugger;
        percentOfWrongImagesPerCity = wrongImageCount/totalImageCount*100;
        return buildingMarkup;
        
    }

    return (
        <section className='list_of_images'>
            {/* {percentOfWrongImagesPerCity}% */}
            {getImageAndCityMarkup(props.buildings)}
        </section>
    )
}

export default ImageList;