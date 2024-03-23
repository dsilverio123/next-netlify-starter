import Head from 'next/head';
import Header from '@components/Header';
import { useState, useEffect, useRef } from 'react';
  

export default function Home() {
  const [address, setAddress] = useState('');
  const [representatives, setRepresentatives] = useState({});
  const [selectedDivision, setSelectedDivision] = useState(null);
  const addressInputRef = useRef(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!window.google) {
        console.error('Google Maps JavaScript API not loaded');
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setAddress(place.formatted_address);
        } else if (place.name) {
          setAddress(place.name);
        }
      });
    };

    if (window.google) {
      initializeAutocomplete();
    } else {
      const loadGoogleMapsScript = document.createElement('script');
      loadGoogleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
      document.body.appendChild(loadGoogleMapsScript);
      loadGoogleMapsScript.addEventListener('load', initializeAutocomplete);
    }
  }, []);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSearch = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CIVIC_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=${encodedAddress}&includeOffices=true&levels=country&levels=regional&levels=locality&levels=administrativeArea1&levels=administrativeArea2&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setRepresentatives(data);
    } catch (error) {
      console.error('Error fetching representative data:', error);
    }
  };

  const handleDropdownSelect = (divisionName) => {
    setSelectedDivision(divisionName);
  };
  const mappedRepresentatives = Object.keys(representatives.divisions || {}).map(divisionKey => {
    const division = representatives.divisions[divisionKey];
    const divisionOfficials = division.officeIndices.map(index => {
      const office = representatives.offices[index];
      return office.officialIndices.map(officialIndex => {
        const official = representatives.officials[officialIndex];
        return {
          divisionName: division.name,  
          officeName: office.name,
          name: official.name,
          party: official.party, 
        };
      });
    }).flat();
    return divisionOfficials;
  }).flat();
  

  const filteredRepresentatives = mappedRepresentatives.filter(item => item.divisionName === selectedDivision);

  return (
    <div className="container">


      <Head>
        <title>Voter Representative Info</title>
        <meta property="og:image" content="https://your-app-name.netlify.app/Cover.png" />
        <link rel="icon" href="/download.ico" />
      </Head>

      <main>
        <Header title="Who are my representatives? 🗳️" />

        <h2 className="welcome">
        Who are my representatives? 🗳️
        </h2>
        <h3 className="description">
        Please input your address below. 🏠
        </h3>

        <div>
          <input 
            ref={addressInputRef}
            type="text" 
            value={address} 
            onChange={handleAddressChange} 
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Dropdown Components */}
        {Object.keys(representatives.divisions || {}).map((divisionKey, index) => (
          <button key={index} onClick={() => handleDropdownSelect(representatives.divisions[divisionKey].name)}>
            {representatives.divisions[divisionKey].name}
          </button>
        ))}

        {/* Representative Table */}
        {selectedDivision && (
          <div>
            <h2>{selectedDivision}</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Office</th>
                  <th>Party</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepresentatives.map((official, index) => (
                  <tr key={index}>
                    <td>{official.name}</td>
                    <td>{official.officeName}</td>
                    <td>{official.party}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
      </main>

    </div>
  );
}
