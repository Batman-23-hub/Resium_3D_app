import React from "react";

function LayerControl({ layers, toggleLayer }) {
  return (
    <div style={styles.container}>
      <h4>Layer Control</h4>
      {Object.entries(layers).map(([layer, isVisible]) => (
        <label key={layer} style={styles.label}>
          <input
            type="checkbox"
            checked={isVisible}
            onChange={() => toggleLayer(layer)}
          />
          {layer}
        </label>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    top: "50px",
    left: "10px",
    zIndex: 1000,
    background: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  label: {
    display: "block",
    margin: "5px 0",
  },
};

export default LayerControl;
