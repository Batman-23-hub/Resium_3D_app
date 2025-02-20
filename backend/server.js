const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

// Configure CORS to allow requests from frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);


// Endpoint to fetch all poles
app.get("/api/poles", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, ST_AsGeoJSON(geom)::json AS wkt_geometry FROM pole`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching pole data:", error);
    res.status(500).json({ error: "Error fetching pole data" });
  }
});

app.get("/api/towers", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, ST_AsGeoJSON(geom)::json AS wkt_geometry FROM towers`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tower data:", error);
    res.status(500).json({ error: "Error fetching tower data" });
  }
});

app.get("/api/energy_source", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, ST_AsGeoJSON(geom)::json AS wkt_geometry FROM energy_source`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching energy source data:", error);
    res.status(500).json({ error: "Error fetching energy source data" });
  }
});

// Endpoint to fetch all service point
app.get("/api/service_point", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, ST_AsGeoJSON(geom)::json AS wkt_geometry FROM service_point`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching service point data:", error);
    res.status(500).json({ error: "Error fetching service point data" });
  }
});

// Endpoint to fetch line geometries
app.get("/api/w_segments", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, ST_AsGeoJSON(geom)::json AS wkt_geometry FROM wire_segment"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching line data:", error);
    res.status(500).json({ error: "Error fetching line data" });
  }
});

app.get("/api/c_segments", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, ST_AsGeoJSON(geom)::json AS wkt_geometry FROM cable_segment"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cable line data:", error);
    res.status(500).json({ error: "Error fetching cable line data" });
  }
});

app.get("/api/sub_substations", async (req, res) => {
  try {
    const result = await pool.query(
      // "SELECT id, ST_AsText(geom) AS wkt_geometry FROM sub_substtation"
      "SELECT id, ST_AsGeoJSON(geom)::json AS wkt_geometry FROM sub_substtation"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching substation data:", error);
    res.status(500).json({ error: "Error fetching substation data" });
  }
});

app.get("/api/connector_points", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, ST_AsGeoJSON(geom)::json AS wkt_geometry FROM connector_point`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching connector point data:", error);
    res.status(500).json({ error: "Error fetching connector point data" });
  }
});

app.get("/api/search", async (req, res) => {
  const { category, id } = req.query;

  try {
    let query = "";
    const values = [`%${id}%`]; // Enable partial matching
    const objs = {
      "Cable Segment": "cable_segment",
      "Connector Point": "connector_point",
      "Energy Source": "energy_source",
      "Pole": "pole",
      "Service Point": "service_point",
      "Substation": "sub_substtation",
      "Wire Segment": "wire_segment",
      "Tower": "towers",
    };

    if (category === "All") {
      query = `
        SELECT 'Cable Segment' AS type, id, ST_AsGeoJSON(geom) AS geom FROM cable_segment WHERE id ILIKE $1
        UNION
        SELECT 'Connector Point' AS type, id, ST_AsGeoJSON(geom) AS geom FROM connector_point WHERE id ILIKE $1
        UNION
        SELECT 'Energy Source' AS type, id, ST_AsGeoJSON(geom) AS geom FROM energy_source WHERE id ILIKE $1
        UNION
        SELECT 'Pole' AS type, id, ST_AsGeoJSON(geom) AS geom FROM pole WHERE id ILIKE $1
        UNION
        SELECT 'Service Point' AS type, id, ST_AsGeoJSON(geom) AS geom FROM service_point WHERE id ILIKE $1
        UNION
        SELECT 'Substation' AS type, id, ST_AsGeoJSON(geom) AS geom FROM sub_substtation WHERE id ILIKE $1
        UNION
        SELECT 'Wire Segment' AS type, id, ST_AsGeoJSON(geom) AS geom FROM wire_segment WHERE id ILIKE $1
        UNION
        SELECT 'Tower' AS type, id, ST_AsGeoJSON(geom) AS geom FROM towers WHERE id ILIKE $1
      `;
    } else {
      const tableName = objs[category];
      if (!tableName) {
        return res.status(400).send("Invalid category");
      }

      query = `
        SELECT '${category}' AS type, id, ST_AsGeoJSON(geom) AS geom
        FROM ${tableName} 
        WHERE id ILIKE $1
      `;
    }

    const result = await pool.query(query, values);

    // Parse GeoJSON and extract first coordinate (for Point, LineString, Polygon, MultiLineString, MultiPolygon)
    const getCoordinates = (geojson) => {
      switch (geojson.type) {
        case "Point":
          return geojson.coordinates; // [lon, lat]
        case "LineString":
        case "MultiPoint":
          return geojson.coordinates[0]; // First point
        case "Polygon":
          return geojson.coordinates[0][0]; // First vertex of outer ring
        case "MultiLineString":
          return geojson.coordinates.flat()[0]; // First point of first line
        case "MultiPolygon":
          return geojson.coordinates.flat(2)[0]; // First point of first polygon
        default:
          console.warn(`Unknown geometry type: ${geojson.type}`);
          return [0, 0]; // Fallback
      }
    };
    
    const data = result.rows.map((row) => {
      const geojson = JSON.parse(row.geom);
      const [longitude, latitude] = getCoordinates(geojson);
    
      return {
        type: row.type,
        id: row.id,
        latitude,
        longitude,
      };
    });

    res.json(data);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("Internal Server Error");
  }
});




const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
