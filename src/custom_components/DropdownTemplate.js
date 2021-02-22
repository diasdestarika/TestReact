import React from 'react';
import PropTypes from 'prop-types';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';

const propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  name: PropTypes.string
};


class DropdownTemplate extends React.Component {
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
    const {name, data} = this.props;

    var item = []

    for ( let [key, value] of Object.entries(data)){
        item.push(
            <DropdownItem value={key}  onClick={e => this.onClick(e)}>{value}</DropdownItem>
        )
    }

    return (
        <UncontrolledButtonDropdown size ="sm">
            <DropdownToggle caret>
                {name}
            </DropdownToggle>

            <DropdownMenu>
                {item}
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    );
  }
}

DropdownTemplate.propTypes = propTypes;

export default DropdownTemplate;