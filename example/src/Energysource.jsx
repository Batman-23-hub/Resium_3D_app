import { useEffect, useState } from "react";
import { Entity, PointGraphics } from "resium";
import { Cartesian3, Color } from "cesium";

const Energysource = () => {
  const [energySources, setEnergySources] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/energy_source")
      .then((res) => res.json())
      .then((data) => {
        const parsedSources = data
          .map((source) => {
            if (!source.wkt_geometry.coordinates || source.wkt_geometry.coordinates.length !== 2) return null;
            const [lng, lat] = source.wkt_geometry.coordinates;
            return {
              id: source.id,
              position: Cartesian3.fromDegrees(lng, lat),
            };
          })
          .filter(Boolean); // Remove invalid data

        setEnergySources(parsedSources);
      })
      .catch((err) => console.error("Error fetching energy sources:", err));
  }, []);

  return (
    <>
      {energySources.map((source) => (
        <Entity
          key={source.id}
          position={source.position}
          name={`Energy Source ${source.id}`}
        >
          <PointGraphics
            pixelSize={12}
            color={Color.GREEN} // Green for energy sources
            outlineColor={Color.BLACK}
            outlineWidth={2}
          />
        </Entity>
      ))}
    </>
  );
};

export default Energysource;
