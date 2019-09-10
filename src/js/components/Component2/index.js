class Component2 extends React.Component {
  render() {
    return (
      <div>
        <h1>Component2 React Rendered davexxx</h1>
      </div>
    );
  }
}

Component2.propTypes = {
  title: PropTypes.string
};

Component2.defaultProps = {
  title: "Default title"
};
