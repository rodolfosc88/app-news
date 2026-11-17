<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input 
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Procure uma cidade ou estado"
        aria-label="Procure uma cidade ou estado"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus: outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="mapboxSearchResults"
      >
        <li v-if="searchError" class="py-2">Desculpe, ocorreu algum erro, por favor tente novamente.</li>
        <li v-else-if="mapboxSearchResults.length === 0" class="py-2">Nenhum dado encontrado, por favor tente outro nome.</li>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.id"
            class="py-2"
          >
            <button type="button" class="w-full text-left" @click="previewCity(searchResult)">
            {{ searchResult.properties.full_address }}
            </button>
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList/>
        <template #fallback>
          <CityCardSkeleton/>
        </template>
      </Suspense>
    </div>
    <iframe
      title="Mapa da região Sul Fluminense"
      class="pt-4 mb-8 relative"
      src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d471622.5865893255!2d-44.53612832046377!3d-22.558469228000707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x9e782a945692b7%3A0x41a16cad689ba04e!2sItatiaia%2C%20RJ!3m2!1d-22.4912927!2d-44.572122799999995!4m5!1s0x9ea9999fde2429%3A0xfab1426cfb273033!2sSerra%20das%20Araras%20-%20Rod.%20Pres.%20Dutra%2C%20160%20-%20Pira%C3%AD%2C%20RJ%2C%2027175-000!3m2!1d-22.6665229!2d-43.8413009!5e0!3m2!1spt-BR!2sbr!4v1731609891873!5m2!1spt-BR!2sbr" 
      width="100%" 
      height="350" 
      style="border:0;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="strict-origin-when-cross-origin">
    </iframe>
  </main>
</template>

<script setup>
import CityCardSkeleton from '@/components/CityCardSkeleton.vue';
import CityList from '@/components/CityList.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { searchPlaces } from '@/services/weather';

const router = useRouter();

const placeNames = (result) => {
  const props = result.properties ?? {};
  const parts = (props.full_address ?? '').split(',').map((p) => p.trim());
  const city = props.name || parts[0] || 'Cidade';
  const state = props.context?.region?.name || parts[1] || props.context?.country?.name || '-';
  return { city, state };
};

const previewCity = (searchResult) => {
  const { city, state } = placeNames(searchResult);
  const [lng, lat] = searchResult.geometry?.coordinates ?? [];
  router.push({
    name: 'cityView',
    params: { state, city },
    query: { lat, lng, preview: true },
  });
};

const searchQuery = ref('');
const mapboxSearchResults = ref(null);
const searchError = ref(false);
let queryTimeout = null;
let lastRequest = 0;

const getSearchResults = () => {
  clearTimeout(queryTimeout);
  queryTimeout = setTimeout(async () => {
    const query = searchQuery.value.trim();
    searchError.value = false;
    if (!query) {
      mapboxSearchResults.value = null;
      return;
    }
    // Evita que uma resposta antiga sobrescreva a mais recente
    const requestId = ++lastRequest;
    try {
      const results = await searchPlaces(query);
      if (requestId === lastRequest) mapboxSearchResults.value = results;
    } catch {
      if (requestId === lastRequest) {
        searchError.value = true;
        mapboxSearchResults.value = [];
      }
    }
  }, 300);
};
</script>
