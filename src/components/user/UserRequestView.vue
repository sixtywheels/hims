<template>
  <div>
    <div><user-navigation></user-navigation></div>
  <h3>User Request Form for Yap Kai</h3>

  <div id="app">
    <div class = "containerOrderItems">
    <UserRequestComponent  @added="change"/>
    </div>

    <h2> Your Transactions </h2>

    <div class = "containerOrderDisplay">
        <UserRequestDisplayComponent :key="refreshComp"/>
    </div>
    
  </div>
  </div>

</template>

<script>

import UserRequestComponent from './UserRequestComponent.vue'
import UserRequestDisplayComponent from './UserRequestDisplayComponent.vue'
import UserNavigation from './UserNavigation.vue'

  export default {  
    name:"UserRequestView",
    components:{ UserRequestComponent, UserRequestDisplayComponent, UserNavigation }, // , OrderDisplay },

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