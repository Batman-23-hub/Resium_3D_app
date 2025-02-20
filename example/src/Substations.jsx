import { useEffect, useState } from "react";
import { Entity, PolygonGraphics } from "resium";
import { Cartesian3, Color, PolygonHierarchy } from "cesium";

const Substations = () => {
  const [substations, setSubstations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/sub_substations")
      .then((res) => res.json())
      .then((data) => {
        const parsedSubstations = data.map((source) => {
          if (!source.wkt_geometry.coordinates) return null;

          // Flatten MultiPolygon → Polygon → Cartesian3
          const polygons = source.wkt_geometry.coordinates.flatMap((multiPolygon) =>
            multiPolygon.map((polygon) => {
              if (!Array.isArray(polygon) || polygon.length < 3) return null;

              const positions = polygon.map(([lng, lat]) =>
                Cartesian3.fromDegrees(lng, lat, 0) // Ensure height is 0
              );

              return new PolygonHierarchy(positions);
            })
          ).filter(Boolean);

          if (polygons.length === 0) return null;

          return { id: source.id, polygons };
        });

        setSubstations(parsedSubstations.filter(Boolean));
      })
      .catch((err) => console.error("Error fetching Substations:", err));
  }, []);

  return (
    <>
      {substations.map((source) =>
        source.polygons.map((polygon, index) => (
          <Entity key={`${source.id}-${index}`} name={`Substation ${source.id}`}>
            <PolygonGraphics
              hierarchy={polygon}
              material={Color.ORANGE.withAlpha(0.7)} // Better visibility
              outline={true}
              outlineColor={Color.BLACK}
              outlineWidth={2}
              height={0} // Ensure no clamping
            />
          </Entity>
        ))
      )}
    </>
  );
};

export default Substations;
