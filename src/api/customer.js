import request from '@/utils/request'

export function listCustomer(params) {
  return request({
    url: 'customer/list',
    method: 'get',
    params: params
  })
}
