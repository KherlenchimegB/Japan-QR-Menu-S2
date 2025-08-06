# 🍣 Япон Ресторан QR Menu System

Япон ресторанны QR кодоор захиалга өгөх систем. Үйлчлүүлэгчид QR код уншуулаад гар утсаараа хоол захиалж, админ хэсэг дээр захиалгуудыг удирдах боломжтой.

## 🚀 Онцлогууд

### Үйлчлүүлэгчийн хэсэг
- 📱 **QR код уншуулах** - Ширээний QR код уншуулаад menu харах
- 🍽️ **Хоолны жагсаалт** - Суши, Рамэн, Үндсэн хоол, Ундаа
- 🛒 **Захиалгын саг** - Хоол нэмэх, хасах, тоо өөрчлөх
- 💳 **Захиалга өгөх** - Нэг товчлуураар захиалга илгээх
- 📊 **Ширээний мэдээлэл** - Ширээний дугаар, огноо

### Админ хэсэг
- 📋 **Захиалгын жагсаалт** - Бүх захиалгуудыг харах
- 🎯 **Статус удирдлага** - Хүлээгдэж байна, Бэлтгэж байна, Бэлэн, Дууссан
- 🏠 **Ширээний удирдлага** - Ширээнүүдийн статус
- 📈 **Статистик** - Өнөөдрийн захиалга, орлого
- 🔄 **Real-time updates** - Шинэ захиалгууд автоматаар харагдах

## 🛠️ Технологиуд

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **React Hooks** - State management

### Backend
- **Express.js** - RESTful API
- **MongoDB** - Database
- **Mongoose** - ODM
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Cloudinary** - Image upload

## 📁 Төслийн бүтэц

```
QR-menu/
├── frontend/                 # Frontend (Next.js)
│   ├── app/                 # App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Customer menu page
│   │   ├── admin/          # Admin pages
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── menu/           # Menu components
│   │   └── cart/           # Cart components
│   ├── lib/                # Utilities
│   ├── types/              # TypeScript types
│   └── public/             # Static files
├── backend/                 # Backend (Express.js)
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── index.ts        # Server entry
│   └── dist/               # Build output
└── README.md               # Project documentation
```

## 🚀 Суулгах болон ажиллуулах

### 1. Төслийг clone хийх
```bash
git clone <repository-url>
cd QR-menu
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

### 4. MongoDB суулгах
MongoDB суулгаж, `.env` файлд холболтын мэдээлэл оруулна уу.

## 📖 Хэрэглээ

### Үйлчлүүлэгчийн хэсэг
1. Ширээний QR кодыг уншуулах
2. Хоолны жагсаалтаас сонгох
3. Захиалгын сагт нэмэх
4. Захиалга өгөх товчлуурыг дарж илгээх

### Админ хэсэг
1. `/admin` хуудас руу орох
2. Захиалгуудыг харах
3. Статус өөрчлөх
4. Ширээнүүдийг удирдах

## 🔧 API Endpoints

### Menu
- `GET /api/menu` - Бүх хоолнууд
- `POST /api/menu` - Шинэ хоол нэмэх

### Orders
- `GET /api/orders` - Бүх захиалгууд
- `POST /api/orders` - Шинэ захиалга
- `PATCH /api/orders/:id/status` - Статус өөрчлөх

### Tables
- `GET /api/tables` - Бүх ширээнүүд
- `POST /api/tables` - Шинэ ширээ
- `PATCH /api/tables/:id/status` - Статус өөрчлөх

## 🎨 Дизайн

- **Япон ресторанны theme** - Улаан, улбар шар өнгө
- **Responsive design** - Бүх төхөөрөмж дээр
- **Clean UI** - Энгийн, ойлгомжтой
- **Modern components** - shadcn/ui ашигласан

## 🔮 Ирээдүйн төлөвлөгөө

- [ ] **Real-time WebSocket** - Шууд шинэчлэлт
- [ ] **Payment integration** - Төлбөр төлөх
- [ ] **Multi-language** - Олон хэл дэмжлэг
- [ ] **Analytics dashboard** - Дэлгэрэнгүй статистик
- [ ] **Push notifications** - Мэдэгдэл илгээх
- [ ] **QR code generation** - QR код үүсгэх
- [ ] **Image upload** - Хоолны зураг
- [ ] **User authentication** - Хэрэглэгчийн бүртгэл

## 🤝 Хувь нэмэр оруулах

1. Fork хийх
2. Feature branch үүсгэх (`git checkout -b feature/amazing-feature`)
3. Commit хийх (`git commit -m 'Add amazing feature'`)
4. Push хийх (`git push origin feature/amazing-feature`)
5. Pull Request үүсгэх

## 📄 License

MIT License - Дэлгэрэнгүй мэдээллийг [LICENSE](LICENSE) файлаас харна уу.

## 👨‍💻 Хөгжүүлэгчид

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Express.js, MongoDB, Mongoose
- **Design**: shadcn/ui, Lucide React

## 📞 Холбоо барих

Асуулт, санал болон зөвлөгөө байвал issue үүсгэнэ үү.

---

**🍣 Япон Ресторан QR Menu System** - Хоолны захиалгын шийдэл 