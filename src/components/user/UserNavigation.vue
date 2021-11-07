<template>
    <div id='navigation'>
        <v-btn v-on:click = "$router.push({ path:'/UserDashboard' })">
            <div>Dashboard</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/requestform' })">
            <div>Request Form</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/userwip' })">
            <div>Pending Approval</div>
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

