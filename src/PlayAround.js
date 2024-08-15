import './App.css';
// eslint-disable-next-line
import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from 'geotiff';

function App() {
  // console.log(GeoTIFF);
  const tiffUrl = 'https://s3-ap-southeast-1.amazonaws.com/stag1.telepathglobal/Reports/16/542/VBPmEKiYvygV5JO.tiff';

  async function getData() {
    // const tiff = await fromUrl(tiffUrl);

    const response = await fetch(tiffUrl);
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await fromArrayBuffer(arrayBuffer);
    // console.log("GeoTiff fetched successfully: ",tiff);
    
    const image = await tiff.getImage(); // by default, the first image is read.
    const width = image.getWidth();
    const height = image.getHeight();
    const tileWidth = image.getTileWidth();
    const tileHeight = image.getTileHeight();
    const samplesPerPixel = image.getSamplesPerPixel();
    console.log({width,height,tileWidth,tileHeight,samplesPerPixel});

    const data = await image.readRasters();
    const imageWidth = data.width;
    const imageHeight = data.height;
    console.log({imageWidth, imageHeight});

    const [red, green, blue] = await image.readRasters();
    console.log({red,green,blue});
  }
  
  return (
    <div className="App">
      <button onClick={()=>getData()}> getData </button>
    </div>
  );
}

export default App;
