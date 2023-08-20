import { API_URL } from "./dataApi.js";
import { createOption } from "./ui.js";
import { customFetch } from "./utils.js";

const chooseDomla = document.querySelector("#domla");
const chooseSurah = document.querySelector("#surah");
const chooseAyah = document.querySelector("#ayah");
const nextBtn = document.querySelector("#nextBtn");
const backAyah = document.querySelector("#backAyah");
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
let count = 0;
let allCount = 0;

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

//===============>> Main menu <<========================//
setInterval(() => {
  const nowTime = new Date();
  currentTime.textContent = `Current Time: ${nowTime.toLocaleTimeString()}`;
});
btnTasbeh.addEventListener("click", () => {
  count++;
  allCount++

  retry0.addEventListener("click", () => {
    allCount = 0;
    JamiNumbers.textContent = `Jami: ${0}`;
    btnTasbeh.textContent = 0;
    tasbehNum.textContent = `${0}/33`;
    count = 0;
  });

  JamiNumbers.textContent = `Jami: ${allCount}`;
  btnTasbeh.textContent = count;
  tasbehNum.textContent = `${count}/33`;

  if (count === 33) {
    count = 0;
    btnTasbeh.textContent = 0;
    tasbehNum.textContent = `${count}/33`
    JamiNumbers.textContent =`Jami: ${allCount}` 
  }
})
//====================================================================//
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
  }
)();

// function foo(){
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
    });
  })();
});
//===============>> Settings Content <<==================//
