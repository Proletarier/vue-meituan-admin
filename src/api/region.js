import request from '@/utils/request'

export function cityList() {
  return request({
    url: 'region/listChildren/',
    method: 'get'
  })
}
