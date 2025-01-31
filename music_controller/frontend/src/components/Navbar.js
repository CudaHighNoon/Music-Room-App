import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Typography, Button, Grid } from "@material-ui/core";


export default function Navbar(){
  

 
    return (
    
          <Grid item xs={12} style={styles.navbar}>
            <Grid container alignItems="center" style={styles.navItems}>
              <img
                src="../../static/images/logo.png"
                alt="TuneShare Logo"
                style={styles.logoImage}
              />
              <Typography variant="h5" style={styles.navBrand}>
                TuneShare
              </Typography>
              <Link to="/" style={styles.navLink}>
                Home
              </Link>
              <Link to="/info" style={styles.navLink}>
                About
              </Link>
            </Grid>
           </Grid>
           
    );
  }



const styles = {
  navbar: {
    padding: "1rem 5%",
    position: "relative",
    zIndex: 2,
  },
  navItems: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  logoImage: {
    width: "60px",
    height: "60px",
    marginRight: "0.5rem",
  },
  navBrand: {
    fontWeight: "bold",
    marginRight: "1rem",
    fontSize: "1.8rem",
    fontFamily: "Nunito, sans-serif", // Explicit font for brand
    textDecoration: "none",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    whiteSpace: "nowrap",
    fontFamily: "Nunito, sans-serif", // Explicit font for links
    fontWeight: 600,
  }
};

const mediaQueries = `
  @media (max-width: 700px) {
    .navBrand {
      font-size: 1.5rem !important;
    }
    .navLink {
      font-size: 0.9rem !important;
    }
    .heroContainer {
      padding: 2rem 5% !important;
    }
    .mainTitle {
      font-size: 2.5rem !important;
    }
    .tagline {
      font-size: 1.2rem !important;
    }
    .description {
      font-size: 1.1rem !important;
    }
    .buttonColumn {
      max-width: 100% !important;
    }
    .imageSide {
      height: 300px !important;
    }
    .circleImage {
      left: -50% !important;
    }
  }

  @media (min-width: 1280px) {
    .createButton, .joinButton {
      font-size: 1.3rem !important;
      padding: 1rem 2rem !important;
      max-width: 350px !important;
    }
    .mainTitle {
      font-size: 4rem !important;
    }
    .navBrand {
      font-size: 2rem !important;
    }
    .navLink {
      font-size: 1.1rem !important;
    }
  }
`;

// Create a style element and append to head
const styleElement = document.createElement('style');
styleElement.appendChild(document.createTextNode(mediaQueries));
document.head.appendChild(styleElement);

