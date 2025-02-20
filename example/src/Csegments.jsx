import { useEffect, useState } from "react";
import { Entity, PolylineGraphics } from "resium";
import { Cartesian3, Color } from "cesium";

const CSegment = () => {
  const [cSegments, setCSegments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/c_segments") // Replace with actual endpoint
      .then((res) => res.json())
      .then((data) => {

        const parsedSegments = data.map((segment) => {
          if (!segment.wkt_geometry.coordinates || segment.wkt_geometry.coordinates.length === 0) {
            console.warn(`Invalid coordinates for segment ${segment.id}`);
            return null;
          }

          // Convert coordinates to Cartesian3
          const positions = segment.wkt_geometry.coordinates[0].map(([lng, lat]) => {
            if (isNaN(lng) || isNaN(lat)) {
              console.warn(`Invalid coordinate pair for segment ${segment.id}: [${lng}, ${lat}]`);
              return null;
            }
            return Cartesian3.fromDegrees(lng, lat, 0); // Set height = 0
          }).filter(Boolean); // Remove any null values (invalid coordinates)

          // If the segment has valid positions, return it, otherwise null
          if (positions.length < 2) {
            console.warn(`Segment ${segment.id} has insufficient valid positions.`);
            return null;
          }

          return {
            id: segment.id,
            positions,
          };
        });

        // Filter out invalid segments
        setCSegments(parsedSegments.filter(Boolean));
      })
      .catch((err) => console.error("Error fetching C Segments:", err));
  }, []);

  return (
    <>
      {cSegments.map((segment) => (
        <Entity key={segment.id} name={`C Segment ${segment.id}`}>
          <PolylineGraphics
            positions={segment.positions}
            material={Color.GREEN} // Green color for c_segment
            width={2} // Line thickness
          />
        </Entity>
      ))}
    </>
  );
};

export default CSegment;
