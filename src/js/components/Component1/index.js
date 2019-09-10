class Component1 extends React.Component {
  render() {
    return (
      <div>
        <h1>Component1 React Rendered</h1>
        <h2>{this.props.title}</h2>
      </div>
    );
  }
}

Component1.propTypes = {
  title: PropTypes.string
};

Component1.defaultProps = {
  title: "Default title"
};
