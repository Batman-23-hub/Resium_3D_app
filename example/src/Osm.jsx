import { useEffect } from "react";
import * as Cesium from "cesium";

const OsmBuildings = ({ viewer }) => {
  useEffect(() => {
    const loadOsmBuildings = async () => {
      if (!viewer) return console.error("Viewer not found.");

      try {
        console.log("Loading OSM Buildings...");
        const buildingTileset = await Cesium.createOsmBuildingsAsync();
        viewer.scene.primitives.add(buildingTileset);
        console.log("OSM Buildings loaded.");
      } catch (error) {
        console.error("Error loading OSM Buildings:", error);
      }
    };

    loadOsmBuildings();
  }, [viewer]);

  return null; // No UI to render
};

export default OsmBuildings;
