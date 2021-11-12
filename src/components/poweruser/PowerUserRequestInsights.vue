<template>
    
    <div v-if="loaded">
        <br>
        <br>
        <v-chart class="chart" :option="option" />
        <br>
        <br>
    </div>

</template>

<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
<script src="https://cdn.jsdelivr.net/npm/@vue/composition-api@1.0.0-rc.3"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.1.2"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-echarts@6.0.0-rc.6"></script>
<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
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
        inventoryNames: [],
        dataToDisplay: [],
        modifyDataDisplay: [],
        modifyInventoryNames: [],
       

        option: {
        title: {
          text: "Amount of Supplies",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "Loading"
          ]
        },
        series: [
          {
            name: "Amount of Supplies",
            type: "pie",
            radius: "75%",
            center: ["50%", "60%"],
            data: [
              { value: 0, name: "Loading" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
        }, 


    };
  },

 
    mounted: function() {
      this.consolidateItemDisbursed()
      this.loaded = true
    },

    methods: {

        async consolidateItemDisbursed(){
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
                this.inventoryNames.push( itemfiltered[i]['Item_Name'])
                var qty = itemfiltered[i]['Order_Quantity']
                var name = itemfiltered[i]['Item_Name']
                var maker = {value: qty  , name: name}
                this.dataToDisplay.push( maker)

                //this.option.legend.data.push(itemfiltered[i]['Item_Name'])
                //this.option.series.data.push( maker)
            }

            this.option.series[0].data = this.dataToDisplay;
            this.option.legend.data = this.inventoryNames;

            console.log(this.inventoryNames)
            console.log(this.dataToDisplay)
          
        },

        async getInventoryNames(){
            const itemSuppliesgetter =  getDocs(query(collection(db, "ItemSupplies")) );
            var itemfiltered = []
            var consolidateNames = []

            try {
                const querySnapshot = await itemSuppliesgetter;
                querySnapshot.forEach((doc) => {
                itemfiltered.push(doc.data())
                });
        
            }catch (error) {
                console.error("Error checking document: ", error)
            }
            
            for (let i =0; i < itemfiltered.length; i++ ){
                consolidateNames.push( itemfiltered[i]['Item_Name'])
            }
            return JSON.parse(JSON.stringify(consolidateNames))
        },

    },

};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>