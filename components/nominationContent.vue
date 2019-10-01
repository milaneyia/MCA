<template>
    <div>
        <p v-if="info">{{ info }}</p>
        <hr>
        <input type="text" v-model.trim="searchBm" @keyup.enter="searchBeatmapset" placeholder="keywords 4 ur bm to nominate">

        <div v-for="category in categories">
            <div v-if="category.name != 'mappers'">
                {{category.name}}
                <div style="margin-left:10px;" v-for="subCategory in category.subCategories">
                    {{ subCategory.name }}
                    <nomination
                        style="margin-left: 10px;"
                        :subCategory="subCategory"
                        :beatmapsets.sync="beatmapsetsSearched"
                        :nominations.sync="nominations"
                        :mode="mode"
                        :is-maps="true"
                    >
                    </nomination>
                </div>
            </div>

            <div v-else>
                <hr>
                <input type="text" v-model.trim="userToSearch" @keyup.enter="searchUser" placeholder="username|id">

                {{category.name}}
                <div style="margin-left:10px;" v-for="mapperCategory in category.subCategories">
                    {{ mapperCategory.name }}
                    <nomination
                        style="margin-left: 10px;"
                        :subCategory="mapperCategory"
                        :user="userSearched"
                        :nominations.sync="nominations"
                        :mode="mode"
                    >
                    </nomination>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import axios from 'axios';
import nomination from '~/components/nomination.vue';

export default Vue.extend({
    components: { 
        nomination,
    },
    props: {
        mode: Number,
    },
    data () {
        return {
            info: null,
            searchBm: null,
            userToSearch: null,
            beatmapsetsSearched: null,
            userSearched: null,
            nominations: [],
            categories: null,
            selectedBeatmapsetCategory: null,
            selectedMapperCategory: null,
            canParticipate: null,
            selectedSubCategory: null,
        }
    },
    mounted: async function() {
        try {
            const data = (await axios.get(`/api/nominations/${this.mode}`)).data;
            if (!data.error) {
                this.nominations = data.nominations;
                this.categories = data.categories;
                this.canParticipate = data.canParticipate;
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        searchBeatmapset: async function() {
            try {
                const data = (await axios.get(`/api/nominations/${this.mode}/beatmapsets/${this.searchBm}`)).data;
                
                if (!data.error) {
                    this.beatmapsetsSearched = data.beatmapsets;
                }
            } catch (err) {
                console.log(err);
            }
        },
        searchUser: async function() {
            try {
                const data = (await axios.get(`/api/nominations/${this.mode}/users/${this.userToSearch}`)).data;

                if (!data.error) {
                    this.userSearched = data.user;
                }
            } catch (err) {
                console.log(err);
            }
        },
    }
});
</script>

<style>

</style>