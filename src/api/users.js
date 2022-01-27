import request from '@/utils/request'

export function getAllUsers(data) {
    return request({
      url: '/users/all',
      method: 'get',
    })
}

export function getSingleUser(uniqueId) {
    return request({
        url: `/users/single/${uniqueId}`,
        method: 'get'
    })
}

export function updateUserStatus(data) {
    return request({
        url: '/users/single',
        method: 'put',
        data,
    });
}