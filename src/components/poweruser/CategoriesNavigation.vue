<template>
    <div id='catNav'>
        <v-btn v-on:click = "$router.push({ path:'/poweruserdme' })">
            <div>DME</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/poweruseracutecare' })">
            <div>Acute Care</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/powerusersurgical' })">
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

