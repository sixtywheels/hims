<template>

<div>
    <div><power-user-navigation></power-user-navigation></div>
    <v-card>
        <v-card-title>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
        </v-card-title>
            <v-data-table
                :headers="headers"
                :items="requestedrecords"
                :search="search"
                class="elevation-1"
                >

                <template v-slot:top>
                    <v-toolbar
                        flat
                    >
                        <v-toolbar-title>To Receive the Arrivals </v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog
                            v-model="dialog"
                            max-width="500px"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                v-bind="attrs"
                                v-on="on"
                            >
                            New Item
                            </v-btn>
                        </template>

                        <v-card>
                            <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                            <v-container>
                                <v-row>

                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                    v-model="editedItem.Trans_id"
                                    label="Transation Id"
                                    disabled
                                    ></v-text-field>
                                </v-col>

          

                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                    v-model="editedItem.Item_Name"
                                    label="Item Name"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                    v-model="editedItem.Item_Id"
                                    label="Item Id"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                    v-model="editedItem.Topup_Quantity"
                                    label="Supply Ordered Quantity"
                                    ></v-text-field>
                                </v-col>
                      
                                </v-row>
                            </v-container>
                            </v-card-text>

                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="close"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="save"
                            >
                                Save
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                        </v-dialog>
                    </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                    
                    <!-- 
                    <v-icon
                        
                        @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                    
                    

                    <v-icon
                        
                        class="mr-2"
                        @click="editItem(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    -->
      
                    <v-icon
                        
                        @click="orderArrived(item)"
                    >
                        mdi-thumb-up
                    </v-icon>


                    </template>
                    <template v-slot:no-data>
                    
                    <!-- <v-btn
                        color="primary"
                        @click="initialize"
                    >
                        Reset
                    </v-btn> -->
                    </template>
            </v-data-table>

    </v-card>

</div>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, setDoc, doc, deleteDoc, query, where} from "firebase/firestore"
//import { collection, getDocs} from "firebase/firestore"
const db = getFirestore(firebaseApp);
import PowerUserNavigation from './PowerUserNavigation'
import {getAuth, onAuthStateChanged} from  "firebase/auth";

