// 1. ضعي رابط Web App الخاص بـ Google Sheet هنا
const SCRIPT_URL = "PUT_YOUR_GOOGLE_SHEET_WEB_APP_URL_HERE";

// 2. قائمة الحيوانات السحرية مع نسبة ظهور كل حيوان (chance)
// ملاحظة: تقدري تغيري أرقام الـ chance براحتك، كل ما الرقم كبر زادت فرصة ظهور الحيوان
const magicalPets = [
    // --- فئة عادية (مجموع نسبهم 60%) ---
    { 
        name: "بفسكين (Puffskein)", 
        rarity: "عادي",
        chance: 35, // نسبة الظهور 35%
        img: "images/puffskein.png", 
        desc: "كائن كروي ناعم ولطيف يحبه جميع السحرة." 
    },
    { 
        name: "البومة الثلجية", 
        rarity: "عادي",
        chance: 25, // نسبة الظهور 25%
        img: "images/owl.png", 
        desc: "رفيق وفيّ وذكي لتوصيل الرسائل السحرية." 
    },

    // --- فئة نادرة (مجموع نسبهم 30%) ---
    { 
        name: "نيفلر (Niffler)", 
        rarity: "نادر ✨",
        chance: 18, // نسبة الظهور 18%
        img: "images/niffler.png", 
        desc: "كائن ظريف يعشق كل الأشياء اللامعة والذهب!" 
    },
    { 
        name: "هيبوغريف (Buckbeak)", 
        rarity: "نادر ✨",
        chance: 12, // نسبة الظهور 12%
        img: "images/hippogriff.png", 
        desc: "مخلوق مهيب نصفه نسر ونصفه حصان، يحترم من يحترمه." 
    },

    // --- فئة أسطورية (مجموع نسبهم 10% فقط) ---
    { 
        name: "تنين الهورنهيل المجري", 
        rarity: "أسطوري 🔥",
        chance: 7, // نسبة الظهور 7%
        img: "images/dragon.png", 
        desc: "من أقوى وأخطر المخلوقات السحرية على الإطلاق!" 
    },
    { 
        name: "طائر العنقاء (Fawkes)", 
        rarity: "أسطوري 👑",
        chance: 3, // نسبة الظهور 3% فقط (نادر جداً)
        img: "images/phoenix.png", 
        desc: "كائن أسطوري خارق يتجدد من الرماد!" 
    }
];

let isOpening = false;

// دالة اختيار الحيوان بناءً على النسبة المئوية (Weighted Random)
function getPetByPercentage() {
    // جمع كل النسب الموجودة في القائمة (حتى لو عدلتي الأرقام ومكانش مجموعهم 100 الكود هيحسبها صح تلقائياً)
    const totalChance = magicalPets.reduce((sum, pet) => sum + pet.chance, 0);
    
    // اختيار رقم عشوائي بين 0 ومجموع النسب
    let randomNum = Math.random() * totalChance;

    // المرور على الحيوانات لاختيار الحيوان المطابق للرقم العشوائي
    for (let i = 0; i < magicalPets.length; i++) {
        if (randomNum < magicalPets[i].chance) {
            return magicalPets[i];
        }
        randomNum -= magicalPets[i].chance;
    }
    
    return magicalPets[0]; // احتياطي
}

function crackEgg() {
    if (isOpening) return;

    const nameInput = document.getElementById("wizardName");
    const houseInput = document.getElementById("wizardHouse");
    const errorMsg = document.getElementById("errorMsg");

    const wizardName = nameInput.value.trim();
    const wizardHouse = houseInput.value.trim();

    if (!wizardName || !wizardHouse) {
        errorMsg.innerText = "⚠️ تعويذة ناقصة! يرجى إدخال اسمك ومنزلك السحري أولاً.";
        return;
    }

    errorMsg.innerText = "";
    isOpening = true;
    nameInput.disabled = true;
    houseInput.disabled = true;

    const eggCard = document.getElementById("eggCard");
    eggCard.classList.add("shake-animation");
    document.querySelector(".click-hint").innerText = "جاري فقس البيضة... ✨";

    // سحب الحيوان حسب النسبة المئوية
    const selectedPet = getPetByPercentage();

    setTimeout(() => {
        document.getElementById("eggStage").style.display = "none";
        document.getElementById("inputsSection").style.display = "none";

        const resultStage = document.getElementById("resultStage");
        resultStage.style.display = "block";

        document.getElementById("petImg").src = selectedPet.img;
        // عرض اسم الحيوان وبجانبه درجة ندرته
        document.getElementById("petName").innerText = `${selectedPet.name} [${selectedPet.rarity}]`;
        document.getElementById("petDesc").innerText = selectedPet.desc;

        // إرسال اسم الحيوان ودرجة ندرته إلى شيت الإكسل
        sendToGoogleSheet(wizardName, wizardHouse, `${selectedPet.name} (${selectedPet.rarity})`);
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
