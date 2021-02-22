import React from 'react';
import { Redirect } from 'react-router';

class ReceivingPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    // const group = this.props.group;
    this.state = {
      isDetail: 'HEADER',
      data: {},
      choose: '',
      modal: true,
    };
  }

  handlePageState = (pageState, data = {}) => () => {
    console.log(data);

    if (pageState === 'HEADER') {
      this.setState({ isDetail: 'HEADER' });
    } else if (pageState === 'DETAIL') {
      this.setState({ isDetail: 'DETAIL', data: data });
    } else {
      this.setState({ isDetail: 'NEW', data: data });
    }
  };

  render() {
    const { isDetail, data } = this.state;
    const { group } = this.props;

    return (
      <React.Fragment>
        {isDetail === 'HEADER' && (
          <Redirect
            to={{
              pathname: '/receivingH',
              state: {
                // changePageState: this.handlePageState,
                group: group,
              },
            }}
          />
        )}
        {/* redirect={() => this.props.history.push({
                                        pathname: '/login',
                                    })} */}
        {isDetail === 'DETAIL' && (
          <Redirect
            to={{
              pathname: '/receivingDetail',
              state: {
                // changePageState: this.handlePageState,
                group: group,
                data: data,
              },
            }}
          />
        )}
        {isDetail === 'NEW' && (
          <Redirect
            to={{
              pathname: '/receivingNew',
              state: {
                // changePageState: this.handlePageState,
                group: group,
                data: data,
              },
            }}
          />
        )}
      </React.Fragment>
    );
  }
}
export default ReceivingPage;
