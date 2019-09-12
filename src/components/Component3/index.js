class Component3 extends React.Component {
  render() {
    return (
      <div>
        <h2>Component3</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in
          ex quis eros mattis feugiat vitae vitae justo. Fusce facilisis
          molestie tellus, vitae sodales neque pharetra quis. Nam vitae tortor
          maximus, euismod nisi sagittis, blandit orci. Donec eget orci ligula.
          Praesent egestas egestas quam sit amet scelerisque. Praesent dignissim
          maximus maximus. Etiam ut consequat felis. Cras eu sem viverra,
          sodales ante sed, lacinia mauris. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Suspendisse volutpat posuere pharetra.
        </p>
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
