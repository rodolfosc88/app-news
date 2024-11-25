<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input 
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Procure uma cidade ou estado"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus: outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="mapboxSearchResults"
      >
      <p v-if="searchError">Desculpe, ocorreu algum erro, por favor tente novamente.</p>
      <p v-if="!searchError && mapboxSearchResults.length === 0">Nenhum dado encontrado, por favor tente outro nome.</p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.properties.full_address }}
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
      class="pt-4 mb-8 relative"
      src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d471622.5865893255!2d-44.53612832046377!3d-22.558469228000707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x9e782a945692b7%3A0x41a16cad689ba04e!2sItatiaia%2C%20RJ!3m2!1d-22.4912927!2d-44.572122799999995!4m5!1s0x9ea9999fde2429%3A0xfab1426cfb273033!2sSerra%20das%20Araras%20-%20Rod.%20Pres.%20Dutra%2C%20160%20-%20Pira%C3%AD%2C%20RJ%2C%2027175-000!3m2!1d-22.6665229!2d-43.8413009!5e0!3m2!1spt-BR!2sbr!4v1731609891873!5m2!1spt-BR!2sbr" 
      width="100%" 
      height="350" 
      style="border:0;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import CityList from '@/components/CityList.vue';
import CityCardSkeleton from '@/components/CityCardSkeleton.vue';

const router = useRouter();
const previewCity = (searchResult) => {
  console.log(searchResult);
  const [city, state] = searchResult.properties.full_address.split(",");
  router.push({
    name: "cityView",
    params: {state: state.replaceAll(" ", ""), city: city},
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true
    }
  })
}

const mapboxAPIkey = "pk.eyJ1IjoicnNjaG1pZHQ4OCIsImEiOiJjbTM2OXU1anowMzQ4Mm1wdzZ4bzEzanFhIn0.g4VqUGpLOtEnIv6akGgt4g";
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchError = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async() => {
    if(searchQuery.value !== ""){
      try {
        const result = await axios.get(
          `https://api.mapbox.com/search/geocode/v6/forward?q=${searchQuery.value}&access_token=${mapboxAPIkey}&types=place`
        );
        mapboxSearchResults.value = result.data.features;
      } catch {
        searchError.value = true;
      }
      return;
    }
    mapboxSearchResults.value = null;
  }, 300);
}
</script>