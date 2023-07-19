<template>
<div>
    <div>
        <h1 class="text-center my-24 text-5xl">Streamer name</h1>
    </div>
    <div>
        <table class="w-full mt-6">
			<thead>
				<tr>
					<th>Nazwa</th>
					<th>Rozpoczęty</th>
					<th>Zakończony</th>
					<th>Czas trwania</th>
					<th>Szczegóły</th>
				</tr>
			</thead>
			<tbody>
				<!--<tr v-for="channel in data.items" :key="channel.id">
					<td>{{ channel.name }}</td>
					<td>{{ channel.externalId }}</td>
					<td>
						<a :href="channel.url">{{ channel.platform }}</a>
					</td>
					<td>Brak</td>
					<td> 
						<RouterLink :to="{ path: `/channel/${channel.externalId}` }"> 
							<VIcon  icon="bi bi-card-list" color="white"></VIcon>
						</RouterLink>
					</td>
				</tr>-->
			</tbody>
		</table>
    </div>
</div>
</template>
<script>
</script>