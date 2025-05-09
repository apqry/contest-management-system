# خطوات النشر على Railway.app

## 1. إنشاء حساب على Railway
1. اذهب إلى https://railway.app
2. انقر على "Start Free" أو "ابدأ مجاناً"
3. سجل الدخول باستخدام حساب GitHub الخاص بك

## 2. إنشاء مشروع جديد
1. بعد تسجيل الدخول، انقر على "New Project" أو "مشروع جديد"
2. اختر "Deploy from GitHub repo" أو "النشر من مستودع GitHub"
3. اختر المستودع الذي يحتوي على مشروعك

## 3. إعداد قاعدة البيانات MySQL
1. في لوحة المشروع، انقر على "New" ثم اختر "Database" ثم "MySQL"
2. انتظر حتى يتم إنشاء قاعدة البيانات
3. بعد الإنشاء، ستجد تفاصيل الاتصال في قسم "Connect" أو "الاتصال"
4. احفظ هذه المعلومات لاستخدامها في الخطوة التالية

## 4. إعداد متغيرات البيئة
1. في لوحة المشروع، انتقل إلى تبويب "Variables" أو "المتغيرات"
2. أضف المتغيرات التالية:
   ```
   DB_HOST=<عنوان_قاعدة_البيانات>
   DB_USER=<اسم_المستخدم>
   DB_PASSWORD=<كلمة_المرور>
   DB_NAME=<اسم_قاعدة_البيانات>
   PORT=3001
   ```
   (استبدل القيم بين <> بالقيم الفعلية من معلومات الاتصال بقاعدة البيانات)

## 5. نشر الخادم (Backend)
1. تأكد من أن ملف `package.json` يحتوي على script للتشغيل:
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```
2. Railway سيقوم تلقائياً بتثبيت الاعتماديات وتشغيل الخادم
3. انتظر حتى اكتمال النشر
4. احصل على رابط الخادم من تبويب "Settings" أو "الإعدادات"

## 6. إعداد واجهة المستخدم (Frontend)
1. في مجلد المشروع، أنشئ ملف `.env` جديد:
   ```
   REACT_APP_API_BASE_URL=https://<رابط_الخادم>/api
   ```
   (استبدل <رابط_الخادم> برابط الخادم الذي حصلت عليه من Railway)

2. قم ببناء واجهة المستخدم:
   ```bash
   npm run build
   ```

## 7. نشر واجهة المستخدم
يمكنك نشر واجهة المستخدم على:
- Railway (كمشروع منفصل)
- Vercel
- Netlify
- GitHub Pages

### للنشر على Railway:
1. أنشئ مشروع جديد
2. اختر نفس المستودع
3. أضف متغير البيئة `REACT_APP_API_BASE_URL`
4. في `package.json` تأكد من وجود:
   ```json
   {
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build"
     }
   }
   ```

## 8. اختبار التطبيق
1. انتقل إلى رابط واجهة المستخدم
2. تأكد من أن جميع الوظائف تعمل بشكل صحيح:
   - إضافة متسابقات
   - إضافة مشرفات
   - إضافة مسابقات
   - إدخال الدرجات
   - البحث
   - التصدير

## ملاحظات مهمة
- تأكد من أن جميع متغيرات البيئة صحيحة
- تأكد من أن الروابط بين الخادم وواجهة المستخدم صحيحة
- احتفظ بنسخة احتياطية من قاعدة البيانات بشكل دوري
- راقب استهلاك الموارد في لوحة تحكم Railway

## الدعم والمساعدة
- إذا واجهت أي مشاكل، راجع:
  - وثائق Railway: https://docs.railway.app
  - سجلات التطبيق في لوحة التحكم
  - رسائل الخطأ في وحدة التحكم بالمتصفح
