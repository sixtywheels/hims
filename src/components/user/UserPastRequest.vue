<template>
    <div>
        <user-navigation></user-navigation>
        <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        class="elevation-1">
            
        </v-data-table>
    </div>
</template>

<script>
import UserNavigation from './UserNavigation.vue'
// import firebaseApp from '../../firebase.js';
// import { getFirestore } from "firebase/firestore";
// import { collection, getDocs , doc, setDoc} from "firebase/firestore"

// const db = getFirestore(firebaseApp);

export default {
    components: {
        UserNavigation: UserNavigation,
    },

    data() {
        return {
            headers: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: false,
                    value: 'Disbursement_Id',
                },
                { text: 'Item Name', value: 'Item_Name' },
                { text: 'Order Quantity', value: 'Order_Quantity' },
            ],
            items: []
        }
    }
}
</script>
