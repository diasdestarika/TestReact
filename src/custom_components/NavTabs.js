import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, NavLink } from 'reactstrap';

const propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object,
  id: PropTypes.number
};


class NavTabs extends React.Component {
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
    const {id, data} = this.props;

    var tabChild =[];


      for (let [key, value] of Object.entries(data)){
        
        tabChild.push(
          <NavItem>
            <NavLink 
                id={key}
                style=  {{  color: "black", 
                            justifyContent: "center", 
                            backgroundColor: id === key ? "white" : ""
                }}
                active = {id === key}
                onClick={e => this.onClick(e)}
            >
                {value}
            </NavLink>
          </NavItem>
      )}



    return (
            <Nav tabs justified > 
                {tabChild}
            </Nav>
    );
  }
}

NavTabs.propTypes = propTypes;

export default NavTabs;