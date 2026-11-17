<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- Banner -->
        <div
            v-if="route.query.preview"
            class="text-white p-4 bg-weather-secondary w-full text-center"
        >
            <p>Você está pré-visualizando uma cidade, clique no botão "+" para adicionar a cidade à lista.</p>
        </div>
        <div v-if="!weatherData" class="text-white text-center py-12 px-8">
            <p class="mb-4">Não foi possível carregar a previsão do tempo para este local.</p>
            <RouterLink :to="{ name: 'home' }" class="underline">Voltar ao início</RouterLink>
        </div>
        <template v-else>
        <!-- Previsão do Tempo -->
        <div class="flex flex-col items-center text-white py-12">
            <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
            <p class="text-sm mb-12">
                {{ 
                    new Date(weatherData.currentTime).toLocaleDateString("pt-BR",
                    {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                    })    
                }}
                {{ 
                    new Date(weatherData.currentTime).toLocaleTimeString("pt-BR",
                    {
                        timeStyle: "short",
                    })    
                }}
            </p>
            <p class="text-8xl mb-8">
                {{ Math.round(weatherData.current.temp) }}&deg;
            </p>
            <div class="text-center">
                <p>
                    Sensação térmica
                    {{ Math.round(weatherData.current.feels_like) }} &deg;
                </p>
                <p class="capitalize">
                    {{ weatherData.current.weather[0].description }}
                </p>
                <img 
                    class="w-[150px] h-auto"
                    :src="
                        iconUrl(weatherData.current.weather[0].icon)
                    " 
                    alt=""
                    aria-hidden="true"
                />
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <!-- Previsão por hora -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">Previsão por hora</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div 
                        v-for="hourData in weatherData.hourly" 
                        :key="hourData.dt"
                        class="flex flex-col gap-4 items-center"
                    >
                        <p class="whitespace-nowrap text-md">
                            {{ 
                            new Date(hourData.currentTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) 
                            }}
                        </p>
                        <img 
                            class="w-auto h-[50px] object-cover"
                            :src="
                                iconUrl(hourData.weather[0].icon)
                            "
                            alt=""
                    aria-hidden="true"
                        >
                        <p class="text-xl">
                            {{ Math.round(hourData.temp) }}&deg;
                        </p>
                    </div>
                </div>
            </div>            
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <!-- Previsão Semanal -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">Previsão nos próximos 7 dias</h2>
                <div
                    v-for="day in weatherData.daily"
                    :key="day.dt"
                    class="flex items-center"
                >
                    <p class="flex-1">
                        {{ 
                            new Date(day.dt * 1000).toLocaleDateString(
                                "pt-BR",
                                {
                                    weekday: "long",
                                }
                            )    
                        }}
                    </p>
                    <img 
                        class="w-[50px] h-[50px] object-cover"
                        :src="
                            iconUrl(day.weather[0].icon)
                            "
                        alt=""
                    aria-hidden="true">
                    <div class="flex gap-2 flex-1 justify-end">
                        <p>Máx: {{ Math.round(day.temp.max) }}</p>
                        <p>Mín: {{ Math.round(day.temp.min) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <button
            v-if="!route.query.preview && route.query.id"
            type="button"
            class="flex items-center gap-2 py-12 text-white duration-150 hover:text-red-500"
            @click="removeCity"
        >
            <i class="fa-solid fa-trash" aria-hidden="true"></i>
            <span>Remover Cidade</span>
        </button>
        </template>
    </div>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { getForecast, iconUrl, loadCities, parseCoords, saveCities } from '@/services/weather';

const route = useRoute();
const router = useRouter();

// Converte os horários UTC da API para o fuso da cidade consultada
const toCityTime = (dt, timezoneOffset) => {
    const localOffset = new Date().getTimezoneOffset() * 60000;
    return dt * 1000 + localOffset + timezoneOffset * 1000;
};

const getWeatherData = async () => {
    const coords = parseCoords(route.query.lat, route.query.lng);
    if (!coords) return null;
    try {
        const data = await getForecast(coords);
        data.currentTime = toCityTime(data.current.dt, data.timezone_offset);
        data.hourly = (data.hourly ?? []).slice(0, 24).map((hour) => ({
            ...hour,
            currentTime: toCityTime(hour.dt, data.timezone_offset),
        }));
        data.daily = data.daily ?? [];
        return data;
    } catch (error) {
        console.error('Erro ao buscar previsão do tempo:', error?.message);
        return null;
    }
};
const weatherData = await getWeatherData();

const removeCity = () => {
    const updatedCities = loadCities().filter((city) => city.id !== route.query.id);
    saveCities(updatedCities);
    router.push({ name: 'home' });
};
</script>
