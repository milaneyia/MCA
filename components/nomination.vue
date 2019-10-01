<template>
    <div>
        <div>
            <small>already nominated:</small>
            <span v-if="nominations">
                <span v-if="isMaps">
                    <button 
                        v-for="nomination in beatmapsetsNominations" :key="nomination.id"
                        style="background-color: red"
                        @click="cancelNomination(nomination.beatmapset.id, subCategory.id)"
                    >
                        {{ nomination.beatmapset.title }}
                    </button>
                </span>
                <span v-else>
                    <button 
                        v-for="nomination in mappersNominations" :key="nomination.id"
                        style="background-color: red"
                        @click="cancelNomination(nomination.user.id, subCategory.id)" 
                    >
                        {{ nomination.user.username }}
                    </button>
                </span>
            </span>
        </div>

        <div>
            <small>searched:</small>
            <span v-if="beatmapsets">
                <span v-for="beatmapset in beatmapsets" :key="beatmapset.id">
                    <button
                        v-if="hasNominated(beatmapset.id, subCategory.id)"
                        style="background-color: red"
                        @click="cancelNomination(beatmapset.id, subCategory.id)" 
                    >{{ beatmapset.title }}</button>
                    <button 
                        v-else-if="canNominate(subCategory, beatmapset)"
                        @click="nominate(beatmapset.id, subCategory.id)"
                    >{{ beatmapset.title }}</button>
                    <button 
                        v-else
                        disabled
                    >{{ beatmapset.title }}</button>
                </span>
            </span>
            <span v-else-if="user">
                <button
                    v-if="hasNominated(user.id, subCategory.id)"
                    style="background-color: red"
                    @click="cancelNomination(user.id, subCategory.id)" 
                >{{ user.username }}</button>
                <button 
                    v-else-if="canNominate(subCategory, user)"
                    @click="nominate(user.id, subCategory.id)"
                >{{ user.username }}</button>
                <button 
                    v-else
                    disabled
                >{{ user.username }}</button>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import Vue, { PropOptions } from 'vue';

export default Vue.extend({
    name: 'nomination',
    props: {
        subCategory: Object, 
        beatmapsets: Array,
        user: Object,
        mode: Number,
        isMaps: Boolean,
        nominations: Array,
    },
    computed: {
        beatmapsetsNominations: function() {
            if (this.nominations && this.subCategory) {
                return this.nominations.filter(n => n.beatmapsetId && n.subCategoryId == this.subCategory.id);
            }
        },
        mappersNominations: function() {
            if (this.nominations && this.subCategory) {
                return this.nominations.filter(n => n.userId && n.subCategoryId == this.subCategory.id);
            }
        },
    },
    methods: {
        hasNominated: function(nomineeOsuId, categoryId) {
            if (this.nominations) {
                if (this.isMaps) {
                    return this.nominations.find(n => n.beatmapsetId == nomineeOsuId && n.categoryId == categoryId);
                } else {
                    return this.nominations.find(n => n.userId == nomineeOsuId && n.categoryId == categoryId);
                }
            } else {
                return false;
            }
        },
        canNominate: function(subCategory, nominee) {
            let nominationCount = [];
            if (this.nominations) {
                nominationCount = this.nominations.filter(n => n.subCategoryId == subCategory.id)
            }

            let fitsLength = true;
            if (this.isMaps && (subCategory.name == 'Marathon' || subCategory.name == 'Spread')) {
                fitsLength =  (nominee.isMarathon && subCategory.name != 'Marathon') || (nominee.isSpread && subCategory.name != 'Spread');
            }
            
            return nominationCount.length < subCategory.allowedNominations && fitsLength;
        },
        nominate: async function(nomineeId, subCategoryId) {
            try {
                const data = (await axios.post('/api/nominations/nominate', { 
                    nomineeId: nomineeId,
                    subCategoryId: subCategoryId,
                    modeId: this.mode,
                })).data;
                console.log(data);
                
                if (data.nomination) {
                    this.nominations.push(data.nomination);
                    this.$emit('update:nominations', this.nominations);
                }
            } catch (err) {
                console.log(err);
            }
        },
        cancelNomination: async function(nomineeId, subCategoryId) {
            try {
                const res = (await axios.post('/api/nominations/cancelNomination', { 
                    nomineeId: nomineeId,
                    subCategoryId: subCategoryId,
                    modeId: this.mode,
                })).data;

                if (res.success) {
                    let i;
                    if (this.isMaps) {
                        i = this.nominations.findIndex(n => n.subCategoryId == subCategoryId && n.beatmapsetId == nomineeId);
                    } else {
                        i = this.nominations.findIndex(n => n.subCategoryId == subCategoryId && n.userId == nomineeId);
                    }
                    this.nominations.splice(i, 1);
                    this.$emit('update:nominations', this.nominations);
                }
            } catch (err) {
                console.log(err);
            }
        },
    }
});
</script>
