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
                {building.address}
        </div>
        <div className='wrong_image_percent'>Repeat Images: {building.percentOfWrongImages}%</div>
        <ul>
        {building.images.map((image, idx) => {
            totalImageCount++;
            if(!image.belongsToBuilding)wrongImageCount++;
            return (<li key={idx}>
                <span className={`belongsToBuilding-${image.belongsToBuilding}`}></span>
                <a target='_blank' href={image.url}>{image.caption}</a>
                {/* <button className='btn' data-clipboard-text={image.url}>Copy URL</button>
                <button className='btn' data-clipboard-text={image.id}>Copy UUID</button> */}
            </li>)})}
        </ul>
        </article>
        )}
        )
        buildingMarkup = [<article key='percentpercity' className='percentPerCity'>Repeat images in all buildings: {(wrongImageCount/totalImageCount*100).toFixed(2)}%</article>,..._Els];
        
        return buildingMarkup;
        
    }

    return (
        <section className='list_of_images'>
            {getImageAndCityMarkup(props.buildings)}
        </section>
    )
}

export default ImageList;