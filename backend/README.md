# QR Menu Backend API

Япон ресторанны QR menu системийн backend API.

## Онцлогууд

- **Express.js** - RESTful API
- **MongoDB + Mongoose** - Өгөгдлийн сан
- **TypeScript** - Type safety
- **JWT Authentication** - Хамгаалалт
- **Rate Limiting** - Хүсэлтийн хязгаарлалт
- **Error Handling** - Алдааны удирдлага
- **Validation** - Өгөгдлийн шалгалт

## API Endpoints

### Menu Items
- `GET /api/menu` - Бүх menu items
- `GET /api/menu/:id` - Нэг menu item
- `POST /api/menu` - Шинэ menu item үүсгэх
- `PUT /api/menu/:id` - Menu item шинэчлэх
- `DELETE /api/menu/:id` - Menu item устгах
- `PATCH /api/menu/:id/status` - Статус өөрчлөх

### Orders
- `GET /api/orders` - Бүх захиалгууд
- `GET /api/orders/:id` - Нэг захиалга
- `POST /api/orders` - Шинэ захиалга үүсгэх
- `PATCH /api/orders/:id/status` - Статус өөрчлөх
- `DELETE /api/orders/:id` - Захиалга устгах
- `GET /api/orders/today/orders` - Өнөөдрийн захиалгууд
- `GET /api/orders/active/orders` - Идэвхтэй захиалгууд

### Tables
- `GET /api/tables` - Бүх ширээнүүд
- `GET /api/tables/:id` - Нэг ширээ
- `POST /api/tables` - Шинэ ширээ үүсгэх
- `PUT /api/tables/:id` - Ширээ шинэчлэх
- `DELETE /api/tables/:id` - Ширээ устгах
- `PATCH /api/tables/:id/status` - Статус өөрчлөх
- `PATCH /api/tables/:id/qr-code` - QR код шинэчлэх

### Authentication
- `POST /api/auth/login` - Admin нэвтрэх
- `POST /api/auth/logout` - Гарах
- `GET /api/auth/profile` - Admin profile
- `PUT /api/auth/change-password` - Нууц үг өөрчлөх

## Суулгах

```bash
# Dependencies суулгах
npm install

# Development mode-д ажиллуулах
npm run dev

# Production build
npm run build

# Production mode-д ажиллуулах
npm start
```

## Environment Variables

`.env` файл үүсгэж дараах тохиргоонуудыг оруулна уу:

```env
# Server тохиргоо
PORT=5000
NODE_ENV=development

# MongoDB холболт
MONGODB_URI=mongodb://localhost:27017/qr-menu

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Cloudinary тохиргоо
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

## MongoDB Schema

### MenuItem
```typescript
{
  name: string;
  description: string;
  price: number;
  image?: string;
  category: 'sushi' | 'ramen' | 'main' | 'drink';
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order
```typescript
{
  orderNumber: string;
  tableNumber: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Table
```typescript
{
  number: number;
  status: 'free' | 'occupied' | 'reserved';
  currentOrder?: ObjectId;
  qrCode?: string;
  capacity: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Алдааны кодууд

- `200` - Амжилттай
- `201` - Үүсгэгдсэн
- `400` - Буруу хүсэлт
- `401` - Хандах эрх байхгүй
- `404` - Олдсонгүй
- `500` - Серверийн алдаа

## Хамгаалалт

- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - Хүсэлтийн хязгаарлалт
- **Input Validation** - Өгөгдлийн шалгалт
- **Error Handling** - Алдааны удирдлага

## Хөгжүүлэлт

### Development
```bash
npm run dev
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Production

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

## Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## License

MIT License 