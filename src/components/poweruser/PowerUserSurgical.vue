<template>
<div>

<h1> Inventory Table DME </h1>

<v-progress-linear value="15"></v-progress-linear>

<table id= "table">
    <tr>
    <th>S.No</th>
    <th>Name</th>
    <th>Inventory Level</th>
    <th>Options</th>
    <th>Edit Threshold</th>
    </tr>
</table><br><br>

</div>
</template>

<script>

import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc, deleteDoc, setDoc} from "firebase/firestore"
const db = getFirestore(firebaseApp);

export default {
    mounted(){
    async function display(){
        let z = await getDocs(collection(db,"ItemSupplies"))
        let ind = 1

        z.forEach((docs) => {
            let yy = docs.data()
            var table = document.getElementById("table")
            var row = table.insertRow(ind)

            var name = (yy.name)
            var inventory_lvl = (yy.quantity)
            var category = (yy.category)
            
            //pop-up-form div
            var pop_up = document.createElement('div')
            pop_up.class = "form-popup"
            pop_up.id = "threshold_pop"
            
            pop_up.style.display = "none"
            pop_up.style.position = "relative"

            var form_pop_up = document.createElement('form')
            form_pop_up.class = "form-container"
            pop_up.appendChild(form_pop_up)

            var pop_up_button_close = document.createElement("button")
            pop_up_button_close.class = "btn cancel"
            pop_up_button_close.innerHTML = "close-form"
            pop_up_button_close.type = "button"
            pop_up_button_close.onclick = function closeForm() {
                pop_up.style.display = "none";
                pop_up_button_open.style.display = "block"
            }

            //button to open the pop-up
            var pop_up_button_open = document.createElement("button")
            pop_up_button_open.class = "open-button"
            pop_up_button_open.innerHTML = "Open Form"
            pop_up_button_open.style.display = "block"
            pop_up_button_open.onclick = function openForm() {
                pop_up.style.display = "block";
                pop_up_button_open.style.display = "none"
            }

            if (category == "surgical") {

            var cell1 = row.insertCell(0); var cell2 = row.insertCell(1); var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3); var cell5 = row.insertCell(4);
    
            cell1.innerHTML = ind; cell2.innerHTML = name; cell3.innerHTML = inventory_lvl;
            
            var bu_request = document.createElement("button")
            bu_request.className = "Request"
            bu_request.innerHTML = "Request"
            bu_request.onclick = function(){
            }
            cell4.appendChild(bu_request)

            // Start of Inventory bar using v-progress

            var bu_order = document.createElement("button")
            bu_order.className = "Order"
            bu_order.innerHTML = "Order"
            bu_order.onclick = function(){
            }
            cell4.appendChild(bu_order)

            //Start of pop-up
            //Creating an input field for each pop-up form

            var input_field = document.createElement("input")
            input_field.id = "Threshold_input"
            input_field.type = "number"
            input_field.min = "0"
            input_field.placeholder = "Enter Threshold"
            input_field.required = true
            form_pop_up.appendChild(input_field)
            
            var bu_edit_low = document.createElement("button")
            bu_edit_low.className = "Edit_low"
            bu_edit_low.innerHTML = "Edit_low"
            bu_edit_low.type = "submit"
            bu_edit_low.onclick = function(){
                var threshold_input_1 = parseInt(input_field.value);
                appendinstrument1(yy, threshold_input_1);
                deleteinstrument(name);
            }
            form_pop_up.appendChild(bu_edit_low)

            var bu_edit_high = document.createElement("button")
            bu_edit_high.className = "Edit_high"
            bu_edit_high.innerHTML = "Edit_high"
            bu_edit_high.type = "submit"
            bu_edit_high.onclick = function(){
                var threshold_input_2 = parseInt(input_field.value);
                appendinstrument2(yy, threshold_input_2)
                deleteinstrument(name);
            }
            form_pop_up.appendChild(bu_edit_high)
            form_pop_up.appendChild(pop_up_button_close)

            //pop-up Appened into cell 6
            cell5.appendChild(pop_up_button_open)
            cell5.appendChild(pop_up)
            ind += 1
        }

        })

    }
    
    display()

    function deleteinstrument(name){
            var x = name
            deleteDoc(doc(db, "ItemSupplies", x))

            let tb = document.getElementById("table")
            while(tb.rows.length > 1){
                tb.deleteRow(1)
            }
            console.log("Document successfully deleted!", x);
            display()
        }
    
    async function appendinstrument2(item, threshold){
            var a = (item.id)
            var b = (item.imgLink)
            var c = (item.name)
            var d = (item.threshold1)
            var e = (item.category)
            var f = (item.quantity)
            console.log(b)
            await setDoc(doc(db, "ItemSupplies", a), {id: a, imgLink: b, name: c, threshold1: d, threshold2: threshold, category: e, quantity: f})
        }
    
    async function appendinstrument1(item, threshold){
            var a = (item.id)
            var b = (item.imgLink)
            var c = (item.name)
            var d = (item.threshold2)
            var e = (item.category)
            var f = (item.quantity)
            await setDoc(doc(db, "ItemSupplies", a), {id: a, imgLink: b, name: c, threshold1: threshold, threshold2: d, category: e, quantity: f})
        }
    
    /*function getClass(a, threshold1, threshold2) {
        if (a < threshold1) {
            this.class = "first"
            return this.class
        }
        if (a > threshold2) {
            this.class = "third"
            return this.class
        }
        else {
            this.class = "second"
            return this.class
        }
    }*/   
    }
};
</script>

<style scoped>

table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    background-color: yellow;
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
