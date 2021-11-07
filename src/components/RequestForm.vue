<template>

<div>
   <!-- <div><power-user-navigation></power-user-navigation></div> -->
  <!-- <h2>Order Items </h2> -->
  <br>

<!--:vertical="vertical" -->
  <v-snackbar
      v-model="snackbar"
      
      :timeout="timeout"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click= "snackbar = false" 
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  

  <div class = "containerLeft" >
    <v-row justify="center">
    <v-img id="exactImg" 
      v-model="weblinkhere"
      :src= weblinkhere
      max-width="500"
      max-height="500"
      @change="changeItems($event)"
      
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </v-row>
  </div>
  
  <!-- 
  <div id="itemImg"  @change="changeItems($event)" class = "containerLeft"  >
  <br>
  <img id="exactImg" :src = this.weblinkhere alt = "No Picture Available" />
  </div>
  -->

    <div class = "containerRight">

            <v-card id="test" >
                <div id="content">
                    <v-card-title>Request Form</v-card-title>
                    <v-card-text>
                      <v-form ref="form2">
                            <v-select
                                v-model="selectedCategory"
                                :items="itemCategory"
 
                                label="Category"
                                required
                                @change="changeCategory($event)"
                                @blur="changeCategory($event)"
                            ></v-select>

                            <v-select
                                v-model="selectedItem"
                                :items="itemList"
                                label="Items"
                                required
                                @click="clickItems($event)"
                                @change="changeItems($event)"

                            ></v-select>

                            <v-text-field label="Quantity" v-model="quantity"></v-text-field>
                            <v-textarea
                              v-model="remarks"
                            >
                              <template v-slot:label>
                                <div>
                                  Remarks <small>(optional)</small>
                                </div>
                              </template>
                            </v-textarea>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="#B2DFDB" class="mr-4" v-on:click="savetofs()">Request</v-btn>
                        <v-btn color="#B2DFDB" class="mr-4" v-on:click="resetSearch()">Reset Search</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
  </div>
</div>

</template>



<script>
//import PowerUserNavigation from '../components/poweruser/PowerUserNavigation'
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc , setDoc, query, where } from "firebase/firestore"
const db = getFirestore(firebaseApp);

