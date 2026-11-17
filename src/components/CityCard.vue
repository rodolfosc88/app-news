<template>
    <button
        type="button"
        class="flex w-full text-left py-6 px-3 bg-weather-secondary rounded-md shadow-md"
    >
        <div class="flex flex-col flex-1">
            <h2 class="text-3xl">{{ city.city }}</h2>
            <h3>{{ city.state }}</h3>
        </div>
        <div v-if="city.weather?.main" class="flex flex-col gap-2">
            <p class="text-3xl self-end">
                {{ Math.round(city.weather.main.temp) }}&deg;
            </p>
            <div class="flex gap-2">
                <span class="text-xs">
                    Sensação Térmica:
                    {{ Math.round(city.weather.main.feels_like) }}&deg;
                </span>
            </div>
        </div>
        <p v-else class="text-xs self-center">Clima indisponível</p>
    </button>
</template>

<script setup>
defineProps({
    city: {
        type: Object,
        default: () => ({}),
    },
});
</script>
