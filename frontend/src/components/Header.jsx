import React from "react";

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-main">
        <h1>Distributed Cinema Reservation System</h1>
        <p>Apache Cassandra 3-Node Cluster · Big Data and Distributed Processing Project</p>
      </div>

      <div className="team-box">
        <span>Developed by</span>
        <strong>Baris Surmelioglu & Ozan Polat</strong>
      </div>
    </header>
  );
};

export default Header;