<template>
    <div class="locale">
        <div 
            class="locale__current" 
            @click="change = !change"
        >
            <img 
                :src="$t('flag')"
                class="locale__flag"
            >
            <div class="locale__text">
                {{ $i18n.locale.toUpperCase() }}
            </div>
        </div>
        <div 
            v-if="change"
            class="locale__selector"
        >
            test
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    data () {
        return {
            change: false,
        };
    },
});
</script>

<style lang="scss">
.locale {
    color: #cccccc;
    padding-right: 1%;
}

.locale__current {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.locale__flag {
    height: 25px;
    padding-right: 10px;
}

.locale__text {
    font-size: 20px;
}

.locale__selector {

}
</style>