<template>
    <div>
        <p v-if="info">{{ info }}</p>

        <span v-if="requests && requests.length">
            <p v-for="request in requests" :key="request.id">
                {{ request.user.username }} : {{ request.evidence }} : {{ request.mode.name }}
                <button @click="grantAccess(request.userId, request.modeId)">grant access</button>
                <button @click="denyAccess(request.userId, request.modeId)">deny access</button>
            </p>
        </span>
        <p v-else>noone requests</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data () {
        return {
            requests: null,
            info: null,
        }
    },
    mounted: async function() {
        try {
            const data = (await axios.get(`/api/staff`)).data;

            if (!data.error) {
                this.requests = data.requests;
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        grantAccess: async function(userId, modeId) {
            try {
                const data = (await axios.post(`/api/staff/grantAccess`, {
                    userId: userId,
                    modeId: modeId,
                })).data;

                this.info = data.response;
            } catch (err) {
                console.log(err);
            }
        },
        denyAccess: async function(userId, modeId) {
            try {
                const data = (await axios.post(`/api/staff/denyAccess`, {
                    userId: userId,
                    modeId: modeId,
                })).data;

                this.info = data.response;
            } catch (err) {
                console.log(err);
            }
        }
    }
}
</script>
