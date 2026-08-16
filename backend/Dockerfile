FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# ป้องกัน postinstall -> prisma generate
# ไม่ให้รันตอน Docker Build
RUN npm install --ignore-scripts

COPY . .

EXPOSE 5000

# ตอน Container เริ่มทำงาน Render จะมี DATABASE_URL แล้ว
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm start"]