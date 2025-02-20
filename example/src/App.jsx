// import Polemap from "./Polemap.jsx";
// import Servicepoint from "./Servicepoint.jsx";
// import Energysource from "./Energysource.jsx";
// import Substations from "./Substations.jsx";
// import WSegment from "./Wsegments.jsx";
// import CSegment from "./Csegments.jsx";
// import Towers from "./Towers.jsx"
// import ConnectPoint from "./Connectorpoint.jsx";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Viewer,
//   Entity,
//   EntityDescription,
//   ModelGraphics,
//   CameraFlyTo,
//   PolylineGraphics,
// } from "resium";
// import * as Cesium from "cesium";
// import { Color } from "cesium";

// Cesium.Ion.defaultAccessToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmY1MzQ4My1lY2Y0LTQxYzYtYWUzMC0zNWI2YjA0YzdmYmMiLCJpZCI6MjcwMTgzLCJpYXQiOjE3MzczNjU5MTd9.u7nZRy8QuXlbfSnswyWM1b8DCZmdEMyc3ZxrNfHTqeQ"; // Replace with your Cesium Ion access token if needed

//   function App() {

//   return (
//     <Viewer full={true}>
//       <Servicepoint />
//       <Polemap />
//       <Towers/>
//       <Energysource/>
//       <Substations/>
//       <WSegment/>
//       <CSegment/>
//       <ConnectPoint/>
//     </Viewer>
//   );
// }
// export default App;


// import React, { useRef, useEffect, useState } from "react";
// import { Viewer } from "resium";
// import * as Cesium from "cesium";
// import Servicepoint from "./Servicepoint.jsx";
// import Polemap from "./Polemap.jsx";
// import Energysource from "./Energysource.jsx";
// import Substations from "./Substations.jsx";
// import WSegment from "./Wsegments.jsx";
// import CSegment from "./Csegments.jsx";
// import Towers from "./Towers.jsx";
// import ConnectPoint from "./Connectorpoint.jsx";
// import LayerControl from "./LayerControl.jsx";

// // Set your Cesium Ion access token
// Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmY1MzQ4My1lY2Y0LTQxYzYtYWUzMC0zNWI2YjA0YzdmYmMiLCJpZCI6MjcwMTgzLCJpYXQiOjE3MzczNjU5MTd9.u7nZRy8QuXlbfSnswyWM1b8DCZmdEMyc3ZxrNfHTqeQ";

// function App() {
//   const viewerRef = useRef(null);
//   const [viewer, setViewer] = useState(null);
//   const [showLayerControl, setShowLayerControl] = useState(false);

//   // State to manage visibility of each object
//   const [layers, setLayers] = useState({
//     Servicepoint: true,
//     Polemap: true,
//     Energysource: true,
//     Substations: true,
//     WSegment: true,
//     CSegment: true,
//     Towers: true,
//     ConnectPoint: true,
//   });

//   // Function to toggle layer visibility
//   const toggleLayer = (layer) => {
//     setLayers((prevLayers) => ({
//       ...prevLayers,
//       [layer]: !prevLayers[layer],
//     }));
//   };

//   return (
//     <div>
//       {/* Cesium Viewer */}
//       <Viewer
//         full
//         ref={viewerRef}
//         onReady={(viewerInstance) => {
//           setViewer(viewerInstance);

//           // Fly to a location (New York City)
//           viewerInstance.camera.flyTo({
//             destination: Cesium.Cartesian3.fromDegrees(-74.006, 40.7128, 15000),
//           });
//         }}
//       >
//         {/* Conditionally Render Objects */}
//         {layers.Servicepoint && <Servicepoint />}
//         {layers.Polemap && <Polemap />}
//         {layers.Energysource && <Energysource />}
//         {layers.Substations && <Substations />}
//         {layers.WSegment && <WSegment />}
//         {layers.CSegment && <CSegment />}
//         {layers.Towers && <Towers />}
//         {layers.ConnectPoint && <ConnectPoint />}
//       </Viewer>

//       {/* Layer Control Button */}
//       <button style={styles.layerButton} onClick={() => setShowLayerControl((prev) => !prev)}>
//         Toggle Layers
//       </button>

//       {/* Layer Control UI (Visible on Button Click) */}
//       {showLayerControl && <LayerControl layers={layers} toggleLayer={toggleLayer} />}
//     </div>
//   );
// }

