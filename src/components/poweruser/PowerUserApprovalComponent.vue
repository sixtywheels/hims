<template>

<div>
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
                
                <!--
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.headers.Action === 'Action'">
                        <button type="button" class="btn btn-primary">Action</button>
                    </span>
                    <span v-else> {{ props.formattedRow[props.headers.field] }} </span>
                </template>   
                -->

                <!--
                <template v-slot:item.options="{}">
                    <v-btn @click="approveOrder()" >Approve</v-btn>
                    <v-btn @click="rejectOrder()"> Reject</v-btn>
                </template >
                -->

                <template v-slot:top>
                    <v-toolbar
                        flat
                    >
                        <v-toolbar-title>To Approve Request</v-toolbar-title>
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
                                    v-model="editedItem.Quantity_Requested"
                                    label="Quantity Requested"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                    v-model="editedItem.Remarks"
                                    label="Remarks"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                    v-model="editedItem.Notes"
                                    label="Notes"
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
      
                    <v-icon
                        
                        @click="approveItem(item)"
                    >
                        mdi-thumb-up
                    </v-icon>


                    </template>
                    <template v-slot:no-data>
                    <v-btn
                        color="primary"
                        @click="initialize"
                    >
                        Reset
                    </v-btn>
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

export default {

    name:"PowerUserApprovalComponent",

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
            value: 'Trans_Id',
          },
          { text: 'Timestamp', value: 'Timestamp' },
          { text: 'Item_Name', value: 'Item_Name' },
          { text: 'Item_Id', value: 'Item_Id' },
          { text: 'Quantity_Requested', value: 'Quantity_Requested' },
          { text: 'Remarks', value: 'Remarks' },
          { text: 'Notes', value: 'Notes' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],

        requestedrecords: [],
        refreshComp:0,
        transidList: [],
        transloop: 0,
        itemselector: [],

        editedIndex: -1,
        editedItem: {
            Item_Name: '',
            Item_Id: 0,
            Order_Quantity: 0,
            Remarks: 0,
            Notes: 0,
        },
        defaultItem: {
            Item_Name: '',
            Item_Id: 0,
            Order_Quantity: 0,
            Remarks: 0,
            Notes: 0,
        },
      }
     },

     computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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

        approveItem (item) {
        this.editedIndex = this.requestedrecords.indexOf(item)
        this.editedItem = Object.assign({}, item)
        //this.dialogDelete = true

        console.log("Approving is here")
        console.log(this.editedItem)

        var pTransId = this.editedItem['Trans_Id']
        var pItemId = this.editedItem['Item_Id']
        var pOrderQuantity = this.editedItem['Quantity_Requested']
        var pItemName = this.editedItem['Item_Name']
        var pRemarks = this.editedItem['Remarks']
        this.approveOrder(pTransId, pItemId, pOrderQuantity, pItemName,pRemarks, "TEMPNOSHOW")
        },


        deleteItemConfirm () {
            console.log("deleteItemConfirm")
            var rejectedItem = this.requestedrecords.splice(this.editedIndex, 1)
            console.log(rejectedItem)
            var pTransId = rejectedItem[0]['Trans_Id']
            this.rejectOrder(pTransId)

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

        var pTransId = this.editedItem['Trans_Id']
        var pItemId = this.editedItem['Item_Id']
        var pOrderQuantity = this.editedItem['Quantity_Requested']
        var pItemName = this.editedItem['Item_Name']
        var pRemarks = this.editedItem['Remarks']
        var pTimestamp = this.editedItem['Timestamp']
        this.updateOrder(pTransId, pItemId, pOrderQuantity, pItemName, pRemarks, pTimestamp)
        this.close()
        },



        //##################################################//

        async display(){
            
        this.requestedrecords = []
        let z = await getDocs(collection(db,"Request"))

        z.forEach((docs) => {
            let yy = docs.data()
            let callData = {}


            var showTransId = (yy.Trans_Id)
            var showItemName = (yy.Item_Name)
            var showItemId = (yy.Item_Id)
            var showOrderQuantity = (yy.Order_Quantity)
            var showRemarks = (yy.Remarks)
            var showTimestamp = (yy.Timestamp)

            var showRequester = (yy.UserId) //console.log(showRequester)
            console.log(showRequester)

            callData.Trans_Id = showTransId
            callData.Item_Name = showItemName
            callData.Item_Id = showItemId
            callData.Quantity_Requested = showOrderQuantity
            callData.Remarks = showRemarks
            callData.Timestamp = showTimestamp
            

            this.requestedrecords = this.requestedrecords.concat(callData)

        })
        return this.requestedrecords
        },

        async updateOrder(pTransId, pItemId, pOrderQuantity, pItemName, pRemarks, pTimestamp){
            //await deleteDoc(doc(db, "Request", parseInt(pTransId.slice(8)) ))
            console.log("Setting Updates")

            try{ 
                await setDoc(doc(db, "Request", pTransId.slice(8) ), {Trans_Id: "WD-2021-"+ pTransId.slice(8) , Timestamp: pTimestamp, UserId: "TEMP NO SHOW", Item_Id: parseInt(pItemId) , Item_Name: pItemName , Order_Quantity: parseInt(pOrderQuantity), Remarks: pRemarks, Status: "Pending Approval"})
                console.log("Update Completed")
            } catch (error) {
                console.log(error)
            }
        },

        //Check Quantity
        async checkQuantity (showItemId, showItemName, showOrderQuantity){
            console.log("here check quantity")
            console.log(showItemName + " " + showItemId)
            const querygetter =  getDocs(query(collection(db, "ItemSupplies"), where("Item_Id", "==", showItemId), where("Item_Name", "==", showItemName) ) );
            
            var itemfiltered = []
            var actualqty = 0
            var upperthresholdqty = 0
            var lowerthresholdqty = 0

            try {
                const querySnapshot = await querygetter;
                querySnapshot.forEach((doc) => {
                itemfiltered.push(doc.data())
                });
                
                console.log(itemfiltered[0])
                actualqty += itemfiltered[0]['Order_Quantity']
                upperthresholdqty += itemfiltered[0]['Threshold2']
                lowerthresholdqty += itemfiltered[0]['Threshold1']

                
                var showitemCat = itemfiltered[0]['Category']
                var showid = itemfiltered[0]['Item_Id']
                var showimglink = itemfiltered[0]['ImgLink']
                var showname = itemfiltered[0]['Item_Name']

                if (actualqty <= showOrderQuantity){
                    console.log("The Current Inventory has inadequate stock to fufil requestor's order")
                    var notOkay = ["Not Okay", showitemCat, showid, showimglink, showname, parseInt(actualqty), parseInt(showOrderQuantity), parseInt(lowerthresholdqty), parseInt(upperthresholdqty)]
                    
                    //Reject Function
                    return notOkay
                } 
                
                else if ( actualqty - showOrderQuantity < lowerthresholdqty ) {
                    var bythismuch = lowerthresholdqty - (actualqty - showOrderQuantity)
                    var totopup = upperthresholdqty - (actualqty - showOrderQuantity)
                    console.log("Initial Qty: " + actualqty.toString())
                    console.log("After deduction: " + (actualqty - showOrderQuantity).toString() )
                    console.log("The Request will result in Inventory going below the lower limit by " + bythismuch.toString() )
                    console.log("The Request will require a top up of " + totopup.toString())
                    var errOkay =["Low Stock", showitemCat, showid, showimglink, showname, parseInt(actualqty), parseInt(showOrderQuantity), parseInt(lowerthresholdqty), parseInt(upperthresholdqty), parseInt(bythismuch), parseInt(totopup)]
                    return errOkay

                } else {
                    var okay = ["Okay", showitemCat, showid, showimglink, showname, parseInt(actualqty), parseInt(showOrderQuantity), parseInt(lowerthresholdqty), parseInt(upperthresholdqty)]
                    return okay
                }


            } catch (error) {
                console.error("Error checking document: ", error)
            }
        },

        async checkAutoOrderMechanism (showItemId, showItemName){
            console.log("here checkAutoOrderMechanism")
            console.log(showItemName + " " + showItemId)
            const pendingArrivalgetter =  getDocs(query(collection(db, "PendingArrival"), where("Item_Id", "==", showItemId), where("Item_Name", "==", showItemName) ) );
            const itemSuppliesgetter =  getDocs(query(collection(db, "ItemSupplies"), where("Item_Id", "==", showItemId), where("Item_Name", "==", showItemName) ) );
           
            
            var pendingArrivalList = []
            var itemSupply = []


            try {

                var overallQty = 0
                //var upperthresholdqty = 0
                var lowerthresholdqty = 0

                const findItemSupply = await itemSuppliesgetter;
                findItemSupply.forEach((doc) => {
                itemSupply.push(doc.data())
                });

                console.log(itemSupply[0])
                overallQty += itemSupply[0]['Order_Quantity']
                //upperthresholdqty += itemSupply[0]['Threshold2']
                lowerthresholdqty += itemSupply[0]['Threshold1']

                const findPendingOrders = await pendingArrivalgetter;
                findPendingOrders.forEach((doc) => {
                pendingArrivalList.push(doc.data())
                });
                
  
                for (let i =0; i < pendingArrivalList.length; i++ ){
                    console.log(pendingArrivalList)
                    console.log(pendingArrivalList[i])   
                    overallQty +=  parseInt(pendingArrivalList[i]['Topup_Quantity'])
                }

                if (overallQty >= lowerthresholdqty){
                    console.log("There is enough pending order to cover threshold!");
                    return ["Stop Auto Order"]
                    
                } else {
                    console.log("Please make the Auto Order!");
                    return ["Proceed Auto Order"]
                }

            } catch (error) {
                console.error("Error checking document: ", error)
            }
        },


        async fetchTransId(nameDB) {
            var transidList = []
            var transloop = 1

            console.log("FetchingId...")
            const query = getDocs(collection(db, nameDB))
                try {
                    const { docs } = await query
                    transidList = docs.map(doc => {
                        const { id } = doc
                        const data = doc.data()[0]
                        return { id, ...data }
                    })

                    console.log('Loaded Ids', transidList)
                    if (transidList.length == 0) {
                        transloop = 1
                    } else {
                        //Literally Sort out 10 and 1
                        var transIdsSorted = []
                        for (let k = 0; k < transidList.length; k++) {
                        transIdsSorted.push(parseInt(transidList[k]['id']))
                        }
                        transIdsSorted.sort(function(a, b){return a-b})
                        console.log("TransId Sorted List")

                        var checking = transIdsSorted[transIdsSorted.length - 1]
                        console.log(checking)

                        if ( isNaN(checking) ) {
                        transloop = 1
                        console.log(transloop)
                        } else {
                        transloop = parseInt(checking)+1
                        console.log(transloop)
                        }
                    }
                    
                    console.log("whats my Item Disburse id: " + transloop.toString())
                    return transloop

                } catch (error) {
                    console.error("Error adding document: ", error)
                }
        },

        addZero(dtinput){
            var result = dtinput.toString()
            if (dtinput < 10) { 
            result = "0" + dtinput.toString() 
            }
            return result
        },
        

         //----- Approve Order-----//

        //Check if Quanity in itemSupplies is Adequate to request Order
        async approveOrder(showTransId, showItemId, showOrderQuantity, showItemName,showRemarks, showRequester) { //, showOrderQuantity, showItemName){
        
            try{
                var x1 = showTransId
                var x2 = showTransId.slice(8)
                var x3 = parseInt(showItemId).toString()
                var x4 = parseInt(showOrderQuantity).toString()
                var x5 = showItemName
                var x6 = showRemarks
                var x7 = showRequester
                
                var x8 = "POWERUSERA" //this.approvingOfficer

                var today = new Date();
                var date = this.addZero(today.getDate()) + '-' + this.addZero( (today.getMonth()+1) )+ '-' + today.getFullYear();
                var time = this.addZero(today.getHours()) + ":" + this.addZero(today.getMinutes()) + ":" + this.addZero(today.getSeconds());
                var dateTime = date+' '+time;
                        

                console.log(x1)
                console.log(x2)
                console.log(x3)
                console.log(x4 )
                console.log(x5 )    
                console.log(x6 )
                console.log(x7)
                console.log(x8)

                //await setDoc(doc(db, "PendingArrival", x2), {Trans_id: x2, Item_Id: x3, Order_Quantity: x4, Item_Name: x5, Remarks: x6})
                //await deleteDoc(doc(db, "Request", x2))
                //console.log("order Request accepted!", x1);
                
                //Check Quantity and Stock Availability
                var quantityStatus = await this.checkQuantity (showItemId,showItemName,showOrderQuantity)
                //console.log(quantityStatus)

                if (quantityStatus[0] == "Okay" || quantityStatus[0] == "Low Stock"){
                    
                    var nameDB = "ItemDisbursed"
                    var transloop = await this.fetchTransId(nameDB )
                    console.log(transloop)
                    await setDoc(doc(db, "ItemDisbursed", transloop.toString() ), {Disbursement_id: parseInt(transloop),  Timestamp: dateTime,  Item_Id: parseInt(x3), Category: quantityStatus[1],  Order_Quantity: parseInt(x4), Item_Name: x5, Remarks: x6, Requester: x7, Approver: x8})
                    console.log("Order Request accepted and will be disbursed!", x1);

                    await setDoc(doc(db, "ItemSupplies", x3), {Category: quantityStatus[1], Item_Id: parseInt(x3) , ImgLink: quantityStatus[3], Item_Name: quantityStatus[4] , Order_Quantity: quantityStatus[5] - quantityStatus[6], Threshold1: quantityStatus[7]  , Threshold2: quantityStatus[8] })
                    await deleteDoc(doc(db, "Request", x2))
                    console.log("order Withdrawn from Item Supplies!", x1);
                   

                    if (quantityStatus[0] == "Low Stock"){
                        console.log("PLEASE RESTOCK!", x1);
                        //nameDB = "ItemDisbursed"
                        //transloop = await this.fetchTransId(nameDB )
                        //await setDoc(doc(db, "ItemDisbursed", transloop.toString() ), {Disbursement_id: parseInt(transloop),  Timestamp: dateTime,  Item_Id: parseInt(x3), Category: quantityStatus[1],  Order_Quantity: parseInt(x4), Item_Name: x5, Remarks: x6, Requester: x7, Approver: x8})
                        
                        //RESTOCKING//
                        //Check for current supplies + pending arrival if exceed threshold2 if not, order ele dont order (IN CONSTRCUTION)
                        nameDB = "PendingArrival"
                        transloop = await this.fetchTransId(nameDB )
                        var pendingOrderCheck = await this.checkAutoOrderMechanism( parseInt(x3), x5)
                        if( pendingOrderCheck[0] == "Proceed Auto Order"){
                            await setDoc(doc(db, "PendingArrival", transloop.toString()), {Trans_id: parseInt(transloop),  Timestamp: dateTime,  Item_Id: parseInt(x3), Topup_Quantity: quantityStatus[10], Item_Name: x5, Category: quantityStatus[1]})
                            console.log("Pending Order is created");
                        } else {
                            console.log("Adequate Pending Orders Incoming!");
                        }
                    }
                    alert("Item request has been approved and will be shipped to you!. Await for Disbursement")
                }
                else {
                    console.log("Not Okay");

                    if(quantityStatus[0] == "Not Okay") {
                        console.log("Inadequate Stock, cannot be approved");
                        alert("Inventory cannot meet the Quantity Requested.")

  
                        //Keep in request and hold until possible to approve? To discuss
                        
                        //Add notes into reject database.
                        //Email and tell the person why rejected?
                    }
                }
            
         
                
                //Emit to call for table 1 to change
                this.display()

            } catch (error) {
            console.error("Error approving document: ", error)
            }
        },


        async rejectOrder(showTransId) { //, showOrderQuantity, showItemName){
            try{
                var x1 = showTransId
                var x2 = showTransId.slice(8)
                alert("You have rejected " + x1)
                await deleteDoc(doc(db, "Request", x2))
                console.log("order Request Rejected!", x1);

                //Add notes into reject database.
                //Email and tell the person why rejected?

                alert("Successfully rejected")
                //Emit to call for table 1 to change
                this.display()

            } catch (error) {
            console.error("Error rejecting document: ", error)
            }
        }







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