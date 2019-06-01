<template>
    <mode-content
        :mode="mode"
    ></mode-content>
</template>

<script>
import axios from 'axios';
import modeContent from '~/components/modeContent';

export default {
    components: {
        modeContent,
    },
    data () {
        return {
            mode: 1,
        }
    },
};
</script>