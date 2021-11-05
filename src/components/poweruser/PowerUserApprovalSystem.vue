<template>


<div>
  <h3>Power User Request Approval Page  for Yap Kai</h3>
    <div><power-user-navigation></power-user-navigation></div>


    <div id="app">
    
    <div class = "containertop">
      <div id = "containerRequestItems">
      <RequestForm  @added="change"/>
      </div>

      <div id = "containerOrderItems">
      <PowerUserSupplyOrderForm  @added="change"/>
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

//import UserRequestDisplayComponent from '../user/UserRequestDisplayComponent.vue'
import PowerUserApprovalComponent from './PowerUserApprovalComponent.vue'

  export default {  
    name:"PowerUserApprovalSystem",
    components:{ PowerUserNavigation, RequestForm ,PowerUserSupplyOrderForm, PowerUserApprovalComponent }, //UserRequestDisplayComponent

    data: () =>  { //https://renatello.com/dynamic-drop-down-list-in-vue-js/
      return{
      refreshComp:0,
      }
    },
    methods:{
        change(){
            this.refreshComp +=1
        }
    }

  }

</script>

<style scoped>

    #app{
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
      padding-top: 800px;
    }

    #containerRequestItems{
      float: left;
      height:650px ; 
    }

    #containerOrderItems{
      float: right;
      height:650px ;

    }

    #containerOrderDisplay{
    }

    

</style>