export default {
    
    name:"UserRequestComponent",

    data: () =>  { //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
      snackbar: false,
      text: 'Empty Bar',
      timeout: 3000,

      refreshComp:0,
      originalitemList: [],
      itemList: [],
      selectedItem: null,
      itemNumber: null, 
      storeIndex: null,
      weblinkhere: null,
      weblinkCropped: null,
      transidList: [],
      transloop: null,
      itemCategory: [],
      selectedCategory: null,
      select: '',
      quantity: null,
      remarks: '-',
      item_Name: '',
      itemselector: [],
      }
    },

    components: {
        //PowerUserNavigation: PowerUserNavigation,
    },

    mounted: function() {
      this.fetchItems()
      console.info('mounted, itemList:', this.itemList) 
      this.fetchTransId()
      console.info('mounted, transidList:', this.transidList) 
    },

    computed: {
      items: function() {
          return this.itemList
      },

      ids: function() {
          return this.transidList
      }

    },

    methods: {

    async fetchItems () {
      //https://stackoverflow.com/questions/59772759/uncaught-typeerror-db-collection-is-not-a-function-for-a-real-time-database-in
      //Careful! Fire database and Firestore are different! Firestore needs collection, getDocs and does not have query.get()
      const query = getDocs(collection(db,"ItemSupplies"))
  
          try {
              const { docs } = await query
              this.originalitemList = docs.map(doc => {
                const { id } = doc
                const data = doc.data()
                return { id, ...data }
              })

              this.itemList = this.originalitemList
              console.log("Now i am looking at:")
              console.log(this.itemList['id'])

              //Add Item Categories
              this.itemCategory = [...new Set(this.originalitemList.map( x => x['Category']))];
              console.log('Loaded Items', this.originalitemList)
              console.log('Loaded Categories', this.itemCategory)
 

          } catch (error) {
            console.error("Error adding document: ", error)
          }
      },

      

      async fetchTransId () {
      //https://stackoverflow.com/questions/59772759/uncaught-typeerror-db-collection-is-not-a-function-for-a-real-time-database-in
      //Careful! Fire database and Firestore are different! Firestore needs collection, getDocs and does not have query.get()
      const query = getDocs(collection(db,"Request"))
          try {
              const { docs } = await query
              this.transidList = docs.map(doc => {
                const { id } = doc
                const data = doc.data()[0]
                return { id, ...data }
              })

              console.log('Loaded Ids', this.transidList)
              if (this.transidList.length == 0) {
                this.transloop = 0
              } else {
                //this.transidList = this.transidList.sort(function(a, b){return a-b})

                //Literally Sort out 10 and 1
                var transIdsSorted = []
                for (let k = 0; k < this.transidList.length; k++) {
                  transIdsSorted.push(parseInt(this.transidList[k]['id']))
                }
                transIdsSorted.sort(function(a, b){return a-b})
                console.log("TransId Sorted List")

                var checking = transIdsSorted[transIdsSorted.length - 1]
                console.log(checking)

                if ( isNaN(checking) ) {
                  this.transloop = 0
                  console.log(this.transloop)
                } else {
                  this.transloop = parseInt(checking)
                  console.log(this.transloop)
                }
              }
              
              console.log("whats my id: " + this.transloop.toString())


          } catch (error) {
            console.error("Error adding document: ", error)
          }
      },

      
      changeCategory(){
        this.fetchTransId()
        let itemListupdate = []
        for (let i in this.originalitemList) {
          var theItem = this.originalitemList[i]
          if ( theItem['Category'] == this.selectedCategory ) {
              console.log("check here")
              itemListupdate.push(theItem['Item_Name'])
             }
          }
        
        console.log("Here is my Item List Updated")
        console.log(itemListupdate)
        this.itemList = itemListupdate
        this.weblinkhere = null;
      },

  
      clickItems(){
        this.fetchTransId()
        let itemListupdate = []

        if (this.selectedCategory == null){
           console.log("yes is null")

          for (let i in this.originalitemList) {
          var theItem = this.originalitemList[i]
          itemListupdate.push(theItem['Item_Name'])
        }

        console.log("Here is my Item List Updated")
        console.log(itemListupdate)
        this.itemList = itemListupdate

        this.weblinkhere = null;
        }


       },

       changeItems(){
        this.fetchTransId()
        for (let i in this.originalitemList) {
          var theItem = this.originalitemList[i]
          if ( theItem['Item_Name'] == this.selectedItem ) {
              this.selectedCategory = theItem['Category'] 
              this.weblinkhere = theItem['ImgLink'] ;
             }
          }
    
        
        console.log("Item Category changed to to:")
        console.log(this.selectedCategory);

       },



      onUpdate(newValue, oldValue) {
        console.log(newValue, oldValue);
      },
      onChange(event) {
        console.log(event);
      },
      onInput(event) {
        console.log(event);
      },

      
      addZero(dtinput){
        var result = dtinput.toString()
        if (dtinput < 10) { 
          result = "0" + dtinput.toString() 
        }
        return result
      },


      async savetofs(){
        const querygetter =  getDocs(query(collection(db, "ItemSupplies"), where("Item_Name", "==", this.selectedItem) ) );
        try {
                const querySnapshot = await querygetter;
                querySnapshot.forEach((doc) => {
                this.itemselector.push(doc.data())
                });
        } catch(error) {
          console.log(error);
        }
        //Check if item has been ordered before. If yes, prompt user to ammend the order below -- Construction --
        //var transactionid = "TS"+ this.transloop.toString()
        // var a = this.itemList[this.storeIndex-1]['id'].toString();
        // var a = this.item_Name

        console.log( this.itemselector)
        var a = this.itemselector[0]['Item_Id']
        var b = this.selectedItem

    
        var c = this.quantity
        var d = this.remarks
        var e = "dummyUser1"
        var f = (parseInt(this.transloop) + 1).toString()

        var today = new Date();
        var date = this.addZero(today.getDate()) + '-' + this.addZero( (today.getMonth()+1) )+ '-' + today.getFullYear();
        var time = this.addZero(today.getHours()) + ":" + this.addZero(today.getMinutes()) + ":" + this.addZero(today.getSeconds());
        var dateTime = date+' '+time;


        console.log(a)
        console.log(b)
        console.log(c)
        console.log(d)
    
        console.log(e)
        console.log("my transactionid:")
        console.log(f)

        if (d == ""){
          d = "-"
        }


        try{

            if(c == "" ){
              alert("You (" + e + ") did not enter any quantity ")
            } 
            
            else if ( c <= 0 ) {
              alert("You (" + e + ") called an invalid quantity ")
            }
            else{
              const docRef = await setDoc(doc(db, "Request", f), {Trans_Id: "WD-2021-"+f, Timestamp: dateTime, UserId: e, Item_Id: parseInt(a) , Item_Name: b ,   Order_Quantity: parseInt(c), Remarks: d, Status: "Pending Approval"})
              console.log(docRef)
              this.fetchTransId()
              this.$emit("added")
              //alert("You (" + e + ") have requested for " + c.toString() + " units of " + b)

              this.snackbar = true
              this.text = "You (" + e + ") have requested for " + c.toString() + " units of " + b

              this.selectedCategory = null;
              this.itemselector =[]
              this.refreshComp +=1 //Refreshes OrderDisplay
            }

        } catch (error) {
            console.error("Error adding document: ", error)
        }
        
        this.$refs.form2.reset()
        this.weblinkhere = null
        console.log("reset works")
      
      },

      resetSearch(){
        this.$refs.form2.reset()
        this.weblinkhere = null
        console.log("reset works")
      },
    

    }
  
}
</script>

