import { useEffect, useState } from "react";
import { Viewer, Entity, PointGraphics } from "resium";
import { Cartesian3, Color } from "cesium";

const TowersMap = () => {
    const [towers, setTowers] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/towers") // Ensure backend is running
        .then((res) => res.json())
        .then((data) => {
          const parsedTowers = data
            .map((tower) => {
              if (!tower.wkt_geometry.coordinates || tower.wkt_geometry.coordinates.length !== 2) return null; // Validate
              const [lng, lat] = tower.wkt_geometry.coordinates;
              return {
                id: tower.id,
                position: Cartesian3.fromDegrees(lng, lat),
              };
            })
            .filter(Boolean); // Remove null entries
  
          setTowers(parsedTowers);
        })
        .catch((err) => console.error("Error fetching towers:", err));
    }, []);
  
    return (
      <>
        {towers.map((tower) => (
          <Entity key={tower.id} position={tower.position} name={`tower ${tower.id}`}>
            <PointGraphics
              pixelSize={10}
              color={Color.BLUE}
              outlineColor={Color.BLACK}
              outlineWidth={2}
            />
          </Entity>
        ))}
      </>
    );
  };
  
  export default TowersMap;