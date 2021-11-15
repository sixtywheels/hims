<template>
<div>
  <div><power-user-navigation></power-user-navigation></div>
  <div style="padding-left: 10px; padding-right: 10px; padding-top: 10px;">
    <div class="vcard">

              <v-card id="mycard">
                <div id="content">
                    <v-card-title>Add New Items to Inventory</v-card-title>
                    <v-card-text>

                      <v-form ref="myform">
                            
                            <v-text-field
                                v-model="this.idLoop"
                                label="Serial Number"
                                readonly
                            ></v-text-field>
                            <v-text-field label="New Item Name" v-model="InputItemName"></v-text-field>
                            <v-select
                                v-model="SelectedCategory"
                                :items="itemCategory"
                                
                                label="Category"
                                required

                            ></v-select>

                            <span>
                              <span v-if="this.SelectedCategory == 'Add new Category'">
                                <v-text-field label="New Category" v-model="InputNewCategory"></v-text-field>
                              </span>
                            </span>

                            <v-text-field label="Image Link" v-model="InputImageLink"></v-text-field>
                            <v-text-field label="Initial Quantity of New Item" v-model="InputQuantity"></v-text-field>
                            <v-text-field label="Min. Stock Level" v-model="InputThreshold1"></v-text-field>
                            <v-text-field label="Restock Level" v-model="InputThreshold2"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="#B2DFDB" class="mr-4" v-on:click="savetofs()">Add Item</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
      </div>

      <div class="vcard">
        <v-card>
              <v-card-title>Add Departments</v-card-title>
              <v-card-text>

                      <v-form ref="myform">
                          
                            <v-select
                                :items="DepartmentList"
                                
                                label="Current Departments in System"
                                required

                            ></v-select>

                            <v-text-field label="New Department" v-model="NewDepartment"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="#B2DFDB" class="mr-4" v-on:click="savedepttofs()">Add Department</v-btn>
                    </v-card-actions>

        </v-card>
      </div>
</div>
<div class="float-container">
  
</div>
  </div>
</template>

<script>
import PowerUserNavigation from './PowerUserNavigation'
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc , setDoc, query, where } from "firebase/firestore"
const db = getFirestore(firebaseApp);
import {getAuth, onAuthStateChanged} from  "firebase/auth";


export default {
  
    name:"PowerUserAddItems",

    data: () =>  { 
      //https://renatello.com/dynamic-drop-down-list-in-vue-js/
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
      
      authemail: '',
      puverified: false,
      DepartmentList: [],
      NewDepartment: '',

      originalitemList: [],
      itemIds: [],
      idLoop: null,
      }
    },

    components: {
        PowerUserNavigation: PowerUserNavigation,
    },

    mounted: function() {
      this.fetchDepartments()
      this.fetchItemsCategories() //console.info('mounted, itemListCategories:', this.itemCategory)
      this.fetchLastItemId()

            
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if(user) {
          this.user = user;
          this.authemail = user['email']
        }
      })
      this.verifyPU()


    }, 

    methods: {

      async verifyPU(){
          console.log("VERIFYING PU....")
            const pugetter =  getDocs(query(collection(db, "powerusers") ) );

            var pufiltered = []
            console.log(pufiltered)

            try {
                const querySnapshot = await pugetter;
                querySnapshot.forEach((doc) => {
                pufiltered.push(doc.data())
                });
                
                for(let i =0; i < pufiltered.length ; i++){
                  if(pufiltered[i]['email'] == this.authemail){
                      console.log("WELCOME IN!")
                      this.puverified = true
                  } 
                }
            }catch (error) {
                console.error("Error checking document: ", error)
            }

            console.log(this.puverified)
            if(this.puverified == false){
                console.log("ROUTE THIS AWAY!!!")
            }
        },


    async fetchItemsCategories () {
        this.itemCategory = []
        this.originalitemList = []

        console.log("FETCHING ITEM CATEGORY")
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

      async fetchLastItemId () {
        console.log("FETCH TRANSACTION ID")
        const query = getDocs(collection(db,"ItemSupplies"))
          try {
              const { docs } = await query
              this.itemIds = docs.map(doc => {
                const { id } = doc
                const data = doc.data()[0]
                return { id, ...data }
              })
              
              if (this.itemIds.length == 0) {
                this.idLoop = 0
              } else {

                //Literally Sort out 10 and 1
                var itemIdsSorted = []
                for (let k = 0; k < this.itemIds.length; k++) {
                  itemIdsSorted.push(parseInt(this.itemIds[k]['id']))
                }
                itemIdsSorted.sort(function(a, b){return a-b})
                var checking = itemIdsSorted[itemIdsSorted.length - 1]
                
                if ( isNaN(checking) ) {
                  this.idLoop = 0
                } 
                else {
                  this.idLoop = parseInt(checking) + 1
                }
              }
          } catch (error) {
            console.error("Error adding document: ", error)
          }
        },

      async savetofs(){
        console.log("SAVING")
        var h = this.idLoop.toString();
        var a = this.InputItemName;
        var b = this.SelectedCategory;
        var c = this.InputNewCategory
        var d = this.InputImageLink;
        var e = this.InputQuantity;
        var f = this.InputThreshold1;
        var g = this.InputThreshold2;
      
        //Empty Image Link
        if (d == ""){
          d = "-"
        }

        try{
            var catConfirm = c
            if (c == '' ){
                catConfirm = b
        } 

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

        async fetchDepartments(){
            console.log("FETCH DEPARTMENTS")
            let z  = await getDocs(collection(db, "Departments"));
            
            z.forEach((docs) => {
                let yy = docs.data()
                var department = yy.Department
                console.log("Pulled from db: ", department)
                this.DepartmentList.push(department)
                }
            )
        },

        async savedepttofs(){
          if (this.NewDepartment == "") {
                alert("Please fill up the fields!")
          } else { 
            console.log("Field is: ", this.NewDepartment.empty)
            var currentDepartment = await getDocs(query(collection(db, "Departments"), where("Department", "==", this.NewDepartment)));
            if (currentDepartment.empty) {
              await setDoc(doc(db, "Departments", this.NewDepartment + " Department"), {
                Department: this.NewDepartment
              })
              .then(() => {
                alert("New department (" + this.NewDepartment + " Department) added successfully!");
              })
              .catch(error => {
                alert(error.message);
              });
            } else {
              alert("An existing department already exists for: " + this.NewDepartment)
            }
          }
        }
    },
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

/* https://coder-coder.com/display-divs-side-by-side */
    .float-container {
    border: 3px solid #fff;
    padding: 20px;
}

.v-card {
    width: 50%;
    float: left;
    padding: 20px;
    border: 2px solid black;
}  


</style>