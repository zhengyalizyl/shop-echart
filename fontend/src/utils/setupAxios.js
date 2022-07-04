import axios from 'axios';


const setupAxios = (store) => {
    axios.interceptors.response.use((res) => {
        return res.data
    }, error => {
        const message = error.response && error.response.message ? error.response.message : error.message;
        return Promise.reject(message)
    })

    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.put['Content-Type'] = 'application/json';
    axios.defaults.headers.patch['Content-Type'] = 'application/json';

}

export default setupAxios;