import { useEffect, useState } from "react";
import { Viewer, Entity, PointGraphics } from "resium";
import { Cartesian3, Color } from "cesium";

const ConnectorPointsMap = () => {
    const [connectorPoints, setServicePoints] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/connector_points") // Ensure backend is running
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
        .catch((err) => console.error("Error fetching connector points:", err));
    }, []);
  
    return (
      <>
        {connectorPoints.map((point) => (
          <Entity key={point.id} position={point.position} name={`Connector Point ${point.id}`}>
            <PointGraphics
              pixelSize={8}
              color={Color.DARKTURQUOISE} // Different color for service points
              outlineColor={Color.BLACK}
              outlineWidth={2}
            />
          </Entity>
        ))}
      </>
    );
  };
  
  export default ConnectorPointsMap;
  