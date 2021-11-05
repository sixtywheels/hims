<template>
<div>
    <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="5"
    class="elevation-1">
        <template v-slot:item.quantity = "props">
            <div>
                <b-progress
                :max = "props.item.threshold2">
                    <b-progress-bar variant="primary" :value = "props.item.quantity"></b-progress-bar>
                    <b-progress-bar variant="warning" :value = "props.item.pendingArrival"></b-progress-bar>
                </b-progress>
            </div>

                <!-- <v-progress-linear :return-value.sync="quant.item.quantity">
                </v-progress-linear>
                <p> {{quant.item.quantity}}</p> -->
        </template>
    
        <template v-slot:item.options="{}">
            <v-btn>Order</v-btn>
            <v-btn>Request</v-btn>
        </template >
        <template v-slot:item.threshold1="props">
            <v-edit-dialog
            :return-value.sync="props.item.threshold1"
            large
            persistent
            @save = "save(props)"
            @cancel = "cancel"
            @open = "open"
            @close = "close">
            {{props.item.threshold1}}
                <template v-slot:input>
                    <div class = "mt-4 text-h6">
                        Update Threshold
                    </div>
                    <v-text-field
                    v-model.number = "props.item.threshold1"
                    :rules = "[isInt]"
                    label = "Edit"
                    single-line
                    autofocus>
                    </v-text-field>
                </template>
            </v-edit-dialog>
        </template>
                <template v-slot:item.threshold2="props">
            <v-edit-dialog
            :return-value.sync="props.item.threshold2"
            large
            persistent
            @save = "save(props)"
            @cancel = "cancel"
            @open = "open"
            @close = "close">
            {{props.item.threshold2}}
                <template v-slot:input>
                    <div class = "mt-4 text-h6">
                        Update Threshold
                    </div>
                    <v-text-field
                    v-model.number = "props.item.threshold2"
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
import { collection, getDocs , doc, setDoc, deleteDoc} from "firebase/firestore"
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
                        value: 'id',
                    },
                    { text: 'Item Name', value: 'name' },
                    { text: 'Inventory Level', value: 'quantity' },
                    { text: 'Options', value: 'options' },
                    { text: 'Threshold1', value: 'threshold1' },
                    { text: 'Threshold2', value: 'threshold2' },
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

                    var name = yy.name
                    var category = yy.category

                    if (category == "DME"){
                        x.name = name
                        x.quantity = yy.quantity
                        x.id = yy.id
                        x.threshold1 = yy.threshold1
                        x.threshold2 = yy.threshold2
                        x.imgLink = yy.imgLink
                        x.category = yy.category
                        x.pendingArrival = this.findTotalPending(yy.id)

                        this.items = this.items.concat(x)
                    }
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

            deleteinstrument(name){
                var x = name
                deleteDoc(doc(db, "ItemSupplies", x))

                let tb = document.getElementById("table")
                while(tb.rows.length > 1){
                    tb.deleteRow(1)
                }
                console.log("Document successfully deleted!", x);
            },
    
            async appendinstrument2(item, threshold){
                var a = (item.id)
                var b = (item.imgLink)
                var c = (item.name)
                var d = (item.threshold1)
                var e = (item.category)
                var f = (item.quantity)
                console.log(b)
                await setDoc(doc(db, "ItemSupplies", a), {id: a, imgLink: b, name: c, threshold1: d, threshold2: threshold, category: e, quantity: f})
            },
    
            async appendinstrument1(item, threshold){
                var a = (item.id)
                var b = (item.imgLink)
                var c = (item.name)
                var d = (item.threshold2)
                var e = (item.category)
                var f = (item.quantity)
                await setDoc(doc(db, "ItemSupplies", a), {id: a, imgLink: b, name: c, threshold1: threshold, threshold2: d, category: e, quantity: f})
            },

            save (props) {
                this.snack = true
                var a = (props.item.id)
                var b = (props.item.imgLink)
                var c = (props.item.name)
                var d = (props.item.threshold2)
                var e = (props.item.category)
                var f = (props.item.quantity)
                var g = (props.item.threshold1)
                setDoc(doc(db, "ItemSupplies", a), {id: a, imgLink: b, name: c, threshold1: g, threshold2: d, category: e, quantity: f})
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
                    
                    a.id = yy.Item_Id
                    a.quant = yy.Order_Quantity
                    
                    this.pending = this.pending.concat(a)
                })
                this.pending2 = this.getPendingReduced(this.pending)
                return this.pending2;
            },

            getPendingReduced(array) {
                var reduced_array = array.reduce( (final,data) => {
                    let isAlready = final.find( ( value ) => { 
                        value.id == data.id;
                    });
                    if(!isAlready){
                        final.push( data );
                    } 
                    else {
                        var index = final.indexOf(isAlready);
                        final[index].quant = parseFloat(final[index].quant) + parseFloat(data.quant);
                    } return final; 
                }, [] )
                return reduced_array;
            },

            findTotalPending(id2) {
                var item = this.pending2.find(x => x.id === id2).quant  
                return item
            }
        }
    }
    
    
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
