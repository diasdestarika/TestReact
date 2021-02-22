import React from 'react';
import PropTypes from 'prop-types';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';

const propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.array,
  size: PropTypes.number
};


class SizeDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }


  render() {
    const {size, data} = this.props;


    return (
        <UncontrolledButtonDropdown>
          <DropdownToggle caret className="mr-3" name ="sizemenu" color="primary">{size}</DropdownToggle>
            <DropdownMenu>
              {data.map(item => <DropdownItem value={item} onClick={e => this.onClick(e)}>{item}</DropdownItem>)}
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    );
  }
}

SizeDropDown.propTypes = propTypes;

export default SizeDropDown;