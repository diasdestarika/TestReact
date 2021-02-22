import React from 'react';
import 'pages/css/App.css';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { Button } from 'reactstrap';


/** A React component for scrolling back to the top of the page **/

class ScrollButton extends React.Component {
  constructor() {
    super();

    this.state = {
      intervalId: 0,
    };
  }

  scrollStep() {
    if (window.scrollY === 0) {
      clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.scrollY - this.props.scrollStepInPx);
  }

  scroll() {
    let intervalId = setInterval(
      this.scrollStep.bind(this),
      this.props.delayInMs,
    );
    //store the intervalId inside the state,
    //so we can use it later to cancel the scrolling
    this.setState({ intervalId: intervalId });
  }

  render() {
    return (
      <Button
        href="#"
        title="Back to top"
        id="scroll"
        className="scroll"
        onClick={event => {
          event.preventDefault();
          this.scroll();
        }}
      >
        {' '}
        <MdKeyboardArrowUp></MdKeyboardArrowUp>
        <span className="glyphicon glyphicon-chevron-up"></span>
      </Button>
    );
  }
}
/*
 * Render the above component into the div with the id 'app'
 */
// React.render(
//   <ScrollButton scrollStepInPx="50" delayInMs="16.66" />,
//   document.getElementById('app'),
// );

export default ScrollButton;
