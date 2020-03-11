<template>
    <div>
        <div
            v-for="category in categories"
            :key="category.ID"
        >
            <b>{{ category.ID }} - {{ category.name }}</b>

            <div style="display: flex">
                <div style="flex-basis: 50%">
                    votes 

                    <div
                        v-for="vote in votes.filter(v => v.categoryID == category.ID)"
                        :key="vote.ID"
                    >
                        {{ category.sectionID == 1 ? vote.beatmapsetID : vote.userID }} - {{ vote.totalChoices }}
                    </div>
                </div>

                <div style="flex-basis: 50%">
                    winners 

                    <div
                        v-for="(winner, i) in winners.filter(w => w.categoryID == category.ID)"
                        :key="i"
                    >
                        {{ category.sectionID == 1 ? winner.beatmapsetID : winner.userID }} - {{ winner.totalChoices }}
                    </div>
                </div>
            </div>
            

            <hr>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Axios from "axios";

export default Vue.extend({
    data () {
        return {
            categories: [],
            votes: [],
            winners: [],
        };
    },
    async mounted () {
        let res = await Axios.get("/api/admin/");
        
        if (!res.data.error) {
            this.categories = res.data.categories;
            this.votes = res.data.votes;
        }

        res = await Axios.get("/api/admin/results");

        if (!res.data.error) {
            this.winners = res.data.winners;
        }
    },
});
</script>