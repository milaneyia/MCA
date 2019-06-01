<template>
    <div>
        <small>already nominated:</small>
        <span v-if="nominations">
            <span v-if="isMaps">
                <button 
                    v-for="nomination in beatmapsetsNominations" :key="nomination.id"
                    style="background-color: red"
                    @click="cancelNomination(nomination.beatmapset.id, category.id)"
                >
                    {{ nomination.beatmapset.title }}
                </button>
            </span>
            <span v-else>
                <button 
                    v-for="nomination in mappersNominations" :key="nomination.id"
                    style="background-color: red"
                    @click="cancelNomination(nomination.user.id, category.id)" 
                >
                    {{ nomination.user.username }}
                </button>
            </span>
        </span>

        <small>searched:</small>
        <span v-if="beatmapsets">
            <span v-for="beatmapset in beatmapsets" :key="beatmapset.id">
                <button
                    v-if="hasNominated(beatmapset.osuId, category.id)"
                    style="background-color: red"
                    @click="cancelNomination(beatmapset.id, category.id)" 
                >{{ beatmapset.title }}</button>
                <button 
                    v-else-if="canNominate(category, beatmapset)"
                    @click="nominate(beatmapset.id, category.id)"
                >{{ beatmapset.title }}</button>
                <button 
                    v-else
                    disabled
                >{{ beatmapset.title }}</button>
            </span>
        </span>
        <span v-else-if="user">
            <button
                v-if="hasNominated(user.id, category.id)"
                style="background-color: red"
                @click="cancelNomination(user.id, category.id)" 
            >{{ user.username }}</button>
            <button 
                v-else-if="canNominate(category, user)"
                @click="nominate(user.id, category.id)"
            >{{ user.username }}</button>
            <button 
                v-else
                disabled
            >{{ user.username }}</button>
        </span>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        category: Object, 
        beatmapsets: Array,
        user: Object,
        mode: Number,
        isMaps: Boolean,
        nominations: Array,
    },
    computed: {
        modeCategories: function() {
            return this.categories.filter(c => c.modeId == this.mode && (this.isMaps ? c.isMaps : c.isMappers));
        },
        beatmapsetsNominations: function() {
            if (this.nominations && this.category) {
                return this.nominations.filter(n => n.beatmapsetId && n.categoryId == this.category.id);
            }
        },
        mappersNominations: function() {
            if (this.nominations && this.category) {
                return this.nominations.filter(n => n.userId && n.categoryId == this.category.id);
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
        canNominate: function(category, nominee) {
            let nominationCount = [];
            if (this.nominations) {
                nominationCount = this.nominations.filter(n => n.categoryId == category.id)
            }

            let fitsLength = true;
            if (this.isMaps) {
                fitsLength =  (nominee.isMarathon && category.name != 'Marathon') || (nominee.isSpread && category.name != 'Spread');
            }

            let fitsGenre = true;
            if (this.isMaps && category.isGenre) {
                fitsGenre = nominee.genre == category.name;
            }
            
            return nominationCount.length < category.allowedNominations && fitsGenre && fitsLength;
        },
        nominate: async function(nomineeId, categoryId) {
            try {
                const data = (await axios.post('/api/nominations/nominate', { 
                    nomineeId: nomineeId,
                    categoryId: categoryId,
                    modeId: this.mode,
                })).data;
                
                if (data.nomination) {
                    this.nominations.push(data.nomination);
                    this.$emit('update:nominations', this.nominations);
                }
            } catch (err) {
                console.log(err);
            }
        },
        cancelNomination: async function(nomineeId, categoryId) {
            try {
                const res = (await axios.post('/api/nominations/cancelNomination', { 
                    nomineeId: nomineeId,
                    categoryId: categoryId,
                    modeId: this.mode,
                })).data;

                if (res.success) {
                    let i;
                    if (this.isMaps) {
                        i = this.nominations.findIndex(n => n.categoryId == categoryId && n.beatmapsetId == nomineeId);
                    } else {
                        i = this.nominations.findIndex(n => n.categoryId == categoryId && n.userId == nomineeId);
                    }
                    this.nominations.splice(i, 1);
                    this.$emit('update:nominations', this.nominations);
                }
            } catch (err) {
                console.log(err);
            }
        },
    }
}
</script>
