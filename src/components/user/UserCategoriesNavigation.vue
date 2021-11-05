<template>
    <div id='catNav'>
        <v-btn v-on:click = "$router.push({ path:'/userALL' })" color = "error">
            <div>Low Stock</div>
        </v-btn> &nbsp;
        <v-btn v-on:click = "$router.push({ path:'/userdme' })" color="primary">
            <div>DME</div>
        </v-btn> &nbsp;
        <v-btn v-on:click = "$router.push({ path:'/usercovid19' })" color="primary">
            <div>COVID19</div>
        </v-btn> &nbsp;
        <v-btn v-on:click = "$router.push({ path:'/usersurgical' })" color="primary">
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

