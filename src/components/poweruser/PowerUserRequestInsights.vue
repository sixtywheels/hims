<template>



    <div class = "requestInsights">
        <!-- <h1>Line Chart </h1>
        <button @click="updateMe ()">Click to update the Line chart </button >
        <line-chart class = 'user' width =500px :data = "chartdata"></line-chart>

        <h1>Pie Chart </h1>
        <button @click="updateMe2 ()"> Click to update the Pie Chart</button ><br><br>
        <pie-chart class ="user" width=500px :data="chartdata2"></pie-chart>  

        <h1>Bar Chart </h1>-->
        <div class = "btnContainer">
        <button id = "bt1" @click="updateAll()"> View All</button >

        </div>
        <pie-chart  class ="user" width=400px :data="chartdata2" @load="updateAll()"></pie-chart >


 
    </div>

</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query} from "firebase/firestore"
const db = getFirestore(firebaseApp);


export default {

    data(){
        return{
            inventoryNames:[],
            dataToDisplay: [],
            chartdata: {'Monday':2,'Tuesday': 5, 'Wednesday': 2, 'Thursday': 5, 'Friday':6},
            chartdata2: [],
            
        }
    },

    mounted: function() {
        //this.consolidateItemDisbursed()
        this.updateAll()

    },
    methods:{
        updateMe: function() {
            this.chartdata = {'Monday':Math.random(),'Tuesday': 5, 'Wednesday': Math.random(), 'Thursday': 5, 'Friday':6}
        },
        
        updateAll: function() {
            console.log("press here")
            this.consolidateItemDisbursed()
            //console.log([JSON.parse(JSON.stringify(this.dataToDisplay))] )
            console.log(this.dataToDisplay)
            this.chartdata2 = this.dataToDisplay //[['Blueberry' ,Math.random ()*30], ['Strawberry' , 23],['Balckberry' , 23]]
        },


        async consolidateItemDisbursed( ){
            this.inventoryNames = []
            this.dataToDisplay = []
            var itemDisbursedgetter =  getDocs(query(collection(db, "ItemDisbursed")) );

            var itemfiltered = []

            try {
                const querySnapshot = await itemDisbursedgetter;
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
                if (this.inventoryNames.indexOf(itemfiltered[i]['Item_Name']) !== -1 ) {
                    console.log("HAVE")
                    console.log(this.dataToDisplay)
                    for (let k =0; k < this.dataToDisplay.length; k++ ){
                        if ( this.dataToDisplay[k][0] == itemfiltered[i]['Item_Name']) {
                            this.dataToDisplay[k][1] += itemfiltered[i]['Order_Quantity']
                        }
                    }

                } else {
                    console.log(itemfiltered[i]['Item_Name'])
                    this.inventoryNames.push( itemfiltered[i]['Item_Name'])
                    var qty = itemfiltered[i]['Order_Quantity']
                    var name = itemfiltered[i]['Item_Name']
                    console.log(qty, name)
                    var maker = [name, qty]
                    this.dataToDisplay.push( maker)

                }
            }
            console.log(this.dataToDisplay)
            
        }

    }
}
</script>

<style scoped>
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

    .requestInsights{
    }


</style>