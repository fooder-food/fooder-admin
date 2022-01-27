import request from '@/utils/request'

export function getCuisines() {
  return request({
    url: '/category/all_in_active',
    method: 'get',
  });
}

export function createCruisine(data) {
    return request({
        url: '/category/create',
        method: 'post',
        data,
    })
}

export function getSingleCuisine(id) {
    return request({
        url: `/category/single/${id}`,
        method: 'get'
    })
}

export function updateCuisine(data) {
    return request({
        url: '/category/update',
        method: 'put',
        data,
    })
}
