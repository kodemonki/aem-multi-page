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
        <p>
          Phasellus sit amet pharetra sapien. Quisque enim orci, imperdiet sed
          nisi elementum, rutrum tincidunt leo. Praesent auctor mauris in
          fermentum hendrerit. Morbi at luctus leo. Praesent ut risus facilisis,
          rutrum metus faucibus, mattis nibh. Praesent volutpat et nunc vel
          vestibulum. Nullam imperdiet euismod lacus, ac pharetra est. Mauris
          laoreet nulla hendrerit metus interdum imperdiet. Donec facilisis elit
          sem, ultrices pellentesque tortor ultrices at. Proin massa enim,
          egestas vel consectetur eget, suscipit venenatis enim. Suspendisse id
          nisi in felis convallis finibus. Integer luctus fermentum velit, eu
          varius nisi. Nam leo neque, suscipit sed dui eget, porttitor luctus
          lorem. Curabitur mauris magna, iaculis at congue ac, aliquam non est.
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
