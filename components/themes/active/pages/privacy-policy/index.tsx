import { Alert, AlertDescription } from '@theme/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@theme/components/ui/card';
import { AlertCircle, FileText, ShieldCheck, Truck, Wrench } from 'lucide-react';

export default function ArkanPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-3xl">سياسة الخصوصية</h1>
          <div className="mx-auto mb-6 h-1 w-20 bg-blue-600"></div>
          <h2 className="mt-6 text-2xl font-semibold text-slate-700">
            شروط البيع وسياسه الاسترجاع
          </h2>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="pt-6">
            <p className="font-medium leading-relaxed text-slate-700">
              عميلنا الكريم : نود تقديم بعض التصالح للاستفادة من الجهاز
            </p>
          </CardContent>
        </Card>

        {/* Return Policy Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl text-slate-900">شروط الإرجاع</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-slate-700">
            <p>
              الإرجاع خلال ثلاثة أيام من تاريخ الفاتورة وأن يكون الجهاز بحالته الأصلية لم يفتح كما
              تم شراؤه
            </p>
            <p>على الزبائن فحص الأجهزة والتأكد بأنها سليمة وتعمل جيدا قبل مغادره المعرض.</p>
            <p>يرجى الإحتفاظ بالفاتورة لأنها جزء من ضمانك حسب الوكيل المعتمد</p>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                في حالة رغبة العميل باسترجاع المنتج في الفترة المحددة وهي ٣ ايام يتم تحميل العميل
                قيمة التحميل والتنزيل 2% من قيمة الفاتورة بحد ادنى ١٠٠ ريال في حال وصول البضاعة إلى
                العميل.
              </AlertDescription>
            </Alert>
            <p>
              لا تقبل هذه الفاتورة إلا إذا استخدمت فاتورة بيع مطبوعة إلكترونية ولا يقبل عندنا غير
              ذالك.
            </p>
          </CardContent>
        </Card>

        {/* Warranty Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl text-slate-900">شروط الضمان</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-slate-700">
            <p>
              الضمان لا يشمل سوء الاستعمال ولا الكسر ولا القطع الاستهلاكية كعيون افران الغاز وسطح
              السيراميك الفرن الكهربائي.
            </p>
            <p>
              في حالة عدم دفع المبلغ المستحقة من الإضافات عن ٢٤ ساعة سيعتبر الضمان لاغياً تلقائياً.
            </p>
          </CardContent>
        </Card>

        {/* Installation Terms - AC Split */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl text-slate-900">شروط تركيب المكيفات الاسبلت</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-slate-700">
            <p>
              في حالة بيع الاسبلت مع المواسير يصرف له من متر إلى أربعة أمتار حسب احتياج الموقع
              والزيادة يجب تسديدها للفني، ولا يحق للزبون المطالبة عند التركيب أقل من أربعة أمتار.
            </p>
            <p>
              قاعدة الكمبروسور الخارجية لا تدخل ضمن عمل التركيب والتكلفة وفي حال طلب العميل توفير
              القاعدة يتم احتساب القاعدة عليه.
            </p>
            <p>
              في حال وجود ماسورة فريون للاسبلت عند الزبون مسبقا لا يحق للزبون المطالبة بقيمة
              المواسير عند قيام الفني بإضافة أي جزء كان من الامتار أو اللحام.
            </p>
            <p>تركيب الاسبلت الجديد لا يشمل تنزيل القديم وفي حالة تنزيله يتم تسديد قيمه التنزيل</p>
            <p>
              ان إيصال خط تصريف مياه التكثف لوحدات التكييف بالشبكة الصرف الصحي أو أي شبكة أخرى ليس
              ضمن نطاق التركيب.
            </p>
          </CardContent>
        </Card>

        {/* Installation Terms - Window AC */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl text-slate-900">شروط تركيب المكيفات الشباك</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-slate-700">
            <p>
              تركيب المكيفات الشباك لا يشمل فك المكيف القديم وفي حال طلب العميل فيتم احتساب التكلفة
              عليه
            </p>
          </CardContent>
        </Card>

        {/* General Terms */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl text-slate-900">شروط عامة</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-slate-700">
            <p>الشركة غير مسؤولة عن نقص بعض الموديلات في حالة تأخر الزبون عن استلامها.</p>
            <p>حالة وجود مبلغ متبقى على العميل يجب دفع دفع المبلغ المتبقي قبل التركيب.</p>
            <p>إن توفير مصدر الكهرباء لمقر الجهاز المنزلي ليس ضمن نطاق التركيب</p>
          </CardContent>
        </Card>

        {/* Storage Terms */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl text-slate-900">شروط التخزين</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-slate-700">
            <p>
              يحق للعميل تمديد فترة التخزين للمنتجات في مستودعات شركة أركان الأجهزة لأكثر من 15 يوم
              ويتم تقديم الخدمة القواتير البالغ ٥٠٠٠ ريال أو أعلى وفي حال انتهاء فترة التخزين ولم
              يقوم العميل باستلام الاجهزة يحق للشركة الغاء الفاتورة وبيع الأجهزة ويحق للعميل استرداد
              مبلغ الفاتورة بعد خصم ٢٥% من قيمتها ولا يتم تعويض العميل عن مبلغ خدمة التخزين.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
