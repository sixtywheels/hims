<template>
<div>
  <!-- <div><power-user-navigation></power-user-navigation></div> -->
  
   <div id="vcard">
            <v-card id="mycard" width="300">
                <div id="content">
                    <v-card-title>Order Supply Form</v-card-title>
                    <v-card-text>

                      <v-form ref="form3">
                            
         
                           
                            <v-select
                                v-model="InputItemName"
                                :items="itemList"
                                
                                label="Item Name"
                                @click="clickItems($event)"
                                @change="changeItems($event)"
                                required

                            ></v-select>

                            
                            <span>
                              <span v-if="this.SelectedCategory == 'Add new Category'">
                                <v-text-field label="New Item Name" v-model="InputItemName"></v-text-field>
                              </span>
                            </span>

 
                            <v-select
                                v-model="SelectedCategory"
                                :items="itemCategory"
                                
                                label="Category"
                                @change="changeCategory($event)"
                                @blur="changeCategory($event)"
                                required

                            ></v-select>

                            <!-- <br v-if = "this.SelectedCategory == 'None of these'"> -->

                            <span>
                              <span v-if="this.SelectedCategory == 'Add new Category'">
                                <v-text-field label="New Category" v-model="InputNewCategory"></v-text-field>
                              </span>
                            </span>

                            <!-- <v-text-field label="Image Link" v-model="InputImageLink"></v-text-field> -->
                            <v-text-field label="Quantity of New Stock" v-model="InputQuantity"></v-text-field>
                            <!-- <v-text-field label="Min. Stock Level" v-model="InputThreshold1"></v-text-field>
                            <v-text-field label="Restock Level" v-model="InputThreshold2"></v-text-field> -->
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="#B2DFDB" class="mr-4" v-on:click="savetofs()">Add Items</v-btn>
                        <v-btn color="#B2DFDB" class="mr-4" v-on:click="resetSearch()">Reset Search</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
  </div>
    </div>
</template>

<script>

import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc , setDoc, query} from "firebase/firestore"
const db = getFirestore(firebaseApp);
import {getAuth, onAuthStateChanged} from  "firebase/auth";


