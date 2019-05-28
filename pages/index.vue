<template>
  <div>
    <table>
      <tr v-for="beatmapset in beatmapsets" :key="beatmapset.id">
        <th>{{ beatmapset.artist + " - " + beatmapset.title }}</th>
        <th>{{ beatmapset.creator }}</th>
        <th><button @click="vote(beatmapset.id, 7)">vote</button></th>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    data () {
        return {
            beatmapsets: null,
        }
    },
    mounted: async function() {
        try {
            const data = (await axios.get('/api/beatmapsets')).data;
            if (data.beatmapsets) {
                this.beatmapsets = data.beatmapsets;
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        vote: async (beatmapsetId, vote) => {
            try {
                const res = (await axios.post('/api/vote', { 
                    beatmapsetId: beatmapsetId, 
                    vote: vote
                })).data;

                if (res.success) {
                    //something
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>