class Component4 extends React.Component {
  render() {
    return (
      <div>
        <Component1 />
        <Component2 />
        <Component3 />
      </div>
    );
  }
}

Component4.propTypes = {
  title: PropTypes.string
};

Component4.defaultProps = {
  title: "Default title"
};
