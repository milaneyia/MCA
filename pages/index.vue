<template>
    <div>
        <form v-if="!user" action="/api/login" method="get">
            <button type="submit">loginorsmtg</button>
        </form>

        requestAccess for
        <span v-if="user && !user.canParticipate" >
            <select v-model="modeId">
                <option value="1">std</option>
                <option value="2">taiko</option>
                <option value="3">ctb</option>
                <option value="4">mania</option>
                <option value="5">sb</option>
            </select>
            <input type="text" v-model="evidence" @keyup.enter="requestAccess" placeholder="ur unranked, link gd">
            <p v-if="info">{{ info }}</p>
        </span>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data () {
        return {
            user: null,
            evidence: null,
            info: null,
            modeId: null,
        }
    },
    mounted: async function() {
        try {
            const data = (await axios.get(`/api/user`)).data;
            
            if (!data.error) {
                this.user = data.user;
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        requestAccess: async function() {            
            try {
                const data = (await axios.post(`/api/users/requestAccess`, {
                    evidence: this.evidence,
                    modeId: this.modeId,
                })).data;

                this.info = data.success || data.error;
            } catch (err) {
                console.log(err);
            }
        },
    }
};
</script>