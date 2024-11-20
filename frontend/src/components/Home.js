import Header from "./Header";
import SpacesList from "../views/SpacesList";
import Navbar from "./Navbar";
import "../App.css";
import "./Home.css";

const HomeFull = () => {
  return (
    <div className="home-full">
      <Header />
      <div className="welcome-message">
        <h1>Bienvenido a Nomad</h1>
      </div>
      <div className="gray">
        <SpacesList />
      </div>
      <Navbar />
    </div>
  );
};

export default HomeFull;