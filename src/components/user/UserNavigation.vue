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
        <v-btn v-on:click = "$router.push({ path:'/powerusersupplyorder' })">
            <div>Order Inventories Form</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/poweruserapprovalsystem' })">
            <div>Pending Approval</div>
        </v-btn>
        
        <v-btn v-on:click = "$router.push({ path:'/powerusertrackarrival' })">
            <div>Add Arrivals</div>
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

