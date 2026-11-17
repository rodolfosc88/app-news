# App News

App de clima em Vue 3 + Vite: pesquise uma cidade (Mapbox), veja o clima atual,
a previsão por hora e a dos próximos 7 dias (OpenWeather) e salve suas cidades
favoritas no navegador.

## Configuração

```sh
npm install
cp .env.example .env   # preencha as chaves
npm run dev
```

Build de produção:

```sh
npm run build
```

## Segurança das chaves de API

- **Toda variável `VITE_*` é embutida no JavaScript público.** Não coloque
  chaves secretas ou com cobrança ilimitada no `.env` do frontend.
- **Mapbox:** use um token público (`pk.`) com restrição de URL para o domínio
  do site.
- **OpenWeather:** a One Call 3.0 exige cartão cadastrado. Defina um limite
  diário de chamadas na conta ou, de preferência, chame a API por um proxy no
  servidor (ex.: função serverless) que guarde a chave.
- Nunca faça commit do `.env` (ele está no `.gitignore`).

## Cabeçalhos recomendados no deploy

Configure no servidor/hospedagem (Netlify, Vercel, Nginx etc.):

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' https://openweathermap.org data:; connect-src 'self' https://api.openweathermap.org https://api.mapbox.com; frame-src https://www.google.com
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

Como o app usa `createWebHistory`, configure também o fallback de rotas para
`index.html`.

## Scraper (protótipo)

`scripts/scraper.py` coleta manchetes do G1 Sul do Rio e Costa Verde. Não é
usado pelo app. Veja as instruções no próprio arquivo.
