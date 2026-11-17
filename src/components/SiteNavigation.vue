<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
            <RouterLink :to="{name: 'home' }">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-sun text-2xl" aria-hidden="true"></i>
                    <p class="text-2xl">App News</p>
                </div>
            </RouterLink>

            <div class="flex gap-3 flex-1 justify-end">
                <button
                    type="button"
                    class="text-xl hover:text-weather-secondary duration-150"
                    aria-label="Sobre o app"
                    @click="toggleModal"
                >
                    <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
                </button>
                <button
                    v-if="route.query.preview"
                    type="button"
                    class="text-xl hover:text-weather-secondary duration-150"
                    aria-label="Adicionar cidade"
                    @click="addCity"
                >
                    <i class="fa-solid fa-plus" aria-hidden="true"></i>
                </button>
            </div>

            <BaseModal
                :modalActive="modalActive"
                @close-modal="toggleModal"
            >
                <div class="text-black">
                <h1 class="text-2xl mb-1">Sobre:</h1>
                <p class="mb-4">
                    O App News permite acompanhar o clima atual e a previsão
                    das cidades que você escolher.
                </p>
                <h2 class="text-2xl">Como funciona:</h2>
                <ol class="list-decimal list-inside mb-4">
                    <li>
                    Pesquise a sua cidade digitando o nome na barra de busca.
                    </li>
                    <li>
                    Selecione uma cidade nos resultados para ver o clima atual
                    do local escolhido.
                    </li>
                    <li>
                    Acompanhe a cidade clicando no ícone "+" no canto superior
                    direito. Ela ficará salva na página inicial.
                    </li>
                </ol>

                <h2 class="text-2xl">Remover uma cidade</h2>
                <p>
                    Se não quiser mais acompanhar uma cidade, selecione-a na
                    página inicial. No fim da página haverá a opção de removê-la.
                </p>
                </div>
            </BaseModal>
        </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { uid } from 'uid';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import BaseModal from './BaseModal.vue';
import { loadCities, parseCoords, saveCities } from '@/services/weather';

const route = useRoute();
const router = useRouter();

const addCity = () => {
    const coords = parseCoords(route.query.lat, route.query.lng);
    if (!coords) return;

    const cities = loadCities();
    // Não duplica uma cidade já salva (mesmas coordenadas)
    const existing = cities.find(
        (c) => Number(c.coords.lat) === coords.lat && Number(c.coords.lng) === coords.lng
    );

    let id = existing?.id;
    if (!existing) {
        id = uid();
        cities.push({
            id,
            state: String(route.params.state ?? ''),
            city: String(route.params.city ?? ''),
            coords,
        });
        saveCities(cities);
    }

    const query = { ...route.query, id };
    delete query.preview;
    router.replace({ query });
};

const modalActive = ref(false);
const toggleModal = () => {
    modalActive.value = !modalActive.value;
};
</script>
