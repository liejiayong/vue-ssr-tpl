import Vue from 'vue';
import Vuex from 'vuex';
import * as api from '@/api/news.js';
Vue.use(Vuex);

function createStore() {
  const store = new Vuex.Store({
    state: {
      bar: '',
    },
    mutations: {
      SET_BAR(state, data) {
        state.bar = data;
      },
    },

    actions: {
      fetchBar({ commit }) {
        return api
          .getTopics()
          .then(({ data }) => {
            console.log('data---', data);
            commit('SET_BAR', JSON.stringify(data[0]));
          })
          .catch((err) => {
            console.error(err);
          });
      },
    },
  });

  if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    // console.log('window.__INITIAL_STATE__', window.__INITIAL_STATE__);
    store.replaceState(window.__INITIAL_STATE__);
  } else {
    console.log('no browser');
  }

  return store;
}

export default createStore;

typeof window;
