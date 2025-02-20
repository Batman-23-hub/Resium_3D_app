import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Cesium from "cesium";

function SearchBar({ viewer, onSelect }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Object categories mapping
  const categories = [
    "All",
    "Cable Segment",
    "Connector Point",
    "Energy Source",
    "Pole",
    "Service Point",
    "Substation",
    "Wire Segment",
    "Tower",
  ];

  // Log viewer instance to verify it's passed correctly
  useEffect(() => {
    console.log("Viewer in SearchBar:", viewer);
  }, [viewer]);

  // Fetch suggestions while typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        console.log("Fetching suggestions for:", category, query);

        const response = await axios.get("http://localhost:5000/api/search", {
          params: { category, id: query },
        });

        console.log("Response from server:", response.data);
        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const delayDebounceFn = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, category]);

  // Handle object selection and zoom to location
  const handleSelect = (item) => {
    console.log("Selected item:", item);

    // Ensure valid viewer and coordinates
    if (viewer && Cesium.defined(viewer.camera) && item.latitude && item.longitude) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          parseFloat(item.longitude),
          parseFloat(item.latitude),
          1000
        ),
        duration: 2,
      });
    }

    // Call onSelect to highlight object
    onSelect(item);

    // Update search input with selected object
    setQuery(`${item.type} - ${item.id}`);

    // Clear suggestions after selection
    setSuggestions([]);
  };

  // Clear search input and suggestions when changing category
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setQuery("");
    setSuggestions([]);
  };

  // Clear highlight and search bar when clicking on the map
  useEffect(() => {
    if (!viewer) return;

    const clickHandler = () => {
      onSelect(null);
      setQuery("");
    };

    viewer.screenSpaceEventHandler.setInputAction(clickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }, [viewer, onSelect]);

  return (
    <div style={styles.container}>
      {/* Object Type Dropdown */}
      <select
        value={category}
        onChange={handleCategoryChange}
        style={styles.dropdown}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by ID"
        style={styles.input}
      />

      {/* Suggestion List */}
      {suggestions.length > 0 && (
        <ul style={styles.suggestions}>
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              style={styles.suggestionItem}
            >
              {item.type} - {item.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Component Styles
const styles = {
  container: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  },
  dropdown: {
    padding: "8px",
    marginBottom: "4px",
  },
  input: {
    padding: "8px",
    width: "300px",
  },
  suggestions: {
    listStyle: "none",
    margin: 0,
    padding: "8px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    borderRadius: "4px",
    maxHeight: "200px",
    overflowY: "auto",
  },
  suggestionItem: {
    padding: "8px",
    cursor: "pointer",
  },
};

export default SearchBar;
