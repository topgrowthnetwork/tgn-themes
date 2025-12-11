import { Card, CardContent, CardHeader, CardTitle } from '@theme/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ArkanAboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-3xl">عن أركان</h1>
          <div className="mx-auto mb-6 h-1 w-20 bg-blue-600"></div>
        </div>

        {/* About Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="space-y-4 pt-6 leading-relaxed text-slate-700">
            <p>
              أركان ستور هي شركة متخصصة في بيع الأجهزة الكهربائية والمنزلية عبر معارضنا وفروعنا داخل
              المملكة، وكذلك من خلال موقعنا الإلكتروني.
            </p>
            <p>
              نجمع بين البيع من خلال فروعنا في الجبيل والأحساء، و اونلاين عبر متجرنا الإلكتروني الذي
              يتيح تجربة تسوق سهلة وآمنة في أي وقت ومن أي مكان.
            </p>
            <p>
              نحرص في أركان على تقديم منتجات أصلية من أفضل العلامات التجارية، بأسعار منافسة وضمان
              رسمي، مع خدمة ما بعد البيع ودعم فني متميز.
            </p>
            <p className="font-medium text-slate-900">
              هدفنا أن نكون وجهتك الأولى في عالم الأجهزة المنزلية، بخدمة سريعة وجودة يمكنك الاعتماد
              عليها دائمًا.
            </p>
          </CardContent>
        </Card>

        {/* Branches Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">فروعنا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Jubail Branch */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-slate-700">الجبيل – حي الصفوة، شارع المدينة الصناعية</p>
              </div>

              {/* Ahsa Branch */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-slate-700">الأحساء – حي الراشدية، طريق الجامعة</p>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-slate-700">للتواصل: 013/3611124 - 013/5811125</p>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-slate-700">البريد الإلكتروني: arkanstore122@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery & Support Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">الدعم والتوصيل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-slate-700">
            <p>التوصيل مجاني داخل الجبيل والأحساء .</p>
            <p>مدة التوصيل تتراوح من 5 إلى 10 أيام عمل حسب المدينة.</p>
            <p>يتم التواصل مع العميل لتأكيد موعد التسليم قبل الشحن.</p>
            <p>
              نحرص دائمًا على تسليم منتجاتك في أسرع وقت وبأفضل تغليف ممكن لضمان سلامتها عند
              الاستلام.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
