
function HelloWorld(props) {
  return (
    <React.Fragment>
      Greeting: {props.greeting}
    </React.Fragment>
  );
}

HelloWorld.propTypes = {
  greeting: PropTypes.string
};


