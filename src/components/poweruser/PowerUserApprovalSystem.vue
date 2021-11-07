<template>


<div>
  <!-- <h3>Power User Request Approval Page  for Yap Kai</h3> -->
    <div><power-user-navigation></power-user-navigation></div>


    <div id="approvalPage">
    
    <div class = "containertop">
      <div id = "containerRequestItems">
      <RequestForm  @added="change"/>
      </div>

      <div id = "containerOrderItems">
          <PowerUserSupplyOrderForm  @added="change"/>
      </div>

      <div id = "containerInsights">
          <PowerUserInventoryInsights/>
      </div>



    </div>

    <br>
    <br>
    <br>

    
    <!-- <div class = "containerOrderDisplay">
        <h2> Your Transactions </h2>
        <UserRequestDisplayComponent :key="refreshComp  "/>
    </div> -->
    <div class = "containerbottom">
      <div id = "containerOrderApproval">
          <h2> For Your Review </h2>
          <PowerUserApprovalComponent :key="refreshComp" />
      </div>
    </div>

    </div>

</div>

</template>

<script>
import RequestForm from '../RequestForm.vue'
import PowerUserSupplyOrderForm from './PowerUserSupplyOrderForm.vue'
import PowerUserNavigation from './PowerUserNavigation'
import PowerUserInventoryInsights from './PowerUserInventoryInsights'

//import UserRequestDisplayComponent from '../user/UserRequestDisplayComponent.vue'
import PowerUserApprovalComponent from './PowerUserApprovalComponent.vue'



import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query} from "firebase/firestore"
const db = getFirestore(firebaseApp);
import {getAuth, onAuthStateChanged} from  "firebase/auth";


  export default {  
    name:"PowerUserApprovalSystem",
    components:{ PowerUserNavigation,PowerUserInventoryInsights, RequestForm ,PowerUserSupplyOrderForm, PowerUserApprovalComponent }, //UserRequestDisplayComponent

    mounted(){
      
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if(user) {
          this.user = user;
          //console.log(this.user)
          this.authemail = user['email']
        }
      })
      this.verifyPU()

    },
    data: () =>  { //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
      refreshComp:0,
      authemail: '',
      puverified: false,
      }
    },
    methods:{
        change(){
            this.refreshComp +=1
        },

        async verifyPU(){
          console.log("VERIFYING PU....")
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
                      this.puverified = true
                  } else {
                    console.log("CHECK NEXT")
                  }
                }
            }catch (error) {
                console.error("Error checking document: ", error)
            }

            console.log(this.puverified)
            if(this.puverified == false){
                console.log("ROUTE THIS AWAY!!!")
            }
        },


    },

    

  }

</script>

<style scoped>

    #approvalPage{
        font-family: Avenir, Arial, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top:60px

    }

    #bg{
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 60%;
    }

    .containertop{
      float: top
    }

    .containerbottom{
      float: bottom;
      margin-top: 600px;
    }

    #containerRequestItems{
      float: left;
      height:650px ; 
      width: 700px;
    }

    #containerOrderItems{
      float: left;
      height:650px ;

    }

    #containerInsights{
      float: left;
      margin-left: 30px;

    }

    #containerOrderDisplay{
    }

    

</style>