<template>
    <div id="poweruserloginpage">
        <h1>Hospital Inventory Management System <br> (HIMS)</h1>
        <router-link to="/" exact><v-icon dark right>mdi-home</v-icon></router-link>
        <h2>Logistics & Procurement Login Page</h2>
        <br/><br/>
        <div id="vcard">
            <v-card id="test" width="700">
                <div id="content">
                    <v-card-title>Login</v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field label="Email" v-model="email" append-icon="mdi-email"></v-text-field>
                            <v-text-field label="Password (Press icon to show/hide password)" v-model="password"
                                :value="myPass"                     
                                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="() => (value = !value)"
                                :type="value ? 'password' : 'text'">>
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-form @submit.prevent="login()">
                        <v-btn color="#B3E5FC" class="mr-4" v-on:click="login()">Login</v-btn>
                        </v-form>
                        <v-btn color="#EF9A9A" class="mr-4" v-on:click="resetValidation()">Reset Password</v-btn>
                        <v-btn color="#B2DFDB" class="mr-4" v-on:click="signuppage()">Sign Up</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </div>
    </div> 
</template>

<script>

import firebase from '@/uifire.js'
import 'firebase/compat/auth';
import { getFirestore } from "firebase/firestore";
import firebaseApp from '../../firebase.js';
const db = getFirestore(firebaseApp);
import { getDocs, query, where, collection } from "firebase/firestore";

export default {
    data() {
        return {
            email: null,
            password: null,
            value:String,
            myPass: String
        };
    },
    methods: {
        resetValidation: function() {
            this.$router.push({path: '/resetpassword'});
        },
        signuppage: function() {
            this.$router.push({path: '/powerusersignup'});
        },
        login: async function() {
            if (this.email == null|| this.password==null  ){
                alert("Please fill in your email and password!")
            } else {
                var data = await getDocs(query(collection(db, "powerusers"), where("email", "==", this.email)));
                if(data.empty) {
                    alert("No such company email exist in the database. If you are a hospital staff, please proceed to the hospital staff login page!")
                } else {
                    await firebase
                        .auth()
                        .signInWithEmailAndPassword(this.email, this.password)
                        .then(() => {
                            alert('Successfully logged in');
                            this.$router.push({ path: '/poweruserdashboard'});
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                }
            }
        },
    },
};


</script>

<style scoped>
#poweruserloginpage {
    position: relative;
    background-size: cover;
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/c/c0/KRW_Facade2_final.jpg");
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
}
#vcard {
    display: flex;
    align-items: center;
    justify-content: center;
}
h1 {
  text-align: center;
  padding-left: 20px;
  color: rgb(255, 255, 255);
  font-family: Nunito;
  font-weight: bolder;
  font-size: 40px;
}
h2 {
  text-align: center;  
  font-size: 34px;
  font-family: Nunito;
  font-weight: bolder;
  margin-top:43px;
  color: rgb(255, 255, 255);
}
#test {
    padding-left:20px;
    text-align: center;   
}
#content {
    padding: 3%
}
</style>