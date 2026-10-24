// 1. ضعي رابط Web App الخاص بـ Google Sheet هنا بين علامتي التنصيص
const SCRIPT_URL = "PUT_YOUR_GOOGLE_SHEET_WEB_APP_URL_HERE";

// 2. قائمة الحيوانات السحرية (عدلي الأسماء ومسارات الصور حسب الموجود في فولدر images عندك)
const magicalPets = [
    { name: "طائر العنقاء", img: "images/phoenix.png", desc: "كائن أسطوري نادر يتجدد من الرماد!" },
    { name: "نيفلر (Niffler)", img: "images/niffler.png", desc: "كائن ظريف يعشق كل الأشياء اللامعة والذهب!" },
    { name: "البومة الثلجية", img: "images/owl.png", desc: "رفيق وفيّ وذكي لتوصيل الرسائل السحرية." },
    { name: "هيبوغريف (Buckbeak)", img: "images/hippogriff.png", desc: "مخلوق مهيب نصفه نسر ونصفه حصان، يحترم من يحترمه." },
    { name: "تنين الهورنهيل المجري", img: "images/dragon.png", desc: "من أقوى وأخطر المخلوقات السحرية على الإطلاق!" },
    { name: "بفسكين (Puffskein)", img: "images/puffskein.png", desc: "كائن كروي ناعم ولطيف يحبه جميع السحرة." }
];

let isOpening = false; // لمنع الضغط المتكرر على البيضة

function crackEgg() {
    if (isOpening) return;

    const nameInput = document.getElementById("wizardName");
    const houseInput = document.getElementById("wizardHouse");
    const errorMsg = document.getElementById("errorMsg");

    const wizardName = nameInput.value.trim();
    const wizardHouse = houseInput.value.trim();

    // التحقق من إدخال البيانات قبل فتح البيضة
    if (!wizardName || !wizardHouse) {
        errorMsg.innerText = "⚠️ تعويذة ناقصة! يرجى إدخال اسمك ومنزلك السحري أولاً.";
        return;
    }

    // إخفاء رسالة الخطأ وقفل الخانات
    errorMsg.innerText = "";
    isOpening = true;
    nameInput.disabled = true;
    houseInput.disabled = true;

    // تشغيل حركة اهتزاز البيضة
    const eggCard = document.getElementById("eggCard");
    eggCard.classList.add("shake-animation");
    document.querySelector(".click-hint").innerText = "جاري فقس البيضة... ✨";

    // اختيار حيوان عشوائي من القائمة
    const randomIndex = Math.floor(Math.random() * magicalPets.length);
    const selectedPet = magicalPets[randomIndex];

    // الانتظار ثانية ونصف لانتهاء حركة الاهتزاز ثم إظهار النتيجة
    setTimeout(() => {
        document.getElementById("eggStage").style.display = "none";
        document.getElementById("inputsSection").style.display = "none";

        const resultStage = document.getElementById("resultStage");
        resultStage.style.display = "block";

        document.getElementById("petImg").src = selectedPet.img;
        document.getElementById("petName").innerText = selectedPet.name;
        document.getElementById("petDesc").innerText = selectedPet.desc;

        // إرسال البيانات إلى شيت الإكسل
        sendToGoogleSheet(wizardName, wizardHouse, selectedPet.name);
    }, 1500);
}

function sendToGoogleSheet(name, house, pet) {
    const statusText = document.getElementById("sheetStatus");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("house", house);
    formData.append("pet", pet);

    fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
    })
    .then(response => {
        statusText.innerText = "✅ تم تسجيل حيوانك السحري في سجلات المتجر بنجاح!";
        statusText.style.color = "#a7f3d0";
    })
    .catch(error => {
        console.error("Error!", error.message);
        statusText.innerText = "⚠️ ظهر الحيوان ولكن تعذر حفظه في السجل، تأكد من رابط الشيت.";
        statusText.style.color = "#fca5a5";
    });
}
