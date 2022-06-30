import { extend } from 'umi-request';

export const isTestEnv =
  location.hostname.includes('local') || location.hostname.includes('test');

export const urlPrefix = isTestEnv
  ? // ? 'https://mugenartbackend-test-env.mugenart.io'
    'https://mugenartbackend-test-env.mugenart.io'
  : 'https://mugenart-backend.mugenart.io';
const request = extend({
  prefix: urlPrefix,
});

request.interceptors.request.use((url, options) => {
  let params;
  const accessToken = localStorage.getItem('ACCESS_TOKEN');
  if (accessToken) {
    params = {
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authentication: accessToken,
      },
    };
  } else {
    params = {
      headers: options.headers,
    };
  }
  return {
    url,
    options: { ...options, ...params },
  };
});

export default request;
