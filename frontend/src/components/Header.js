import "./Header.css";

const Header = () => {

  return (
    <div className="header">
      <div className="bkg-home">
        <img className="icon" alt="" src="/images/bkg-home.jpg" />
      </div>
      <div className="header1">
        <div className="bienvenido-a-nomad">Bienvenido a nomad!</div>
      </div>
    </div>
  );
};

export default Header;