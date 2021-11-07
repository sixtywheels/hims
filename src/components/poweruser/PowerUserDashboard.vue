<template>
    <div>
        <div><power-user-navigation></power-user-navigation></div>
        <br>
        <h1>Dashboard Categories</h1>
        <div><categories-navigation></categories-navigation></div>
    </div>
</template>

<script>
import PowerUserNavigation from './PowerUserNavigation.vue'
import CategoriesNavigation from './CategoriesNavigation.vue'

export default {
    components: {
        PowerUserNavigation: PowerUserNavigation,
        CategoriesNavigation: CategoriesNavigation,
    }
}
</script>

<style scoped>
h1 {
    text-align: center;
}
</style>
