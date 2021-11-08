<template>



    <div class = "qtyInsights">
        <!-- <h1>Line Chart </h1>
        <button @click="updateMe ()">Click to update the Line chart </button >
        <line-chart class = 'user' width =500px :data = "chartdata"></line-chart>

        <h1>Pie Chart </h1>
        <button @click="updateMe2 ()"> Click to update the Pie Chart</button ><br><br>
        <pie-chart class ="user" width=500px :data="chartdata2"></pie-chart>  

        <h1>Bar Chart </h1>-->
        <div class = "btnContainer">
        <button id = "bt1" @click="updateAll ()"> View All</button >
        <button id = "bt2" @click="updateDME ()"> DME </button >
        <button id = "bt3" @click="updateSurgery ()"> Surgery </button >
        <button id = "bt4" @click="updateCOVID ()"> COVID19 </button >
        </div>

        <bar-chart class ="user" width=400px :data="chartdata2" @load="updateAll()"></bar-chart>
        <br>

        <!--
        <div v-if="loaded">
            <v-chart class="chart" :option="option" />
        </div> -->




 
    </div>

</template>

<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
<script src="https://cdn.jsdelivr.net/npm/@vue/composition-api@1.0.0-rc.3"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.1.2"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-echarts@6.0.0-rc.6"></script>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query, where} from "firebase/firestore"
const db = getFirestore(firebaseApp);



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

use([
  CanvasRenderer,
  PolarComponent,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);


export default {

      components: {
    VChart
  },

    provide: {
    [THEME_KEY]: "light"
  },



    data(){
        return{
            inventoryNames:[],
            dataToDisplay: [],
            chartdata: {'Monday':2,'Tuesday': 5, 'Wednesday': 2, 'Thursday': 5, 'Friday':6},
            chartdata2: [],

                    loaded: false,
        inventoryNames1: [],
        dataToDisplay1: [],
        dataToDisplay2: [],

        
       

        option: {
             angleAxis: {
                type: 'category',
                data: ['loading'],
                
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
                data: ['Current', 'Pending'],
                textStyle: {
                    fontSize: 12,
                    fontStyle: 'italic'
                }
            }
      
        }, 
            
        }
    },

    mounted: function() {
        this.consolidateItemSupplies()
        this.updateAll()
        this.suppliesOverview()
      this.loaded = true

    },
    methods:{

        async suppliesOverview(cat){

            this.inventoryNames1 = []
            this.dataToDisplay1 = []
            this.dataToDisplay2 = []

            console.log(cat)
            var itemSuppliesgetter = null
            if (cat == "None"){
                itemSuppliesgetter =  getDocs(query(collection(db, "ItemSupplies")) );
            } else {
                itemSuppliesgetter =  getDocs(query(collection(db, "ItemSupplies"), where("Category" , "==", cat)) );
            }
            var itemfiltered = []

            try {
                const querySnapshot = await itemSuppliesgetter;
                querySnapshot.forEach((doc) => {
                itemfiltered.push(doc.data())
                });
            console.log("Item filter shoed")
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


            var itemSuppliesgetter2 = null
            if (cat == "None"){
                 itemSuppliesgetter2 =  getDocs(query(collection(db, "PendingArrival")) );
            } else {
                itemSuppliesgetter2 =  getDocs(query(collection(db, "PendingArrival"), where("Category" , "==", cat)) );
            }

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


            console.log("OUTCOME")
            console.log(this.inventoryNames1)
            console.log(this.dataToDisplay1)
            console.log(this.dataToDisplay2)
            


        },

        

        updateMe: function() {
            this.chartdata = {'Monday':Math.random(),'Tuesday': 5, 'Wednesday': Math.random(), 'Thursday': 5, 'Friday':6}
        },
        
        updateAll: function() {
            var cat = "None"
            this.consolidateItemSupplies(cat)
            this.suppliesOverview(cat)
            //console.log([JSON.parse(JSON.stringify(this.dataToDisplay))] )
            this.chartdata2 = this.dataToDisplay //[['Blueberry' ,Math.random ()*30], ['Strawberry' , 23],['Balckberry' , 23]]
        },

        updateDME: function() {
            var cat = "DME"
            this.consolidateItemSupplies(cat)
            this.suppliesOverview(cat)
            //console.log([JSON.parse(JSON.stringify(this.dataToDisplay))] )
            this.chartdata2 = this.dataToDisplay //[['Blueberry' ,Math.random ()*30], ['Strawberry' , 23],['Balckberry' , 23]]
        },

        updateSurgery: function() {
            var cat = "Surgery"
            this.consolidateItemSupplies(cat)
            this.suppliesOverview(cat)
            //console.log([JSON.parse(JSON.stringify(this.dataToDisplay))] )
            this.chartdata2 = this.dataToDisplay //[['Blueberry' ,Math.random ()*30], ['Strawberry' , 23],['Balckberry' , 23]]
        },

        updateCOVID: function() {
            var cat = "COVID19"
            this.consolidateItemSupplies(cat)
            this.suppliesOverview(cat)
            //console.log([JSON.parse(JSON.stringify(this.dataToDisplay))] )
            this.chartdata2 = this.dataToDisplay //[['Blueberry' ,Math.random ()*30], ['Strawberry' , 23],['Balckberry' , 23]]
        },


        async consolidateItemSupplies( filtercategory ){
            this.inventoryNames = []
            this.dataToDisplay = []
            var itemSuppliesgetter =  getDocs(query(collection(db, "ItemSupplies")) );

            var itemfiltered = []

            try {
                const querySnapshot = await itemSuppliesgetter;
                querySnapshot.forEach((doc) => {
                itemfiltered.push(doc.data())
                });
            console.log("HERE")
            console.log(itemfiltered)
            //console.log(itemfiltered[3])
        
            } catch (error) {
                console.error("Error checking document: ", error)
            }
            
            for (let i =0; i < itemfiltered.length; i++ ){

                if (filtercategory != "None"){
                    if (itemfiltered[i]['Category'] == filtercategory ){
                        this.inventoryNames.push( itemfiltered[i]['Item_Name'])
                        var qty = itemfiltered[i]['Order_Quantity']
                        var name = itemfiltered[i]['Item_Name']
                        console.log(qty, name)
                        var maker = [name, qty]
                        this.dataToDisplay.push( maker)
                    }
                } else {
                    this.inventoryNames.push( itemfiltered[i]['Item_Name'])
                    qty = itemfiltered[i]['Order_Quantity']
                    name = itemfiltered[i]['Item_Name']
                    maker = [name, qty]
                    this.dataToDisplay.push( maker)

                }
            }
            
        }

    }
}
</script>

<style scoped>

    .chart {
    height: 300px;
    
    }

    .user{
        margin: auto;
        border: 3px solid grey;
    }

    #chartPUI {
        font-family : Avenir, Helvetica , Arial, sans-serif ;
        -webkit-font-smoothing : antialiased ;
        -moz-osx-font-smoothing : grayscale ;
        text-align : center ;
        color: #2c3e50 ;
        margin-top : 60px;
    }

    #bt1, #bt2, #bt3, #bt4{ 
      padding: 5px 10px;
      border: 2px;
      -webkit-border-radius: 5px;
      cursor: pointer;
      text-align: center;
      color: blue;
    }
    .btnContainer{
        margin-left: 30px;
    }

    .qtyInsights{
    }


</style>