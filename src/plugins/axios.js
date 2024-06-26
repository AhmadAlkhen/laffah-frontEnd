import axios from 'axios';

const token = localStorage.getItem('accessToken');
axios.defaults.baseURL = "https://api.safacati.com/api/";
axios.defaults.headers.common['Content-Type'] = 'application/form-data';
axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

const axiosIns = axios.create({
// You can add your headers here
// ================================
baseURL: 'https://api.safacati.com/api/',
timeout:7000,
headers: {'Content-Type': 'application/form-data','Authorization':token}

})
// http://localhost:8000/api/
//7000
// https://api.safacati.com/api/
// config.headers.Authorization =  token ? `Bearer ${token}` : '';
// axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
export default axiosIns