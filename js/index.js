import { API_URL } from "./dataApi.js";
import { createOption } from "./ui.js";
import { customFetch } from "./utils.js";

const chooseDomla = document.querySelector("#domla");
const chooseSurah = document.querySelector("#surah");
const chooseAyah = document.querySelector("#ayah");
const nextBtn = document.querySelector("#nextBtn");
const audio = document.querySelector("audio");
const oyatText = document.querySelector("#text");

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

    chooseSurah.addEventListener("change", (e) => {
      const { value } = e.target;
      SelectedSurahIdx = value;
      chooseAyah.innerHTML = ` <option selected disabled>Oyatni Tanlang</option>`;
      surahs[value]?.ayahs.forEach((_, idx) => {
        chooseAyah.appendChild(
          createOption({ value: idx, textContent: `${idx + 1}` })
        );
      });
    });

    chooseAyah.addEventListener("change", (e) => {
      const { value } = e.target;
      const SelectedAyah = surahs[SelectedSurahIdx]?.ayahs?.[value];
      audio.src = SelectedAyah.audio;
      oyatText.textContent = SelectedAyah.text;
    });
  })();
});