// // Styling for Layer Control
// const styles = {
//   layerButton: {
//     position: "absolute",
//     top: "10px",
//     left: "10px",
//     zIndex: 1000,
//     padding: "8px 12px",
//     borderRadius: "8px",
//     cursor: "pointer",
//   },
// };

// export default App;

import React, { useRef, useEffect, useState } from "react";
import { Viewer, Entity } from "resium";
import * as Cesium from "cesium";
import Servicepoint from "./Servicepoint.jsx";
import Polemap from "./Polemap.jsx";
import Energysource from "./Energysource.jsx";
import Substations from "./Substations.jsx";
import WSegment from "./Wsegments.jsx";
import CSegment from "./Csegments.jsx";
import Towers from "./Towers.jsx";
import ConnectPoint from "./Connectorpoint.jsx";
import LayerControl from "./LayerControl.jsx";
import SearchBar from "./Searchbar.jsx";

// Set your Cesium Ion access token
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmY1MzQ4My1lY2Y0LTQxYzYtYWUzMC0zNWI2YjA0YzdmYmMiLCJpZCI6MjcwMTgzLCJpYXQiOjE3MzczNjU5MTd9.u7nZRy8QuXlbfSnswyWM1b8DCZmdEMyc3ZxrNfHTqeQ";

function App() {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);


  // State to manage visibility of each object
  const [layers, setLayers] = useState({
    Servicepoint: true,
    Polemap: true,
    Energysource: true,
    Substations: true,
    WSegment: true,
    CSegment: true,
    Towers: true,
    ConnectPoint: true,
  });

  // Function to toggle layer visibility
  const toggleLayer = (layer) => {
    setLayers((prevLayers) => ({
      ...prevLayers,
      [layer]: !prevLayers[layer],
    }));
  };
  
  useEffect(() => {
    console.log("Selected Object Updated:", selectedObject);
  }, [selectedObject]);
  

  useEffect(() => {
    if (!viewerRef.current || viewer) return;
  
    // Wait for the viewer to initialize
    const checkViewer = setInterval(() => {
      const cesiumViewer = viewerRef.current?.cesiumElement;
      if (cesiumViewer) {
        clearInterval(checkViewer);
        setViewer(cesiumViewer);
        console.log("Cesium Viewer Initialized:", cesiumViewer);
  
        // Ensure the camera flies to the location only once
        cesiumViewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-74.006, 40.7128, 15000),
        });
      }
    }, 100); // Check every 100ms
  
    return () => clearInterval(checkViewer); // Cleanup on unmount
  }, [viewer]);
  

  return (
    <div>
      {/* Cesium Viewer */}
      <Viewer full ref={viewerRef}>
        {/* Conditionally Render Objects */}
        {layers.Servicepoint && <Servicepoint />}
        {layers.Polemap && <Polemap />}
        {layers.Energysource && <Energysource />}
        {layers.Substations && <Substations />}
        {layers.WSegment && <WSegment />}
        {layers.CSegment && <CSegment />}
        {layers.Towers && <Towers />}
        {layers.ConnectPoint && <ConnectPoint />}
        {viewer && selectedObject && (
  <Entity
    position={Cesium.Cartesian3.fromDegrees(
      parseFloat(selectedObject.longitude),
      parseFloat(selectedObject.latitude),
      selectedObject.height || 0
    )}
    point={{
      pixelSize: 12,
      color: Cesium.Color.YELLOW,
      outlineColor: Cesium.Color.RED,
      outlineWidth: 3,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    }}
    name={`Selected: ${selectedObject.id}`}
    description={`Type: ${selectedObject.type}`}
  />
)}


      </Viewer>

      {/* Ensure Search Bar is rendered when viewer is ready */}
      {viewer && (
    <SearchBar viewer={viewer} onSelect={setSelectedObject} />
)}


      {/* Layer Control Button */}
      <button
        style={styles.layerButton}
        onClick={() => setShowLayerControl((prev) => !prev)}
      >
        Toggle Layers
      </button>

      {/* Layer Control UI */}
      {showLayerControl && <LayerControl layers={layers} toggleLayer={toggleLayer} />}
    </div>
  );
}

// Styling for Layer Control
const styles = {
  layerButton: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 1000,
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};



export default App;

