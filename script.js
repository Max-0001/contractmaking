const page1 = document.getElementById('page-1');
const page2 = document.getElementById('page-2');
const page3 = document.getElementById('page-3');

const form = document.getElementById('contract-form');
const viewContractBtn = document.getElementById('view-contract-btn');
const resetBtn = document.getElementById('reset-btn');
const backToFormBtn2 = document.getElementById('back-to-form-btn-2');
const backBtn = document.getElementById('back-btn');
const pdfBtn = document.getElementById('pdf-btn');

const verificationCodeInput = document.getElementById('verification-code');
const verificationMessage = document.getElementById('verification-message');
const verifyBtn = document.getElementById('verify-btn');
const resendCodeBtn = document.getElementById('resend-code-btn');
const clientEmailInput = document.getElementById('client-email');
const sendCodeBtn = document.getElementById('send-code-btn');
const langSelector = document.getElementById('second-language-selector');

const signaturePad = document.getElementById('signature-pad');
const signatureUpload = document.getElementById('signature-upload');
const toggleDrawUploadBtn = document.getElementById('toggle-draw-upload');
const signatureUploadPreview = document.getElementById('signature-upload-preview');
const previewSignature = document.getElementById('preview-signature');

const serviceProviderDate = document.getElementById('service-provider-date');
const serviceProviderTime = document.getElementById('service-provider-time');
const clientProviderDate = document.getElementById('client-provider-date');
const clientProviderTime = document.getElementById('client-provider-time');

const verificationContainer = document.getElementById('verification-container');

let verificationCode = null;
const DEV_OTP = '000000';
let isDrawingMode = true;
let signatureCtx = signaturePad.getContext('2d');
let isSigning = false;
let signatureDataUrl = null;

const inputs = {
    clientName: document.getElementById('client-name'),
    clientAddress: document.getElementById('client-address'),
    authorizedPerson: document.getElementById('authorized-person'),
    authorizedPosition: document.getElementById('authorized-position'),
    contractDate: document.getElementById('contract-date'),
    termMonths: document.getElementById('term-months'),
    termYears: document.getElementById('term-years'),
    rate: document.getElementById('rate'),
    currency: document.getElementById('currency'),
    jurisdiction: document.getElementById('jurisdiction'),
};

const previews = {
    sigName: document.getElementById('preview-sig-name'),
    sigPosition: document.getElementById('preview-sig-position'),
    clientName: document.getElementById('preview-client-name'),
    clientAddress: document.getElementById('preview-client-address'),
    authorizedPerson: document.getElementById('preview-authorized-person'),
    authorizedPosition: document.getElementById('preview-authorized-position'),
    contractDate: document.getElementById('preview-contract-date'),
    contractDate2: document.getElementById('preview-contract-date-2'),
    contractTerm: document.getElementById('preview-contract-term'),
    rate: document.getElementById('preview-rate'),
    currency: document.getElementById('preview-currency'),
    jurisdiction: document.getElementById('preview-jurisdiction'),
    endDate: document.getElementById('preview-end-date'),
};
const placeholders = {
    clientName: '[CLIENT NAME]',
    clientAddress: "[Client's Address]",
    authorizedPerson: '[Authorized Person Name]',
    authorizedPosition: '[Position]',
    contractDate: 'August 13, 2025',
    contractTerm: '[Time Period]',
    rate: '[Rate]',
    currency: '[Currency, e.g., USD]',
    jurisdiction: '[Jurisdiction]',
    endDate: '[End Date]',
};

const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'AMD': '֏',
    'GBP': '£',
    'JPY': '¥',
    'INR': '₹',
    'AED': 'د.إ',
    'SAR': 'ر.س',
};

