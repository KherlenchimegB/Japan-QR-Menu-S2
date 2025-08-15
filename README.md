# 💊 MonoPharma - Монгол Фармацевтийн Вэбсайт

Монгол фармацевтийн компанийн орчин үеийн вэбсайт. 100+ бүтээгдэхүүн, 3 хэлний дэмжлэг, emonos.mn сайттай интеграци.

## 🚀 Онцлогууд

### Бүтээгдэхүүн
- 🏥 **100+ Бүтээгдэхүүн** - Фармацевтийн олон төрлийн бүтээгдэхүүн
- 🌍 **3 хэлний дэмжлэг** - Монгол, Англи, Хятад хэл
- 🔗 **emonos.mn холбоос** - Бүтээгдэхүүн дээр дарахад emonos.mn руу шилжих
- 📱 **Хариуцагч дизайн** - Бүх төхөөрөмж дээр тохирох
- 🎥 **Видео дэмжлэг** - Бүтээгдэхүүний танилцуулгын видео
- 🎯 **3D дүрс** - Интерактив 3D харуулалт

### Админ хэсэг
- 📊 **Бүтээгдэхүүн удирдлага** - Бүтээгдэхүүн нэмэх, засах, устгах
- 🌐 **Олон хэлний агуулга** - 3 хэл дээрх агуулга удирдах
- 📈 **Статистик** - Хандалт, хэрэглээний статистик
- 🎞️ **Медиа удирдлага** - Зураг, видео, 3D файл удирдах

## 🛠️ Технологиуд

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **shadcn/ui** - UI components
- **Three.js** - 3D graphics
- **React Query** - Data fetching
- **i18next** - Multilingual support

### Backend
- **Express.js** - RESTful API
- **MongoDB** - Database
- **Mongoose** - ODM
- **TypeScript** - Type safety
- **Cloudinary** - Media storage
- **JWT** - Authentication

## 📁 Төслийн бүтэц

```
monopharma/
├── frontend/                 # Frontend (Next.js)
│   ├── app/                 # App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── products/       # Product pages
│   │   ├── admin/          # Admin pages
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── products/       # Product components
│   │   ├── layout/         # Layout components
│   │   └── 3d/             # 3D components
│   ├── lib/                # Utilities
│   ├── types/              # TypeScript types
│   ├── locales/            # i18n translations
│   └── public/             # Static files
├── backend/                 # Backend (Express.js)
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── controllers/    # Route controllers
│   │   └── index.ts        # Server entry
│   └── dist/               # Build output
└── README.md               # Project documentation
```

## 🚀 Суулгах болон ажиллуулах

### 1. Төслийг clone хийх
```bash
git clone <repository-url>
cd monopharma
```

### 2. Frontend суулгах
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:3000

### 3. Backend суулгах
```bash
cd backend
npm install
npm run dev
```
Backend API: http://localhost:5000

### 4. MongoDB тохиргоо
MongoDB суулгаж, `.env` файлд холболтын мэдээлэл оруулна уу.

## 📖 Хэрэглээ

### Бүтээгдэхүүний хэсэг
1. Бүтээгдэхүүний жагсаалт үзэх
2. Дэлгэрэнгүй мэдээлэл харах
3. emonos.mn руу шилжих
4. Видео болон 3D дүрс үзэх

### Админ хэсэг
1. `/admin` хуудас руу орох
2. Бүтээгдэхүүн удирдах
3. Олон хэлний агуулга засах
4. Медиа файл удирдах

## 🔧 API Endpoints

### Products
- `GET /api/products` - Бүх бүтээгдэхүүн
- `GET /api/products/:id` - Тодорхой бүтээгдэхүүн
- `POST /api/products` - Шинэ бүтээгдэхүүн нэмэх
- `PUT /api/products/:id` - Бүтээгдэхүүн засах
- `DELETE /api/products/:id` - Бүтээгдэхүүн устгах

### Media
- `POST /api/media/upload` - Медиа файл оруулах
- `GET /api/media/:id` - Медиа файл авах

### Languages
- `GET /api/languages` - Хэлний жагсаалт
- `GET /api/translations/:lang` - Орчуулга авах

## 🎨 Дизайн

- **Фармацевтийн theme** - Цэвэр, найдвартай дизайн
- **Responsive design** - Бүх төхөөрөмж дээр
- **Modern UI** - Орчин үеийн компонентууд
- **3D визуализаци** - Бүтээгдэхүүний 3D харуулалт

## 🔮 Ирээдүйн төлөвлөгөө

- [x] **MongoDB схем** - Өгөгдлийн бүтэц
- [x] **3 хэлний дэмжлэг** - Олон хэл
- [x] **emonos.mn интеграци** - Гадаад холбоос
- [x] **Видео дэмжлэг** - Медиа файлууд
- [x] **3D дүрс** - Интерактив харуулалт
- [ ] **SEO оптимизаци** - Хайлтын системд тохируулга
- [ ] **Performance оптимизаци** - Хурдыг сайжруулах
- [ ] **Analytics** - Хэрэглээний статистик

## 📄 License

MIT License - Дэлгэрэнгүй мэдээллийг [LICENSE](LICENSE) файлаас харна уу.

## 👨‍💻 Хөгжүүлэгчид

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Three.js
- **Backend**: Express.js, MongoDB, Mongoose
- **Design**: shadcn/ui, Modern pharmaceutical design

## 📞 Холбоо барих

Асуулт, санал болон зөвлөгөө байвал issue үүсгэнэ үү.

---

**💊 MonoPharma** - Монгол Фармацевтийн Орчин Үеийн Шийдэл 