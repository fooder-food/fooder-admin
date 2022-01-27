import request from '@/utils/request';
import axios from 'axios'

const countryService = axios.create({
  baseURL: 'https://api.countrystatecity.in/v1/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: {
    "X-CSCAPI-KEY": "cHhnVm1HZjR5QXJ4d3l5RUpXOERnVFB3dGJiaWIzWnBqRXVJNk1nZw=="
  }
});

export function getRestaurants() {
  return request({
    url: '/restaurants/all-admin',
    method: 'get',
  });
}

export function getRestaurantInfo(id) {
    return request({
        url: `/restaurants/info-admin/${id}`,
        method: 'get',
    })
}

export function getCountry() {
  return countryService({
    url: 'countries',
    method: 'get',
  });
  
}

export function getState(code) {
  return countryService({
    url: `countries/${code}/states`,
    method: 'get',
  });
  
}

export function updateRestaurantInfo(data) {
  return request({
    url: '/restaurants/update',
    data,
    method: 'put',
  });
}
