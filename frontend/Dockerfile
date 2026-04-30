### STAGE 1: BUILD ###
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build -- --configuration=production

### STAGE 2: RUN ###
FROM nginx:alpine

# 1. On vide le dossier par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# 2. On copie les fichiers compilés d'Angular
# Vérifie bien que c'est 'frontend' le nom dans dist/ (vu dans ton angular.json)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# 3. ON COPIE NOTRE CONFIG PERSONNALISÉE
# C'est ici qu'on utilise le fichier créé à l'étape précédente
COPY deploiement/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
