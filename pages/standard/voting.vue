<template>
    <voting-content
        :mode="mode"
    ></voting-content>
</template>

<script>
import axios from 'axios';
import votingContent from '~/components/votingContent';

export default {
    components: {
        votingContent,
    },
    data () {
        return {
            mode: 1,
        }
    },
};
</script>