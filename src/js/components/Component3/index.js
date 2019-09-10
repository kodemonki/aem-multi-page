class Component3 extends React.Component {
  render() {
    return (
      <div>
        <h1>Component3 React Rendered</h1>
      </div>
    );
  }
}

Component3.propTypes = {
  title: PropTypes.string
};

Component3.defaultProps = {
  title: "Default title"
};
