import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/routes';

//import {createApp} from 'vue'
//import PowerUserInsights from './components/poweruser/PowerUserInsights.vue'
//import VueChartkick from 'vue-chartkick'
//import Chart from 'chart.js'
//createApp(PowerUserInsights).use(VueChartkick).mount('#chartPUI')
import {Chart} from 'chart.js'
import Chartkick from 'vue-chartkick'
Vue.use(Chartkick.use(Chart));
//npm install vue-chartkick@0.6.1 chart.js@2.9 --save
//npm install vue-chartjs --save




//npm install echarts vue-echarts
//npm i -D @vue/composition-api
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent
]);
// register globally (or you can do it locally)
Vue.component('v-chart', ECharts)


new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
