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
        name: "قطة سوداء", 
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
    isOpening = true;

    const eggCard = document.getElementById("eggCard");
    eggCard.classList.add("shake-animation");
    document.querySelector(".click-hint").innerText = "جاري فقس البيضة... ✨";

    // اختيار الحيوان بالنسبة المئوية
    const selectedPet = getPetByPercentage();

    setTimeout(() => {
        document.getElementById("eggStage").style.display = "none";

        const resultStage = document.getElementById("resultStage");
        resultStage.style.display = "block";

        // إظهار صورة الحيوان واسمه
        document.getElementById("petImg").src = selectedPet.img;
        document.getElementById("petName").innerText = selectedPet.name;
        document.getElementById("petDesc").innerText = selectedPet.desc || "";
    }, 1500);
}
