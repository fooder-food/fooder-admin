import request from '@/utils/request'

export function getReports() {
  return request({
    url: '/report/all',
    method: 'get',
  });
}
export function getSingleReport(id) {
  return request({
    url: `/report/${id}`,
    method: 'get',
  });
}

export function updateReport(id,data) {
  return request({
    url: `/report/update/${id}`,
    data,
    method: 'put'
  });
}


