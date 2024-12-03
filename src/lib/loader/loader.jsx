import "./loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper1" id="loader_img">
      <div className="loader1">
        {/* <img src="/loader-logo.png" alt="" /> */}
        <img src="/img/logo.png" alt="" />
        <div className="material-spinner1"></div>
      </div>
    </div>
  );
};

export default Loader;
