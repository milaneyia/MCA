<template>
    <div>
        <input
            v-model.trim="name"
            type="text"
        >
        
        <select v-model="newCategoryMode">
            <option 
                v-for="mode in modes" 
                :key="mode.ID" 
                :value="mode.ID"
            >
                {{ mode.name }}
            </option>
        </select>
        
        <button @click="create">
            create
        </button>
    
        <hr>

        <select v-model="selectedCategory">
            <option
                v-for="category in categories"
                :key="category.ID"
                :value="category"
            >
                {{ category.name }}
            </option>
        </select>

        <template v-if="selectedCategory">
            <input 
                v-model.trim="selectedCategory.name" 
                type="text"
                :disabled="!selectedCategory.ID"
            >
                
            <select
                v-model="selectedCategory.modeID"
                :disabled="!selectedCategory.ID"
            >
                <option 
                    v-for="mode in modes" 
                    :key="mode.ID" 
                    :value="mode.ID"
                >
                    {{ mode.name }}
                </option>
            </select>

            <button @click="update">
                update
            </button>
            
            <button @click="remove">
                remove
            </button>
        </template>

        <hr>
        
        <div
            v-for="beatmap in beatmaps"
            :key="beatmap.ID"
        >
            <input
                v-model="selectedCategory.beatmaps"
                :value="beatmap"
                type="checkbox"
            >

            {{ beatmap.ID }} - {{ beatmap.title }} - {{ beatmap.artist }}
        </div>

        <hr>

        {{ info }}
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';

interface Category {
    ID: number;
    name: string;
    modeID: number;
    beatmaps: object[];
}

export default Vue.extend({
    data () {
        return {
            categories: [] as Category[],
            beatmaps: [],
            selectedCategory: {} as Category,
            modes: [],
            info: '',
            name: '',
            newCategoryMode: 0,
        }
    },
    async mounted () {
        const res = await Axios.get('/api/staff/categories/');

        if (res.data && !res.data.error) {
            this.categories = res.data.categories;
            this.beatmaps = res.data.beatmaps;
            this.modes = res.data.modes;
        }
    },
    methods: {
        async create () {
            this.info = '';
            const res = await Axios.post(`/api/staff/categories/create`, {
                name: this.name,
                mode: this.newCategoryMode,
            });
            
            if (res.data.error) {
                this.info = res.data.error;
            } else if (res.data) {
                this.categories.push(res.data);
                this.info = 'ok';
            }
        },
        async update () {
            if (!this.selectedCategory) {
                return;
            }
            
            this.info = '';
            const res = await Axios.post(`/api/staff/categories/${this.selectedCategory.ID}/update`, {
                name: this.selectedCategory.name,
                beatmaps: this.selectedCategory.beatmaps,
                mode: this.selectedCategory.modeID,
            });
            
            if (res.data.error) {
                this.info = res.data.error;
            } else if (res.data) {
                const i = this.categories.findIndex(c => c.ID === this.selectedCategory.ID);
                Vue.set(this.categories, i, res.data);
                this.info = 'ok';
            }
        },
        async remove () {
            if (!this.selectedCategory) {
                return;
            }

            this.info = '';
            const res = await Axios.post(`/api/staff/categories/${this.selectedCategory.ID}/remove`);
            
            if (res.data.error) {
                this.info = res.data.error;
            } else if (res.data) {
                const i = this.categories.findIndex(c => c.ID === this.selectedCategory.ID);

                if (i !== -1) {
                    this.categories.splice(i, 1);
                }
            }
        },
    }
})
</script>
