import Avatar from 'components/Avatar';
import { UserCard } from 'components/Card';
import withBadge from 'hocs/withBadge';
import React from 'react';
import {
  MdClearAll,
  MdExitToApp,
  MdEditLocation,
  MdNotificationsActive,
  MdPublic,
} from 'react-icons/md';
import {
  Button,
  ListGroup,
  ListGroupItem,
  Nav,
  Navbar,
  NavLink,
  Popover,
  PopoverBody,
  Label,
} from 'reactstrap';
import bn from 'utils/bemnames';
import { Redirect } from 'react-router-dom';

const bem = bn.create('header');

const MdNotificationsActiveWithBadge = withBadge({
  size: 'md',
  color: 'primary',
  style: {
    top: -10,
    right: -10,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  children: <small>2</small>,
})(MdNotificationsActive);

class Header extends React.Component {
  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
    redirect: false,
    redirectGudang: false,
    redirectDashboard: false,
  };

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  signOut = () => {
    window.localStorage.removeItem('tokenCookies');
    window.localStorage.removeItem('accessList');
    this.setState({
      redirect: true,
    });
  };

  keluarGudang = () => {
    this.setState({
      redirectGudang: true,
      title: '',
    });
  };

  keDashboard = () => {
    this.setState({
      redirectDashboard: true,
      isOpenUserCardPopover: false,
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    } else if (this.state.redirectGudang) {
      const { title } = this.props;
      this.setState({ title: '' });
      return <Redirect to="/" />;
    } else if (this.state.redirectDashboard) {
      this.setState({ redirectDashboard: false });
      return <Redirect to="/Dashboard" />;
    }
  };

  setDataProfile() {
    var profileName = JSON.parse(window.localStorage.getItem('profile'));
    if (profileName === null) {
      return;
    } else {
      this.setState({
        nip: profileName.mem_nip,
        nama: profileName.mem_username,
      });
    }
  }
  componentDidMount() {
    this.setDataProfile();
  }

  // <SearchInput />
  render() {
    var gudangName = window.localStorage.getItem('gName');
    return (
      <Navbar light expand className={bem.b('bg-white')}>
        {this.renderRedirect()}
        <Nav navbar className="mr-2">
          <Button outline onClick={this.handleSidebarControlButton}>
            <MdClearAll size={25} />
          </Button>
        </Nav>
        <Label
          style={{
            fontWeight: 'bold',
            textAlign: 'Center',
            fontSize: '35px',
            margin: '0',
            marginLeft: '1%',
            color: this.props.color,
            width: '100%',
          }}
        >
          {this.props.title}
        </Label>
        <NavLink id="Popover2">
          <Avatar onClick={this.toggleUserCardPopover} className="can-click" />
        </NavLink>
        <Popover
          placement="bottom-end"
          isOpen={this.state.isOpenUserCardPopover}
          toggle={this.toggleUserCardPopover}
          target="Popover2"
          className="p-0 border-0"
          style={{ minWidth: 250 }}
        ></Popover>

        <Popover
          placement="bottom-end"
          isOpen={this.state.isOpenUserCardPopover}
          toggle={this.toggleUserCardPopover}
          target="Popover2"
          className="p-0 border-0"
          style={{ minWidth: 250 }}
        >
          <PopoverBody className="p-0 border-light">
            <UserCard
              title={this.state.nama}
              subtitle={gudangName}
              className="border-light"
            >
              <ListGroup flush>
                <ListGroupItem
                  tag="button"
                  action
                  onClick={this.keDashboard}
                  className="border-light"
                >
                  <MdPublic /> Dashboard
                </ListGroupItem>
                <ListGroupItem
                  tag="button"
                  action
                  onClick={this.keluarGudang}
                  className="border-light"
                >
                  <MdEditLocation /> Pilih Gudang
                </ListGroupItem>
                <ListGroupItem
                  tag="button"
                  action
                  onClick={this.signOut}
                  className="border-light"
                >
                  <MdExitToApp /> Keluar
                </ListGroupItem>
              </ListGroup>
            </UserCard>
          </PopoverBody>
        </Popover>
      </Navbar>
    );
  }
}

export default Header;
