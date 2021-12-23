import logo200Image from 'assets/img/logo/logo_200.png';
import sidebarBgImage from 'assets/img/sidebar/sidebar-0.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import { MdHdrStrong } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavLink as BSNavLink } from 'reactstrap';
import bn from 'utils/bemnames';

var accessList = {};

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const navItems = [
  {
    to: '/',
    id:'30',
    name: 'Test Page',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    if (window.localStorage.getItem('accessList')) {
      accessList = JSON.parse(window.localStorage.getItem('accessList'));
    }
  }

  state = {
    isOpenComponents: false,
    isOpenContents: false,
    isOpenPages: false,
    navItems: false,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  allFound = master => {
    return master.some(menu => Object.keys(accessList).includes(menu.id));
  };

  handleSidebarControlButton = event => {
    // event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  render() {
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <img
                src={logo200Image}
                width="40"
                height="30"
                className="pr-2"
                alt=""
              />
              <span className="text-white">Testing React</span>
            </SourceLink>
          </Navbar>

          <Nav vertical>
            {this.allFound(navItems) &&
              navItems.map(
                ({ to, id, name, exact, Icon }, index) =>
                  Object.keys(accessList).includes(id) && (
                    <NavItem key={index} className={bem.e('nav-item')}>
                      <BSNavLink
                        id={`navItem-${name}-${index}`}
                        className="text-uppercase"
                        tag={NavLink}
                        to={to}
                        activeClassName="active"
                        exact={exact}
                        onClick={this.handleSidebarControlButton}
                      >
                        <Icon className={bem.e('nav-item-icon')} />
                        <span className="">{name}</span>
                      </BSNavLink>
                    </NavItem>
                  ),
              )}
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
