import { useEffect, useState } from 'react'
import './App.css'
import OpenSeaDragon from 'openseadragon'
import { enableGeoTIFFTileSource } from "geotiff-tilesource"
enableGeoTIFFTileSource(OpenSeaDragon)

function App() {

  const [viewer, setViewer] = useState(null)
  const initOSD = () => {
    // Basic viewer setup
    setViewer(OpenSeaDragon({
        element: "viewer",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        minZoomImageRatio: 0.01,
        visibilityRatio: 0,
        crossOriginPolicy: "Anonymous",
        ajaxWithCredentials: true,
        sequenceMode: true,
      })
    )
  }

  useEffect(()=>{
    //initiating here so that page loads completely and then adding viewer
    initOSD();
    
  // eslint-disable-next-line
  },[])

  //Load url from GeoTiff.js
  const loadFromGeoTiff = () => {
    viewer.close();
    let input = document.getElementById("link-input");
    let url = input.value;
    console.log('url- ',url);
    if (!url) return;
    setupImage(url);
  };

  function setupImage(tileSourceInput) {
    viewer.close();
  
    let tiffTileSources = OpenSeaDragon.GeoTIFFTileSource.getAllTileSources(tileSourceInput, {
      logLatency: true,
    });
    console.log("viewer- ",viewer);
    tiffTileSources.then((ts) => viewer.open(ts)).catch((error)=>console.error(error));
  
    tiffTileSources
      .then((tileSources) => {
        console.log("TiltSourceLoaded Successfully! tiledSource- ",tileSources);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Load url without Geotiff.js
  const loadWithoutGeotiff = async () => {
    viewer.close();
    let input = document.getElementById('dzi-link');
    let url = input.value;
    
    const tiledSrcObj = {
      type: "legacy-image-pyramid",
      levels:[{
        url: ""
      }]
    }
    tiledSrcObj.levels[0].url = url;
    const img = await getWnH(url);
    if(img.naturalWidth === 0){
      tiledSrcObj.levels[0].width = 1000;
    } else{
      tiledSrcObj.levels[0].width = img.naturalWidth;
    }
    if(tiledSrcObj.levels[0].height === 0){
      tiledSrcObj.levels[0].height = 1000;
    } else{
      tiledSrcObj.levels[0].height = img.naturalHeight;
    }
    console.log({tiledSrcObj});
    viewer.open(tiledSrcObj);
  }

  const getWnH = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
    // console.log({img});
  })

  const loadLocalFileGeoTiff = () => {
    const localFile = document.getElementById('file-picker');
    console.log('Uploaded file: ',localFile.files[0]);
    setupImage(localFile.files[0]);
  }
  
  return (
    <div className='App'>
      <div id="control-panel">
          <div>
          <input type='text' id="link-input" placeholder="Enter a link address for a TIFF/SVS/NDPI/etc. file"/>
          <button onClick={()=>loadFromGeoTiff()}>Load with GeoTiff.js</button>
          {'  '}
          <label htmlFor='file-picker'>Local Files:</label>
          <input type='file' id='file-picker' onChange={()=>loadLocalFileGeoTiff()}/>
        </div>
        <div>
          <input type='text' id='dzi-link' placeholder="Enter a link address for a DZI file"/>
          <button onClick={()=>loadWithoutGeotiff()}>Load without GeoTiff.js</button>
        </div>
      </div>
      <div id="viewer" className="vwr"></div>
    </div>
  )
}

export default App