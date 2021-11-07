<template>
    <div>
        <div><user-navigation></user-navigation></div>
        <br>
        <h1>Dashboard Categories</h1>
        <div><user-categories-navigation></user-categories-navigation></div>
    </div>
</template>

<script>
import UserNavigation from './UserNavigation.vue'
import UserCategoriesNavigation from './UserCategoriesNavigation.vue'

export default {
    components: {
        UserNavigation: UserNavigation,
        UserCategoriesNavigation: UserCategoriesNavigation,
    }
}
</script>

<style scoped>
 h1{
    text-align:center;
}
</style>
