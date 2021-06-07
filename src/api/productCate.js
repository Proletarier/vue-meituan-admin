import request from '@/utils/request'

export function listProductCate(params) {
  return request({
    url: 'productCate/list',
    method: 'get',
    params: params
  })
}

export function getProdutCate(id) {
  return request({
    url: 'productCate/' + id,
    method: 'get'
  })
}

export function updatetProdutCate(data) {
  return request({
    url: 'productCate/update',
    method: 'post',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: 'productCate/update/status',
    method: 'post',
    data: data
  })
}

export function createProdutCate(data) {
  return request({
    url: 'productCate/create',
    method: 'put',
    data: data
  })
}
