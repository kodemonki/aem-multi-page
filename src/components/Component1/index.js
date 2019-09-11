class Component1 extends React.Component {
  render() {
    return (
      <div>
        <h2>Component1</h2>
        <h3>{this.props.title}</h3>
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
