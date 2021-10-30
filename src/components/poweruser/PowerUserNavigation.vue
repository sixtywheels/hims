<template>
    <div id='navigation'>
        <v-btn v-on:click = "$router.push({ path:'/PowerUserDashboard' })">
            <div>Dashboard</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/PowerUserAddItems' })">
            <div>Add new items</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/requestform' })">
            <div>Request Form</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/poweruserwip' })">
            <div>Order Form</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/poweruserwip' })">
            <div>Pending Approval</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/poweruserwip' })">
            <div>Closed Requests</div>
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

