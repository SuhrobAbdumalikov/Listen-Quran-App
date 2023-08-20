import { API_URL } from "./dataApi.js";
import { createOption } from "./ui.js";
import { customFetch } from "./utils.js";

const quranAppBox = document.querySelector(".quranAppBox");
const chooseDomla = document.querySelector("#domla");
const chooseSurah = document.querySelector("#surah");
const chooseAyah = document.querySelector("#ayah");
const nextBtn = document.querySelector("#nextBtn");
const backAyah = document.querySelector("#backAyah");
const nightBtn = document.querySelector(".nightBtn");
const audio = document.querySelector("audio");
const oyatText = document.querySelector("#text");
const allTabs = document.querySelectorAll(".tab_btn");
const allContents = document.querySelectorAll(".content_item");
const buttomLine = document.querySelector(".line");
const currentTime = document.querySelector(".currentTime");
const retry0 = document.querySelector(".retry0");
const btnTasbeh = document.querySelector(".btnTasbeh");
const JamiNumbers = document.querySelector(".Jami");
const tasbehNum = document.querySelector(".tasbehNum");
const shiorText = document.querySelector("fieldset");
const toggleBtn = document.querySelector(".togglebtn");
const Info = document.querySelector(".Info");
const aboutAppPopSection = document.querySelector(".aboutAppPopSection");

//===========>========> Listen Qur'on Content <<=================//
(async () => {
  const { data } = await customFetch(`${API_URL}/edition/format/audio`);
  console.log(data);
  data?.forEach((name) => {
    const { identifier, englishName } = name;
    chooseDomla.appendChild(
      createOption({ value: identifier, textContent: englishName })
    );
  });
})();

chooseDomla.addEventListener("change", (e) => {
  chooseSurah.innerHTML = `<option selected disabled>Surani Tanlang</option>`;

  (async () => {
    const {
      data: { surahs },
    } = await customFetch(`${API_URL}/quran/${e.target.value}`);
    let SelectedSurahIdx = 0;
    surahs?.forEach((sura) => {
      const { number, englishName } = sura;
      chooseSurah.appendChild(
        createOption({ value: number, textContent: englishName })
      );
    });
    nextBtn.addEventListener("click", () => {
      chooseDomla.style.display = "none";
      chooseSurah.style.display = "block";
    });

    chooseSurah.addEventListener("change", (e) => {
      const { value } = e.target;
      SelectedSurahIdx = value;
      chooseAyah.innerHTML = ` <option selected disabled>Oyatni Tanlang</option>`;
      surahs[value]?.ayahs.forEach((_, idx) => {
        chooseAyah.appendChild(
          createOption({ value: idx, textContent: `${idx + 1}` })
        );
      });

      nextBtn.addEventListener("click", () => {
        chooseSurah.style.display = "none";
        chooseAyah.style.display = "block";
      });
    });

    chooseAyah.addEventListener("change", (e) => {
      const { value } = e.target;
      const SelectedAyah = surahs[SelectedSurahIdx]?.ayahs?.[value];
      audio.src = SelectedAyah.audio;
      oyatText.textContent = SelectedAyah.text;

      // backAyah.style.display = "block";
      oyatText.style.display = "block";
      chooseAyah.style.display = "none";
      audio.style.display = "block";
      nextBtn.style.display = "none";
      shiorText.style.display = "none";
    });
  })();
});
//=====================================================================//

//================>> Tab Menu Content <<===================//
allTabs.forEach((tab, idx) => {
  tab.addEventListener("click", (e) => {
    allTabs.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");

    buttomLine.style.width = e.target.offsetWidth + "px";
    buttomLine.style.left = e.target.offsetLeft + "px";

    allContents.forEach((content) => content.classList.remove("active"));
    allContents[idx].classList.add("active");
  });
});
//==========================================================//

//===============>> Main menu <<========================//
setInterval(() => {
  const nowTime = new Date();
  currentTime.textContent = `Current Time: ${nowTime.toLocaleTimeString()}`;
});
const clickAudio = new Audio();
clickAudio.src = "../audio/click2.mp3";
let count = 0;
let allCount = 0;

btnTasbeh.addEventListener("click", () => {
  count++;
  allCount++;
  clickAudio.play();
  retry0.addEventListener("click", () => {
    localStorage.clear();
    // localStorage.removeItem("countBtnNum")
    // localStorage.removeItem("countAllNum")
    //   JSON.parse(localStorage.removeItem("countAllNum"));
    //   JSON.parse();
    count = 0;
    allCount = 0;
    JamiNumbers.textContent = `Jami: ${0}`;
    btnTasbeh.textContent = 0;
    tasbehNum.textContent = `${0}/33`;
  });

  JamiNumbers.textContent = `Jami: ${allCount}`;
  btnTasbeh.textContent = count;
  tasbehNum.textContent = `${count}/33`;

  if (count === 33) {
    allCount++;
    count = 0;
    btnTasbeh.textContent = 0;
    tasbehNum.textContent = `${count}/33`;
    JamiNumbers.textContent = `Jami: ${allCount}`;
  }
  localStorage.setItem("countBtnNum", JSON.stringify(count));
  localStorage.setItem("countAllNum", JSON.stringify(allCount));
});

let getAllNumCount = JSON.parse(localStorage.getItem("countAllNum"));
let getBtnTasCount = JSON.parse(localStorage.getItem("countBtnNum"));
JamiNumbers.textContent = `Jami: ${getAllNumCount}`;
btnTasbeh.textContent = getBtnTasCount;
tasbehNum.textContent = `${getBtnTasCount}/33`;
//====================================================================//

//===============>> Settings Content <<==================//
toggleBtn.addEventListener("click", () => {
  quranAppBox.classList.toggle("dark");
  toggleBtn.classList.toggle("active");
  nightBtn.classList.toggle("nightMode");
  Info.classList.toggle("nightMode");
  aboutAppPopSection.classList.toggle("dark");
  let theme;

  if (
    quranAppBox.classList.contains("dark") &&
    nightBtn.classList.contains("nightMode")
  ) {
    console.log("dark");
    theme = "DARK";
  } else {
    console.log("light");
    theme = "LIGHT";
  }

  localStorage.setItem("pageMode", JSON.stringify(theme));
});

let getTheme = JSON.parse(localStorage.getItem("pageMode"));
console.log(getTheme);

if (getTheme === "DARK") {
  quranAppBox.classList.add("dark");
  nightBtn.classList.add("nightMode");
  toggleBtn.classList.add("active");
  Info.classList.add("nightMode");
  aboutAppPopSection.classList.add("dark");
}

// =====>> Info <<===//
Info.addEventListener("click", () => {
  const aboutAppP = document.querySelectorAll(".aboutAppP");
  const chevronBack = document.querySelector("#chevronBack");
  aboutAppPopSection.style.width = "100%";
  setTimeout(() => {
    aboutAppP.forEach((e) => {
      e.style.opacity = 1;
    });
  }, 1000);
  chevronBack.addEventListener("click", () => {
    aboutAppPopSection.style.width = "0%";
    setTimeout(() => {
      aboutAppP.forEach((e) => {
        e.style.opacity = 0;
      });
    }, 1000);
  });
});
//===========================================================//
