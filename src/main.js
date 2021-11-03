import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/routes';

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
