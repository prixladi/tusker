FROM denoland/deno:1.31.2

WORKDIR /app

COPY ./import_map.json ./import_map.json
COPY ./src ./src

RUN deno cache --import-map=import_map.json ./src/app.ts

CMD ["run", "--allow-net", "--allow-env",  "--import-map=import_map.json", "./src/app.ts"]