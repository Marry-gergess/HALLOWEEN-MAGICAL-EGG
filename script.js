const magicalPets = [
    { 
        name: "كلب أسود", 
        chance: 16, 
        img: "images/animal1.png"
    },
    { 
        name: "بومة سوداء", 
        chance: 16, 
        img: "images/animal2.png"
    },
    { 
        name: "غراب أسود", 
        chance: 16, 
        img: "images/animal3.png"
    },
    { 
        name: "غراب", 
        chance: 16, 
        img: "images/animal4.png"
    },
    { 
        name: "جلامبامبل", 
        chance: 10, // أقل بحاجة بسيطة
        img: "images/animal5.png"
    },
    { 
        name: "بيلي ويج", 
        chance: 10, // أقل بحاجة بسيطة
        img: "images/animal6.png"
    },
    { 
        name: "بومة سوداء", 
        chance: 16, 
        img: "images/animal7.png"
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

        // إظهار صورة الحيوان واسمه فقط بدون كلمة undefined
        document.getElementById("petImg").src = selectedPet.img;
        document.getElementById("petName").innerText = selectedPet.name;
        document.getElementById("petDesc").innerText = selectedPet.desc || "";

        // إظهار بيانات الساحر ورقم التيكت تحت النتيجة عشان لو هياخدوا سكرين شوت للتيكت
        const statusText = document.getElementById("sheetStatus");
        if (statusText) {
            statusText.innerText = `✨ الساحر/ة: ${wizardName} | تيكت رقم: ${ticketNum} ✨`;
            statusText.style.color = "#f5d76e";
        }
    }, 1500);
}
