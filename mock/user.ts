export default {
  // 支持值为 Object 和 Array
  'POST /mugen-auth-service/auth/login': {
    code: '0',
    message: '成功',
    data:
      'eyJhbciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2FsbGV0QWRkciI6IjB4N2Y4MzMxNzJmODUyYTY3MDc0YTQwNmNmZTM3ZDI2MDA5NTQyYTgzMSIsImF1ZCI6IndlYiIsImxvZ2luTm9uY2UiOiI2MjczODMwMzUiLCJpc3MiOiJtdWdlbmFydCIsImV4cCI6MTY0NjQ1MDQxMywiaWF0IjoxNjQ1NTg2NDEzfQ.GYknjuXW_FaYxbYWbru5WJKowFTONrNWR4AY3geUGsQ',
  },

  'GET /mugen-auth-service/auth/getLoginNonce': {
    code: '0',
    message: '成功',
    data: '627383035',
  },

  'POST /mugen-auth-service/auth/verify': {
    code: '01',
    message: '用户未登录，请先登录！',
    data: '',
  },

  'POST /mugen-auth-service/auth/logout': {
    code: '0',
    message: '成功',
    data: '',
  },

  // GET 可忽略
  '/api/users/1': { id: 1 },
};
