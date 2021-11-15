<template>
   <div id="powerusersignuppage">
       <h1>Hospital Inventory Management System <br> (HIMS)</h1>
       <router-link to="/" exact><v-icon dark right>mdi-home</v-icon></router-link>
       <h2>Logistics & Procurement Staff Sign Up Page</h2>
       <br/><br/>
       <div id="vcard">
           <v-card id="test" width="700">
               <div id="content">
                    <v-card-title>Sign Up Now!</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="register">
                            <v-text-field
                                type="email"
                                label="Email address"
                                required
                                v-model="email" append-icon="mdi-email">
                            </v-text-field>
                            <v-text-field label="Password (Press icon to show/hide password)" v-model="password"
                                :value="myPass"                     
                                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="() => (value = !value)"
                                :type="value ? 'password' : 'text'">
                            </v-text-field>      
                            <v-text-field
                                label="Staff ID"
                                v-model="staffID" append-icon="mdi-account">
                            </v-text-field>

                            <v-text-field
                                value="Logistics & Procurement"
                                label="Department"
                                readonly
                                append-icon="mdi-account-group"
                            ></v-text-field>
                            <v-btn color="#B3E5FC" class="mr-4" type="submit">Register</v-btn>
                        </v-form>
                    </v-card-text>
                    <br/>
                    <p>Already have account?</p>
                    <div id="loginbutton">
                        <v-btn v-on:click = "$router.push({path: '/poweruserlogin'})" color="blue">Login</v-btn>
                    </div>
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
import { setDoc, doc, getDocs, query, collection, where } from "firebase/firestore";

export default {
    data() {
        return {
            email: '',
            password: '',
            staffID:'',
            department: 'Logistics & Procurement',
            value:String,
        };
    },
    methods: {
        register: async function() {
            if (this.email == null || this.password == null || this.staffID == null) {
                alert("Please fill up the fields!")
            } else { 
                var currentUser = await getDocs(query(collection(db, "users"), where("staffID", "==", this.staffID)));
                var currentPowerUser = await getDocs(query(collection(db, "powerusers"), where("staffID", "==", this.staffID)));
                if (currentUser.empty && currentPowerUser.empty){
                    await firebase
                        .auth()
                        .createUserWithEmailAndPassword(this.email, this.password)
                        .then(async () => {
                            const user = firebase.auth().currentUser;
                            user.updateProfile({
                                displayName: this.fullName
                            }).then(async () => {
                                await setDoc(doc(db, "powerusers", this.staffID), {
                                    email: this.email,
                                    staffID: this.staffID,
                                    department: this.department,
                                });
                                await firebase.auth().signOut().then(function() {
                                    console.log("Signed Up and Signed Out!");
                                }, function(error) {
                                    console.log(error);
                                })
                                .then(() => {
                                    alert("Account Created Successfully!");
                                    this.$router.push("poweruserlogin");
                                })  
                            }).catch(error => {
                                alert(error.message);
                            });
                        }).catch(error => {
                                    alert(error.message);
                        });
                } else {
                    alert("An account has already been created for staff ID: " + this.staffID)
                }
            }
        },
    },
    
};
</script>

<style scoped>
#powerusersignuppage {
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
#loginbutton {
    margin-left:-10px;
}
#content {
    padding: 3%
}
</style>