import "./Home.css";
import Header from "./Header";
import SpacesList from "./SpacesList";

const HomeFull = () => {
  return (
    <div className="home-full">
      <Header />
      <div className="gray">
        <SpacesList />
      </div>
    </div>
  );
};

export default HomeFull;
