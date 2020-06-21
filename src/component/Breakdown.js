import React from 'react';
import wineryApi from '../api/winery';
import Loader from './Loader';

const TYPE = {
  'year': 'getYearBreakdown',
  'variety': 'getVarietyBreakdown',
  'region': 'getRegionBreakdown',
  'year-variety': 'getYearAndVarietyBreakdown',
};

class Breakdown extends React.Component {
  state = {
    filteredBreakDown: [],
    breakdown: [],
    requestError: null,
  };

  componentDidMount() {
    this.getBreakDownData();
  }

  getBreakDownData = async (endpoint = TYPE.year) => {
    try {
      const response = await wineryApi.get(
        `/${endpoint}/${this.props.lotCode}`
      );
      this.setState({
        breakdown: response.data.breakdown,
        filteredBreakDown: response.data.breakdown.slice(0, 5),
      });
    } catch (error) {
      this.setState({ requestError: error.message });
    }
  };

  onSelect = (event) => {
    const endpoint = TYPE[event.target.value];
    this.getBreakDownData(endpoint);
  };

  onClickLoadMore = () => {
    this.setState({ filteredBreakDown: this.state.breakdown });
  };

  renderErrorMessage() {
    return (
      <div className='ui negative floated message'>
        <i className='exclamation triangle icon'></i>
        {this.state.requestError}
      </div>
    );
  }

  renderDropdown() {
    return (
      <div className='ui secondary menu'>
        <div className='right menu'>
          <select onChange={this.onSelect} className='ui dropdown'>
            <option value='year'>By Year</option>
            <option value='variety'>By Variety</option>
            <option value='region'>By Region</option>
            <option value='year-variety'>By Year and Variety</option>
          </select>
        </div>
      </div>
    );
  }

  renderLoadMoreButton() {
    const { filteredBreakDown, breakdown } = this.state;
    if (
      filteredBreakDown.length === 5 &&
      breakdown.length > filteredBreakDown.length
    ) {
      return (
        <button onClick={this.onClickLoadMore} className='ui button'>
          Load more ...
        </button>
      );
    }
  }

  renderTableheader() {
    const headers = this.state.filteredBreakDown[0];
    return Object.keys(headers).map((d, i) => {
      return <th key={i}>{d.toUpperCase()}</th>;
    });
  }

  renderTableBody() {
    return this.state.filteredBreakDown.map((data, i) => {
      return <tr key={i}>{this.renderTableData(data)}</tr>;
    });
  }

  renderTableData(data) {
    return Object.keys(data).map((key, i) => {
      if (key === 'percentage') {
        return <td key={i}>{data[key]} %</td>;
      }
      return <td key={i}>{data[key]}</td>;
    });
  }

  renderTable() {
    return (
      <table className='ui celled fixed table centered'>
        <thead>
          <tr>{this.renderTableheader()}</tr>
        </thead>
        <tbody>{this.renderTableBody()}</tbody>
      </table>
    );
  }

  render() {
    if (this.state.requestError) {
      return this.renderErrorMessage();
    }
    if (this.state.filteredBreakDown.length) {
      return (
        <div style={{ padding: '3em 0 1em' }}>
          <h4 className='ui horizontal divider header'>
            <i className='hourglass half icon'></i>
            Breakdown
          </h4>
          {this.renderDropdown()}
          {this.renderTable()}
          {this.renderLoadMoreButton()}
        </div>
      );
    }
    return <Loader />;
  }
}

export default Breakdown;
