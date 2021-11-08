<template>

    <div v-if="loaded">
        <v-chart class="chart" :option="option" />
    </div>

</template>

<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
<script src="https://cdn.jsdelivr.net/npm/@vue/composition-api@1.0.0-rc.3"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.1.2"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-echarts@6.0.0-rc.6"></script>
<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PolarComponent } from 'echarts/components';

import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query} from "firebase/firestore"
const db = getFirestore(firebaseApp);


use([
  CanvasRenderer,
  PolarComponent,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

export default {
  name: "PowerUserInsights",
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: "light"
  },

  data() {
    return {
        loaded: false,
        inventoryNames1: [],
        dataToDisplay1: [],
        dataToDisplay2: [],

        
       

        option: {
             angleAxis: {
                type: 'category',
                data: ['loading']
            },
            radiusAxis: {},
            polar: {},
            series: [
                {
                type: 'bar',
                data: [0],
                coordinateSystem: 'polar',
                name: 'Current',
                stack: 'a',
                emphasis: {
                    focus: 'series'
                }
                },
                {
                type: 'bar',
                data: [0],
                coordinateSystem: 'polar',
                name: 'Pending',
                stack: 'a',
                emphasis: {
                    focus: 'series'
                }
                },

            ],
            legend: {
                show: true,
                data: ['Current', 'Pending']
            }
      
        }, 


    };
  },

 
    mounted: function() {
      this.suppliesOverview()
      this.loaded = true
    },

    methods: {

        async suppliesOverview(){
            const itemSuppliesgetter =  getDocs(query(collection(db, "ItemSupplies")) );
            var itemfiltered = []

            try {
                const querySnapshot = await itemSuppliesgetter;
                querySnapshot.forEach((doc) => {
                itemfiltered.push(doc.data())
                });
            console.log(itemfiltered)
            //console.log(itemfiltered[3])
        
            }catch (error) {
                console.error("Error checking document: ", error)
            }
            
            for (let i =0; i < itemfiltered.length; i++ ){
                this.inventoryNames1.push( itemfiltered[i]['Item_Name'])
                var qty = itemfiltered[i]['Order_Quantity']
                this.dataToDisplay1.push( qty)
            }

            console.log(this.inventoryNames1)
            console.log(this.dataToDisplay1)
            console.log(this.dataToDisplay2)

            this.option.series[0].data = this.dataToDisplay1;
            this.option.angleAxis.data = this.inventoryNames1;

            //#############################################################################//

            const itemSuppliesgetter2 =  getDocs(query(collection(db, "PendingArrival")) );
            itemfiltered = []

            try {
                const querySnapshot = await itemSuppliesgetter2;
                querySnapshot.forEach((doc) => {
                itemfiltered.push(doc.data())
                });
            console.log(itemfiltered)
            //console.log(itemfiltered[3])
        
            }catch (error) {
                console.error("Error checking document: ", error)
            }
            
            for (let i =0; i < itemfiltered.length; i++ ){
                this.inventoryNames.push( itemfiltered[i]['Item_Name'])
                var qty = itemfiltered[i]['Topup_Quantity']
                this.dataToDisplay2.push( qty)
            }

            this.option.series[1].data = this.dataToDisplay2;


            console.log(this.inventoryNames1)
            console.log(this.dataToDisplay1)
            console.log(this.dataToDisplay2)
            


        },

        

    },




};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>