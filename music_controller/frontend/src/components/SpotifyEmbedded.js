// SpotifyEmbedded.js
import React from "react";

export default function SpotifyEmbedded() {
  return (
    <div style={styles.embeddedContainer}>
    
      {/* Example: an embedded playlist or track selection */}
      <iframe
        src="https://open.spotify.com/embed/"
        width="100%"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
        style={styles.iframeStyle}
        title="Spotify Embedded"
      />
      <p style={styles.info}>
        Use this embed to pick songs. Audio does <strong>not</strong> come 
        from here, only from WebPlayback in your browser.
      </p>
    </div>
  );
}

const styles = {
  embeddedContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: "8px",
    padding: "1rem",
    color: "#fff",
  },
  header: {
    marginTop: 0,
    marginBottom: "0.5rem",
  },
  iframeStyle: {
    border: "none",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  info: {
    fontSize: "0.9rem",
    color: "#ccc",
  },
};
