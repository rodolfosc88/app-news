<template>
    <div v-for="city in savedCities" :key="city.id">
        <CityCard :city="city" @click="goToCityView(city)"/>
    </div>

    <p v-if="savedCities.length === 0">
        Não há cidades adicionadas. Para começar a monitorar uma cidade, pesquise no campo acima.
    </p>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CityCard from './CityCard.vue';
import { getCurrentWeather, loadCities } from '@/services/weather';

const savedCities = ref([]);

const getCities = async () => {
    const cities = loadCities();

    // allSettled: uma cidade com erro não derruba a lista inteira
    const results = await Promise.allSettled(
        cities.map((city) => getCurrentWeather(city.coords))
    );

    savedCities.value = cities.map((city, index) => ({
        ...city,
        weather: results[index].status === 'fulfilled' ? results[index].value : null,
    }));
};

await getCities();

const router = useRouter();
const goToCityView = (city) => {
    router.push({
        name: 'cityView',
        params: { state: city.state, city: city.city },
        query: { id: city.id, lat: city.coords.lat, lng: city.coords.lng },
    });
};
</script>
