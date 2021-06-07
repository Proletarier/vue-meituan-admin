import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/admin/create',
    method: 'put',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/admin/updateStatus',
    method: 'post',
    data: data
  })
}

export function getItem(id) {
  return request({
    url: '/admin/' + id,
    method: 'get'
  })
}

export function getRoleListByAdmin(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function allotRole(data) {
  return request({
    url: '/admin/allotRole/',
    method: 'post',
    data: data
  })
}
