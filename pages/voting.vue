<template>
    <div>
        <h3>Choose 10 candidates, from most to less important</h3>

        <p v-if="info">
            {{ info }}
        </p>

        <hr>

        <div
            v-for="category in categories"
            :key="category.ID"
        >
            {{ category.name }} - {{ category.mode.name }} - {{ category.section.name }}

            <div
                v-for="nomination in category.nominations"
                :key="nomination.ID"
                style="margin-left: 20px"
            >
                <span v-if="category.sectionID == 1">
                    {{ nomination.beatmapset.title }}
                </span>
                
                <span v-else>
                    {{ nomination.user.osu.username }}
                </span>

                <button
                    v-if="relatedVote(nomination, category.ID)"
                    @click="remove(relatedVote(nomination, category.ID).ID)"
                >
                    remove ({{ relatedVote(nomination, category.ID).choice }})
                </button>
                
                <button
                    v-else 
                    @click="choose(nomination.ID)"
                >
                    choose ({{ getCurrentChoicePosition(category.ID) }})
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface Vote {
    ID: number;
    category: Category;
    userID: number;
    beatmapsetID: number;
    choice: number;
}

interface Nomination {
    ID: number;
    category: Category;
    userID: number;
    beatmapsetID: number;
}

interface Category {
    ID: number;
    sectionID: number;
    mode: {
        ID: number;
    }
}

export default Vue.extend({
    data () {
        return {
            votes: [] as Vote[],
            categories: [],
            info: "",
        };
    },
    mounted: async function() {
        const res = await axios.get(`/api/voting`);

        if (!res.data.error) {
            this.votes = res.data.votes;
            this.categories = res.data.categories;
        }
    },
    methods: {
        relatedVote (nomination: Nomination, categoryID: number): Vote | undefined {
            return this.votes.find(v => {
                if (v.category.ID == categoryID) {
                    if (v.category.sectionID == 1) {
                        return v.beatmapsetID == nomination.beatmapsetID;
                    }

                    return v.userID == nomination.userID;
                }
            });
        },
        getCurrentChoicePosition (categoryID: number): number {
            const relatedVotes = this.votes.filter(v => v.category.ID == categoryID);

            if (!relatedVotes.length) {
                return 1;
            }

            if (relatedVotes.length >= 10) {
                return 0;
            }

            let maxChoicesGiven = 1;

            for (const vote of relatedVotes) {
                if (vote.choice > maxChoicesGiven) {
                    maxChoicesGiven = vote.choice;
                }
            }

            return maxChoicesGiven + 1;
        },
        async choose (nomineeId: number) {
            this.info = "";
            const res = await axios.post(`/api/voting/create`, {
                nomineeId,
            });

            if (res.data.error) {
                this.info = res.data.error;
            } else {
                this.votes.push(res.data);
            }
        },
        async remove (voteID: number) {
            this.info = "";
            const res = await axios.post(`/api/voting/${voteID}/remove`);

            if (res.data.error) {
                this.info = res.data.error;
            } else {
                this.votes = res.data;
            }
        },
    },
});
</script>
