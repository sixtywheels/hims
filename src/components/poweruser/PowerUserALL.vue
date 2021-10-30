<template>
<div>
    <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="5"
    class="elevation-1">
        <template v-slot:item.Order_Quantity = "props">
            <div>
                <b-progress
                :max = "props.item.Threshold2">
                    <b-progress-bar variant="primary" :value = "props.item.Order_Quantity"></b-progress-bar>
                    <b-progress-bar variant="warning" :value = "props.item.pendingArrival"></b-progress-bar>
                </b-progress>
            </div>
        </template>
    
        <template v-slot:item.options="{}">
            <v-btn>Order</v-btn>
            <v-btn>Request</v-btn>
        </template >
        <template v-slot:item.Threshold1="props">
            <v-edit-dialog
            :return-value.sync="props.item.Threshold1"
            large
            persistent
            @save = "save(props)"
            @cancel = "cancel"
            @open = "open"
            @close = "close">
            {{props.item.Threshold1}}
                <template v-slot:input>
                    <div class = "mt-4 text-h6">
                        Update Threshold
                    </div>
                    <v-text-field
                    v-model.number = "props.item.Threshold1"
                    :rules = "[isInt]"
                    label = "Edit"
                    single-line
                    autofocus>
                    </v-text-field>
                </template>
            </v-edit-dialog>
        </template>
                <template v-slot:item.Threshold2="props">
            <v-edit-dialog
            :return-value.sync="props.item.Threshold2"
            large
            persistent
            @save = "save(props)"
            @cancel = "cancel"
            @open = "open"
            @close = "close">
            {{props.item.Threshold2}}
                <template v-slot:input>
                    <div class = "mt-4 text-h6">
                        Update Threshold
                    </div>
                    <v-text-field
                    v-model.number = "props.item.Threshold2"
                    :rules = "[isInt]"
                    label = "Edit"
                    single-line
                    autofocus>
                    </v-text-field>
                </template>
            </v-edit-dialog>
        </template>
     
    </v-data-table>
    <v-snackbar
    v-model="snack"
    :timeout="3000"
    :color="snackColor"
    >
        {{ snackText }}

        <template v-slot:action="{ attrs }">
            <v-btn
            v-bind="attrs"
            text
            @click="snack = false"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>
</div>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs , doc, setDoc} from "firebase/firestore"
const db = getFirestore(firebaseApp);

