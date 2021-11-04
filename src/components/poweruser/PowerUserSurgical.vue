<template>
<div>
    <v-data-table
    :headers="headers"
    :items="items"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    :items-per-page="5"
    show-expand
    class="elevation-1">

    <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
            <spark-line v-bind:id = 'item.Item_Id'/>
        </td>
        
    </template>

        <template v-slot:item.Order_Quantity = "props">
            <div>
                <b-progress
                :max = "props.item.Threshold2" show-value>
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
import SparkLine from "@/components/poweruser/SparkLine.vue"

const db = getFirestore(firebaseApp);
const delay = ms => new Promise(res => setTimeout(res, ms));

export default {
    components: {
        SparkLine
    },
    data () {
        return {
            expanded: [],
            singleExpand: true,
            labels: [],
            value: [],
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

                if (category == "Surgery"){
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

                    if (x.pendingArrival + x.Order_Quantity < x.Threshold1) {
                        console.log("TOO LOW")
                    }

                    this.items = this.items.concat(x)
                }
            })
            return this.items
        },

        async save (props) {
            this.snack = true
            var a = (props.item.Item_Id).toString()
            var b = (props.item.ImgLink)
            var c = (props.item.Item_Name)
            var d = (props.item.Threshold2)
            var e = (props.item.Category)
            var f = (props.item.Order_Quantity)
            var g = (props.item.Threshold1)

            var h = (props.item.pendingArrival)
            var current_quant = f + h
            var Trans_Id = await this.fetchTransId("PendingArrival")
            console.log(current_quant)
            if (g > d) {
                console.log("ERROR THRESHOLD2 MUST BE HIGHER THAN THRESHOLD1")
                this.snackColor = 'error'
                this.snackText = 'Canceled'
            }
            else if (current_quant < g) {
                console.log("LOOOOW")
                var Topupper = d - current_quant
                if (Topupper < 0) {
                    console.log("ERROR THRESHOLD2 MUST BE HIGHER THAN THRESHOLD1")
                    this.snackColor = 'error'
                    this.snackText = 'Canceled'
                }
                else {
                    setDoc(doc(db, "PendingArrival", a), {Item_Id: parseInt(a), Item_Name: c, Category: e, Topup_Quantity: Topupper, Trans_id: Trans_Id})
                    setDoc(doc(db, "ItemSupplies", a), {Item_Id: parseInt(a), ImgLink: b, Item_Name: c, Threshold1: g, Threshold2: d, Category: e, Order_Quantity: f})
                    this.snackColor = 'success'
                    this.snackText = 'Data saved'
                }
            }
            else {
                setDoc(doc(db, "ItemSupplies", a), {Item_Id: parseInt(a), ImgLink: b, Item_Name: c, Threshold1: g, Threshold2: d, Category: e, Order_Quantity: f})
                this.snackColor = 'success'
                this.snackText = 'Data saved'
            }
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

        async close () {
            console.log('Dialog closed')
            await delay(1000);
            location.reload()
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

        async getPending() {
            var z  = await getDocs(collection(db, "PendingArrival"));
            
            z.forEach((docs) => {
                let yy = docs.data()
                let a = {}
                var category = yy.Category

                if (category == "Surgery") {
                    a.Item_Id = yy.Item_Id
                    a.Topup_Quantity = yy.Topup_Quantity
                    
                    this.pending = this.pending.concat(a)

                }
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

.v-sheet--offset {
top: -24px;
position: relative;
}
</style>
