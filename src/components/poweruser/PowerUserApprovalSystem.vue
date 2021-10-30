<template>

<div>
  <h3>Power User Request Approval Page  for Yap Kai</h3>

    <div id="app">

    <div class = "containerOrderItems">
    <UserRequestComponent  @added="change"/>
    </div>

    <br>
    <br>
    <br>
    <br>
    
    <div class = "containerOrderDisplay">
        <h2> Your Transactions </h2>
        <UserRequestDisplayComponent :key="refreshComp  "/>
    </div>
    
    <div class = "containerOrderApproval">
        <h2> For Your Review </h2>
        <PowerUserApprovalComponent :key="refreshComp" />
    </div>

    </div>

</div>

</template>

<script>
import UserRequestComponent from '../user/UserRequestComponent.vue'
import UserRequestDisplayComponent from '../user/UserRequestDisplayComponent.vue'
import PowerUserApprovalComponent from './PowerUserApprovalComponent.vue'

  export default {  
    name:"PowerUserApprovalSystem",
    components:{ UserRequestComponent , UserRequestDisplayComponent, PowerUserApprovalComponent },

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

    .containerOrderItems{
      height:450px ;
    }

    .containerOrderDisplay{
        float: bottom;
    }

</style>