<template>
    <div>
        <form v-if="!user" action="/api/login" method="get">
            <button type="submit">loginorsmtg</button>
        </form>

        <span v-if="user && !user.canVote" >
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
            const data = (await axios.get(`/api/initialData/user`)).data;
            
            if (!data.error) {
                this.user = data.user;
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        requestAccess: async function() {
            if (!this.evidence.includes('osu.ppy.sh/')) {
                this.info = 'not an osu link';
                return;
            }

            if (!this.modeId) {
                this.info = 'select a mode';
                return;
            }
            
            try {
                const data = (await axios.post(`/api/users/requestAccess`, {
                    evidence: this.evidence,
                    modeId: this.modeId,
                })).data;

                this.info = data.response;
            } catch (err) {
                console.log(err);
            }
        },
    }
};
</script>