import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'reactstrap';

const propTypes = {
  First: PropTypes.func,
  Back: PropTypes.func,
  Next: PropTypes.func,
  Last: PropTypes.func,
  Page: PropTypes.number,
  MaxPage: PropTypes.number
};

class PageNav extends React.Component {
  constructor(props) {
    super(props);
  }

  First(e) {
      this.props.First(e);
  }

  Back(e) {
      this.props.Back(e);
  }

  Next(e) {
      this.props.Next(e);
  }

  Last(e) {
      this.props.Last(e);
  }

  render() {
    const {Page, MaxPage} = this.props;
    const AdjustedMaxPage = MaxPage < 1 ? 1 : MaxPage;
    const AdjustedPage = Page > MaxPage ? MaxPage : Page < 1 ? 1 : Page ;

    const isFirst = AdjustedPage <= 1;
    const  isLast = AdjustedPage >= MaxPage;

    return (
      <ButtonGroup style={{ alignSelf: 'center', alignItems: 'center'}}>
        <Button onClick={e => this.First(e)} disabled={isFirst}>«</Button>
        <Button onClick={e => this.Back(e)} disabled={isFirst}>‹</Button>
        <Button color="white" style={{fontSize: "10pt", width: "55px"}} disabled>   {AdjustedPage} / {AdjustedMaxPage}   </Button>
        <Button onClick={e => this.Next(e)} disabled={isLast}>›</Button>
        <Button onClick={e => this.Last(e)} disabled={isLast}>»</Button>
      </ButtonGroup>
    );
  }
}

PageNav.propTypes = propTypes;

export default PageNav;