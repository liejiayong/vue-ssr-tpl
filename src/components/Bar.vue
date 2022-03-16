<template>
  <div class="bar">
    <h1>Bar Component</h1>
    <button @click="onHandleClick">Get bar component</button>
    <div>bar fetch msg: {{msg}}</div>
  </div>
</template>

<script>

function fetchInitialData({store}) {
  store.dispatch('fetchBar');
}

export default{
  asyncData:fetchInitialData,
  computed:{
    msg(){
      console.log('bar component store', this.$store);
      return this.$store.state.bar
    }
  },
  mounted() {
    // 需要注意的是，我在mounted中也写了获取数据的代码，这是为什么呢？
    //  因为想要做到同构，代码单独在浏览器端运行，也应该是没有问题的，
    // 又由于服务器没有mounted生命周期，
    // 所以我写在这里就可以解决单独在浏览器环境使用也可以发起同样的异步请求去初始化数据。

    // 因为服务端渲染只有 beforeCreate 和 created 两个生命周期，不会走这里
    // 所以把调用 Ajax 初始化数据也写在这里，是为了供单独浏览器渲染使用
    let store = this.$store;
    fetchInitialData({ store });
  },
  methods: {
      onHandleClick() {
        alert('bar');
      }
  },
}
</script>

<style>
.bar {
  background: bisque;
}
</style>
