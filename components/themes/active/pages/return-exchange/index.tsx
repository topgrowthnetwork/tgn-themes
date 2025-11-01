import { Alert, AlertDescription } from '@theme/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@theme/components/ui/card';
import { AlertCircle, Mail, Package, Phone } from 'lucide-react';

export default function ArkanReturnPolicyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
            سياسة الاستبدال والاسترجاع
          </h1>
          <div className="mx-auto mb-6 h-1 w-20 bg-blue-600"></div>
        </div>

        {/* Return & Exchange Policy */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="space-y-4 pt-6 leading-relaxed text-slate-700">
            <p className="font-medium text-slate-900">عميلنا العزيز،</p>
            <p>
              يمكنك إرجاع أو استبدال المنتج الجديد خلال 14 يومًا من تاريخ الشراء إذا تم الشراء من
              الموقع الإلكتروني، و3 أيام إذا تم الشراء من المعرض، وذلك من تاريخ الشراء أو من تاريخ
              استلام المنتج.
            </p>
            <p>
              يشترط أن يكون المنتج غير مستخدم وفي حالته الأصلية، مع تقديم فاتورة الشراء الأصلية أو
              الإلكترونية.
            </p>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                يُحمَّل العميل قيمة التحميل والتنزيل بنسبة (2%) من قيمة الفاتورة، بحد أدنى 100 ريال
                سعودي.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* How to Return */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">طريقة إعادة المنتج:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-slate-700">
                  إذا تم استلام المنتج من خلال فريق تسليم أركان، يُرجى الاتصال بنا مباشرة
                  013/3611124 - 013/5811125.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Package className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-slate-700">
                  إذا تم استلام المنتج من أحد معارضنا، يُرجى مراجعة نفس المعرض لإتمام العملية.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">الضمان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-slate-700">
            <p>
              في أركان ستور، جميع منتجاتنا تأتي بضمان رسمي لمدة سنتين من الوكيل أو المصنع المعتمد
              داخل المملكة العربية السعودية.
            </p>
            <p>
              يشمل الضمان عيوب التصنيع والأعطال الفنية الناتجة عن الاستخدام الطبيعي للمنتج خلال فترة
              الضمان، وفقًا لشروط وضوابط الوكيل.
            </p>
            <p>
              يتم تقديم خدمات الضمان من خلال مراكز الصيانة المعتمدة للعلامة التجارية داخل المملكة.
            </p>
          </CardContent>
        </Card>

        {/* Contact for Warranty */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="space-y-4 pt-6 leading-relaxed text-slate-700">
            <p>في حال واجهتك أي مشكلة في المنتج خلال فترة الضمان، يمكنك التواصل معنا عبر:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-slate-700">013/5811125 - 013/3611124</p>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-slate-700">arkanstore122@gmail.com</p>
              </div>
            </div>
            <p>
              وسنقوم بتوجيهك إلى مركز الخدمة المعتمد القريب منك لضمان سرعة المعالجة وجودة الخدمة.
            </p>
          </CardContent>
        </Card>

        {/* Closing Statement */}
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-white shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center font-medium leading-relaxed text-slate-700">
              نحن في أركان نلتزم بتوفير تجربة شراء مريحة وآمنة لعملائنا، تبدأ من لحظة الطلب وحتى ما
              بعد البيع.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
