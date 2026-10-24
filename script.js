const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-VB_ZThn4gBA-opwc0HcNwU-Ht5f0R754Ex4sf8C-qilCBfi7OvtmMoz6bo6nM5jG/exec";

const magicalPets = [
    { 
        name: "كلب أسود", 
        chance: 35, 
        img: "images/animal1.png", 
    },
    { 
        name: "بومة سوداء", 
        eggType: "بيضة عادية",
        chance: 25, 
        img: "images/animal2.png", 
        desc: "وصف الحيوان الثاني يكتب هنا..." 
    },

    // --- فئة نادرة (30%) ---
    { 
        name: "الحيوان الثالث", 
        eggType: "بيضة نادرة ✨",
        chance: 18, 
        img: "images/animal3.png", 
        desc: "وصف الحيوان الثالث يكتب هنا..." 
    },
    { 
        name: "الحيوان الرابع", 
        eggType: "بيضة نادرة ✨",
        chance: 12, 
        img: "images/animal4.png", 
        desc: "وصف الحيوان الرابع يكتب هنا..." 
    },

    // --- فئة أسطورية (10%) ---
    { 
        name: "الحيوان الخامس", 
        eggType: "بيضة أسطورية 🔥",
        chance: 7, 
        img: "images/animal5.png", 
        desc: "وصف الحيوان الخامس يكتب هنا..." 
    },
    { 
        name: "الحيوان السادس", 
        eggType: "بيضة أسطورية 👑",
        chance: 3, 
        img: "images/animal6.png", 
        desc: "وصف الحيوان السادس يكتب هنا..." 
    }
];

let isOpening = false;

// دالة اختيار الحيوان بناءً على النسبة المئوية
function getPetByPercentage() {
    const totalChance = magicalPets.reduce((sum, pet) => sum + pet.chance, 0);
    let randomNum = Math.random() * totalChance;

    for (let i = 0; i < magicalPets.length; i++) {
        if (randomNum < magicalPets[i].chance) {
            return magicalPets[i];
        }
        randomNum -= magicalPets[i].chance;
    }
    return magicalPets[0];
}

function crackEgg() {
    if (isOpening) return;

    const nameInput = document.getElementById("wizardName");
    const ticketInput = document.getElementById("ticketNum");
    const errorMsg = document.getElementById("errorMsg");

    const wizardName = nameInput.value.trim();
    const ticketNum = ticketInput.value.trim();

    if (!wizardName || !ticketNum) {
        errorMsg.innerText = "⚠️ تعويذة ناقصة! يرجى إدخال الاسم ورقم تيكت الديسكورد أولاً.";
        return;
    }

    errorMsg.innerText = "";
    isOpening = true;
    nameInput.disabled = true;
    ticketInput.disabled = true;

    const eggCard = document.getElementById("eggCard");
    eggCard.classList.add("shake-animation");
    document.querySelector(".click-hint").innerText = "جاري فقس البيضة... ✨";

    // اختيار الحيوان بالنسبة المئوية
    const selectedPet = getPetByPercentage();

    setTimeout(() => {
        document.getElementById("eggStage").style.display = "none";
        document.getElementById("inputsSection").style.display = "none";

        const resultStage = document.getElementById("resultStage");
        resultStage.style.display = "block";

        // إظهار صورة الحيوان وبياناته
        document.getElementById("petImg").src = selectedPet.img;
        document.getElementById("petName").innerText = `${selectedPet.name} (${selectedPet.eggType})`;
        document.getElementById("petDesc").innerText = selectedPet.desc;

        // إرسال الـ 3 أعمدة للشيت:
        // Name | Ticket num | Animal name
        sendToGoogleSheet(wizardName, ticketNum, selectedPet.name);
    }, 1500);
}

function sendToGoogleSheet(name, ticketNum, animalName) {
    const statusText = document.getElementById("sheetStatus");

    // وضع البيانات داخل الرابط مباشرة لضمان وصولها 100%
    const url = `${SCRIPT_URL}?name=${encodeURIComponent(name)}&ticketNum=${encodeURIComponent(ticketNum)}&animalName=${encodeURIComponent(animalName)}`;

    fetch(url, {
        method: "GET",
        mode: "no-cors"
    })
    .then(() => {
        statusText.innerText = "✅ تم تسجيل حيوانك السحري وتذكرتك في السجلات بنجاح!";
        statusText.style.color = "#a7f3d0";
    })
    .catch(error => {
        console.error("Error!", error);
        statusText.innerText = "⚠️ ظهر الحيوان ولكن تعذر حفظه في السجل، تأكدي من الرابط.";
        statusText.style.color = "#fca5a5";
    });
}
