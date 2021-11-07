<template>
    <div id='catNav'>
        <v-btn v-on:click = "$router.push({ path:'/poweruserALL' })" color = "error">
            <div>Low Stock</div>
        </v-btn> &nbsp;
        <v-btn v-on:click = "$router.push({ path:'/poweruserdme' })" color="primary">
            <div>DME</div>
        </v-btn> &nbsp;
        <v-btn v-on:click = "$router.push({ path:'/powerusercovid19' })" color="primary">
            <div>COVID19</div>
        </v-btn> &nbsp;
        <v-btn v-on:click = "$router.push({ path:'/powerusersurgical' })" color="primary">
            <div>Surgical</div>
        </v-btn>
    <router-view/>
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
#catNav{
    text-align: center;
}

</style>
