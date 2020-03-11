<template>
    <div>
        <p v-if="info">
            {{ info }}
        </p>

        <hr>
        
        <select v-model="selectedCategory">
            <option
                v-for="category in categories"
                :key="category.ID"
                :value="category"
            >
                {{ category.name }} - {{ category.mode.name }} - {{ category.section.name }}
            </option>
        </select>

        <input
            v-model.trim="searchValue"
            type="text"
            placeholder="keywords to search"
            @keyup.enter="search"
        >

        <div>
            <div
                v-for="result in results"
                :key="result.ID"
            >
                {{ result.title || result.osu.username }}

                <button @click="nominate(result.ID)">
                    nominate
                </button>
            </div>
        </div>

        <hr>

        <div
            v-for="category in categories"
            :key="category.ID"
        >
            {{ category.name }} - {{ category.mode.name }} - {{ category.section.name }}

            <div
                v-for="nomination in getNominations(category.ID)"
                :key="nomination.ID"
                style="margin-left: 20px"
            >
                <span v-if="category.sectionID == 1">
                    {{ nomination.beatmapset.title }}
                </span>
                
                <span v-else>
                    {{ nomination.user.osu.username }}
                </span>

                <button @click="remove(nomination.ID)">
                    remove
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface Nomination {
    ID: number;
    category: Category;
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
            nominations: [] as Nomination[],
            categories: [],
            searchValue: "",
            selectedCategory: null as null | Category,
            results: [],
            info: "",
        };
    },
    mounted: async function() {
        const res = await axios.get(`/api/nominations`);

        if (!res.data.error) {
            this.nominations = res.data.nominations;
            this.categories = res.data.categories;
        }
    },
    methods: {
        async search () {
            if (!this.selectedCategory) {
                return;
            }

            let res;

            if (this.selectedCategory.sectionID == 1) {
                res = await axios.get(`/api/beatmapsets/search?mode=${this.selectedCategory.mode.ID}&keywords=${this.searchValue}`);
            } else {
                res = await axios.get(`/api/users/search?user=${this.searchValue}`);
            }
            
            if (!res.data.error) {
                this.results = res.data;
            }
        },
        getNominations (categoryID: number) {
            return this.nominations.filter(n => n.category.ID === categoryID);
        },
        async nominate (nomineeId: number) {
            this.info = "";
            
            if (!this.selectedCategory) {
                return;
            }
            
            const res = await axios.post(`/api/nominations/create`, {
                categoryId: this.selectedCategory?.ID,
                nomineeId,
            });

            if (res.data.error) {
                this.info = res.data.error;
            } else {
                this.nominations.push(res.data);
            }
        },
        async remove (nominationID: number) {
            this.info = "";
            const res = await axios.post(`/api/nominations/${nominationID}/remove`);

            if (res.data.error) {
                this.info = res.data.error;
            } else {
                const i = this.nominations.findIndex(n => n.ID == nominationID);
                this.nominations.splice(i, 1);
            }
        },
    },
});
</script>
