<template>
<div>
    <user-navigation></user-navigation>
    <RequestForm></RequestForm>
</div>
</template>

<script>
import RequestForm from '../RequestForm.vue'
import UserNavigation from './UserNavigation.vue'

export default {
    components: {
        RequestForm: RequestForm,
        UserNavigation: UserNavigation,
    }
}
</script>
brb