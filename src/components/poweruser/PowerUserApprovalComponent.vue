<template>

<div>
   <!-- <h1 id = "Current"> Orders Requested</h1> -->
        <table id= "table2" class = "auto-index">
            <tr>
            <th>S/N</th>
            <th>TransId</th>
            <th>Item Name</th>
            <th>Item Id </th>
            <th>Order Quantity</th>
            <th>Remarks</th>
            <th>Status</th>
            <th>Action</th>
            
            </tr>
        </table><br><br>
</div>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, setDoc, doc, deleteDoc, query, where} from "firebase/firestore"
const db = getFirestore(firebaseApp);

export default {

    name:"PowerUserApprovalComponent",

    data: () =>  { //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
        refreshComp:0,
        transidList: [],
        transloop: 0
      }
     },

    mounted(){
    async function display(){
        let z = await getDocs(collection(db,"Request"))
        let ind = 1


        z.forEach((docs) => {
            let yy = docs.data()
            var table = document.getElementById("table2")
            var row = table.insertRow(ind)

            var showTransId = (yy.Trans_Id)
            var showItemName = (yy.Item_Name)
            var showItemId = (yy.Item_Id)
            var showOrderQuantity = (yy.Order_Quantity)
            var showRemarks = (yy.Remarks)
            var showRequester = (yy.UserId)
            console.log(showRequester)
            //var showStatus = (yy.Status)

            var cell1 = row.insertCell(0); var cell2 = row.insertCell(1); var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3); var cell5 = row.insertCell(4); var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6); var cell8 = row.insertCell(7);
    
            cell1.innerHTML = ind; cell2.innerHTML = showTransId; cell3.innerHTML = showItemName; cell4.innerHTML = showItemId;
            cell5.innerHTML= showOrderQuantity; cell6.innerHTML = showRemarks; cell7.innerHTML = "";
            


            var txtbx = document.createElement("INPUT")
            txtbx.className = "txt"
            txtbx.id = String(showTransId)
            cell7.appendChild(txtbx)



            var buApprove = document.createElement("button")
            buApprove.className = "bwtApprove"
            buApprove.id = String(showTransId)
            buApprove.innerHTML = "Approve"
            buApprove.onclick =  function(){ 
                approveOrder(showTransId, showItemId, showOrderQuantity, showItemName,showRemarks, showRequester)
             }
            cell8.appendChild(buApprove)

            var labelSpace = document.createElement("LABEL")
            labelSpace.id = String(showTransId)
            labelSpace.innerHTML = "   "
            cell8.appendChild(labelSpace)


            var buReject = document.createElement("button")
            buReject.className = "bwtReject"
            buReject.id = String(showTransId)
            buReject.innerHTML = "Reject"
            buReject.onclick = function(){
                rejectOrder(showTransId)
            }
            cell8.appendChild(buReject)




            ind += 1
        })
    } display()

        //Check Quantity
        async function checkQuantity (showItemId, showItemName, showOrderQuantity){
            console.log("here")
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
        }


        async function checkAutoOrderMechanism (showItemId, showItemName){
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
        }

        async function fetchTransId(nameDB) {
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
        }



        //----- Approve Order-----//

        //Check if Quanity in itemSupplies is Adequate to request Order
        async function approveOrder(showTransId, showItemId, showOrderQuantity, showItemName,showRemarks, showRequester) { //, showOrderQuantity, showItemName){
        
            try{
                var x1 = showTransId
                var x2 = showTransId.slice(8)
                var x3 = parseInt(showItemId).toString()
                var x4 = parseInt(showOrderQuantity).toString()
                var x5 = showItemName
                var x6 = showRemarks
                var x7 = showRequester
                
                var x8 = "POWERUSERA" //this.approvingOfficer

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
                var quantityStatus = await checkQuantity (showItemId,showItemName,showOrderQuantity)
                //console.log(quantityStatus)

                if (quantityStatus[0] == "Okay" || quantityStatus[0] == "Low Stock"){
                    
                    var nameDB = "ItemDisbursed"
                    var transloop = await fetchTransId(nameDB )
                    console.log(transloop)
                    await setDoc(doc(db, "ItemDisbursed", transloop.toString() ), {Disbursement_id:  transloop , Item_Id: parseInt(x3), Order_Quantity: parseInt(x4), Item_Name: x5, Remarks: x6, Requester: x7, Approver: x8})
                    console.log("Order Request accepted and will be disbursed!", x1);

                    await setDoc(doc(db, "ItemSupplies", x3), {Category: quantityStatus[1], Item_Id: parseInt(x3) , ImgLink: quantityStatus[3], Item_Name: quantityStatus[4] , Order_Quantity: quantityStatus[5] - quantityStatus[6], Threshold1: quantityStatus[7]  , Threshold2: quantityStatus[8] })
                    await deleteDoc(doc(db, "Request", x2))
                    console.log("order Withdrawn from Item Supplies!", x1);
                   

                    if (quantityStatus[0] == "Low Stock"){
                        console.log("PLEASE RESTOCK! Automation on Construction", x1);
                        nameDB = "ItemDisbursed"
                        transloop = await fetchTransId(nameDB )
                        await setDoc(doc(db, "ItemDisbursed", transloop.toString() ), {Disbursement_id: transloop, Item_Id: parseInt(x3), Category: quantityStatus[1],  Order_Quantity: parseInt(x4), Item_Name: x5, Remarks: x6, Requester: x7, Approver: x8})
                        
                        //RESTOCKING//
                        //Check for current supplies + pending arrival if exceed threshold2 if not, order ele dont order (IN CONSTRCUTION)
                        nameDB = "PendingArrival"
                        transloop = await fetchTransId(nameDB )
                        var pendingOrderCheck = await checkAutoOrderMechanism( parseInt(x3), x5)
                        if( pendingOrderCheck[0] == "Proceed Auto Order"){
                            await setDoc(doc(db, "PendingArrival", transloop.toString()), {Trans_id: transloop, Item_Id: parseInt(x3), Topup_Quantity: quantityStatus[10], Item_Name: x5, Category: quantityStatus[1]})
                            console.log("Pending Order is created");
                        } else {
                            console.log("Adequate Pending Orders Incoming!");
                        }
                    }
                }
                else {
                    console.log("Not Okay");

                    if(quantityStatus[0] == "Not Okay!") {
                        console.log("Inadequate Stock, cannot be approved");
                        //Add notes into reject database.
                        //Email and tell the person why rejected?
                    }
                }
                
                let tb = document.getElementById("table2")
                while(tb.rows.length > 1){
                    tb.deleteRow(1)
                }
                
                alert("Item request has been sent to administrator. Await for Disbursement")
                //Emit to call for table 1 to change
                display()

            } catch (error) {
            console.error("Error approving document: ", error)
            }
        }


        //----- Reject Order-----//
        async function rejectOrder(showTransId) { //, showOrderQuantity, showItemName){
            try{
                var x1 = showTransId
                var x2 = showTransId.slice(8)
                alert("You have rejected " + x1)
                await deleteDoc(doc(db, "Request", x2))
                console.log("order Request Rejected!", x1);

                //Add notes into reject database.
                //Email and tell the person why rejected?

                let tb = document.getElementById("table2")
                while(tb.rows.length > 1){
                    tb.deleteRow(1)
                }
                
                alert("Successfully rejected")
                //Emit to call for table 1 to change
                display()

            } catch (error) {
            console.error("Error rejecting document: ", error)
            }
        }

    }, 
}
</script>

<style>
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