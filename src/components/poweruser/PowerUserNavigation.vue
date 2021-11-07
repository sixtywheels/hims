<template>
    <div id='navigation'>
        <v-btn v-on:click = "$router.push({ path:'/PowerUserDashboard' })">
            <div>Dashboard</div>
        </v-btn>

        <v-btn v-on:click = "$router.push({ path:'/PowerUserAddItems' })">
            <div>Add new items</div>
        </v-btn>

        <v-btn v-on:click = "$router.push({ path:'/poweruserapprovalsystem' })">
            <div>Pending Approval</div>
        </v-btn>
        
        <v-btn v-on:click = "$router.push({ path:'/powerusertrackarrival' })">
            <div>Add Arrivals</div>
        </v-btn>

        <v-btn v-on:click="logout">
            <div>Logout</div>
        </v-btn>
    </div>
</template>

<script>

import firebase from '@/uifire.js'

export default{
    data(){
        return{};
    },

    methods: {
        logout() {
            firebase
            .auth()
            .signOut()
            .then(() => {
                alert("You are logging out now.")
                this.$router.replace({ path: "/" });
            });
        },
    }
}
</script>

