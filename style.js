const stylingVectorTile = (f, num) => {
  switch(f.properties_.layer){
    case "railway":
      return [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#000000',
            width: 3
          })
        }),
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#FFFFFF',
            lineDash: [10,10],
            width: 2
          })
        }),
      ]
      
      break;
    case "road":
      return [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#000000',
            lineCap: 'butt',
            width: 3
          })
        }),
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#CCCCCC',
            lineCap: 'round',
            width: 2
          })
        }),
      ]
      
      break;
    case "coastline":
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#AAAAFF'
        })
      })
      
      break;
    case "building":
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#FFCC00'
        })
      })
      
      break;
    case "waterarea":
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#AAAAFF'
        })
      })
      
      break;
    default:
    
      return null;
      
      break;
  
  
  }


};