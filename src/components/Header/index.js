class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string
};

Header.defaultProps = {
  title: "Default Header title"
};