const contentByLang = {
     armenian: `
        <h1 class="text-2xl font-bold text-center mb-4">ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐԻ ՄԱՏՈՒՑՄԱՆ ՊԱՅՄԱՆԱԳԻՐ</h1>
        <p class="text-center font-semibold">ք.Երևան</p>
        <p class="text-center font-semibold mb-8"><span id="preview-contract-date-arm">Օգոստոսի 13, 2025</span></p>
        <p class="mb-4">Սույն Ծառայությունների մատուցման պայմանագիրը կնքվել է հետևյալ կողմերի միջև՝</p>
        <p class="mb-4 font-bold"><span id="preview-client-name-arm">[ՀԱՃԱԽՈՐԴԻ ԱՆՈՒՆԸ]</span><br>
        (այսուհետ\` «Հաճախորդ»)<br>
        <span id="preview-client-address-arm">[Հաճախորդի հասցեն]</span><br>
        ի դեմս տնօրեն <span id="preview-authorized-person-arm">[Լիազորված անձի անունը]</span>-ի, որը գործում է Կանոնադրության հիման վրա, մի կողմից,
        </p>
        <p class="mb-4">և</p>
        <p class="mb-8 font-bold">"SYS INFOTECH" ՍՊԸ<br>
        ՀՀ, ք. Երևան, Խանջյան փ. 19, 4-րդ հարկ, գրասենյակ 5<br>
        (այսուհետ\` «Ծառայություններ մատուցող»)
        </p>
        <h3 class="text-xl font-bold mb-4">1. ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐԻ ՇՐՋԱՆԱԿԸ</h3>
        <p class="mb-4">Ծառայություններ մատուցողը պարտավորվում է մատուցել հետևյալ ծառայությունները Հաճախորդի համար (այսուհետ\` «Ծառայություններ»)՝</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
            <li><b>Տվյալների կառավարում:</b> Ներառյալ՝ տվյալների մուտքագրում, մաքրում, պահպանում և տվյալների ամբողջականության ապահովում:</li>
            <li><b>Հետնամասի աջակցություն:</b> Հաճախորդի ծրագրային ապահովման սպասարկում, խնդիրների լուծում և տեխնիկական աջակցություն:</li>
        </ul>
        <p class="mb-4">Կատարվելիք աշխատանքների կոնկրետ մանրամասները կնշվեն առանձին աշխատանքային պատվերներում կամ աշխատանքային հայտարարություններում, որոնք կընդգրկվեն սույն Պայմանագրի մեջ՝ հղումով:</p>
        <h3 class="text-xl font-bold mb-4">2. ՊԱՅՄԱՆԱԳՐԻ ԺԱՄԿԵՏԸ</h3>
        <p class="mb-4">Սույն Պայմանագիրը սկսվում է <span id="preview-contract-date-arm-2">Օգոստոսի 13, 2025</span> և շարունակվում է <span id="preview-contract-term-arm">[Ժամանակահատված]</span> ժամկետով, եթե չի դադարեցվում ավելի վաղ՝ սույն Պայմանագրի դրույթների համաձայն:</p>
        <p class="mb-4">Սույն պայմանագրի ավարտի ամսաթիվն է՝ <span id="preview-end-date-arm">[Ավարտի ամսաթիվ]</span>:</p>

        <h3 class="text-xl font-bold mb-4">3. ՎՃԱՐՈՒՄ ԵՎ ՓՈԽՀԱՏՈՒՑՈՒՄ</h3>
        <p class="mb-2">3.1. **Հաշիվ-ապրանքագիր:** Ծառայություններ մատուցողը ամեն ամիս հաշիվ-ապրանքագիր է ներկայացնում Հաճախորդին՝ նախորդ ամսվա ընթացքում մատուցված Ծառայությունների համար: Հաշիվ-ապրանքագիրը մանրամասնում է կատարված աշխատանքները, ծախսված ժամերը և համաձայնեցված ցանկացած ծախս:</p>
        <p class="mb-2">3.2. **Սակագին:** Ծառայությունների սակագինը կկազմի <span id="preview-rate-arm">[Սակագին]</span>:</p>
        <p class="mb-4">3.3. **Վճարման պայմաններ:** Հաճախորդը պարտավոր է վճարել յուրաքանչյուր հաշիվ-ապրանքագրի ամբողջ գումարը այն ստանալուց հետո երեսուն (30) օրվա ընթացքում: Բոլոր վճարումները պետք է կատարվեն <span id="preview-currency-arm">[Արժույթ, օրինակ՝ USD]</span>:</p>

        <h3 class="text-xl font-bold mb-4">4. ԳԱՂՏՆԻՈՒԹՅՈՒՆ</h3>
        <p class="mb-4">Երկու կողմերը համաձայնում են պահպանել ցանկացած և բոլոր սեփական կամ գաղտնի տեղեկատվության գաղտնիությունը, որը ստացվել է մյուս կողմից սույն Պայմանագրի գործողության ընթացքում: Այս պարտավորությունը գործում է նաև Պայմանագրի դադարեցումից հետո:</p>

        <h3 class="text-xl font-bold mb-4">5. ԻՆՏԵԼԵԿՏՈՒԱԼ ՍԵՓԱԿԱՆՈՒԹՅՈՒՆ</h3>
        <p class="mb-4">Բոլոր աշխատանքային արդյունքները, ներառյալ՝ հաշվետվությունները, տվյալները և ծրագրային կոդը, որոնք ստեղծվել են Ծառայություններ մատուցողի կողմից, համարվում են Հաճախորդի միանձնյա սեփականությունը՝ ամբողջական վճարումից հետո:</p>

        <h3 class="text-xl font-bold mb-4">6. ԴԱԴԱՐԵՑՈՒՄ</h3>
        <p class="mb-4">Յուրաքանչյուր կողմ կարող է դադարեցնել պայմանագիրը, եթե էական խախտումը չի շտկվում գրավոր ծանուցումից հետո 30 օրվա ընթացքում:</p>

        <h3 class="text-xl font-bold mb-4">7. ԱՆԿԱԽ ԿՈՆՏՐԱԿՏՈՐԻ ՀԱՐԱԲԵՐՈՒԹՅՈՒՆ</h3>
        <p class="mb-4">Ծառայություններ մատուցողը անկախ կոնտրակտոր է, և սույն Պայմանագրի ոչ մի դրույթ չի կարող մեկնաբանվել որպես գործատու-աշխատողի, գործընկերության կամ համատեղ ձեռնարկության հարաբերություն ստեղծող երկու կողմերի միջև:</p>

        <h3 class="text-xl font-bold mb-4">8. ՓՈԽՀԱՏՈՒՑՈՒՄ</h3>
        <p class="mb-4">Յուրաքանչյուր կողմ համաձայնում է փոխհատուցել և պաշտպանել մյուս կողմին ցանկացած հայցից, վնասից կամ պարտավորություններից, որոնք բխում են սույն Պայմանագրի կատարման ընթացքում իր սեփական անփութությունից կամ դիտավորյալ վարքագծից:</p>

        <h3 class="text-xl font-bold mb-4">9. ՊԱՐՏԱԿԱՆՈՒԹՅՈՒՆՆԵՐԻ ՍԱՀՄԱՆԱՓԱԿՈՒՄ</h3>
        <p class="mb-4">Ոչ մի կողմ պատասխանատվություն չի կրում մյուս կողմի նկատմամբ սույն Պայմանագրից բխող որևէ անուղղակի, պատահական կամ հետևանքային վնասի համար:</p>

        <h3 class="text-xl font-bold mb-4">10. ԿԻՐԱՌՎՈՂ ՕՐԵՆՍԴՐՈՒԹՅՈՒՆ ԵՎ ՎԵՃԵՐԻ ԼՈՒԾՈՒՄ</h3>
        <p class="mb-4">Սույն Պայմանագիրը կարգավորվում է <span id="preview-jurisdiction-arm">[Իրավասություն]</span> օրենսդրությամբ: Ցանկացած վեճ, որը բխում է սույն Պայմանագրից, պետք է լուծվի բարեխիղճ բանակցությունների միջոցով: Եթե բանակցությունները ձախողվեն, կողմերը համաձայնում են դիմել միջնորդության՝ նախքան դատական հայց ներկայացնելը:</p>

        <h3 class="text-xl font-bold mb-4">11. ԱՄԲՈՂՋԱԿԱՆ ՀԱՄԱՁԱՅՆՈՒԹՅՈՒՆ</h3>
        <p class="mb-4">Սույն Պայմանագիրը, միասին ցանկացած հղվող աշխատանքային պատվերների հետ, կազմում է Կողմերի միջև ամբողջական համաձայնությունը և փոխարինում է բոլոր նախկին համաձայնագրերին կամ պայմանավորվածություններին, լինեն դրանք գրավոր կամ բանավոր:</p>

        <h3 class="text-xl font-bold mb-4 mt-8">ԿՈՂՄԵՐԻ ՄԱՆՐԱՄԱՍՆԵՐԸ ԵՎ ՍՏՈՐԱԳՐՈՒԹՅՈՒՆՆԵՐԸ</h3>
        <div class="grid grid-cols-2 gap-8 mt-16">
            <div>
                <p class="font-bold">ՀԱՃԱԽՈՐԴ</p>
                <div class="mt-4">
                    <p class="font-semibold">Թվային ստորագրված է՝ <span id="preview-sig-name-arm"></span></p>
                    <p class="text-sm text-gray-500"><span id="preview-sig-position-arm"></span></p>
                    <img id="preview-signature-arm" class="signature-image mb-2">
                    <p class="text-sm text-gray-500">Ամսաթիվ՝ <span id="client-provider-date-arm"></span></p>
                    <p class="text-sm text-gray-500">Ժամանակ՝ <span id="client-provider-time-arm"></span></p>
                </div>
                <div class="mt-4 border-t border-gray-400 pt-2">Ստորագրություն</div>
            </div>
            <div>
                <p class="font-bold">ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐ ՄԱՏՈՒՑՈՂ</p>
                <p class="mt-4"><b>Ընկերության անունը՝</b> "SYS INFOTECH" ՍՊԸ</p>
                <div class="mt-12">
                    <p class="font-semibold">Թվային ստորագրված է՝ Պրն. Մաքս Քիթ</p>
                    <img src="https://storage.googleapis.com/gemini-prod-us-west1-assets/9972323719a909a8/image-removebg-preview%20(14).png" alt="Mr. Max Keith's Signature" class="max-w-[200px] h-auto">
                    <p class="text-sm text-gray-500">Ամսաթիվ՝ <span id="service-provider-date-arm"></span></p>
                    <p class="text-sm text-gray-500">Ժամանակ՝ <span id="service-provider-time-arm"></span></p>
                </div>
                <div class="mt-4 border-t border-gray-400 pt-2">Ստորագրություն</div>
            </div>
        </div>
        `,
    spanish: `
        <h1 class="text-2xl font-bold text-center mb-4">ACUERDO DE SERVICIOS</h1>
        <p class="text-center font-semibold">Ciudad de Ereván</p>
        <p class="text-center font-semibold mb-8"><span id="preview-contract-date-spa">13 de agosto de 2025</span></p>
        <p class="mb-4">Este Acuerdo de Servicios se celebra entre:</p>
        <p class="mb-4 font-bold"><span id="preview-client-name-spa">[NOMBRE DEL CLIENTE]</span><br>
        (en adelante, el "Cliente")<br>
        <span id="preview-client-address-spa">[Dirección del Cliente]</span><br>
        representado por su <span id="preview-authorized-position-spa">[Posición]</span> <span id="preview-authorized-person-spa">[Nombre de la Persona Autorisada]</span>, quien actúa en virtud de los estatutos, por un lado,
        </p>
        <p class="mb-4">y</p>
        <p class="mb-8 font-bold">"SYS INFOTECH" LLC<br>
        Oficina No. 5, 4to piso, 19 Khanjyan Str., Ereván, Armenia<br>
        (en adelante, el "Proveedor de Servicios")<br>
        representado por su Director [Nombre del Director], quien actúa en virtud de los estatutos, por el otro lado.
        </p>
        <h3 class="text-xl font-bold mb-4">1. ALCANCE DE LOS SERVICIOS</h3>
        <p class="mb-4">El Proveedor de Servicios realizará los siguientes servicios para el Cliente (los "Servicios"):</p>
        <ul class="list-disc list-inside space-y-2 mb-4">
            <li><b>Gestión de Datos:</b> Incluyendo, entre otros, la entrada de datos, la limpieza de datos, el almacenamiento de datos y la garantía de la integridad de los datos.</li>
            <li><b>Soporte de Backend:</b> Proporcionar mantenimiento, solución de problemas y soporte técnico para el software del Cliente.</li>
        </ul>
        <p class="mb-4">Los detalles específicos del trabajo a realizar se describirán en órdenes de trabajo o declaraciones de trabajo separadas, que se incorporarán a este Acuerdo por referencia.</p>
        <h3 class="text-xl font-bold mb-4">2. TÉRMINO DEL ACUERDO</h3>
        <p class="mb-4">Este Acuerdo comenzará el <span id="preview-contract-date-spa-2">13 de agosto de 2025</span> y continuará por un período de <span id="preview-contract-term-spa">[Período de Tiempo]</span>, a menos que se termine antes de acuerdo con las disposiciones de este Acuerdo.</p>
        <p class="mb-4">La fecha de finalización de este acuerdo es <span id="preview-end-date-spa">[Fecha de Finalización]</span>.</p>

        <h3 class="text-xl font-bold mb-4">3. COMPENSACIÓN Y PAGO</h3>
        <p class="mb-2">3.1. **Facturación:** El Proveedor de Servicios facturará al Cliente mensualmente por los Servicios realizados durante el mes anterior. La factura detallará el trabajo completado, las horas dedicadas y los gastos acordados.</p>
        <p class="mb-2">3.2. **Tarifa:** La tarifa por los servicios será de <span id="preview-rate-spa">[Tarifa]</span>.</p>
        <p class="mb-4">3.3. **Condiciones de Pago:** El Cliente pagará el monto total de cada factura dentro de los treinta (30) días posteriores a la recepción. Todos los pagos se realizarán en <span id="preview-currency-spa">[Moneda, ej. USD]</span>.</p>

        <h3 class="text-xl font-bold mb-4">4. CONFIDENCIALIDAD</h3>
        <p class="mb-4">Ambas Partes acuerdan mantener la confidencialidad de cualquier y toda la información propietaria o confidencial recibida de la otra Parte durante el término de este Acuerdo. Esta obligación sobrevivirá a la terminación de este Acuerdo.</p>

        <h3 class="text-xl font-bold mb-4">5. PROPIEDAD INTELECTUAL</h3>
        <p class="mb-4">Todo el producto de trabajo, incluyendo, entre otros, informes, datos y código de software creado por el Proveedor de Servicios como parte de los Servicios, será propiedad exclusiva del Cliente una vez que se complete el pago total.</p>

        <h3 class="text-xl font-bold mb-4">6. TERMINACIÓN</h3>
        <p class="mb-4">Cualquiera de las Partes puede terminar el acuerdo si un incumplimiento material no se corrige dentro de los 30 días posteriores a un aviso por escrito.</p>

        <h3 class="text-xl font-bold mb-4">7. RELACIÓN DE CONTRATISTA INDEPENDIENTE</h3>
        <p class="mb-4">El Proveedor de Servicios es un contratista independiente y nada en este Acuerdo se interpretará como la creación de una relación de empleador-empleado, asociación o empresa conjunta entre las Partes.</p>

        <h3 class="text-xl font-bold mb-4">8. INDEMNIZACIÓN</h3>
        <p class="mb-4">Cada Parte acuerda indemnizar, defender y eximir de responsabilidad a la otra Parte de cualquier reclamo, daño o responsabilidad que surja de su propia negligencia o mala conducta intencional en el cumplimiento de este Acuerdo.</p>

        <h3 class="text-xl font-bold mb-4">9. LIMITACIÓN DE RESPONSABILIDAD</h3>
        <p class="mb-4">Ninguna de las Partes será responsable ante la otra por daños indirectos, incidentales o consecuentes que surjan de este Acuerdo.</p>

        <h3 class="text-xl font-bold mb-4">10. LEY APLICABLE Y RESOLUCIÓN DE DISPUTAS</h3>
        <p class="mb-4">Este Acuerdo se regirá por las leyes de <span id="preview-jurisdiction-spa">[Jurisdicción]</span>. Cualquier disputa que surja de este Acuerdo se resolverá a través de negociaciones de buena fe. Si la negociación falla, las Partes acuerdan recurrir a la mediación antes de recurrir a litigios.</p>

        <h3 class="text-xl font-bold mb-4">11. ACUERDO COMPLETO</h3>
        <p class="mb-4">Este Acuerdo, junto con cualquier orden de trabajo a la que se haga referencia, constituye el acuerdo completo entre las Partes y reemplaza todos los acuerdos o entendimientos anteriores, ya sean escritos u orales.</p>

        <h3 class="text-xl font-bold mb-4 mt-8">DETALLES Y FIRMAS DE LAS PARTIES</h3>
        <div class="grid grid-cols-2 gap-8 mt-16">
            <div>
                <p class="font-bold">CLIENTE</p>
                <div class="mt-4">
                    <p class="font-semibold">Firmado digitalmente por: <span id="preview-sig-name-spa"></span></p>
                    <p class="text-sm text-gray-500"><span id="preview-sig-position-spa"></span></p>
                    <img id="preview-signature-spa" class="signature-image mb-2">
                    <p class="text-sm text-gray-500">Fecha: <span id="client-provider-date-spa"></span></p>
                    <p class="text-sm text-gray-500">Hora: <span id="client-provider-time-spa"></span></p>
                </div>
                <div class="mt-4 border-t border-gray-400 pt-2">Firma</div>
            </div>
            <div>
                <p class="font-bold">PROVEEDOR DE SERVICIOS</p>
                <p class="mt-4"><b>Nombre de la Compañía:</b> "SYS INFOTECH" LLC</p>
                <div class="mt-12">
                    <p class="font-semibold">Firmado digitalmente por: Sr. Max Keith</p>
                    <img src="https://storage.googleapis.com/gemini-prod-us-west1-assets/9972323719a909a8/image-removebg-preview%20(14).png" alt="Mr. Max Keith's Signature" class="max-w-[200px] h-auto">
                    <p class="text-sm text-gray-500">Fecha: <span id="service-provider-date-spa"></span></p>
                    <p class="text-sm text-gray-500">Hora: <span id="service-provider-time-spa"></span></p>
                </div>
                <div class="mt-4 border-t border-gray-400 pt-2">Firma</div>
            </div>
        </div>
    `,
            french: `
                <h1 class="text-2xl font-bold text-center mb-4">CONTRAT DE SERVICES</h1>
                <p class="text-center font-semibold">Ville d'Erevan</p>
                <p class="text-center font-semibold mb-8"><span id="preview-contract-date-fre">13 août 2025</span></p>
                <p class="mb-4">Ce Contrat de Services est conclu entre :</p>
                <p class="mb-4 font-bold"><span id="preview-client-name-fre">[NOM DU CLIENT]</span><br>
                (ci-après d\u00e9nomm\u00e9 le "Client")<br>
                <span id="preview-client-address-fre">[Adresse du Client]</span><br>
                repr\u00e9sent\u00e9 par son <span id="preview-authorized-position-fre">[Position]</span> <span id="preview-authorized-person-fre">[Nom de la Personne Autoris\u00e9e]</span>, qui agit en vertu des statuts, d'une part,
                </p>
                <p class="mb-4">et</p>
                <p class="mb-8 font-bold">"SYS INFOTECH" LLC<br>
                Bureau No. 5, 4\u00e8me \u00e9tage, 19 Khanjyan Str., Erevan, Arm\u00e9nie<br>
                (ci-apr\u00e8s d\u00e9nomm\u00e9 le "Fournisseur de Services")<br>
                repr\u00e9sent\u00e9 par son Directeur [Nom du Directeur], qui agit en vertu des statuts, d'autre part.
                </p>
                <h3 class="text-xl font-bold mb-4">1. \u00c9TENDUE DES SERVICES</h3>
                <p class="mb-4">Le Fournisseur de Services ex\u00e9cutera les services suivants pour le Client (les "Services") :</p>
                <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><b>Gestion des Donn\u00e9es :</b> Y compris, mais sans s'y limiter, la saisie de donn\u00e9es, le nettoyage des donn\u00e9es, le stockage des donn\u00e9es et l'assurance de l'int\u00e9grit\u00e9 des donn\u00e9es.</li>
                    <li><b>Soutien Backend :</b> Fournir la maintenance, le d\u00e9pannage et le support technique pour le logiciel du Client.</li>
                </ul>
                <p class="mb-4">Les d\u00e9tails sp\u00e9cifiques des travaux \u00e0 effectuer seront d\u00e9crits dans des ordres de travail ou des d\u00e9clarations de travail s\u00e9par\u00e9s, qui seront int\u00e9gr\u00e9s \u00e0 cet Accord par r\u00e9f\u00e9rence.</p>
                <h3 class="text-xl font-bold mb-4">2. DUR\u00c9E DE L'ACCORD</h3>
                <p class="mb-4">Cet Accord commencera le <span id="preview-contract-date-fre-2">13 ao\u00fbt 2025</span> et se poursuivra pour une p\u00e9riode de <span id="preview-contract-term-fre">[P\u00e9riode de temps]</span>, sauf r\u00e9siliation anticip\u00e9e conform\u00e9ment aux dispositions de cet Accord.</p>
                <p class="mb-4">La date de fin de cet accord est le <span id="preview-end-date-fre">[Date de fin]</span>.</p>

                <h3 class="text-xl font-bold mb-4">3. COMPENSATION ET PAIEMENT</h3>
                <p class="mb-2">3.1. **Facturation :** Le Fournisseur de Services facturera le Client sur une base mensuelle pour les Services ex\u00e9cut\u00e9s pendant le mois pr\u00e9c\u00e9dent. La facture d\u00e9taillera le travail accompli, les heures pass\u00e9es et les d\u00e9penses convenues.</p>
                <p class="mb-2">3.2. **Tarif :** Le tarif des services sera de <span id="preview-rate-fre">[Tarif]</span>.</p>
                <p class="mb-4">3.3. **Conditions de Paiement :** Le Client paiera le montant total de chaque facture dans les trente (30) jours suivant la r\u00e9ception. Tous les paiements seront effectu\u00e9s en <span id="preview-currency-fre">[Devise, par ex. USD]</span>.</p>

                <h3 class="text-xl font-bold mb-4">4. CONFIDENTIALIT\u00c9</h3>
                <p class="mb-4">Les deux Parties conviennent de maintenir la confidentialit\u00e9 de toute information propri\u00e9taire ou confidentielle re\u00e7ue de l'autre Partie pendant la dur\u00e9e de cet Accord. Cette obligation survivra \u00e0 la r\u00e9siliation de cet Accord.</p>

                <h3 class="text-xl font-bold mb-4">5. PROPRI\u00c9T\u00c9 INTELLECTUELLE</h3>
                <p class="mb-4">Tout le produit du travail, y compris, mais sans s'y limiter, les rapports, les donn\u00e9es et le code logiciel cr\u00e9\u00e9 par le Fournisseur de Services dans le cadre des Services, sera la seule propri\u00e9t\u00e9 du Client apr\u00e8s le paiement int\u00e9gral.</p>

                <h3 class="text-xl font-bold mb-4">6. R\u00c9SILIATION</h3>
                <p class="mb-4">Chaque Partie peut r\u00e9silier l'accord si une violation mat\u00e9rielle n'est pas corrig\u00e9e dans les 30 jours suivant un avis \u00e9crit.</p>

                <h3 class="text-xl font-bold mb-4">7. RELATION DE CONTRACTANT IND\u00c9PENDANT</h3>
                <p class="mb-4">Le Fournisseur de Services est un contractant ind\u00e9pendant et rien dans cet Accord ne sera interpr\u00e9t\u00e9 comme cr\u00e9ant une relation d'employeur-employ\u00e9, de partenariat ou de coentreprise entre les Parties.</p>

                <h3 class="text-xl font-bold mb-4">8. INDEMNISATION</h3>
                <p class="mb-4">Chaque Partie accepte d'indemniser, de d\u00e9fendre et de d\u00e9gager de toute responsabilit\u00e9 l'autre Partie de toute r\u00e9clamation, dommage ou responsabilit\u00e9 d\u00e9coulant de sa propre n\u00e9gligence ou de sa mauvaise conduite intentionnelle dans l'ex\u00e9cution de cet Accord.</p>

                <h3 class="text-xl font-bold mb-4">9. LIMITATION DE RESPONSABILIT\u00c9</h3>
                <p class="mb-4">Aucune des Parties ne sera responsable envers l'autre des dommages indirects, accessoires ou cons\u00e9cutifs d\u00e9coulant de cet Accord.</p>

                <h3 class="text-xl font-bold mb-4">10. LOI APPLICABLE ET R\u00c8GLEMENT DES DIFF\u00c9RENDS</h3>
                <p class="mb-4">Cet Accord sera r\u00e9gi par les lois de <span id="preview-jurisdiction-fre">[Juridiction]</span>. Tout diff\u00e9rend d\u00e9coulant de cet Accord sera r\u00e9solu par des n\u00e9gociations de bonne foi. Si la n\u00e9gociation \u00e9choue, les Parties conviennent de recourir \u00e0 la m\u00e9diation avant de recourir \u00e0 un litige.</p>

                <h3 class="text-xl font-bold mb-4">11. ACCORD COMPLET</h3>
                <p class="mb-4">Cet Accord, ainsi que toutes les commandes de travail r\u00e9f\u00e9renc\u00e9es, constitue l'int\u00e9gralit\u00e9 de l'accord entre les Parties et remplace tous les accords ou ententes ant\u00e9rieurs, qu'ils soient \u00e9crits ou oraux.</p>

                <h3 class="text-xl font-bold mb-4 mt-8">D\u00c9TAILS ET SIGNATURES DES PARTIES</h3>
                <div class="grid grid-cols-2 gap-8 mt-16">
                    <div>
                        <p class="font-bold">CLIENT</p>
                        <div class="mt-4">
                            <p class="font-semibold">Sign\u00e9 num\u00e9riquement par : <span id="preview-sig-name-fre"></span></p>
                            <p class="text-sm text-gray-500"><span id="preview-sig-position-fre"></span></p>
                            <img id="preview-signature-fre" class="signature-image mb-2">
                            <p class="text-sm text-gray-500">Date : <span id="client-provider-date-fre"></span></p>
                            <p class="text-sm text-gray-500">Heure : <span id="client-provider-time-fre"></span></p>
                        </div>
                        <div class="mt-4 border-t border-gray-400 pt-2">Signature</div>
                    </div>
                    <div>
                        <p class="font-bold">FOURNISSEUR DE SERVICES</p>
                        <p class="mt-4"><b>Nom de la soci\u00e9t\u00e9 :</b> "SYS INFOTECH" LLC</p>
                        <div class="mt-12">
                            <p class="font-semibold">Sign\u00e9 num\u00e9riquement par : M. Max Keith</p>
                            <img src="https://storage.googleapis.com/gemini-prod-us-west1-assets/9972323719a909a8/image-removebg-preview%20(14).png" alt="Mr. Max Keith's Signature" class="max-w-[200px] h-auto">
                            <p class="text-sm text-gray-500">Date : <span id="service-provider-date-fre"></span></p>
                            <p class="text-sm text-gray-500">Heure : <span id="service-provider-time-fre"></span></p>
                        </div>
                        <div class="mt-4 border-t border-gray-400 pt-2">Signature</div>
                    </div>
                </div>
            `,
            german: `
                <h1 class="text-2xl font-bold text-center mb-4">DIENSTLEISTUNGSVERTRAG</h1>
                <p class="text-center font-semibold">Stadt Eriwan</p>
                <p class="text-center font-semibold mb-8"><span id="preview-contract-date-ger">13. August 2025</span></p>
                <p class="mb-4">Dieser Dienstleistungsvertrag wird zwischen den folgenden Parteien geschlossen:</p>
                <p class="mb-4 font-bold"><span id="preview-client-name-ger">[KUNDENNAME]</span><br>
                (im Folgenden als "Kunde" bezeichnet)<br>
                <span id="preview-client-address-ger">[Adresse des Kunden]</span><br>
                vertreten durch seinen <span id="preview-authorized-position-ger">[Position]</span> <span id="preview-authorized-person-ger">[Name der autorisierten Person]</span>, der auf der Grundlage der Satzung handelt, einerseits,
                </p>
                <p class="mb-4">und</p>
                <p class="mb-8 font-bold">"SYS INFOTECH" LLC<br>
                Büro Nr. 5, 4. Etage, 19 Khanjyan Str., Eriwan, Armenien<br>
                (im Folgenden als "Dienstleister" bezeichnet)<br>
                vertreten durch seinen Direktor [Name des Direktors], der auf der Grundlage der Satzung handelt, andererseits.
                </p>
                <h3 class="text-xl font-bold mb-4">1. UMFANG DER DIENSTLEISTUNGEN</h3>
                <p class="mb-4">Der Dienstleister erbringt die folgenden Dienstleistungen für den Kunden (die "Dienstleistungen"):</p>
                <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><b>Datenmanagement:</b> Einschließlich, aber nicht beschränkt auf Dateneingabe, Datenbereinigung, Datenspeicherung und Sicherstellung der Datenintegrität.</li>
                    <li><b>Backend-Support:</b> Bereitstellung von Wartung, Fehlerbehebung und technischem Support für die Software des Kunden.</li>
                </ul>
                <p class="mb-4">Die spezifischen Details der zu erbringenden Arbeiten werden in separaten Arbeitsaufträgen oder Leistungsbeschreibungen festgelegt, die durch Verweis in diesen Vertrag aufgenommen werden.</p>
                <h3 class="text-xl font-bold mb-4">2. VERTRAGSLAUFZEIT</h3>
                <p class="mb-4">Dieser Vertrag beginnt am <span id="preview-contract-date-ger-2">13. August 2025</span> und läuft für einen Zeitraum von <span id="preview-contract-term-ger">[Zeitraum]</span>, es sei denn, er wird früher gemäß den Bestimmungen dieses Vertrags gekündigt.</p>
                <p class="mb-4">Das Enddatum für diesen Vertrag ist <span id="preview-end-date-ger">[Enddatum]</span>.</p>

                <h3 class="text-xl font-bold mb-4">3. VERGÜTUNG UND ZAHLUNG</h3>
                <p class="mb-2">3.1. **Rechnungsstellung:** Der Dienstleister stellt dem Kunden monatlich Rechnungen für die im Vormonat erbrachten Dienstleistungen aus. Die Rechnung enthält eine detaillierte Aufschlüsselung der erbrachten Leistungen, der aufgewendeten Stunden und der vereinbarten Ausgaben.</p>
                <p class="mb-2">3.2. **Tarif:** Der Tarif für die Dienstleistungen beträgt <span id="preview-rate-ger">[Tarif]</span>.</p>
                <p class="mb-4">3.3. **Zahlungsbedingungen:** Der Kunde zahlt den vollen Betrag jeder Rechnung innerhalb von dreißig (30) Tagen nach Erhalt. Alle Zahlungen erfolgen in <span id="preview-currency-ger">[Währung, z. B. USD]</span>.</p>

                <h3 class="text-xl font-bold mb-4">4. VERTRAULICHKEIT</h3>
                <p class="mb-4">Beide Parteien stimmen zu, alle proprietären oder vertraulichen Informationen, die sie während der Laufzeit dieses Vertrags von der anderen Partei erhalten, vertraulich zu behandeln. Diese Verpflichtung bleibt auch nach Beendigung dieses Vertrags bestehen.</p>

                <h3 class="text-xl font-bold mb-4">5. GEISTIGES EIGENTUM</h3>
                <p class="mb-4">Alle Arbeitsergebnisse, einschließlich, aber nicht beschränkt auf Berichte, Daten und Softwarecode, die vom Dienstleister im Rahmen der Dienstleistungen erstellt wurden, sind nach vollständiger Bezahlung alleiniges Eigentum des Kunden.</p>

                <h3 class="text-xl font-bold mb-4">6. KÜNDIGUNG</h3>
                <p class="mb-4">Jede Partei kann den Vertrag kündigen, wenn eine wesentliche Vertragsverletzung nicht innerhalb von 30 Tagen nach einer schriftlichen Mitteilung behoben wird.</p>

                <h3 class="text-xl font-bold mb-4">7. BEZIEHUNG ALS UNABHÄNGIGER AUFTRAGNEHMER</h3>
                <p class="mb-4">Der Dienstleister ist ein unabhängiger Auftragnehmer, und nichts in diesem Vertrag ist so auszulegen, dass es eine Arbeitgeber-Arbeitnehmer-, Partnerschafts- oder Joint-Venture-Beziehung zwischen den Parteien schafft.</p>

                <h3 class="text-xl font-bold mb-4">8. SCHADENERSATZ</h3>
                <p class="mb-4">Jede Partei erklärt sich damit einverstanden, die andere Partei von allen Ansprüchen, Schäden oder Verbindlichkeiten freizustellen, zu verteidigen und schadlos zu halten, die sich aus ihrer eigenen Fahrlässigkeit oder ihrem vorsätzlichen Fehlverhalten bei der Erfüllung dieses Vertrags ergeben.</p>

                <h3 class="text-xl font-bold mb-4">9. HAFTUNGSBESCHRÄNKUNG</h3>
                <p class="mb-4">Keine der Parteien haftet der anderen für indirekte, zufällige oder Folgeschäden, die sich aus diesem Vertrag ergeben.</p>

                <h3 class="text-xl font-bold mb-4">10. ANWENDBARES RECHT UND STREITBEILEGUNG</h3>
                <p class="mb-4">Dieser Vertrag unterliegt den Gesetzen von <span id="preview-jurisdiction-ger">[Gerichtsstand]</span>. Alle Streitigkeiten, die sich aus diesem Vertrag ergeben, werden durch Verhandlungen in gutem Glauben beigelegt. Wenn die Verhandlungen scheitern, vereinbaren die Parteien, vor der Einleitung eines Gerichtsverfahrens eine Mediation zu versuchen.</p>

                <h3 class="text-xl font-bold mb-4">11. GESAMTER VERTRAG</h3>
                <p class="mb-4">Dieser Vertrag stellt zusammen mit allen darin genannten Arbeitsaufträgen die gesamte Vereinbarung zwischen den Parteien dar und ersetzt alle früheren Vereinbarungen oder Absprachen, ob schriftlich oder mündlich.</p>

                <h3 class="text-xl font-bold mb-4 mt-8">DETAILS UND UNTERSCHRIFTEN DER PARTEIEN</h3>
                <div class="grid grid-cols-2 gap-8 mt-16">
                    <div>
                        <p class="font-bold">KUNDE</p>
                        <div class="mt-4">
                            <p class="font-semibold">Digital signiert von: <span id="preview-sig-name-ger"></span></p>
                            <p class="text-sm text-gray-500"><span id="preview-sig-position-ger"></span></p>
                            <img id="preview-signature-ger" class="signature-image mb-2">
                            <p class="text-sm text-gray-500">Datum: <span id="client-provider-date-ger"></span></p>
                            <p class="text-sm text-gray-500">Uhrzeit: <span id="client-provider-time-ger"></span></p>
                        </div>
                        <div class="mt-4 border-t border-gray-400 pt-2">Unterschrift</div>
                    </div>
                    <div>
                        <p class="font-bold">DIENSTLEISTER</p>
                        <p class="mt-4"><b>Firmenname:</b> "SYS INFOTECH" LLC</p>
                        <div class="mt-12">
                            <p class="font-semibold">Digital signiert von: Herr Max Keith</p>
                            <img src="https://storage.googleapis.com/gemini-prod-us-west1-assets/9972323719a909a8/image-removebg-preview%20(14).png" alt="Mr. Max Keith's Signature" class="max-w-[200px] h-auto">
                            <p class="text-sm text-gray-500">Datum: <span id="service-provider-date-ger"></span></p>
                            <p class="text-sm text-gray-500">Uhrzeit: <span id="service-provider-time-ger"></span></p>
                        </div>
                        <div class="mt-4 border-t border-gray-400 pt-2">Unterschrift</div>
                    </div>
                </div>
            `,
            hindi: `
                <h1 class="text-2xl font-bold text-center mb-4">सेवा अनुबंध</h1>
                <p class="text-center font-semibold">येरेवान शहर</p>
                <p class="text-center font-semibold mb-8"><span id="preview-contract-date-hin">13 अगस्त, 2025</span></p>
                <p class="mb-4">यह सेवा अनुबंध निम्नलिखित के बीच किया गया है:</p>
                <p class="mb-4 font-bold"><span id="preview-client-name-hin">[ग्राहक का नाम]</span><br>
                (इसके बाद "ग्राहक" के रूप में संदर्भित)<br>
                <span id="preview-client-address-hin">[ग्राहक का पता]</span><br>
                represented by its <span id="preview-authorized-position-hin">[पद]</span> <span id="preview-authorized-person-hin">[अधिकृत व्यक्ति का नाम]</span>, जो एक तरफ, चार्टर के आधार पर कार्य करता है,
                </p>
                <p class="mb-4">और</p>
                <p class="mb-8 font-bold">"SYS INFOTECH" LLC<br>
                कार्यालय संख्या 5, 4थी मंजिल, 19 खंज्यान स्ट्र, येरेवान, आर्मेनिया<br>
                (इसके बाद "सेवा प्रदाता" के रूप में संदर्भित)<br>
                अपने निदेशक [निदेशक का नाम] द्वारा प्रतिनिधित्व किया गया है, जो दूसरी तरफ, चार्टर के आधार पर कार्य करता है।
                </p>
                <h3 class="text-xl font-bold mb-4">1. सेवाओं का दायरा</h3>
                <p class="mb-4">सेवा प्रदाता ग्राहक के लिए निम्नलिखित सेवाएं ("सेवाएं") करेगा:</p>
                <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><b>डेटा प्रबंधन:</b> जिसमें डेटा प्रविष्टि, डेटा सफाई, डेटा भंडारण और डेटा अखंडता सुनिश्चित करना शामिल है, लेकिन इन्हीं तक सीमित नहीं है।</li>
                    <li><b>बैकएंड सहायता:</b> ग्राहक के सॉफ्टवेयर के लिए रखरखाव, समस्या निवारण और तकनीकी सहायता प्रदान करना।</li>
                </ul>
                <p class="mb-4">किए जाने वाले कार्य के विशिष्ट विवरण अलग-अलग कार्य आदेशों या कार्य विवरणों में उल्लिखित होंगे, जिन्हें संदर्भ द्वारा इस अनुबंध में शामिल किया जाएगा।</p>
                <h3 class="text-xl font-bold mb-4">2. समझौते की अवधि</h3>
                <p class="mb-4">यह समझौता <span id="preview-contract-date-hin-2">13 अगस्त, 2025</span> को शुरू होगा और <span id="preview-contract-term-hin">[समय अवधि]</span> की अवधि तक जारी रहेगा, जब तक कि इस समझौते के प्रावधानों के अनुसार पहले समाप्त न हो जाए।</p>
                <p class="mb-4">इस समझौते की समाप्ति तिथि <span id="preview-end-date-hin">[समाप्ति तिथि]</span> है।</p>

                <h3 class="text-xl font-bold mb-4">3. मुआवजा और भुगतान</h3>
                <p class="mb-2">3.1. **चालान:** सेवा प्रदाता पिछले महीने के दौरान की गई सेवाओं के लिए मासिक आधार पर ग्राहक को चालान करेगा। चालान में पूर्ण किए गए कार्य, खर्च किए गए घंटे और सहमत खर्चों का विवरण होगा।</p>
                <p class="mb-2">3.2. **दर:** सेवाओं के लिए दर <span id="preview-rate-hin">[दर]</span> होगी।</p>
                <p class="mb-4">3.3. **भुगतान शर्तें:** ग्राहक चालान की प्राप्ति के तीस (30) दिनों के भीतर प्रत्येक चालान की पूरी राशि का भुगतान करेगा। सभी भुगतान <span id="preview-currency-hin">[मुद्रा, जैसे USD]</span> में किए जाएंगे।</p>

                <h3 class="text-xl font-bold mb-4">4. गोपनीयता</h3>
                <p class="mb-4">दोनों पक्ष इस समझौते की अवधि के दौरान दूसरे पक्ष से प्राप्त किसी भी और सभी मालिकाना या गोपनीय जानकारी की गोपनीयता बनाए रखने के लिए सहमत हैं। यह दायित्व इस समझौते की समाप्ति के बाद भी बना रहेगा।</p>

                <h3 class="text-xl font-bold mb-4">5. बौद्धिक संपदा</h3>
                <p class="mb-4">सेवा प्रदाता द्वारा सेवाओं के हिस्से के रूप में बनाए गए सभी कार्य उत्पाद, जिसमें रिपोर्ट, डेटा और सॉफ्टवेयर कोड शामिल हैं, लेकिन इन्हीं तक सीमित नहीं हैं, पूर्ण भुगतान पर ग्राहक की एकमात्र संपत्ति होगी।</p>

                <h3 class="text-xl font-bold mb-4">6. समाप्ति</h3>
                <p class="mb-4">यदि लिखित नोटिस के 30 दिनों के भीतर एक महत्वपूर्ण उल्लंघन को ठीक नहीं किया जाता है तो कोई भी पक्ष समझौते को समाप्त कर सकता है।</p>

                <h3 class="text-xl font-bold mb-4">7. स्वतंत्र ठेकेदार संबंध</h3>
                <p class="mb-4">सेवा प्रदाता एक स्वतंत्र ठेकेदार है और इस समझौते में कुछ भी पक्षों के बीच नियोक्ता-कर्मचारी, साझेदारी, या संयुक्त उद्यम संबंध बनाने के रूप में नहीं माना जाएगा।</p>

                <h3 class="text-xl font-bold mb-4">8. क्षतिपूर्ति</h3>
                <p class="mb-4">प्रत्येक पक्ष इस समझौते के प्रदर्शन में अपनी स्वयं की लापरवाही या जानबूझकर दुराचार से उत्पन्न होने वाले किसी भी दावे, क्षति, या देनदारियों से दूसरे पक्ष की क्षतिपूर्ति, बचाव और हानिरहित रखने के लिए सहमत है।</p>

                <h3 class="text-xl font-bold mb-4">9. दायित्व की सीमा</h3>
                <p class="mb-4">इस समझौते से उत्पन्न होने वाले किसी भी अप्रत्यक्ष, आकस्मिक, या परिणामी नुकसान के लिए कोई भी पक्ष दूसरे के प्रति उत्तरदायी नहीं होगा।</p>

                <h3 class="text-xl font-bold mb-4">10. शासी कानून और विवाद समाधान</h3>
                <p class="mb-4">यह समझौता <span id="preview-jurisdiction-hin">[अधिकार क्षेत्र]</span> के कानूनों द्वारा शासित होगा। इस समझौते से उत्पन्न होने वाले किसी भी विवाद को सद्भावना वार्ता के माध्यम से हल किया जाएगा। यदि बातचीत विफल हो जाती है, तो पक्ष मुकदमेबाजी का सहारा लेने से पहले मध्यस्थता का पीछा करने के लिए सहमत हैं।</p>

                <h3 class="text-xl font-bold mb-4">11. संपूर्ण समझौता</h3>
                <p class="mb-4">यह समझौता, किसी भी संदर्भित कार्य आदेशों के साथ, पक्षों के बीच संपूर्ण समझौता है और सभी पिछले समझौतों या समझ, चाहे वे लिखित या मौखिक हों, को प्रतिस्थापित करता है।</p>

                <h3 class="text-xl font-bold mb-4 mt-8">विवरण और पार्टियों के हस्ताक्षर</h3>
                <div class="grid grid-cols-2 gap-8 mt-16">
                    <div>
                        <p class="font-bold">ग्राहक</p>
                        <div class="mt-4">
                            <p class="font-semibold">डिजिटल रूप से हस्ताक्षरित: <span id="preview-sig-name-hin"></span></p>
                            <p class="text-sm text-gray-500"><span id="preview-sig-position-hin"></span></p>
                            <img id="preview-signature-hin" class="signature-image mb-2">
                            <p class="text-sm text-gray-500">दिनांक: <span id="client-provider-date-hin"></span></p>
                            <p class="text-sm text-gray-500">समय: <span id="client-provider-time-hin"></span></p>
                        </div>
                        <div class="mt-4 border-t border-gray-400 pt-2">हस्ताक्षर</div>
                    </div>
                    <div>
                        <p class="font-bold">सेवा प्रदाता</p>
                        <p class="mt-4"><b>कंपनी का नाम:</b> "SYS INFOTECH" LLC</p>
                        <div class="mt-12">
                            <p class="font-semibold">डिजिटल रूप से हस्ताक्षरित: श्री मैक्स कीथ</p>
                            <img src="https://storage.googleapis.com/gemini-prod-us-west1-assets/9972323719a909a8/image-removebg-preview%20(14).png" alt="Mr. Max Keith's Signature" class="max-w-[200px] h-auto">
                            <p class="text-sm text-gray-500">दिनांक: <span id="service-provider-date-hin"></span></p>
                            <p class="text-sm text-gray-500">समय: <span id="service-provider-time-hin"></span></p>
                        </div>
                        <div class="mt-4 border-t border-gray-400 pt-2">हस्ताक्षर</div>
                    </div>
                </div>
            `,
        };
        
        function calculateEndDate() {
            const startDateString = inputs.contractDate.value;
            const termMonths = parseInt(inputs.termMonths.value, 10);
            const termYears = parseInt(inputs.termYears.value, 10);
            if (!startDateString) {
                return placeholders.endDate;
            }
            const startDate = new Date(startDateString);
            if (isNaN(startDate.getTime())) {
                return 'Invalid Date';
            }
            const endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + termYears);
            endDate.setMonth(startDate.getMonth() + termMonths);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return endDate.toLocaleDateString('en-US', options);
        }
        
        function updatePreview() {
            const selectedLanguage = langSelector.value;
            
            if (selectedLanguage !== 'none') {
                document.getElementById('english-content').classList.add('hidden');
                document.getElementById('second-language-content').innerHTML = contentByLang[selectedLanguage];
            } else {
                document.getElementById('english-content').classList.remove('hidden');
                document.getElementById('second-language-content').innerHTML = '';
            }

            for (const key in previews) {
                const element = previews[key];
                if (element) {
                    if (inputs[key] && inputs[key].value !== '') {
                        element.textContent = inputs[key].value;
                    } else if (placeholders[key]) {
                        element.textContent = placeholders[key];
                    }
                }
            }

            const dateValue = new Date().toISOString().split('T')[0];
            const dateObj = new Date(dateValue);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options);
            previews.contractDate.textContent = formattedDate;
            previews.contractDate2.textContent = formattedDate;
            
            const termMonths = parseInt(inputs.termMonths.value, 10) || 0;
            const termYears = parseInt(inputs.termYears.value, 10) || 0;
            let termText = '';
            if (termYears > 0) {
                termText += `${termYears} year${termYears > 1 ? 's' : ''}`;
            }
            if (termMonths > 0) {
                if (termText.length > 0) termText += ' and ';
                termText += `${termMonths} month${termMonths > 1 ? 's' : ''}`;
            }
            if (termText === '') {
                termText = placeholders.contractTerm;
            }
            previews.contractTerm.textContent = termText;

            previews.rate.textContent = inputs.rate.value || placeholders.rate;
            previews.currency.textContent = inputs.currency.value || placeholders.currency;
            previews.jurisdiction.textContent = inputs.jurisdiction.value || placeholders.jurisdiction;
            
            document.getElementById('end-date').value = calculateEndDate();
            previews.endDate.textContent = document.getElementById('end-date').value;
            
            const selectedCurrency = inputs.currency.value;
            const symbol = currencySymbols[selectedCurrency] || '';
            document.getElementById('currency-symbol').textContent = symbol;
            
            previews.sigName.textContent = inputs.authorizedPerson.value;
            previews.sigPosition.textContent = inputs.authorizedPosition.value;
            
            if (signatureDataUrl) {
                previewSignature.src = signatureDataUrl;
            } else {
                previewSignature.src = '';
            }

            updateServiceProviderSignature();
            updateClientSignatureTimestamp();
            
            if (selectedLanguage !== 'none') {
                updateDualLanguageContent(selectedLanguage);
            }
        }
        
        function updateDualLanguageContent(selectedLanguage) {
            const langPrefix = selectedLanguage.substring(0,3);
            const engContent = document.getElementById('english-content');
            const dualContent = document.getElementById('second-language-content');
            
            if (selectedLanguage === 'none' || !contentByLang[selectedLanguage]) {
                engContent.classList.remove('hidden');
                dualContent.innerHTML = '';
                return;
            }
            
            engContent.classList.add('hidden');
            dualContent.innerHTML = contentByLang[selectedLanguage];
            
            const engElements = {
                clientName: inputs.clientName.value,
                clientAddress: inputs.clientAddress.value,
                authorizedPerson: inputs.authorizedPerson.value,
                authorizedPosition: inputs.authorizedPosition.value,
                contractDate: previews.contractDate.textContent,
                contractDate2: previews.contractDate2.textContent,
                contractTerm: previews.contractTerm.textContent,
                rate: previews.rate.textContent,
                currency: previews.currency.textContent,
                jurisdiction: previews.jurisdiction.textContent,
                endDate: previews.endDate.textContent,
                sigName: previews.sigName.textContent,
                sigPosition: previews.sigPosition.textContent,
                clientDate: clientProviderDate.textContent,
                clientTime: clientProviderTime.textContent,
                servDate: serviceProviderDate.textContent,
                servTime: serviceProviderTime.textContent,
            };

            const dualElements = {
                clientName: document.getElementById(`preview-client-name-${langPrefix}`),
                clientAddress: document.getElementById(`preview-client-address-${langPrefix}`),
                authorizedPerson: document.getElementById(`preview-authorized-person-${langPrefix}`),
                authorizedPosition: document.getElementById(`preview-authorized-position-${langPrefix}`),
                contractDate: document.getElementById(`preview-contract-date-${langPrefix}`),
                contractDate2: document.getElementById(`preview-contract-date-${langPrefix}-2`),
                contractTerm: document.getElementById(`preview-contract-term-${langPrefix}`),
                rate: document.getElementById(`preview-rate-${langPrefix}`),
                currency: document.getElementById(`preview-currency-${langPrefix}`),
                jurisdiction: document.getElementById(`preview-jurisdiction-${langPrefix}`),
                endDate: document.getElementById(`preview-end-date-${langPrefix}`),
                sigName: document.getElementById(`preview-sig-name-${langPrefix}`),
                sigPosition: document.getElementById(`preview-sig-position-${langPrefix}`),
                clientDate: document.getElementById(`client-provider-date-${langPrefix}`),
                clientTime: document.getElementById(`client-provider-time-${langPrefix}`),
                servDate: document.getElementById(`service-provider-date-${langPrefix}`),
                servTime: document.getElementById(`service-provider-time-${langPrefix}`),
            };
            
            for(const key in dualElements){
                if(dualElements[key]){
                    dualElements[key].textContent = engElements[key];
                }
            }
            
            const dualSigImg = document.getElementById(`preview-signature-${langPrefix}`);
            if(dualSigImg && signatureDataUrl){
                dualSigImg.src = signatureDataUrl;
            }
        }
        
        function initSignaturePad() {
            const resizeCanvas = () => {
                const rect = signaturePad.getBoundingClientRect();
                signaturePad.width = rect.width;
                signaturePad.height = rect.height;
                signatureCtx.fillStyle = '#f7f7f7';
                signatureCtx.fillRect(0, 0, signaturePad.width, signatureCtx.height);
            };

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            const getMousePos = (e) => {
                const rect = signaturePad.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            };
            const getTouchPos = (e) => {
                const rect = signaturePad.getBoundingClientRect();
                const touch = e.touches[0];
                return {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top
                };
            };

            const startDrawing = (e) => {
                isSigning = true;
                const pos = e.type.startsWith('mouse') ? getMousePos(e) : getTouchPos(e);
                signatureCtx.beginPath();
                signatureCtx.moveTo(pos.x, pos.y);
            };

            const draw = (e) => {
                if (!isSigning) return;
                e.preventDefault();
                const pos = e.type.startsWith('mouse') ? getMousePos(e) : getTouchPos(e);
                signatureCtx.lineTo(pos.x, pos.y);
                signatureCtx.strokeStyle = '#4A4A4A';
                signatureCtx.lineWidth = 2;
                signatureCtx.lineCap = 'round';
                signatureCtx.stroke();
            };

            const stopDrawing = () => {
                isSigning = false;
                signatureDataUrl = signaturePad.toDataURL();
                if (previewSignature) {
                    previewSignature.src = signatureDataUrl;
                }
            };
            
            signaturePad.addEventListener('mousedown', startDrawing);
            signaturePad.addEventListener('mousemove', draw);
            signaturePad.addEventListener('mouseup', stopDrawing);
            signaturePad.addEventListener('mouseleave', stopDrawing);

            signaturePad.addEventListener('touchstart', startDrawing);
            signaturePad.addEventListener('touchmove', draw);
            signaturePad.addEventListener('touchend', stopDrawing);
        }
        
        initSignaturePad();

        toggleDrawUploadBtn.addEventListener('click', () => {
            isDrawingMode = !isDrawingMode;
            if (isDrawingMode) {
                toggleDrawUploadBtn.textContent = 'Upload';
                signaturePad.classList.remove('hidden');
                signatureUpload.classList.add('hidden');
                signatureUploadPreview.classList.add('hidden');
            } else {
                toggleDrawUploadBtn.textContent = 'Draw';
                signaturePad.classList.add('hidden');
                signatureUpload.classList.remove('hidden');
                signatureUploadPreview.classList.remove('hidden');
            }
        });

        signatureUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    signatureDataUrl = event.target.result;
                    if (previewSignature) {
                        previewSignature.src = signatureDataUrl;
                        signatureUploadPreview.innerHTML = `<img src="${signatureDataUrl}" class="h-full object-contain mx-auto">`;
                    }
                    signaturePad.classList.add('hidden');
                    signatureUploadPreview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
        
        viewContractBtn.addEventListener('click', () => {
            page1.classList.add('hidden');
            page2.classList.remove('hidden');
        });
        
        sendCodeBtn.addEventListener('click', () => {
            generateVerificationCode();
            verificationContainer.classList.remove('hidden');
            verificationMessage.textContent = `A verification code has been sent to ${clientEmailInput.value}.`;
            verificationMessage.classList.add('text-gray-600');
            resendCodeBtn.classList.remove('hidden');
        });

        verificationCodeInput.addEventListener('input', () => {
            if (verificationCodeInput.value.length === 6) {
                verifyBtn.disabled = false;
            } else {
                verifyBtn.disabled = true;
            }
        });

        verifyBtn.addEventListener('click', () => {
            if (verificationCodeInput.value === verificationCode) {
                verificationMessage.textContent = 'Verification successful!';
                verificationMessage.classList.add('text-green-600');
                verificationMessage.classList.remove('text-red-600');
                
                updatePreview();
                updateServiceProviderSignature();
                updateClientSignatureTimestamp();
                page2.classList.add('hidden');
                page3.classList.remove('hidden');
            } else {
                verificationMessage.textContent = 'Invalid code. Please try again.';
                verificationMessage.classList.add('text-red-600');
                verificationMessage.classList.remove('text-green-600');
            }
        });

        resendCodeBtn.addEventListener('click', () => {
            generateVerificationCode();
            verificationMessage.textContent = 'New code sent!';
            verificationMessage.classList.add('text-blue-600');
            verificationMessage.classList.remove('text-red-600', 'text-green-600');
        });

        backToFormBtn2.addEventListener('click', () => {
            page2.classList.add('hidden');
            page1.classList.remove('hidden');
        });

        backBtn.addEventListener('click', () => {
            page3.classList.add('hidden');
            page2.classList.remove('hidden');
        });

        pdfBtn.addEventListener('click', async () => {
            const contractContent = document.getElementById('contract-content');
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - 2 * margin;

            const canvas = await html2canvas(contractContent, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#fff',
            });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const imgHeight = canvas.height * contentWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = margin;

            doc.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft >= -50) {
                position = heightLeft - imgHeight + margin;
                doc.addPage();
                doc.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save('Service-Agreement.pdf');
        });
        
        form.addEventListener('input', updatePreview);
        langSelector.addEventListener('change', (e) => {
            updateDualLanguagePreview(e.target.value);
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            const today = new Date().toISOString().split('T')[0];
            if (inputs.contractDate) {
                inputs.contractDate.value = today;
            }
            updatePreview();
            updateServiceProviderSignature();
        });
        
        function generateVerificationCode() {
            verificationCode = DEV_OTP;
            console.log(`[SIMULATED] Verification code for ${clientEmailInput.value} is: ${verificationCode}`);
        }

        function updateServiceProviderSignature() {
            const now = new Date();
            const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
            
            const formattedDate = now.toLocaleDateString('en-US', optionsDate);
            const formattedTime = now.toLocaleTimeString('en-US', optionsTime);

            if (serviceProviderDate) {
                serviceProviderDate.textContent = formattedDate;
            }
            if (serviceProviderTime) {
                serviceProviderTime.textContent = formattedTime;
            }
            
            const selectedLanguage = langSelector.value;
            if (selectedLanguage !== 'none') {
                const langServDate = document.getElementById(`service-provider-date-${selectedLanguage.substring(0,3)}`);
                const langServTime = document.getElementById(`service-provider-time-${selectedLanguage.substring(0,3)}`);
                if (langServDate) langServDate.textContent = formattedDate;
                if (langServTime) langServTime.textContent = formattedTime;
            }
        }

        function updateClientSignatureTimestamp() {
            const now = new Date();
            const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
            
            const formattedDate = now.toLocaleDateString('en-US', optionsDate);
            const formattedTime = now.toLocaleTimeString('en-US', optionsTime);

            if (clientProviderDate) {
                clientProviderDate.textContent = formattedDate;
            }
            if (clientProviderTime) {
                clientProviderTime.textContent = formattedTime;
            }
            
            const selectedLanguage = langSelector.value;
            if (selectedLanguage !== 'none') {
                const langClientDate = document.getElementById(`client-provider-date-${selectedLanguage.substring(0,3)}`);
                const langClientTime = document.getElementById(`client-provider-time-${selectedLanguage.substring(0,3)}`);
                if (langClientDate) langClientDate.textContent = formattedDate;
                if (langClientTime) langClientTime.textContent = formattedTime;
            }
        }
    </script>
</body>
</html>
