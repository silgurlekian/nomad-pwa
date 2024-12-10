import Header from "./Header";
import SpacesList from "../views/SpacesList";
import Navbar from "./Navbar";
import "../App.css";
import "./Home.css";

const HomeFull = () => {
  return (
    <div className="home-full">
      <Header />
      <div className="gray">
        <SpacesList />
      </div>
      <Navbar />
    </div>
  );
};

export default HomeFull;