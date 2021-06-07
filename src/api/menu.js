import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/menu/create',
    method: 'put',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data: data
  })
}

export function getMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

export function treeMenu() {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}
