<template>
    <div id = "container">
        <form id = "myform">
            <h2>Add Items </h2>
            
            <div class = "formli">

                <label for="id"> Item S/N: </label>
                <h3 id = "id"> {{ this.idLoop}} </h3> <br>
                
                <label for="itemName"> Item Name </label>
                <input type="text" id="itemName" required="" placeholder = "Enter Item Name"> <br><br>
        
                <label> Category </label>
                <select id="categorychoosenmain" class="form-control" v-model="categorySelection" required @change="fetchItemsCategories($event)">
                    <option value="" selected disabled>Choose</option>
                    <option value="None of these"  >None of these</option>
                    <option id="categorychoosen" v-for="cat in itemCategory" :value="cat" :key="cat"> {{ cat }}</option> 
                </select> <br>

                <!--https://stackoverflow.com/questions/34621142/vuejs-display-other-input-fields-based-on-selected-value-from-dropdown -->
                <br v-if = "categorySelection == 'None of these'">
                <label v-if = "categorySelection == 'None of these'" for="newCategoryInput">New Category </label>
                <input v-if = "categorySelection == 'None of these'"  type="text" id="newCategoryInput" required="" placeholder = "Enter New Category"> <br><br>

                <label for="newImageLink"> Image Link: </label>
                <input type="text" id="newImageLink" required="" placeholder = "Enter Imgage Link"> <br><br>
                
                <label for="quant1"> Buy Quantity: </label>
                <input type="number" id="quant1" required="" placeholder = "Quantity"> <br><br>

                <label for="thresh1"> Threshold 1 (Low Stock Level): </label>
                <input type="number" id="thresh1" min=0 max =1 required="" placeholder = "Enter restock alert"> <br><br>

                <label for="thresh2"> Threshold 2 (Healthy Limit): </label>
                <input type="number" id="thresh2" min=0 max =1  required="" placeholder = "Enter healthy limit"> <br><br>


                <div class = "save">
                    <button id = "savebutton" type = "button" v-on:click = "savetofs()"> Save </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc , setDoc} from "firebase/firestore"
const db = getFirestore(firebaseApp);

export default {
  
    name:"PowerUserAddItems",

    data: () =>  { //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
      categorySelection: '',
      originalitemList: [],
      itemCategory: [],
      selectedCategory: null,
      itemIds: [],
      idLoop: null,
      }
    },

    mounted: function() {
      this.fetchItemsCategories()
      console.info('mounted, itemListCategories:', this.itemCategory)
      this.fetchLastItemId()
    }, 

    methods: {

        async fetchItemsCategories () {
        
        this.itemCategory = []
        this.originalitemList = []

        console.log("FetchItemCategories")
        const query = getDocs(collection(db,"ItemSupplies"))
  
          try {
              const { docs } = await query
              this.originalitemList = docs.map(doc => {
                const { id } = doc
                const data = doc.data()
                return { id, ...data }
              })

              //Add Item Categories
              this.itemCategory = [...new Set(this.originalitemList.map( x => x['Category']))];
              console.log('Loaded Categories', this.itemCategory)
 

          } catch (error) {
            console.error("Error adding document: ", error)
          }
        },

        async fetchLastItemId () {
        console.log("FetchLastItemId")
        const query = getDocs(collection(db,"ItemSupplies"))
          try {
              const { docs } = await query
              this.itemIds = docs.map(doc => {
                const { id } = doc
                const data = doc.data()[0]
                return { id, ...data }
              })

              console.log('Loaded Ids', this.itemIds)
              
              if (this.itemIds.length == 0) {
                this.idLoop = 0
              } else {

                //Literally Sort out 10 and 1
                var itemIdsSorted = []
                for (let k = 0; k < this.itemIds.length; k++) {
                  itemIdsSorted.push(parseInt(this.itemIds[k]['id']))
                }
                itemIdsSorted.sort(function(a, b){return a-b})
                console.log("Item Sorted List")
                console.log(itemIdsSorted)
                //

                var checking = itemIdsSorted[itemIdsSorted.length - 1]
                
                if ( isNaN(checking) ) {
                  this.idLoop = 0
                  console.log(this.idLoop)
                } 
                else {
                  this.idLoop = parseInt(checking) + 1
                  console.log(this.idLoop)
                }
              }
              
              //console.log("whats my latest itemList: ")
              //console.log(this.itemIds);
              console.log("whats my saving itemid: " + this.idLoop.toString())

          } catch (error) {
            console.error("Error adding document: ", error)
          }
        },



        

        async savetofs(){
        console.log("Saving")
        var h = this.idLoop.toString();
        var a = document.getElementById("itemName").value;
        var b = document.getElementById("categorychoosen").value;
        console.log(h)
        console.log(a)
        console.log(b)

        //Error new category is null
        var c = document.getElementById("newCategoryInput").value;
        if (c == null) {
          c = ""
        }
        console.log(c)

        var d = document.getElementById("newImageLink").value;
        var e = document.getElementById("quant1").value;
        var f = document.getElementById("thresh1").value;
        var g = document.getElementById("thresh2").value;
      
        console.log(d)
        console.log(e)
        console.log(f)
        console.log(g)

        if (d == ""){
          d = "-"
        }

        try{

            var catConfirm = b
            if (c != "" || c != null ){
                catConfirm = c
            } 

            const docRef = await setDoc(doc(db, "ItemSupplies", h), {Category: catConfirm, Item_Id: parseInt(h), ImgLink: d, Item_Name: a, Order_Quantity: parseInt(e), Threshold1: parseInt(f), Threshold2: parseInt(g)})
            console.log(docRef)
            document.getElementById('myform').reset();
            this.$emit("added")
            this.fetchItemsCategories()
            this.fetchLastItemId ()
            alert("You have added: " + a)

        } catch (error) {
            console.error("Error adding document: ", error)
        }
        },

    }
}
</script>

<style scoped>

    h2{
        background-color:yellow;
    }

    .formli{
        display: inline-block;
        text-align: right;
    }

    form{
        text-align: center;
        align-items: center;
        margin: auto;
    }

    input:hover {
        box-shadow: 3px 3px purple;
        border-radius: 2px;
    }

    .save{
        text-align: center;
    }

</style>