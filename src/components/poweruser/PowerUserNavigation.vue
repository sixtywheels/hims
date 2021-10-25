<template>
    <div id='navigation'>
        <v-btn v-on:click = "$router.push({ path:'/PowerUserDME' })">
            <div>click here</div>
        </v-btn>
    </div>
</template>

<script>
export default{
    data(){
        return{};
    }
}
</script>

<style scoped>

#navigation {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;
  display: flex;
  color:white;
  background-color:#079C72;
  height:80px;
  font-size:35px;
  font-family: "Sanchez";
  min-width:1400px;
}
</style>