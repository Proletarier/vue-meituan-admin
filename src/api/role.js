import request from '@/utils/request'

export function listRole(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/role/create',
    method: 'put',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/role/updateStatus',
    method: 'post',
    data: data
  })
}

export function getItem(id) {
  return request({
    url: '/role/' + id,
    method: 'get'
  })
}

export function listMenuRelation(id) {
  return request({
    url: '/role/menuRelation/' + id,
    method: 'get'
  })
}

export function allocMenu(data) {
  return request({
    url: '/role/allocMenu',
    method: 'post',
    data: data
  })
}

export function listRoleResourceRelation(id) {
  return request({
    url: '/role/resourceRelation/' + id,
    method: 'get'
  })
}

export function allocResource(data) {
  return request({
    url: '/role/allocResource',
    method: 'post',
    data: data
  })
}
