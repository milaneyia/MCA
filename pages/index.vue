<template>
  <div>
	<a
		v-if="!user || user.discord.userID === ''"
		href="/api/login/discord"
	>login discord</a>
	<a
		v-if="(user && user.osu.userID === '')"
		href="/api/login/osu"
	>login osu!</a>
	<div v-if="user">
		Discord username: {{ user.discord.username }}<br>
		osu! username: {{ user.osu.username }}<br>
	<p v-if="eligible">
		You are eligible
	</p>
	<p v-else>
		You are not eligible
	</p>
	</div>
	{{ value }}
	<div @click="run">
		click to run
	</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
	data () {
		return {
			user: null,
			value: "0%",
			eligible: false,
		}
	},
	mounted: async function() {
		try {
			const data = (await axios.get(`/api/user`)).data;

			if (data.error) {
				alert(data.error)
			} else {
				this.user = data.user;
				for (const eligibility of this.user.mca) {
					if (eligibility.year === (new Date).getUTCFullYear) {
						this.eligible = true
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	},
	methods: {
		async run () {
			const res = (await axios.post(`/api/user/guestDifficulty/2019`, {
				url: "https://osu.ppy.sh/beatmapsets/809748#osu/1699094"
			})).data
			if (res.error) {
				this.value = res.error
			} else {
				this.value = "Success!"
			}
		},
	},
}
</script>