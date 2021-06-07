import request from '@/utils/request'

export function listPromotion(params) {
  return request({
    url: 'promotion/list',
    method: 'get',
    params: params
  })
}
