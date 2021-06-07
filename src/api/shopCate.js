import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/shopCategory/list',
    method: 'get',
    params: params
  })
}

export function createShopCate(data) {
  return request({
    url: 'shopCategory/create',
    method: 'put',
    data: data
  })
}

export function updateShopcate(data) {
  return request({
    url: 'shopCategory/update',
    method: 'post',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/shopCategory/update/status',
    method: 'post',
    data: data
  })
}

export function getShopCate(cateId) {
  return request({
    url: 'shopCategory/' + cateId,
    method: 'get'
  })
}

export function listShopCateAndChildren() {
  return request({
    url: 'shopCategory/children',
    method: 'get'
  })
}
