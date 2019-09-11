class Component2 extends React.Component {
  render() {
    return (
      <div>
        <h2>Component2</h2>
        <img src="https://picsum.photos/300/200" />
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
