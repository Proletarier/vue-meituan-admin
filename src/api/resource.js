import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/resource/list',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/resource/create',
    method: 'put',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/resource/update',
    method: 'post',
    data: data
  })
}

export function getItem(id) {
  return request({
    url: '/resource/' + id,
    method: 'get'
  })
}

export function listAll(params) {
  return request({
    url: '/resourceCate/list',
    method: 'get',
    params: params
  })
}

export function createCate(data) {
  return request({
    url: '/resourceCate/create',
    method: 'put',
    data: data
  })
}

export function updateCate(data) {
  return request({
    url: '/resourceCate/update',
    method: 'post',
    data: data
  })
}
