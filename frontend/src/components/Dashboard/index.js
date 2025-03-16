import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard({ setIsAuthenticated }) {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('market_cap_desc');

  const logout = () => {
    localStorage.setItem('is_authenticated', false);
    setIsAuthenticated(false);
  }
  // Fetch the data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:8000/cryptos');
        setCryptos(result.data);
        console.log(result.data);
        setFilteredCryptos(result.data); // Set filtered data initially to all cryptocurrencies
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the cryptocurrencies based on the query
    const filtered = cryptos.filter((crypto) =>
      
      crypto.name.toLowerCase().includes(query)
    );
    setFilteredCryptos(filtered);
  };

  // Sort data based on the selected field
  const sortData = (field) => {
    const sortedCryptos = [...filteredCryptos].sort((a, b) => {
      if (field === 'price_usd') {
        return b.price_usd - a.price_usd;
      }
      if (field === 'market_cap_usd') {
        return b.market_cap_usd - a.market_cap_usd;
      }
      if (field === 'volume_usd_24h') {
        return b.volume_usd_24h - a.volume_usd_24h;
      }
      return 0;
    });
    setFilteredCryptos(sortedCryptos);
  };

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-between'>
        <h1>Top 20 Cryptocurrencies</h1>
        <Button onClick={logout}>Logout</Button>
      </div>

      {/* Search Bar */}
      <FormControl
        type="text"
        placeholder="Search for a cryptocurrency"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th onClick={() => sortData('price_usd')}>
              Price (USD)
            </th>
            <th onClick={() => sortData('market_cap_usd')}>
              Market Cap
            </th>
            <th onClick={() => sortData('volume_usd_24h')}>
              24h Trading Volume
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.length > 0 ? (
            filteredCryptos.map((crypto) => (
              <tr key={crypto.id}>
                <td>{crypto.name}</td>
                <td>${crypto.price_usd.toFixed(2)}</td>
                <td>${crypto.market_cap_usd.toLocaleString()}</td>
                <td>${crypto.volume_usd_24h.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No cryptocurrencies found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default Dashboard;
