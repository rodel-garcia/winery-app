import React from 'react';
import wineryApi from '../api/winery';
import Breakdown from './Breakdown';
import Loader from './Loader';

class WineDetail extends React.Component {
  state = {
    wine: null,
    requestError: null,
  };

  componentDidMount() {
    this.getWineDetail();
  }

  getWineDetail = async () => {
    try {
      const { lotCode } = this.props.match.params;
      const response = await wineryApi.get('/' + lotCode);
      this.setState({ wine: response.data });
    } catch (error) {
      this.setState({ requestError: error.message });
    }
  };

  renderErrorMessage() {
    return (
      <div className='ui negative floating message'>
        <i className='exclamation triangle icon'></i>
        {this.state.requestError}
      </div>
    );
  }

  renderDetailRow(label, value, editable = false) {
    let button = null;
    if (editable) {
      button = <button className='ui button right floated blue'>Edit</button>;
    }
    return (
      <tr>
        <td>
          <strong>{label}:</strong>
        </td>
        <td>
          {value}
          {button}
        </td>
      </tr>
    );
  }

  renderBackButton() {
    return (
      <button
        onClick={() => this.props.history.goBack()}
        className='ui icon button teal'
      >
        <i className='left chevron primary icon'></i>
        Back
      </button>
    );
  }

  renderDropdown() {
    return (
      <div className='ui compact menu right floated'>
        <div className='ui simple dropdown icon item'>
          <span className='text'>Operation</span>
          <i className='dropdown icon'></i>
          <div className='menu'>
            <div className='item'>Blending</div>
            <div className='item'>Other</div>
          </div>
        </div>
      </div>
    );
  }

  renderContent() {
    const {
      lotCode,
      description,
      volume,
      tankCode,
      productState,
      ownerName,
    } = this.state.wine;
    return (
      <div className='ui segment' style={{ margin: '2em', padding: '1em' }}>
        {this.renderBackButton()}
        {this.renderDropdown()}
        <h1 className='ui huge header'>{lotCode}</h1>
        <table className='ui celled table'>
          <tbody>
            {this.renderDetailRow('Lot Code', lotCode)}
            {this.renderDetailRow('Description', description, true)}
            {this.renderDetailRow('Volume', volume)}
            {this.renderDetailRow('Tank', tankCode, true)}
            {this.renderDetailRow('Product State', productState)}
            {this.renderDetailRow('Owner', ownerName)}
          </tbody>
        </table>
        <Breakdown lotCode={this.props.match.params.lotCode} />
      </div>
    );
  }

  render() {
    if (this.state.requestError) {
      return this.renderErrorMessage();
    }
    if (this.state.wine) {
      return this.renderContent();
    }
    return <Loader />;
  }
}

export default WineDetail;
