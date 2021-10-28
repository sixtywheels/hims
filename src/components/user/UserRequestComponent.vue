<template>

<div>
  <h2>Order Items </h2>

  <div id="itemImg"  @change="changeItems($event)" class = "containerLeft"  >
  <br>
  <img id="exactImg" :src = this.weblinkhere alt = "No Picture Available" />
  </div>

  <div class = "containerRight">
    <br>
    <form id = "myform">
      <label> Category </label>
      <select id="categorychoosenmain" class="form-control" @change="changeCategory($event)">
        <option value="" selected disabled>Choose</option>
        <option id="categorychoosen" v-for="cat in itemCategory" :value="cat" :key="cat"> {{ cat }}</option> 
      </select> <br><br>


      <label> Item: </label>
      <select id="itemchoosenmain" class="form-control" @change="changeItems($event)">
        <option id="backtodefault" value="" selected disabled>Choose</option>
        <option id="itemchoosen" v-for="item in itemList" :value="item.Item_Id" :key="item.Item_Id"> {{ item.Item_Name }}</option>
      </select> <br><br>

      <label for="quantitychoosen"> Quantity: </label> 
        <input type="number" id="quantitychoosen" required="" placeholder = "Qty" min="1"> <br><br>
  
      <label for="remarkschoosen"> Remarks: </label>
        <input type="text" id="remarkschoosen" required="" placeholder = "Enter Remarks"> <br><br>
      
      <div class = "save">
        <button id = "savebutton" type = "button" v-on:click = "savetofs()"> Request Order </button>
      </div>

    </form> 
  </div>
</div>

</template>



<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc , setDoc} from "firebase/firestore"
const db = getFirestore(firebaseApp);

export default {
    
    name:"UserRequestComponent",

    data: () =>  { //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
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
      
      }
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

      changeCategory(event){
        this.fetchTransId()
        this.selectedCategory = event.target.options[event.target.options.selectedIndex].text
        let itemListupdate = []

        for (let i in this.originalitemList) {
          var theItem = this.originalitemList[i]
          if ( theItem['Category'] == this.selectedCategory ) {
              itemListupdate.push(theItem)
             }
          }
        
        console.log("Here is my Item List Updated")
        console.log(itemListupdate)
        this.itemList = itemListupdate

        this.weblinkhere = null;
        //console.log(document.getElementById('itemchoosenmain'))
        console.log("Item Changed to:")
        //console.log(this.itemList)
        console.log(this.itemList[0]['Item_Name']);
        //this.changeItems(this.itemList[0]['Item_Name'])
        document.getElementById("itemchoosenmain").selectedIndex = 0
   
      },

  
      changeItems(event){
        this.fetchTransId()
        console.log(event.target.options[event.target.options.selectedIndex].text)

        let idx = event.target.options.selectedIndex - 1 //console.log(event.target.options.selectedIndex)
        let srcweb = this.itemList[idx].ImgLink //console.log(this.itemList[idx].imglink)

        this.weblinkhere = srcweb 
        console.log(this.weblinkhere)

        this.selectedItem = event.target.options[event.target.options.selectedIndex].text
        this.storeIndex = event.target.options.selectedIndex
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

      async savetofs(){
        //Check if item has been ordered before. If yes, prompt user to ammend the order below -- Construction --
        //var transactionid = "TS"+ this.transloop.toString()
        var a = this.itemList[this.storeIndex-1]['id'].toString();
        //var a = this.storeIndex.toString();  //numerics from object must be casted as toString() into
        var b = this.selectedItem;
        var c = document.getElementById("quantitychoosen").value;
        var d = document.getElementById("remarkschoosen").value;
        var e = "dummyUser1"
        var f = (parseInt(this.transloop) + 1).toString()

        console.log(a)
        console.log(b)
        console.log(c)
        console.log(d)
    
        console.log(e)
        console.log("my transactionid:")
        console.log(f)

        try{

            if(c == "" ){
              alert("You (" + e + ") did not enter any quantity ")
            } 
            
            else if ( c <= 0 ) {
              alert("You (" + e + ") called an invalid quantity ")
            }
            else{
              const docRef = await setDoc(doc(db, "Request", f), {Trans_Id: "WD-2021-"+f, UserId: e, Item_Id: parseInt(a) , Item_Name: b ,   Order_Quantity: parseInt(c), Remarks: d, Status: "Pending Approval"})
              console.log(docRef)
              document.getElementById('myform').reset();
              //document.getElementById("itemchoosen").selectedIndex = 0
              this.fetchTransId()
              this.$emit("added")
              alert("You (" + e + ") have requested for " + c + " units of " + b)
              
              this.refreshComp +=1 //Refreshes OrderDisplay
              document.getElementById("itemchoosenmain").selectedIndex = 0 //Set Item to Choose
              document.getElementById("categorychoosenmain").selectedIndex = 0
            }

        } catch (error) {
            console.error("Error adding document: ", error)
        }
      }
    

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
      width: 40%;
      height: 40%;
      max-height: 350px;
    }

    .containerLeft{
        width:50%;
        height:400 ;
        float: left;
        background-color: white;
    }

    .containerRight{
        width:50% ;
        height:400px ;
        background-color: #ccc;
        float: right;
    }

    .containerOrderDisplay{
        float: bottom;
    }

    .formli{
        display: inline-block;
        text-align: right;
    }

    form{
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