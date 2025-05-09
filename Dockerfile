# 1. Usa Node.js 20 en su variante slim
FROM node:20-slim

# 2. Instala las herramientas necesarias para compilar `sqlite3`
RUN apt-get update && apt-get install -y \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# 3. Crea el directorio de trabajo
WORKDIR /app

# 4. Copia los archivos de dependencias
COPY package*.json ./

# 5. Instala dependencias (esto compilará sqlite3)
RUN npm install

# 6. Copia el resto del código fuente
COPY . .

# 7. Construye la aplicación Next.js
RUN npm run build

# 8. Expone el puerto 3000 (puerto por defecto en Next.js)
EXPOSE 3000

# 9. Comando de inicio (puede ser "npm start" o "next start" según tu config)
CMD ["npm", "start"]