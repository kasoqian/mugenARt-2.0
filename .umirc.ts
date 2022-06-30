import { defineConfig } from 'umi';

const postcssPxToViewport = require('postcss-px-to-viewport');

export default defineConfig({
  title: 'Mugen ARt',
  links: [{ rel: 'icon', href: '/favicon.png' }],
  // extraBabelPlugins: ['transform-remove-console'],
  // 隐藏全局loading
  dynamicImport: {
    loading: '@/components/Loading',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  history: { type: 'hash' },
  exportStatic: {},
  inlineLimit: 15000,
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/', redirect: '/home' },
        { exact: true, path: '/home', component: '@/pages/home' },
        {
          exact: true,
          path: '/mugenBoxes',
          // component: '@/pages/mugenBoxes/components/tmp',
          component: '@/pages/mugenBoxes',
        },
        { exact: true, path: '/events', component: '@/pages/events' },
        // { exact: true, path: '/market', component: '@/pages/market' },
        { exact: true, path: '/about', component: '@/pages/about' },
        { exact: true, path: '/asset/list', component: '@/pages/asset/list' },
        {
          exact: true,
          path: '/rule/agreement',
          component: '@/pages/rule/agreement',
        },
        {
          exact: true,
          path: '/rule/policy',
          component: '@/pages/rule/policy',
        },
        {
          exact: true,
          path: '/asset/detail/:id',
          component: '@/pages/asset/detail',
        },
        {
          path: '/user',
          component: '@/pages/user',
          routes: [
            {
              exact: true,
              path: '/user/info',
              component: '@/pages/user/info',
            },
            {
              exact: true,
              path: '/user/settings',
              component: '@/pages/user/settings',
            },
            {
              exact: true,
              path: '/user/share',
              component: '@/pages/user/share',
            },
          ],
        },
        { exact: true, path: '/result/:orderId', component: '@/pages/result' },
      ],
    },
  ],
  fastRefresh: {},
  extraPostCSSPlugins: [
    postcssPxToViewport({
      unitToConvert: 'px',
      viewportWidth: 1920,
      unitPrecision: 5,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: undefined,
      include: undefined,
      landscape: false,
      landscapeUnit: 'vw',
      landscapeWidth: 568,
    }),
  ],
  locale: {
    default: 'ja-JP',
  },
  headScripts: [
    { src: 'https://cdn.bootcss.com/stomp.js/2.3.3/stomp.js' },
    { src: 'https://cdn.bootcss.com/sockjs-client/1.6.0/sockjs.min.js' },
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-JVJY6GR38J',
      async: true,
    },
    `
      function getQueryString(name) {
        var query_string = location.search;
        if (!query_string) return null;
        var re = /[?&]?([^=]+)=([^&\/]*)/g;
        var tokens;
        while (tokens = re.exec(query_string)) {
            if (decodeURIComponent(tokens[1]) === name) {
                return decodeURIComponent(tokens[2]);
            }
        }
        return null;
      }
      if (getQueryString('type') === 'twitter' || getQueryString('type') === 'google') {
        const loginMessage = JSON.stringify({
          type: getQueryString('type'),
          code: getQueryString('code'),
          jwtToken: getQueryString('jwtToken')
        })
        localStorage.setItem('message', loginMessage);
        setTimeout(function(){
          window.close()
        }, 200);
      }
      <!-- Global site tag (gtag.js) - Google Analytics -->
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-JVJY6GR38J');

      (function(d, t){
        var key = 'WRxYY';
        var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
            g.src = "https://js.gleam.io/"+key+"/trk.js"; s.parentNode.insertBefore(g, s);
      }(document, "script"));
    `,
  ],
});
