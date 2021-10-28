<template>
  <div>
  <h3>User Request Form for Yap Kai</h3>


    <div class = "containerOrderItems">
    <UserRequestComponent  @added="change"/>
    </div>

    <h2> Your Transactions </h2>

    <!-- 
    <div class = "containerOrderDisplay">
        <OrderDisplay :key="refreshComp"/>
    </div>
    -->
  
  </div>

</template>

<script>

import UserRequestComponent from './UserRequestComponent.vue'
//import OrderDisplay from '@/components/OrderDisplay.vue'

  export default {  
    name:"UserRequestView",
    components:{ UserRequestComponent }, // , OrderDisplay },

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
    .containerOrderItems{
      height:450px ;
    }

    .containerOrderDisplay{
        float: bottom;
    }

</style>