<style scoped>

    #app{
        font-family: Avenir, Arial, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top:60px

    }

    #bg{
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 60%;
    }
    

    h2{
        background-color: aqua;
        margin-left: 1050px;
        padding-left: 100px;
        border: 2px solid #ccc;
        -webkit-border-radius: 5px;
        border-radius: 5px;
    }

    #exactImg{
      margin-top: 50px;
      width: 40%;
      height: 80%;
      max-height: 80%;
      
    }

    .containerLeft{
        width:50%;
        height: 500px;
        float: left;
        background-color:green;
    }

    .containerRight{
        width:50% ;
        float: left;
        padding-right: 30px;
    }

    .containerOrderDisplay{
        float: bottom;
    }

    .formli{
        display: inline-block;
        text-align: right;
    }

    form2{
        text-align: left;
        align-items: center;
        margin-left: 30px;
        
        
    }

    input:hover {
        box-shadow: 3px 3px purple;
        border-radius: 2px;
    }

    .form-control{
      border: 2px;
      -webkit-border-radius: 5px;
      cursor: pointer;
      text-align: center;
    }

    #categorychoosenmain{
      margin-left: 20px;
    }
    
    #itemchoosenmain{
      margin-left: 50px;
    }
    
    #quantitychoosen{
      padding:10px;
      width: 40px;
      margin-left: 20px;
      border: 2px solid #ccc;
      -webkit-border-radius: 5px;
      border-radius: 5px;

    }
    #remarkschoosen{
      padding:50px;
      margin-left: 15px;
      border: 2px solid #ccc;
      -webkit-border-radius: 5px;
      border-radius: 5px;

    }

    #savebutton{ 
      padding: 5px 20px;
      margin-left: 230px;
      border: 1px;
      -webkit-border-radius: 5px;
      cursor: pointer;
      text-align: center;
    }

</style>