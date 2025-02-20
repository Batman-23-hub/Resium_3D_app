import { useEffect, useState } from "react";
import { Viewer, Entity, PointGraphics } from "resium";
import { Cartesian3, Color } from "cesium";

const PolesMap = () => {
    const [poles, setPoles] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/poles") // Ensure backend is running
        .then((res) => res.json())
        .then((data) => {
          const parsedPoles = data
            .map((pole) => {
              if (!pole.wkt_geometry.coordinates || pole.wkt_geometry.coordinates.length !== 2) return null; // Validate
              const [lng, lat] = pole.wkt_geometry.coordinates;
              return {
                id: pole.id,
                position: Cartesian3.fromDegrees(lng, lat),
              };
            })
            .filter(Boolean); // Remove null entries
  
          setPoles(parsedPoles);
        })
        .catch((err) => console.error("Error fetching poles:", err));
    }, []);
  
    return (
      <>
        {poles.map((pole) => (
          <Entity key={pole.id} position={pole.position} name={`Pole ${pole.id}`}>
            <PointGraphics
              pixelSize={10}
              color={Color.YELLOW}
              outlineColor={Color.BLACK}
              outlineWidth={2}
            />
          </Entity>
        ))}
      </>
    );
  };
  
  export default PolesMap;