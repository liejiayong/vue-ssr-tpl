import { createApp } from './app.js';

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, store, App } = createApp();

    const components = App.components,
      asyncDataPromiseFns = [];

    Object.values(components).forEach((component) => {
      if (component.asyncData) {
        asyncDataPromiseFns.push(component.asyncData({ store }));
      }
    });

    // 我们通过导出的App拿到了所有它下面的components，
    // 然后遍历，找出哪些component有asyncData方法，有的话调用并传入store，该方法会返回一个Promise，
    // 我们使用Promise.all等所有的异步方法都成功返回，才resolve(app)。
    Promise.all(asyncDataPromiseFns).then((result) => {
      // 当使用createBundleRenderer时，
      // 如果设置了template选项，context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
      context.state = store.state;

      // console.log('entry-server.js');
      // console.log('store state', store.state);
      // console.log('context.state', context.state);
      // console.log('context', context);

      resolve(app);
    }, reject);
  });
};
