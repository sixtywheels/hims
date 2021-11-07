<template>
    <div>
        <div><user-navigation></user-navigation></div>
        <h1 style="text-align: center">This is a PowerUser page. <br> You are at the right route! <br> Unfortunately, this page is still a work in progress.</h1>
        <v-container fluid>
            <v-layout justify-center align-center>
                <v-flex shrink>
                    <div>
                        <v-img
                            height=100%
                            width=100%
                            src="https://cdn.mos.cms.futurecdn.net/96e541c2568f8085d56251d01bff4137.jpg"
                        ></v-img>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import UserNavigation from './UserNavigation'

export default {

    components: {
        UserNavigation: UserNavigation,
    }
}
</script>
