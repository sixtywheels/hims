<template>

    <div>
   <!-- <h1 id = "Current"> Orders Requested</h1> -->
        <table id= "table" class = "auto-index">
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
import { collection, getDocs, doc, deleteDoc} from "firebase/firestore"
const db = getFirestore(firebaseApp);

export default {
    mounted(){
    async function display(){
        let z = await getDocs(collection(db,"Request"))
        let ind = 1


        z.forEach((docs) => {
            let yy = docs.data()
            var table = document.getElementById("table")
            var row = table.insertRow(ind)

            var showTransId = (yy.Trans_Id)
            var showItemName = (yy.Item_Name)
            var showItemId = (yy.Item_Id)
            var showOrderQuantity = (yy.Order_Quantity)
            var showRemarks = (yy.Remarks)
            var showStatus = (yy.Status)

            var cell1 = row.insertCell(0); var cell2 = row.insertCell(1); var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3); var cell5 = row.insertCell(4); var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6); var cell8 = row.insertCell(7);
    
            cell1.innerHTML = ind; cell2.innerHTML = showTransId; cell3.innerHTML = showItemName; cell4.innerHTML = showItemId;
            cell5.innerHTML= showOrderQuantity; cell6.innerHTML = showRemarks; cell7.innerHTML = showStatus;
            //cell7.className = "profits"

            var bu = document.createElement("button")
            bu.className = "bwt"
            bu.id = String(showTransId)
            bu.innerHTML = "Delete"
            bu.onclick = function(){
                deleteinstrument2(showTransId)
            }
            cell8.appendChild(bu)
            ind += 1
        })
    } display()
        //----- Delete Instruments-----//
        async function deleteinstrument2(showTransId){ //, showOrderQuantity, showItemName){
            var x1 = showTransId
            var x2 = showTransId.slice(4)
            //var s1 = showOrderQuantity
            //var s2 = showItemName
            alert("you are about to delete " + x1)
            await deleteDoc(doc(db, "Request", x2))
            console.log("Item Ordered Retracted!", x1);
            //alert("Your order of " + s1 + " " + s2 + " @" + x1 + " has been retracted successfully")
            alert("Your order of " + x1 + " has been retracted successfully")


            let tb = document.getElementById("table")
            while(tb.rows.length > 1){
                tb.deleteRow(1)
            }
            //document.getElementById("totalProfit").innerHTML = ""
            display()
        }

    }
}
</script>

<style scoped>
h1, h2{
    text-align: center;
    background-color: yellow ;
    font: 600;
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em ;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;


}

table {
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

.bwt{
    color: whitesmoke;
    background-color: black;
}

</style>