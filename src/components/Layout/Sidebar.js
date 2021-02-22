import logo200Image from 'assets/img/logo/logo_200.png';
import sidebarBgImage from 'assets/img/sidebar/sidebar-0.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import {
    MdFormatListBulleted,
    MdKeyboardArrowDown,
    MdHdrStrong,
    MdRadioButtonChecked,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
    Collapse,
    Nav,
    Navbar,
    NavItem,
    NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

var accessList = {};

const sidebarBackground = {
    backgroundImage: `url("${sidebarBgImage}")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
};

const Pelapak = [
    {
        to: '/OrderMalamIni',
        id: '5',
        name: 'L1. Order Pelapak Malam Ini',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderBesokPagi',
        id: '5',
        name: 'L2. Order Pelapak Besok Pagi',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderBesokSore',
        id: '5',
        name: 'L3. Order Pelapak Besok Sore',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/Pesanan2',
        id: '5',
        name: 'L4. Order Pelapak Kejar On Time',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/Pesanan1',
        id: '5',
        name: 'L5. Order Pelapak Kejar Tidak Cancel',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderMalamIninAPI',
        id: '5',
        name: 'L6. Order Pelapak Non API Malam Ini',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderBesokPaginAPI',
        id: '5',
        name: 'L7. Order Pelapak Non API Besok Pagi',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderBesokSorenAPI',
        id: '5',
        name: 'L8. Order Pelapak Non API Besok Sore',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderPageBelumJadiSP',
        id: '5',
        name: 'L9. Order Pelapak Yang Belum Jadi SP Lebih Dari 1 Jam',
        exact: false,
        Icon: MdHdrStrong,
    },
];

const navB2B = [
    {
        to: '/OrderB2BTerlambat',
        id: '5',
        name: 'P1. Order B2B Terlambat',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderB2B',
        id: '5',
        name: 'P2. Order B2B Malam Ini',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderB2BBesokPagi',
        id: '5',
        name: 'P3. Order B2B Besok Pagi',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderB2BBesokSore',
        id: '5',
        name: 'P4. Order B2B Besok Sore',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/OrderB2BKejarOnTime',
        id: '5',
        name: 'P5. Order B2B Kejar On Time',
        exact: false,
        Icon: MdHdrStrong,
    },
];

const navItems2 = [
    // { to: '/OrderPelapak', id: '5', name: 'Order Dr.Ship', exact: false },
    {
        to: '/DetailProduct',
        id: '5',
        name: 'Detail Product Kurang Stock',
        exact: false,
    },
    {
        to: '/SummaryProduct',
        id: '5',
        name: 'Summary Product Kurang Stock',
        exact: false,
    },
    {
        to: '/KekuranganSlongsong',
        id: '5',
        name: 'Kekurangan Slongsong',
        exact: false,
    },
    {
        to: '/KelebihanSlongsong',
        id: '5',
        name: 'Kelebihan Slongsong',
        exact: false,
    },
    // { to: '/CetakResi', id: '5', name: 'Cetak Resi', exact: false },
];

const navReceiving = [
    {
        to: '/receivingFloor',
        id: '18',
        name: 'Receiving Floor',
        exact: false,
        Icon: MdHdrStrong,
    },
    {
        to: '/receivingApotek',
        id: '18',
        name: 'Receiving Apotek',
        exact: false,
        Icon: MdHdrStrong,
    },
];

const navStock = [
    {
        to: '/headerstock',
        id: '19',
        name: 'Stock',
        exact: false,
        Icon: MdHdrStrong,
    },
];

const navTN = [
    {
        to: '/ReturToGudang',
        id: '20',
        name: 'Transfer IN',
        exact: false,
        Icon: MdHdrStrong,
    },
];

const navMasterDataSPAddHO = [
    { to: '/spaddho', id: '23', name: 'SP Add HO', exact: false, Icon: MdRadioButtonChecked }
];

const navRefund = [
    { to: '/refund', id: '23', name: 'REFUND', exact: false, Icon: MdRadioButtonChecked }
];

const spdoGroup = [
    { to: '/spdo', id: '22', name: 'SP DO', exact: false, Icon: MdHdrStrong },
];

const laporanSP = [
    { to: '/laporansphome', id: '23', name: 'Laporan SP Home', exact: false, Icon: MdRadioButtonChecked },
];

const EkspedisiExternal = [
    // { to: '/Ekspedisi-CHC', id: '5', name: 'Ekspedisi-CHC', exact: false, Icon: MdHdrStrong },
  { to: '/Ekspedisi-Pelapak-Eksternal', id: '5', name: 'Ekspedisi-Pelapak-Eksternal', exact: false, Icon: MdHdrStrong },
  { to: '/Cetak-Ulang-Resi', id: '5', name: 'Cetak-Ulang-Resi', exact: false, Icon: MdHdrStrong }
]

var Penjaluran = [
    { to: '/Ekspedisi-Scanner', id: '4', name: 'Scanner', exact: false, Icon: MdHdrStrong },
    { to: '/Ekspedisi-Viewer', id: '4', name: 'Viewer', exact: false, Icon: MdHdrStrong }
]

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        if (window.localStorage.getItem('accessList')) {
            accessList = JSON.parse(window.localStorage.getItem('accessList'));
        } else {
        }
    }

    state = {
        isOpenPelapak: false,
        isOpenMasterB2B: false,
        isOpenReceiving: false,
        isOpenStock: false,
        isOpenExternal: true,
        isOpenMasterSPAddHO: false,
        isOpenEkspedisiExternal: false,
        isOpenPenjaluran: false,
    };

    handleClick = name => () => {
        this.setState(prevState => {
            const isOpen = prevState[`isOpen${name}`];
            return {
                [`isOpen${name}`]: !isOpen,
            };
        });
    };

    //added by Master I team at 11/10/2019
    refreshSamePage = (currPath, toPath) => () => {
        var temporary = 'http://localhost:3000' + toPath;
        //console.log(currPath + " " + temporary);
        if (currPath === temporary) {
            window.location.reload(false);
        }
    };

    allFound = master => {
        return master.some(menu => Object.keys(accessList).includes(menu.id));
    };

    limitedAccess = () =>{
        if(!accessList[4].includes(8)){
            var newPenjaluran =  Penjaluran.filter(menu => menu.name !== 'Scanner')
            return Penjaluran = newPenjaluran
        }else {
            return Penjaluran
        }

    }

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
                            <span className="text-white">Logistic</span>
                        </SourceLink>
                    </Navbar>

                    {/* PELAPAK */}
                    <Nav vertical>
                        {this.allFound(Pelapak) && (
                            <NavItem
                                className={bem.e('nav-item')}
                                onClick={this.handleClick('Pelapak')}
                            >
                                <BSNavLink className={bem.e('nav-item-collapse')}>
                                    <div className="d-flex">
                                        <MdFormatListBulleted className={bem.e('nav-item-icon')} />
                                        <span className="">PELAPAK</span>
                                    </div>
                                    <MdKeyboardArrowDown
                                        className={bem.e('nav-item-icon')}
                                        style={{
                                            padding: 0,
                                            transform: this.state.isOpenPelapak
                                                ? 'rotate(0deg)'
                                                : 'rotate(-90deg)',
                                            transitionDuration: '0.3s',
                                            transitionProperty: 'transform',
                                        }}
                                    />
                                </BSNavLink>
                            </NavItem>
                        )}
                        {this.allFound(Pelapak) && (
                            <Collapse isOpen={this.state.isOpenPelapak}>
                                {Pelapak.map(
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
                            </Collapse>
                        )}

                        {/* B2B */}
                        {this.allFound(navB2B) && (
                            <NavItem
                                className={bem.e('nav-item')}
                                onClick={this.handleClick('MasterB2B')}
                            >
                                <BSNavLink className={bem.e('nav-item-collapse')}>
                                    <div className="d-flex">
                                        <MdFormatListBulleted className={bem.e('nav-item-icon')} />
                                        <span className="">B2B</span>
                                    </div>
                                    <MdKeyboardArrowDown
                                        className={bem.e('nav-item-icon')}
                                        style={{
                                            padding: 0,
                                            transform: this.state.isOpenMasterB2B
                                                ? 'rotate(0deg)'
                                                : 'rotate(-90deg)',
                                            transitionDuration: '0.3s',
                                            transitionProperty: 'transform',
                                        }}
                                    />
                                </BSNavLink>
                            </NavItem>
                        )}
                        {this.allFound(navB2B) && (
                            <Collapse isOpen={this.state.isOpenMasterB2B}>
                                {navB2B.map(
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
                            </Collapse>
                        )}

                        {/* RECEIVING */}
                        {this.allFound(navReceiving) && (
                            <NavItem
                                className={bem.e('nav-item')}
                                onClick={this.handleClick('Receiving')}
                            >
                                <BSNavLink className={bem.e('nav-item-collapse')}>
                                    <div className="d-flex">
                                        <MdFormatListBulleted className={bem.e('nav-item-icon')} />
                                        <span className="">RECEIVING</span>
                                    </div>
                                    <MdKeyboardArrowDown
                                        className={bem.e('nav-item-icon')}
                                        style={{
                                            padding: 0,
                                            transform: this.state.isOpenReceiving
                                                ? 'rotate(0deg)'
                                                : 'rotate(-90deg)',
                                            transitionDuration: '0.3s',
                                            transitionProperty: 'transform',
                                        }}
                                    />
                                </BSNavLink>
                            </NavItem>
                        )}
                        {this.allFound(navReceiving) && (
                            <Collapse isOpen={this.state.isOpenReceiving}>
                                {navReceiving.map(
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
                            </Collapse>
                        )}

                        {/* EXTERNAL EKSPEDISI */}
                        {this.allFound(EkspedisiExternal) && (
                            <NavItem
                                className={bem.e('nav-item')}
                                onClick={this.handleClick('EkspedisiExternal')}
                            >
                                <BSNavLink className={bem.e('nav-item-collapse')}>
                                    <div className="d-flex">
                                        <MdFormatListBulleted className={bem.e('nav-item-icon')} />
                                        <span className="">EKSPEDISI EXTERNAL</span>
                                    </div>
                                    <MdKeyboardArrowDown
                                        className={bem.e('nav-item-icon')}
                                        style={{
                                            padding: 0,
                                            transform: this.state.isOpenEkspedisiExternal
                                                ? 'rotate(0deg)'
                                                : 'rotate(-90deg)',
                                            transitionDuration: '0.3s',
                                            transitionProperty: 'transform',
                                        }}
                                    />
                                </BSNavLink>
                            </NavItem>
                        )}
                        {this.allFound(EkspedisiExternal) && (
                            <Collapse isOpen={this.state.isOpenEkspedisiExternal}>
                                {EkspedisiExternal.map(
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
                            </Collapse>
                        )}

                        {/* EKSPEDISI SCANNER */}
                        {this.allFound(Penjaluran) && (
                            <NavItem
                                className={bem.e('nav-item')}
                                onClick={this.handleClick('Penjaluran')}
                            >
                                <BSNavLink className={bem.e('nav-item-collapse')}>
                                    <div className="d-flex">
                                        <MdFormatListBulleted className={bem.e('nav-item-icon')} />
                                        <span className="">PENJALURAN</span>
                                    </div>
                                    <MdKeyboardArrowDown
                                        className={bem.e('nav-item-icon')}
                                        style={{
                                            padding: 0,
                                            transform: this.state.isOpenPenjaluran
                                                ? 'rotate(0deg)'
                                                : 'rotate(-90deg)',
                                            transitionDuration: '0.3s',
                                            transitionProperty: 'transform',
                                        }}
                                    />
                                </BSNavLink>
                            </NavItem>
                        )}
                        {this.allFound(Penjaluran) && (
                            <Collapse isOpen={this.state.isOpenPenjaluran}>
                                {this.limitedAccess() &&  Penjaluran.map(
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
                            </Collapse>
                        )}


                        {/* Master SP Add HO   */}
                        {this.allFound(navMasterDataSPAddHO) &&
                            navMasterDataSPAddHO.map(({ to, name, exact }, index) => (
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
                                        <span className="">{name}</span>
                                    </BSNavLink>
                                </NavItem>
                            ))}

                        {this.allFound(navRefund) &&
                            navRefund.map(({ to, name, exact }, index) => (
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
                                        <span className="">{name}</span>
                                    </BSNavLink>
                                </NavItem>
                            ))}

                        {/* STOCK */}
                        {this.allFound(navStock) &&
                            navStock.map(({ to, name, exact }, index) => (
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
                                        <span className="">{name}</span>
                                    </BSNavLink>
                                </NavItem>
                            ))}

                        {/* TN Gudang */}
                        {this.allFound(navTN) &&
                            navTN.map(({ to, name, exact }, index) => (
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
                                        <span className="">{name}</span>
                                    </BSNavLink>
                                </NavItem>
                            ))}

                        {/* SP DO */}
                        {this.allFound(spdoGroup) &&
                            spdoGroup.map(({ to, name, exact }, index) => (
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
                                        <span className="">{name}</span>
                                    </BSNavLink>
                                </NavItem>
                            ))}

                        {/* EXTERNAL */}
                        {this.allFound(navItems2) &&
                            navItems2.map(({ to, name, exact }, index) => (
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
                                        <span className="">{name}</span>
                                    </BSNavLink>
                                </NavItem>
                            ))}

                        {/* Laporan SP */}
                        {this.allFound(laporanSP) &&
                            laporanSP.map(({ to, name, exact }, index) => (
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
                                        <span className="">{name}</span>
                                    </BSNavLink>
                                </NavItem>
                            ))}
                    </Nav>
                </div>
            </aside>
        );
    }
}

export default Sidebar;
