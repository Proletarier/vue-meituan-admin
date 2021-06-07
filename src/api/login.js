import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout(token) {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}