export default {

    name:"PowerUserTrackArrival",

    mounted(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user) {
            this.user = user;
            //console.log(this.user)
            this.authemail = user['email']
        }
      })
      this.verifyPU()



    },

    data: () =>  { //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
        search: '',
        dialog: false,
        dialogDelete: false,
        headers: [
          {
            text: 'Transaction Number',
            align: 'start',
            filterable: false,
            value: 'Trans_id',
          },
          { text: 'Timestamp', value: 'Timestamp' },
          { text: 'Category', value: 'Category' },
          //{ text: 'Item_Id', value: 'Item_Id' },
          { text: 'Item_Name', value: 'Item_Name' },
          { text: 'Topup_Quantity', value: 'Topup_Quantity' },
          //{ text: 'Trans_id', value: 'Trans_id' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],

        requestedrecords: [],
        refreshComp:0,
        transidList: [],
        transloop: 0,
        itemselector: [],

        authemail: '',
        puverified: false,



        editedIndex: -1,
        editedItem: {
            Trans_id: 0,
            Item_Name: '',
            Item_Id: 0,
            Topup_Quantity: 0,


        },
        defaultItem: {
            Trans_id: 0,
            Item_Name: '',
            Item_Id: 0,
            Topup_Quantity: 0,

        },
      }
     },

     components: {
        PowerUserNavigation: PowerUserNavigation,
    },

     computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Supply Order'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },


    
    methods:{

        async initialize() {
            this.display()
        },

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
                  } else {
                    console.log("CHECK NEXT")
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
        

        editItem (item) {
        console.log("editItem")
        this.editedIndex = this.requestedrecords.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        },

        deleteItem (item) {
        console.log("deleteItem")
        this.editedIndex = this.requestedrecords.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true

        },

        orderArrived (item) {
        this.editedIndex = this.requestedrecords.indexOf(item)
        this.editedItem = Object.assign({}, item)
        //this.dialogDelete = true

        console.log("Approving is here")
        console.log(this.editedItem)

        var pTransId = this.editedItem['Trans_id']
        //var pCategory = this.editedItem['Category']
        var pItemId = this.editedItem['Item_Id']
        var pItemName = this.editedItem['Item_Name']
        var pTopupQuantity = this.editedItem['Topup_Quantity']
        //var pTimestamp = this.editedItem['Timestamp']

        this.addQuantityToMain(pTransId, pTopupQuantity, pItemName, pItemId)
        },


        deleteItemConfirm () {
            console.log("deleteItemConfirm")
            var rejectedItem = this.requestedrecords.splice(this.editedIndex, 1)
            console.log(rejectedItem)
            var pTransId = rejectedItem[0]['Trans_id']
            this.cancelledOrder(pTransId)

            this.requestedrecords.splice(this.requestedrecords, 1)

            this.closeDelete()
        },

        close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        },

        closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        },

        save () {
        if (this.editedIndex > -1) {
          Object.assign(this.requestedrecords[this.editedIndex], this.editedItem)
        } else {
          this.requestedrecords.push(this.editedItem)
        }

        console.log("Saving Here")
        console.log(this.editedItem)

        
        var pTransId = this.editedItem['Trans_id']
        var pCategory = this.editedItem['Category']
        var pItemId = this.editedItem['Item_Id']
        var pItemName = this.editedItem['Item_Name']
        var pTopupQuantity = this.editedItem['Topup_Quantity']
        var pTimestamp = this.editedItem['Timestamp']
        this.updateOrder(pTransId, pItemId, pTopupQuantity, pItemName, pCategory, pTimestamp)
        this.close()
        },



        //##################################################//

        async display(){
            
        this.requestedrecords = []
        let z = await getDocs(collection(db,"PendingArrival"))

        z.forEach((docs) => {
            let yy = docs.data()
            let callData = {}


            var showTransId = (yy.Trans_id)
            var showItemName = (yy.Item_Name)
            var showItemId = (yy.Item_Id)
            var showTopupQuantity = (yy.Topup_Quantity)
            var showCategory = (yy.Category)
            var showTimestamp = (yy.Timestamp)

            //var showRequester = (yy.UserId) //console.log(showRequester)
            //console.log(showRequester)

            callData.Trans_id = showTransId
            callData.Item_Name = showItemName
            callData.Item_Id = showItemId
            callData.Topup_Quantity = showTopupQuantity
            callData.Category = showCategory
            callData.Timestamp = showTimestamp
            
            this.requestedrecords = this.requestedrecords.concat(callData)

        })
        return this.requestedrecords
        },


        async addQuantityToMain(pTransId, pTopupQuantity, pItemName, pItemId){
            console.log("here order has arrived")
            console.log(pItemName + " " + pItemId)
            const pendingArrivalgetter =  getDocs(query(collection(db, "PendingArrival"), where("Trans_id", "==", pTransId), where("Item_Name", "==", pItemName) ) );
            const itemSuppliesgetter =  getDocs(query(collection(db, "ItemSupplies"),  where("Item_Name", "==", pItemName) ) ); //where("Item_Id", "==", pItemId),
           
            
            var itemArrived = []
            var itemSupply = []

            try {

                var newQty = 0

                const findItemSupply = await itemSuppliesgetter;
                findItemSupply.forEach((doc) => {
                itemSupply.push(doc.data())
                });

                const findPendingOrders = await pendingArrivalgetter;
                findPendingOrders.forEach((doc) => {
                itemArrived.push(doc.data())
                });
            
                console.log(itemSupply[0])
                console.log(itemArrived[0])
                newQty += parseInt(itemSupply[0]['Order_Quantity']) 
                newQty += parseInt(itemArrived[0]['Topup_Quantity'])
                console.log("THis is my new Qty")
                console.log(newQty)

                await setDoc(doc(db, "ItemSupplies", itemSupply[0]['Item_Id'].toString() ), {Category: itemSupply[0]['Category'], Item_Id: itemSupply[0]['Item_Id'] , ImgLink: itemSupply[0]['ImgLink'], Item_Name: itemSupply[0]['Item_Name'], Order_Quantity: parseInt(newQty), Threshold1: itemSupply[0]['Threshold1'] , Threshold2: itemSupply[0]['Threshold2'] })
                console.log("Done setDoc")
                await deleteDoc(doc(db, "PendingArrival", pTransId.toString()))
                console.log(pTransId.toString())
                console.log("Done deleteDoc")
                this.display()

            } catch(error){
                console.log(error)
            }   
        },

 
        async updateOrder(pTransId, pItemId, pTopupQuantity, pItemName, pCategory, pTimestamp){
            console.log("Setting Updates")

            try{ 
                await setDoc(doc(db, "PendingArrival", pTransId.toString() ), {Trans_id: pTransId , Timestamp: pTimestamp, Item_Id: parseInt(pItemId) , Item_Name: pItemName , Topup_Quantity: parseInt(pTopupQuantity),  Category: pCategory})
                console.log("Update Completed")
            } catch (error) {
                console.log(error)
            }
        },


        async cancelledOrder(pTransId) {
            try{
   
                await deleteDoc(doc(db, "PendingArrival", pTransId.toString()))
   
                //Add notes into reject database.
                //Email and tell the person why rejected?

                alert("Successfully Cancelled")
                //Emit to call for table 1 to change
                this.display()

            } catch (error) {
            console.error("Error cancelling pending Orders: ", error)
            }
        },



    }
}
</script>

<style scoped>
h1, h2{
    text-align: center;
    background-color: yellow ;
    font: 700;
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em ;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}

table2 {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

tr:nth-child(even) {
    background-color: #e3edee;
}

th,td{
    border: 1px solid #dddddd;
    text-align: center;
    padding: 8px;
}

.bwtApprove{
    color: whitesmoke;
    background-color: green;
}

.labelSpace{
    color: whitesmoke;
}

.bwtReject{
    color: whitesmoke;
    background-color: red;
}




</style>


