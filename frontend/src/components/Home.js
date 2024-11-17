import "./Home.css";
import Header from "./Header";
import SpacesList from "../views/SpacesList";
import Navbar from "./Navbar";

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
