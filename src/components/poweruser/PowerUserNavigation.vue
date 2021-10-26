<template>
    <div id='navigation'>
        <v-btn v-on:click = "$router.push({ path:'/PowerUserDashboard' })">
            <div>Dashboard</div>
        </v-btn>
        <v-btn v-on:click = "$router.push({ path:'/ManageItemSupplies' })">
            <div>Manage Item Supplies</div>
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

