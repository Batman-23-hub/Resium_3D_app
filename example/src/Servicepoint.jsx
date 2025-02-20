import { useEffect, useState } from "react";
import { Viewer, Entity, PointGraphics } from "resium";
import { Cartesian3, Color } from "cesium";
const ServicePointsMap = () => {
    const [servicePoints, setServicePoints] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/service_point") // Ensure backend is running
        .then((res) => res.json())
        .then((data) => {
          const parsedPoints = data
            .map((point) => {
              if (!point.wkt_geometry.coordinates || point.wkt_geometry.coordinates.length !== 2) return null; // Validate
              const [lng, lat] = point.wkt_geometry.coordinates;
              return {
                id: point.id,
                position: Cartesian3.fromDegrees(lng, lat),
              };
            })
            .filter(Boolean); // Remove null entries
  
          setServicePoints(parsedPoints);
        })
        .catch((err) => console.error("Error fetching service points:", err));
    }, []);
 

    return (
      <>
        {servicePoints.map((point) => (
          <Entity key={point.id} position={point.position} name={`Service Point ${point.id}`}>
            <PointGraphics
              pixelSize={8}
              color={Color.RED} // Different color for service points
              outlineColor={Color.BLACK}
              outlineWidth={2}
            />
          </Entity>
        ))}
      </>
    );
  };
  
  export default ServicePointsMap;
  