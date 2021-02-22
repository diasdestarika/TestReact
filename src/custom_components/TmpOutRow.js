import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const propTypes = {
    onBlur: PropTypes.func,
  data: PropTypes.array,
  index: PropTypes.number
};

const defaultProps = {
    data: [],
    index: 0
  };

class TmpOutRow extends React.Component {
  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  render() {
    const {data, index} = this.props;

    const editable = data.tmpout_editableyn === 'Y';
    const style =   {
                        border: editable ? null : "0",
                        backgroundColor: editable ?   null : "rgba(0, 0, 0, 0)"
                    };

    return (
            <tr className = {!editable ? "table-active" : null}>
                <td>{data.tmpout_kodearea}</td>
                <td>{data.tmpout_jenisarea}</td> 
                <td>
                    <Input 
                        className="tmpout_l0"
                        style = {style}
                        id={index}
                        placeholder={data.tmpout_l0}
                        disabled={!editable}
                        onBlur={this.onBlur}
                    />
                </td>
                <td>
                    <Input 
                        className="tmpout_l15"
                        id={index}
                        style = {style}
                        placeholder={data.tmpout_l15}
                        disabled={!editable}
                        onBlur={this.onBlur}
                    />
                </td>
                <td>
                    <Input 
                        className="tmpout_l30"
                        id={index}
                        style = {style}
                        placeholder={data.tmpout_l30}
                        disabled={!editable}
                        onBlur={this.onBlur}
                    />
                </td>
                <td>
                    <Input 
                        className="tmpout_l45"
                        id={index}
                        style = {style}
                        placeholder={data.tmpout_l45}
                        disabled={!editable}
                        onBlur={this.onBlur}
                    />
                </td>
                <td>
                    <Input 
                        className="tmpout_l60"
                        id={index}
                        style = {style}
                        placeholder={data.tmpout_l60}
                        disabled={!editable}
                        onBlur={this.onBlur}
                    />
                </td>
                <td>
                    <Input 
                        className="tmpout_l80"
                        id={index}
                        style = {style}
                        placeholder={data.tmpout_l80}
                        disabled={!editable}
                        onBlur={this.onBlur}
                    />
                </td>
                <td>
                    <Input 
                        className="tmpout_l100"
                        id={index}
                        style = {style}
                        placeholder={data.tmpout_l100}
                        disabled={!editable}
                        onBlur={this.onBlur}
                    />
                </td>
            </tr>
    );
  }
}

TmpOutRow.propTypes = propTypes;
TmpOutRow.defaultProps = defaultProps;

export default TmpOutRow;