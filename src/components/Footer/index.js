class Footer extends React.Component {
  render() {
    return (
      <div className="Footer">
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}

Footer.propTypes = {
  title: PropTypes.string
};

Footer.defaultProps = {
  title: "Default Footer title"
};
