// 1. Rabit el-Google Sheet Web App el-gaded el-li bahtih
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbySO0Hrz5WCAE1Tz8BFLYg9wt5rDg9CBXtRaghMfS2p-SxHlA8XPql3fI0ThfpxbYYK/exec";

// 2. Qa'emat el-hayawanat el-sehreya m'a nesbat el-zohour (chance) w no' el-beida (eggType)
const magicalPets = [
    // --- Fe'ah adia (60%) ---
    { 
        name: "Puffskein", 
        eggType: "Beida Adia",
        chance: 35, 
        img: "images/puffskein.png", 
        desc: "Ka'en korawy na'em we lateef yeheboh gami' el-sahra." 
    },
    { 
        name: "El-Boma el-thalgeya", 
        eggType: "Beida Adia",
        chance: 25, 
        img: "images/owl.png", 
        desc: "Rafeeq wafy we zakey li-tawseel el-rasael el-sehreya." 
    },

    // --- Fe'ah nadera (30%) ---
    { 
        name: "Niffler", 
        eggType: "Beida Nadera ✨",
        chance: 18, 
        img: "images/niffler.png", 
        desc: "Ka'en zareef ye'shaq kol el-ashya' el-lame'ah we el-zahab!" 
    },
    { 
        name: "Hippogriff", 
        eggType: "Beida Nadera ✨",
        chance: 12, 
        img: "images/hippogriff.png", 
        desc: "Makhlooq moheeb nesfoh nasr we nesfoh hosan, yahtarem man yahtaremoh." 
    },

    // --- Fe'ah ostoreya (10%) ---
    { 
        name: "Teneen el-Horneel el-Maghry", 
        eggType: "Beida Ostoreya 🔥",
        chance: 7, 
        img: "images/dragon.png", 
        desc: "Min aqwa we akhtar el-makhlooqat el-sehreya 'ala el-itlaq!" 
    },
    { 
        name: "Fawkes (El-'Anqaa')", 
        eggType: "Beida Ostoreya 👑",
        chance: 3, 
        img: "images/phoenix.png", 
        desc: "Ka'en ostorey khariq yatgaddad min el-ramad!" 
    }
];

let isOpening = false;

// Dala ikhtiyar el-hayawan bena'an 'ala el-nesba el-meowia
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
        errorMsg.innerText = "⚠️ Taweetha naqesa! Yarja' edkhal el-esm we raqm el-tazkara awwalan.";
        return;
    }

    errorMsg.innerText = "";
    isOpening = true;
    nameInput.disabled = true;
    ticketInput.disabled = true;

    const eggCard = document.getElementById("eggCard");
    eggCard.classList.add("shake-animation");
    document.querySelector(".click-hint").innerText = "Gary faqs el-beida... ✨";

    // Ikhtiyar el-hayawan bi el-nesba el-meowia
    const selectedPet = getPetByPercentage();

    setTimeout(() => {
        document.getElementById("eggStage").style.display = "none";
        document.getElementById("inputsSection").style.display = "none";

        const resultStage = document.getElementById("resultStage");
        resultStage.style.display = "block";

        document.getElementById("petImg").src = selectedPet.img;
        document.getElementById("petName").innerText = `${selectedPet.name} (${selectedPet.eggType})`;
        document.getElementById("petDesc").innerText = selectedPet.desc;

        // Ersal el-arbaa' a'moud le el-sheet:
        // Name | Ticket num | Egg Type | Animal name
        sendToGoogleSheet(wizardName, ticketNum, selectedPet.eggType, selectedPet.name);
    }, 1500);
}

function sendToGoogleSheet(name, ticketNum, eggType, animalName) {
    const statusText = document.getElementById("sheetStatus");

    const formData = new FormData();
    formData.append("name", name);             // Yezehab le 'amoud Name
    formData.append("ticketNum", ticketNum);   // Yezehab le 'amoud Ticket num
    formData.append("eggType", eggType);       // Yezehab le 'amoud Egg Type
    formData.append("animalName", animalName); // Yezehab le 'amoud Animal name

    fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
    })
    .then(response => {
        statusText.innerText = "✅ Tem tasgeel haywanak el-sehrey we tazkaratak fi el-segillat bengah!";
        statusText.style.color = "#a7f3d0";
    })
    .catch(error => {
        console.error("Error!", error.message);
        statusText.innerText = "⚠️ Zahara el-hayawan walakenn ta'azzara hefzoh fi el-segl, ta'akkady min el-rabit.";
        statusText.style.color = "#fca5a5";
    });
}
