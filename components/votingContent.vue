<template>
    <div>
        <div v-for="category in categories">
            <div v-if="category.name != 'mappers'">
                {{category.name}}
                <div style="margin-left:10px;" v-for="subCategory in category.subCategories">
                    {{ subCategory.name }}
                    <voting
                        :nominees="getNominations(subCategory.id)"
                        :subCategory="subCategory"
                        :votes.sync="votes"
                        :mode="mode"
                        v-slot="slotProp"
                    >
                        {{ slotProp.nominee.beatmapset.title }}
                    </voting>
                </div>
            </div>

            <div v-else>
                {{category.name}}
                <div style="margin-left:10px;" v-for="mapperCategory in category.subCategories">
                    {{ mapperCategory.name }}
                    <voting
                        :nominees="getMappersNominations(mapperCategory.id)"
                        :subCategory="mapperCategory"
                        :votes.sync="votes"
                        :mode="mode"
                        v-slot="slotProp"
                    >
                        {{ slotProp.nominee.user.username }}
                    </voting>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import voting from '~/components/voting';

export default {
    components: { 
        voting,
    },
    props: {
        mode: Number,
    },
    data () {
        return {
            beatmapsetsNominations: [],
            mappersNominations: [],
            nominations: [],
            categories: null,
            votes: null,
            canParticipate: null,
        }
    },
    mounted: async function() {
        try {
            const data = (await axios.get(`/api/voting/${this.mode}`)).data;
            
            if (!data.error) {
                this.nominations = data.nominations;
                this.categories = data.categories;
                this.beatmapsetsNominations = data.beatmapsetsNominations;
                this.mappersNominations = data.mappersNominations;
                this.votes = data.votes;
                this.canParticipate = data.canParticipate;
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        getNominations(subCategoryId) {
            if (this.beatmapsetsNominations) {
                return this.beatmapsetsNominations.filter(b => b.subCategoryId == subCategoryId)
            }
        },        
        getMappersNominations(subCategoryId) {
            if (this.mappersNominations) {
                return this.mappersNominations.filter(b => b.subCategoryId == subCategoryId)
            }
        }
    }
};
</script>

<style>

</style>