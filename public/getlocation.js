const axios = require("axios");


const getLocation = async (address) => {
  const apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';


  const params = {
    address: address,
    key: "AIzaSyCI6NC4_qw3itCGtTP8Hx30aP1IY35ng1Y"
  };


  return axios.get(apiUrl, { params })
    .then(response => {
      const result = response.data.results[0];
      const location = result.geometry.location;
      const lat = location.lat;
      const lng = location.lng;


      return { lat, lng };
    })
    .catch(error => {
      throw error.response ? error.response.data.error_message : error.message;
    });
}

module.exports = {
  getLocation
}