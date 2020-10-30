/* eslint no-underscore-dangle: 0 */ // --> OFF
import axios from 'axios';
import config from '../config/config.json';

const instance = axios.create({
  baseURL: `${config.serverUrl}`,
  timeout: 15000,
});

export default instance;
