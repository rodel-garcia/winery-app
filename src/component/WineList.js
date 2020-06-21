import React from 'react';
import { Link } from 'react-router-dom';
import wineryApi from '../api/winery';
import SearchBar from './SearchBar';
import Loader from './Loader';

class WineList extends React.Component {
  state = {
    wines: [],
    filteredWines: [],
    hasRequestError: false,
  };

  componentDidMount() {
    this.getWineList();
  }

  getWineList = async () => {
    try {
      const response = await wineryApi.get('/');
      this.setState({ wines: response.data, filteredWines: response.data });
    } catch (error) {
      this.setState({ hasRequestError: true });
    }
  };

  onSearch = (event) => {
    const term = event.target.value;
    if (!term) {
      this.setState({ filteredWines: this.state.wines });
    }
    const filteredData = this.state.wines.filter((wine) => {
      return (
        wine.lotCode.toLowerCase().includes(term.toLowerCase()) ||
        wine.description.toLowerCase().includes(term.toLowerCase())
      );
    });
    this.setState({ filteredWines: filteredData });
  };

  renderWines = () => {
    return this.state.filteredWines.map((wine, i) => {
      return (
        <div className='item' key={i}>
          <Link to={`/wines/${wine.lotCode}`}>
            <div className='content'>
              <div className='header'>{wine.lotCode}</div>
              <div className='description'>{wine.description}</div>
            </div>
          </Link>
        </div>
      );
    });
  };

  renderErrorMessage() {
    return (
      <div class='ui red message'>
        <i className='exclamation triangle'></i>Please make sure API server is
        running in localhost:8000
      </div>
    );
  }

  renderContent() {
    return (
      <div className='ui segment' style={{ margin: '2em', padding: '1em' }}>
        <SearchBar onSearch={this.onSearch} />
        <div className='ui relaxed divided selection list'>
          {this.renderWines()}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasRequestError) {
      return this.renderErrorMessage();
    }
    if (this.state.filteredWines.length) {
      return this.renderContent();
    }
    return <Loader />;
  }
}

export default WineList;
