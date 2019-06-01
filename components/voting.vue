<template>
    <div>
        <select v-model="selectedCategory">
            <option
                v-for="category in categories"
                :key="category.id"
                :value="category"
            >
                {{ category.name }}
            </option>
        </select>
        <span v-if="selectedCategory">
            <span v-for="nominee in nominees" :key="nominee.id">
                <span v-if="nominee.categoryId == selectedCategory.id">
                    <slot :nominee="nominee"></slot>
                    <button
                        v-if="hasVoted(nominee.id)"
                        style="background-color: red;"
                        @click="unvote(nominee.id)"
                    >
                        {{ getPoints(nominee.id) }}
                    </button>
                    <span v-else v-for="points in 7" :key="points">
                        <button
                            v-if="canVote(selectedCategory.id, points)"
                            @click="vote(nominee.id, points)"
                        >
                            {{ points }}
                        </button>
                    </span>
                </span>
            </span>
        </span>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        nominees: Array,
        categories: Array,
        votes: Array,
        mode: Number,
    },
    data () {
        return {
            selectedCategory: null,
        }
    },
    methods: {
        getPoints: function(nomineeId) {
            if (this.votes) {
                return this.votes.find(v => v.nominationId == nomineeId).points;
            }
        },
        hasVoted: function(nomineeId) {
            if (this.votes) {
                return this.votes.find(v => v.nominationId == nomineeId);
            } else {
                return false;
            }
        },
        canVote: function(categoryId, points) {
            if (this.votes) {
                const count = this.votes.filter(v => v.points == points && v.nomination.categoryId == categoryId);
                let canVote = false;
                switch (points) {
                    case 7:
                    case 6:
                    case 5:
                        canVote = count.length < 1;
                        break;
                    case 4:
                    case 3:
                        canVote = count.length < 2;
                        break;
                    case 2:
                    case 1:
                        canVote = count.length < 3;
                        break;
                    default:
                        return false;
                        break;
                }
                return canVote;
            } else {
                return false;
            }
        },
        vote: async function(nomineeId, points) {
            try {
                const data = (await axios.post('/api/votes/vote', { 
                    nomineeId: nomineeId,
                    points: points,
                    modeId: this.mode,
                })).data;
                
                if (data.vote) {
                    this.votes.push(data.vote);
                    this.$emit('update:votes', this.votes);
                }
            } catch (err) {
                console.log(err);
            }
        },
        unvote: async function(nomineeId) {
            const points = this.getPoints(nomineeId);

            try {
                const data = (await axios.post('/api/votes/unvote', { 
                    nomineeId: nomineeId,
                    points: points,
                    modeId: this.mode,
                })).data;
                
                if (data.success) {
                    const i = this.votes.findIndex(v => v.nominationId == nomineeId && v.points == points);
                    this.votes.splice(i, 1);
                    this.$emit('update:votes', this.votes);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}
</script>
