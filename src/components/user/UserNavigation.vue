<template>
    <div id='navigation'>
        <v-btn v-on:click = "$router.push({ path:'/UserDashboard' })">
            <div>Dashboard</div>
        </v-btn> &nbsp;
        <v-btn v-on:click = "$router.push({ path:'/userrequestform' })">
            <div>Request Form</div>
        </v-btn> &nbsp;
        <v-btn v-on:click = "$router.push({ path:'/userpastrequest' })">
            <div>View Past Requests</div>
        </v-btn> &nbsp;
        <v-btn v-on:click="logout">
            <div>Logout</div>
        </v-btn> &nbsp;
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

<style scoped>

#navigation{
    text-align:center;
    background-color: #B2DFDB;
    padding: 10px;
}

</style>

