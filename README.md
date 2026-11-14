# Mini-frontend pentru API
- **URL API:** https://jsonplaceholder.typicode.com/posts (GET listă, POST creare, DELETE ștergere)
- **Link live:** https://github.com/Beatrice95/Proiectarea-si-realizarea-site-urilor-WEB 
- **CORS:** rezolvat prin header pe server: JSONPlaceholder răspunde cu `Access-Control-Allow-Origin: *`, deci browserul permite cererile de pe GitHub Pages.
- **Status codes tratate** (verific mereu `raspunsServer.ok`):
  - `200` la GET: randez lista; la DELETE: scot elementul din listă.
  - `201` la POST: adaug elementul primit în listă, fără re-fetch.
  - `4xx` / `5xx`: afișez mesajul serverului (`message`) sau `Eroare <cod>` lângă formular / deasupra listei.
  - Eroare de rețea (`fetch` aruncă excepție, prinsă în `catch`): afișez un mesaj generic.
- **Stări listă:** „Se încarcă...”, mesaj de eroare, „Nu există postări.”
