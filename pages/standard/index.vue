<template>
    <nomination-content
        :mode="mode"
    ></nomination-content>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import nominationContent from '~/components/nominationContent.vue';

export default Vue.extend({
    components: {
        nominationContent,
    },
    data () {
        return {
            mode: 1,
        }
    },
});
</script>