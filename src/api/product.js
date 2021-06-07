import request from '@/utils/request'

export function listProduct(params) {
  return request({
    url: 'product/list',
    method: 'get',
    params: params
  })
}

export function getProduct(id) {
  return request({
    url: 'product/' + id,
    method: 'get'
  })
}

export function updateProduct(data) {
  return request({
    url: 'product/update',
    method: 'post',
    data: data
  })
}

export function createProduct(data) {
  return request({
    url: 'product/create',
    method: 'put',
    data: data
  })
}
