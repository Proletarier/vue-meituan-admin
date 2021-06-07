import request from '@/utils/request'

export function listProductAttrCate(params) {
  return request({
    url: '/product/attrCate/list',
    method: 'get',
    params: params
  })
}

export function listAll(params) {
  return request({
    url: '/product/attrCate/listAll',
    method: 'get',
    params: params
  })
}

export function createProductAttrCate(data) {
  return request({
    url: '/product/attrCate/create',
    method: 'put',
    data: data
  })
}

export function updateProductAttrCate(data) {
  return request({
    url: '/product/attrCate/update',
    method: 'post',
    data: data
  })
}

export function listProductAttr(params) {
  return request({
    url: '/productAttr/list',
    method: 'get',
    params: params
  })
}

export function createProductAttr(data) {
  return request({
    url: '/productAttr/create',
    method: 'put',
    data: data
  })
}

export function updateProductAttr(data) {
  return request({
    url: '/productAttr/update',
    method: 'post',
    data: data
  })
}