export default {
  
    name:"PowerUserSupplyOrderForm",

    mounted(){

      this.fetchItems () 
      this.fetchItemsCategories()
      //console.info('mounted, itemListCategories:', this.itemCategory)
      this.fetchTransId("PendingArrival")

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if(user) {
          this.user = user;
          this.authemail = user['email']
        }
      })
      this.verifyPU()
    },
    
    data: () =>  { 
      //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
      categorySelection: '',

      SelectedCategory: null,
      itemCategory: [],
      InputItemName: '',
      InputNewCategory: '',
      InputImageLink: '',
      InputQuantity: null,
      InputThreshold1: null,
      InputThreshold2: null,
      itemList: [],

      itemNamelist: [],  
      originalitemList: [],
      itemIds: [],
      idLoop: null,

      authemail: '',
      puverified: false,
      poweruserId: '',

      }
    },

    methods: {
        resetSearch(){
        this.$refs.form3.reset()
        this.weblinkhere = null
        console.log("SEARCH HAS BEEN RESET")
        },

        async verifyPU(){
            console.log("VERIFYING POWER USER....")
            const pugetter =  getDocs(query(collection(db, "powerusers") ) );
            var pufiltered = [] //console.log(pufiltered)
            try {
                const querySnapshot = await pugetter;
                querySnapshot.forEach((doc) => {
                pufiltered.push(doc.data())
                });
                for(let i =0; i < pufiltered.length ; i++){
                  if(pufiltered[i]['email'] == this.authemail){
                      this.puverified = true
                      this.poweruserId = pufiltered[i]['staffID']
                      console.log("WELCOME IN! THIS IS MY AUTH STAFF ID: " + this.poweruserId)
                  } 
                }
            }catch (error) {
                console.error("Error checking document: ", error)
            }
            //console.log(this.puverified)
            if(this.puverified == false){
                console.log("ROUTE THIS AWAY!!!")
            }
        },

        async fetchItems () {
        const query = getDocs(collection(db,"ItemSupplies"))
            try {
                const { docs } = await query
                this.originalitemList = docs.map(doc => {
                  const { id } = doc
                  const data = doc.data()
                  return { id, ...data }
                })

                this.itemList = this.originalitemList

                //Add Item Categories
                this.itemCategory = [...new Set(this.originalitemList.map( x => x['Category']))];  

            } catch (error) {
              console.error("Error adding document: ", error)
            }
        },

        async fetchItemsCategories () {
        
        this.itemCategory = []
        this.originalitemList = []

        console.log("Fetching Item Categories...")
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
 
          } catch (error) {
            console.error("Error adding document: ", error)
          }
        },

        async fetchTransId(nameDB) {
            var transidList = []
            var transloop = 0

            console.log("Fetching Transaction ID...")
            const query = getDocs(collection(db, nameDB))
                try {
                    const { docs } = await query
                    transidList = docs.map(doc => {
                        const { id } = doc
                        const data = doc.data()[0]
                        return { id, ...data }
                    })

                    if (transidList.length == 0) {
                        transloop = 0
                        this.idLoop = transloop
                    } else {
                        //Literally Sort out 10 and 1 to keep array in increasing order
                        var transIdsSorted = []
                        for (let k = 0; k < transidList.length; k++) {
                        transIdsSorted.push(parseInt(transidList[k]['id']))
                        }
                        transIdsSorted.sort(function(a, b){return a-b})
                        var checking = transIdsSorted[transIdsSorted.length - 1]
                        //console.log(checking)

                        if ( isNaN(checking) ) {
                        transloop = 0
                        this.idLoop = transloop
                        //console.log(transloop)
                        } else {
                        transloop = parseInt(checking)+1
                        this.idLoop = transloop
                        //console.log(transloop)
                        }
                    }
                    //console.log("whats my Item Disburse id: " + transloop.toString())
                    return transloop

                } catch (error) {
                    console.error("Error adding document: ", error)
                }
        },
 
        changeCategory(){
          this.fetchTransId("PendingArrival")
          let itemListupdate = []
          for (let i in this.originalitemList) {
            var theItem = this.originalitemList[i]
            if ( theItem['Category'] == this.SelectedCategory ) {
                itemListupdate.push(theItem['Item_Name'])
              }
            }
          this.itemList = itemListupdate
          this.weblinkhere = null;
          this.InputItemName = null;
        },

        clickItems(){
          this.fetchTransId("PendingArrival")
          let itemListupdate = []

          if (this.SelectedCategory == null){
            for (let i in this.originalitemList) {
            var theItem = this.originalitemList[i]
            itemListupdate.push(theItem['Item_Name'])
          }
          this.itemList = itemListupdate
          this.weblinkhere = null;
          }


        },

        changeItems(){
          this.fetchTransId("PendingArrival")
          for (let i in this.originalitemList) {
            var theItem = this.originalitemList[i]
            if ( theItem['Item_Name'] == this.InputItemName ) {
                this.SelectedCategory = theItem['Category'] 
                this.weblinkhere = theItem['ImgLink'] ;
              }
            }
      
        },

        addZero(dtinput){
          //For Datetime configuration
          var result = dtinput.toString()
          if (dtinput < 10) { 
            result = "0" + dtinput.toString() 
          }
          return result
        },

        async savetofs(){
            this.itemNamelist = []
            this.originalitemList = []
            const query = getDocs(collection(db,"ItemSupplies"))
    
            try {
                const { docs } = await query
                this.originalitemList = docs.map(doc => {
                  const { id } = doc
                  const data = doc.data()
                  return { id, ...data }
                })

                this.itemNamelist = [...new Set(this.originalitemList.map( x => x['Item_Name']))];

            } catch (error) {
              console.error("Error adding document: ", error)
            }

            console.log("SAVING RECORDS...")
            this.fetchTransId ("PendingArrival")
            var h = this.idLoop.toString();
            var a = this.InputItemName;
            var b = this.SelectedCategory;
            var c = this.InputNewCategory
            var d = this.InputImageLink;
            var e = this.InputQuantity;
            var f = this.InputThreshold1;
            var g = this.InputThreshold2;

            //For Empty Image Link
            if (d == ""){
              d = "-"
            }
                        
            var x8 = this.poweruserId
            var today = new Date();
            var date = this.addZero(today.getDate()) + '-' + this.addZero( (today.getMonth()+1) )+ '-' + today.getFullYear();
            var time = this.addZero(today.getHours()) + ":" + this.addZero(today.getMinutes()) + ":" + this.addZero(today.getSeconds());
            var dateTime = date+' '+time;
                            
            try{
                var catConfirm = c
                if (c == '' ){
                    catConfirm = b
                }    

                if ( this.itemNamelist.includes(a) ){
                  if ( d == null ) {
                    d = this.originalitemList[0]['ImgLink']
                  }

                  if ( isNaN(f) || f == null ) {
                    f = this.originalitemList[0]['Threshold1']
                  }

                  if ( isNaN(g)  || g == null ) {
                    g = this.originalitemList[0]['Threshold2']
                  }

                  this.itemIds = []
                  await this.fetchTransId("PendingArrival")
                  h = this.idLoop.toString();
                  const docRef = await setDoc(doc(db, "PendingArrival", h), {Trans_id: parseInt(h), Category: catConfirm, Timestamp: dateTime, Item_Id: parseInt(h),  Item_Name: a, Topup_Quantity: parseInt(e), Officer: x8})
                  console.log(docRef)

                  this.$refs.form3.reset()
                  this.$emit("added")
                  this.fetchItemsCategories()
                  this.fetchTransId ("PendingArrival")
                  alert("You have Ordered: " + e.toString() + " " + a)

                  this.itemNamelist = []
                  this.originalitemList = []
                  

                } else {
                  
                  if (a != null && c != null && e != null && f != null && g != null ){
                    //Check if the input are not empty before adding into the order account.
                    this.itemIds = []
                    await this.fetchTransId("ItemSupplies")
                    h = this.idLoop.toString();
                    await setDoc(doc(db, "ItemSupplies", h), {Category: catConfirm, ImgLink: d, Item_Id: parseInt(h),  Item_Name: a, Order_Quantity: parseInt(e), Threshold1: parseInt(f), Threshold2: parseInt(g)})
                
                    //##REPEAT//
                    this.itemIds = []
                    await this.fetchTransId("PendingArrival")
                    h = this.idLoop.toString();
                    const docRef = await setDoc(doc(db, "PendingArrival", h), {Trans_id: parseInt(h), Category: catConfirm, Timestamp: dateTime, Item_Id: parseInt(h),  Item_Name: a, Topup_Quantity: parseInt(e), Officer: x8})
                    console.log(docRef)

                    this.$refs.form3.reset()
                    this.$emit("added")
                    this.fetchItemsCategories()
                    this.fetchTransId ("PendingArrival")
                    alert("You have Ordered: " + e.toString() + " " + a)

                    this.itemNamelist = []
                    this.originalitemList = []
                
                  } else {
                    alert("Please make sure there are no Empty Inputs" )
                  }

                }

            } catch (error) {
                console.error("Error adding document: ", error)
            }

            this.$refs.form3.reset()
            this.weblinkhere = null
            console.log("RESETTING FORM OUTLOOK")

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