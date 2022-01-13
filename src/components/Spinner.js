const Spinner = () => {
  return (
    <div className="loadingSpinnerContainer">
      <div className="loadingSpinner"></div>
      {/* Spinner gif is added in the custom css page (index.css) itself. So, it can be directly used as it is. */}
    </div>
  );
};

export default Spinner;
