import axios from 'axios';

const token = localStorage.getItem('accessToken');
axios.defaults.baseURL = "http://api.safaqatii.com/api/";
axios.defaults.headers.common['Content-Type'] = 'application/form-data';
axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

const axiosIns = axios.create({
// You can add your headers here
// ================================
baseURL: 'http://api.safaqatii.com/api/',
timeout: 1000,
headers: {'Content-Type': 'application/form-data','Authorization':token}

})

// config.headers.Authorization =  token ? `Bearer ${token}` : '';
// axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
export default axiosIns