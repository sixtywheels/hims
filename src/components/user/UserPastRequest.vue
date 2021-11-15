<template>
    <div>
        <user-navigation></user-navigation>
        <br>
        <h3 style="text-align: center;">Viewing past requests made by Staff {{userId}}</h3>
        <br>
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
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query} from "firebase/firestore"
import {getAuth, onAuthStateChanged} from  "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
    components: {
        UserNavigation: UserNavigation,
    },

    data() {
        return {
            authemail: '',
            uverified: false,
            userId: '',
            headers: [
                {
                    text: 'Request ID',
                    align: 'start',
                    sortable: true,
                    value: 'Disbursement_id',
                },
                { text: 'Date/Time', value: 'Date_Time' },
                { text: 'Item Name', value: 'Item_Name' },
                { text: 'Order Quantity', value: 'Order_Quantity' },
                { text: 'Status', value: 'Status' },
            ],
            items: []
        }
    },
    
    mounted(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user) {
                this.user = user;
                this.authemail = user['email']
            }
        })
        this.display()
    },

    methods: {
        async verifyU(){
            console.log("VERIFYING PU....")
            const ugetter =  getDocs(query(collection(db, "users") ) );

            var ufiltered = []

            try {
                const querySnapshot = await ugetter;
                querySnapshot.forEach((doc) => {
                ufiltered.push(doc.data())
                });
                
                for(let i =0; i < ufiltered.length ; i++){
                    if(ufiltered[i]['email'] == this.authemail){
                        console.log("WELCOME IN!")
                        this.uverified = true
                        this.userId = ufiltered[i]['staffID']
                    } 
                    else {
                    console.log("CHECK NEXT")
                    }
                }
            }
            catch (error) {
                console.error("Error checking document: ", error)
            }

            if (this.userId == ''){
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
                            this.uverified = true
                            this.userId = pufiltered[i]['staffID']
                        } 
                        else {
                        console.log("CHECK NEXT")
                        }
                    }
                }
                catch (error) {
                    console.error("Error checking document: ", error)
                }
            }

            console.log(this.uverified)
            if(this.uverified == false){
                console.log("ROUTE THIS AWAY!!!")
            }
        },

        async display(){
            await this.verifyU()

            console.log(this.userId)
            let z  = await getDocs(collection(db, "Request"));
            
            z.forEach((docs) => {
                let yy = docs.data()
                let x = {}

                var name = yy.Item_Name
                var requester = yy.UserId

                if (parseInt(this.userId) == requester){
                    x.Date_Time = yy.Timestamp
                    x.Item_Name = name
                    x.Order_Quantity = yy.Order_Quantity
                    x.Disbursement_id = yy.Trans_Id
                    x.Remarks = yy.Remarks
                    x.Status = yy.Status
                    this.items = this.items.concat(x)
                }
            })
            return this.items
        },
    }
}   
</script>