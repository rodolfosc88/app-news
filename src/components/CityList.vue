<template>
    <div v-for="city in savedCities" :key="city.id">
        <CityCard :city="city" @click="goToCityView(city)"/>
    </div>

    <p v-if="savedCities.length === 0">
        Não há cidades adicionadas. Para começar a monitorar uma cidade, pesquise no campo acima.
    </p>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import CityCard from './CityCard.vue';
import { useRouter } from 'vue-router';

const savedCities = ref([]);
const getCities = async () => {
    if (localStorage.getItem("savedCities")){
        savedCities.value = JSON.parse(localStorage.getItem("savedCities"))
    }

    const requests = [];

    savedCities.value.forEach((city) => {
        requests.push(axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=038d07f0c5a70ba0088b7b2dfa293e2a&units=metric`
        ))
    })

    const weatherData = await Promise.all(requests);

    //Delay para melhorar UX
    await new Promise((res) => setTimeout(res, 1000));

    weatherData.forEach((value, index) => {
        savedCities.value[index].weather = value.data;
    })
}

await getCities();
const router = useRouter();
const goToCityView = (city) => {
    router.push({
        name: "cityView",
        params: { state: city.state, city: city.city},
        query: { id: city.id, lat: city.coords.lat, lng: city.coords.lng },
    });
}
</script>
