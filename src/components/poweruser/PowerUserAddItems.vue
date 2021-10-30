<template>
<div>
  <div><power-user-navigation></power-user-navigation></div>
   <div id="vcard">
            <v-card id="mycard" width="700">
                <div id="content">
                    <v-card-title>Add New Items to Inventory</v-card-title>
                    <v-card-text>

                      <v-form ref="myform">
                            
                            <v-text-field
                                v-model="this.idLoop"
                                label="Serial Number"
                                readonly
                            ></v-text-field>
                            <v-text-field label="Item Name" v-model="InputItemName"></v-text-field>
                            <v-select
                                v-model="SelectedCategory"
                                :items="itemCategory"
                                
                                label="Category"
                                required

                            ></v-select>

                            <!-- <br v-if = "this.SelectedCategory == 'None of these'"> -->

                            <span>
                              <span v-if="this.SelectedCategory == 'Add new Category'">
                                <v-text-field label="New Category" v-model="InputNewCategory"></v-text-field>
                              </span>
                            </span>

                            <v-text-field label="Image Link" v-model="InputImageLink"></v-text-field>
                            <v-text-field label="Quantity of New Stock" v-model="InputQuantity"></v-text-field>
                            <v-text-field label="Min. Stock Level" v-model="InputThreshold1"></v-text-field>
                            <v-text-field label="Restock Level" v-model="InputThreshold2"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="#B2DFDB" class="mr-4" v-on:click="savetofs()">Add Items</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
  </div>
    </div>
</template>

<script>
import PowerUserNavigation from './PowerUserNavigation'
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc , setDoc} from "firebase/firestore"
const db = getFirestore(firebaseApp);

export default {
  
    name:"PowerUserAddItems",

    data: () =>  { //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
      categorySelection: '',

      SelectedCategory: '',
      itemCategory: [],
      InputItemName: '',
      InputNewCategory: '',
      InputImageLink: '',
      InputQuantity: null,
      InputThreshold1: null,
      InputThreshold2: null,


      originalitemList: [],
      //selectedCategory: null,
      itemIds: [],
      idLoop: null,
      }
    },

      components: {
        PowerUserNavigation: PowerUserNavigation,
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
              this.itemCategory.push("Add new Category")
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
        var a = this.InputItemName;
        var b = this.SelectedCategory;
        console.log(h)
        console.log(a)
        console.log(b)


        var c = this.InputNewCategory
        console.log(c)

        var d = this.InputImageLink;
        var e = this.InputQuantity;
        var f = this.InputThreshold1;
        var g = this.InputThreshold2;
      
        console.log(d)
        console.log(e)
        console.log(f)
        console.log(g)

        //Empty Image Link
        if (d == ""){
          d = "-"
        }

        try{
            var catConfirm = c
            if (c == '' ){
                catConfirm = b
        } 
        console.log(catConfirm)

            const docRef = await setDoc(doc(db, "ItemSupplies", h), {Category: catConfirm, Item_Id: parseInt(h), ImgLink: d, Item_Name: a, Order_Quantity: parseInt(e), Threshold1: parseInt(f), Threshold2: parseInt(g)})
            console.log(docRef)
            this.$refs.myform.reset()
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

    label{
      text-align: right;
      padding-right: 50px ; 
    }

    .formli{
        display: inline-block;
        text-align: right;
    }

    form{
        text-align: center;
        margin: auto;
    }

    input:hover {
        box-shadow: 3px 3px purple;
        border-radius: 2px;
    }

    #id{
      text-align: right;
    }


    .save{
        text-align: center;
    }

</style>