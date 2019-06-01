<template>
    <div>
        <p v-if="info">{{ info }}</p>
        <hr>
        <p>
            nominations bms: 
            <select v-model="selectedBeatmapsetCategory">
                <option
                    v-for="category in beatmapsetsCategories"
                    :key="category.id"
                    :value="category"
                >
                    {{ category.name }}
                </option>
            </select>
            <input type="text" v-model.trim="searchBm" @keyup.enter="searchBeatmapset" placeholder="keywords 4 ur bm to nominate">
        </p>
        <nomination
            v-if="selectedBeatmapsetCategory"
            :category="selectedBeatmapsetCategory"
            :beatmapsets.sync="beatmapsetsSearched"
            :nominations.sync="nominations"
            :mode="mode"
            :is-maps="true"
        >
        </nomination>
        <hr>
        <p>
            nominations users: 
            <select v-model="selectedMapperCategory">
                <option
                    v-for="category in mappersCategories"
                    :key="category.id"
                    :value="category"
                >
                    {{ category.name }}
                </option>
            </select>
            <input type="text" v-model.trim="userToSearch" @keyup.enter="searchUser" placeholder="username|id">
        </p>
        <nomination
            v-if="selectedMapperCategory"
            :category="selectedMapperCategory"
            :user="userSearched"
            :nominations.sync="nominations"
            :mode="mode"
        >
        </nomination>

        <hr>
        <p>bms to vote eventuallytm:</p>
        <voting
            :nominees="beatmapsetsToVote"
            :categories="beatmapsetsCategories"
            :votes.sync="votes"
            :mode="mode"
            v-slot="slotProp"
        >
            {{ slotProp.nominee.beatmapset.title }}
        </voting>
        <hr>
        <p>users to vote eventually:</p>
        <voting
            :nominees="mappersToVote"
            :categories="mappersCategories"
            :votes.sync="votes"
            :mode="mode"
            v-slot="slotProp"
        >
            {{ slotProp.nominee.user.username }}
        </voting>
    </div>
</template>

<script>
import axios from 'axios';
import nomination from '~/components/nomination';
import voting from '~/components/voting';

export default {
    components: { 
        nomination,
        voting,
    },
    props: {
        mode: Number,
    },
    data () {
        return {
            info: null,
            searchBm: null,
            userToSearch: null,
            beatmapsetsToVote: [],
            mappersToVote: [],
            beatmapsetsSearched: null,
            userSearched: null,
            nominations: [],
            categories: null,
            selectedBeatmapsetCategory: null,
            selectedMapperCategory: null,
            votes: null,
            canVote: null,
        }
    },
    mounted: async function() {
        try {
            const data = (await axios.get(`/api/initialData/modes/${this.mode}`)).data;
            if (!data.error) {
                this.beatmapsetsToVote = data.beatmapsets;
                this.nominations = data.nominations;
                this.categories = data.categories;
                this.beatmapsetsToVote = data.beatmapsetsToVote;
                this.mappersToVote = data.mappersToVote;
                this.votes = data.votes;
                this.canVote = data.canVote;
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        beatmapsetsCategories: function() {
            if (this.categories) {
                return this.categories.filter(c => c.isMaps);
            }
        },
        mappersCategories: function() {
            if (this.categories) {
                return this.categories.filter(c => c.isMappers);
            }
        }
    },
    methods: {
        searchBeatmapset: async function() {
            try {
                const data = (await axios.get(`/api/beatmapsets/${this.mode}/${this.searchBm}`)).data;
                if (!data.error) {
                    this.beatmapsetsSearched = data.beatmapsets;
                }
            } catch (err) {
                console.log(err);
            }
        },
        searchUser: async function() {
            try {
                const data = (await axios.get(`/api/users/${this.mode}/${this.userToSearch}`)).data;
                if (!data.error) {
                    this.userSearched = data.user;
                }
            } catch (err) {
                console.log(err);
            }
        },
    }
};
</script>