import config from '../config/config'
import axios from 'axios'

export const getEventLists = () => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/getEvents`,
      baseURL: config.apiBaseUrl,
      method: 'get',
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

export const getToken = (data) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: '/getToken',
      baseURL: config.apiBaseUrl,
      method: "post",
      data: data,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    })
  })
}

export const getEventsMembers = (eventId) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/getEventMemners/${eventId}`,
      baseURL: config.apiBaseUrl,
      method: 'get',
    }).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}