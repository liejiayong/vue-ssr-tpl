const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const backendApp = new Koa();
const backendRouter = new Router();
const bundle = require(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'));
const clientManifest = require(path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'));
const templateSSR = fs.readFileSync(path.resolve(__dirname, '../dist/index.ssr.html'), 'utf-8');
const renderer = require('vue-server-renderer').createBundleRenderer(bundle, {
  runInNewContext: false,
  template: templateSSR,
  clientManifest: clientManifest,
});

// 后端Server
backendRouter.get('/index', async (ctx, next) => {
  try {
    let html = await new Promise((resolve, reject) => {
      // 这里直接使用 renderToString 的 Promise 模式，返回的 html 字符串没有样式和 __INITIAL_STATE__，原因暂时还没有查到
      // 所以，只能暂时先自己封装一个 Promise，用 renderToString 的 callback 模式
      renderer.renderToString((err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });

    ctx.type = 'html';
    ctx.status = 200;
    ctx.body = html;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = '服务器内部错误';
  }
});

backendApp.use(serve(path.resolve(__dirname, '../dist')));

backendApp.use(backendRouter.routes()).use(backendRouter.allowedMethods());

backendApp.listen(3000, () => {
  console.log('服务器端渲染地址： http://localhost:3000/index');
});

// 前端Server
const frontendApp = new Koa();
const frontendRouter = new Router();
frontendRouter.get('/index', (ctx, next) => {
  let html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
  ctx.type = 'html';
  ctx.status = 200;
  ctx.body = html;
});

frontendApp.use(serve(path.resolve(__dirname, '../dist')));

frontendApp.use(frontendRouter.routes()).use(frontendRouter.allowedMethods());

frontendApp.listen(3001, () => {
  console.log('浏览器端渲染地址： http://localhost:3001/index');
});