// const itemsRef =  collection(db, "ItemSupplies")

    export default {
        data () {
            return {
                snack: false,
                snackColor: '',
                snackText: '',
                isInt: v  => {
                    if (!isNaN(parseFloat(v)) && v >= 0) return true;
                    return 'Input has to be a Number!';
                },
                
                headers: [
                    {
                        text: 'S/N',
                        align: 'start',
                        sortable: false,
                        value: 'Item_Id',
                    },
                    { text: 'Item Name', value: 'Item_Name' },
                    { text: 'Inventory Level', value: 'Order_Quantity' },
                    { text: 'Options', value: 'options' },
                    { text: 'Threshold1', value: 'Threshold1' },
                    { text: 'Threshold2', value: 'Threshold2' },
                ],
                items: [],
                newthreshold1:0,
                newthreshold2:0,
                pending: [],
                pending2: [],
            }
        },

        mounted(){
            this.display()
        },

        methods: {
            async display(){
                let z  = await getDocs(collection(db, "ItemSupplies"));

                await this.getPending()
                

                z.forEach((docs) => {
                    let yy = docs.data()
                    let x = {}

                    var category = yy.Category
                    var name = yy.Item_Name

                    //if (category == "DME"){
                        x.Item_Name = name
                        x.Order_Quantity = yy.Order_Quantity
                        x.Item_Id = yy.Item_Id
                        x.Threshold1 = yy.Threshold1
                        x.Threshold2 = yy.Threshold2
                        x.ImgLink = yy.ImgLink
                        x.Category = category
                        if (this.findTotalPending(yy.Item_Id)) {
                            x.pendingArrival = this.findTotalPending(yy.Item_Id)
                        } else {
                            x.pendingArrival = 0
                        }

                        this.items = this.items.concat(x)
                    //}
                })
                return this.items
            },

            // submit1(){
            //     var item = this.item;
            //     var threshold = this.threshold1
            //     console.log(item, threshold) 
            //     this.appendinstrument1(item, threshold);
            //     this.deleteinstrument(item)
            // },

            //deleteinstrument(name){
            //    var x = name
            //   deleteDoc(doc(db, "ItemSupplies", x))

            //    let tb = document.getElementById("table")
            //    while(tb.rows.length > 1){
            //        tb.deleteRow(1)
            //    }
            //    console.log("Document successfully deleted!", x);
            //},
    
            //async appendinstrument2(item, threshold){
            //   var a = (item.id)
            //   var b = (item.imgLink)
            //    var c = (item.name)
            //    var d = (item.threshold1)
            //    var e = (item.category)
            //    var f = (item.quantity)
            //    console.log(b)
            //    await setDoc(doc(db, "ItemSupplies", a), {id: a, imgLink: b, name: c, threshold1: d, threshold2: threshold, category: e, quantity: f})
            //},
    
            //async appendinstrument1(item, threshold){
            //    var a = (item.id)
            //    var b = (item.imgLink)
            //    var c = (item.name)
            //    var d = (item.threshold2)
            //    var e = (item.category)
            //    var f = (item.quantity)
            //    await setDoc(doc(db, "ItemSupplies", a), {id: a, imgLink: b, name: c, threshold1: threshold, threshold2: d, category: e, quantity: f})
            //},                      x.Item_Name = name

            save (props) {
                this.snack = true
                var a = (props.item.Item_Id).toString()
                var b = (props.item.ImgLink)
                var c = (props.item.Item_Name)
                var d = (props.item.Threshold2)
                var e = (props.item.Category)
                var f = (props.item.Order_Quantity)
                var g = (props.item.Threshold1)
                setDoc(doc(db, "ItemSupplies", a), {Item_Id: parseInt(a), ImgLink: b, Item_Name: c, Threshold1: g, Threshold2: d, Category: e, Order_Quantity: f})
                // this.$firestoreRefs.user
                //     .update({ lastName: newLastName })
                //     .then(() => {
                //         console.log('user updated!')
                //     })
                // this.appendinstrument1(props.item, newthreshold1)
                // this.deleteinstrument(props.item.name)
                this.snackColor = 'success'
                this.snackText = 'Data saved'
            },

            cancel () {
                this.snack = true
                this.snackColor = 'error'
                this.snackText = 'Canceled'
            },
            open () {
                this.snack = true
                this.snackColor = 'info'
                this.snackText = 'Dialog opened'
            },
            close () {
                console.log('Dialog closed')
            },

            async getPending() {
                var z  = await getDocs(collection(db, "PendingArrival"));
                
                z.forEach((docs) => {
                    let yy = docs.data()
                    let a = {}
                    
                    a.Item_Id = yy.Item_Id
                    a.Topup_Quantity = yy.Topup_Quantity
                    
                    this.pending = this.pending.concat(a)
                })
                this.pending2 = this.getPendingReduced(this.pending)
                return this.pending2;
            },

            getPendingReduced(array) {
                var reduced_array = array.reduce( (final,data) => {
                    let isAlready = final.find( ( value ) => { 
                        value.Item_Id == data.Item_Id;
                    });
                    if(!isAlready){
                        final.push( data );
                    } 
                    else {
                        var index = final.indexOf(isAlready);
                        final[index].Topup_Quantity = final[index].Topup_Quantity+ data.Topup_Quantity;
                    } return final; 
                }, [] )
                return reduced_array;
            },

            findTotalPending(id2) {
                if (this.pending2.find(x => x.Item_Id === id2)) {
                    return this.pending2.find(x => x.Item_Id === id2).Topup_Quantity
                }
                else {
                    return 0
                }
            }
        }
    }
    
    
</script>

<style>

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
