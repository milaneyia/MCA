<template>
    <div>
        <nuxt-link
            v-for="locale in availableLocales"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
        >
            <p>{{ locale.code }}</p>
        </nuxt-link>


        <div v-html="$t('ayim.index.home')" />
    </div>
</template>

<script>

export default {
    computed: {
        availableLocales () {
            return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale);
        },
    },
};

</script>