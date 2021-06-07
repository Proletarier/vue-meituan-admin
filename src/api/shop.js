import request from '@/utils/request'

export function createShop(data) {
  return request({
    url: '/shop/create',
    method: 'put',
    data: data
  })
}

export function updateShop(data) {
  return request({
    url: '/shop/update',
    method: 'post',
    data: data
  })
}

export function shopList(params) {
  return request({
    url: '/shop/list',
    method: 'get',
    params: params
  })
}

export function getShopInfo(id) {
  return request({
    url: '/shop/' + id,
    method: 'get'
  })
}
