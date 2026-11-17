/**
 * ÖSYM'nin doküman sunucusundaki ALES soru kitapçıkları.
 *
 * Bağlantılar doğrudan ÖSYM'ye gider; uygulama bu dosyaları barındırmaz.
 * "Çalış" düğmesi, soru bankasına eklenmiş soruları sınav kimliğine göre
 * filtreler; soruların kendisi `questions.json` içinde tutulur.
 */

export interface OfficialLink {
  label: string;
  url: string;
}

export interface OfficialExam {
  /** "2021-1" gibi kısa kimlik */
  id: string;
  year: number;
  session: number;
  label: string;
  /** ÖSYM yayım tarihi (varsa) */
  date?: string;
  /** tam: 100 soruluk tam kitapçık, yuzde10: %10'luk temel soru kitapçığı */
  kind: "tam" | "yuzde10";
  links: OfficialLink[];
}

export const officialExams: OfficialExam[] = [
  {
    id: "2026-2",
    year: 2026,
    session: 2,
    label: "2026 ALES/2",
    date: "2 Ağustos 2026",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/web/2026/8/2025-ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10-b22o51-02132535.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2026-ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2026-1",
    year: 2026,
    session: 1,
    label: "2026 ALES/1",
    date: "10 Mayıs 2026",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2026/ALES-1/tsk_als10052026.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2026ales1-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2025-3",
    year: 2025,
    session: 3,
    label: "2025 ALES/3",
    date: "24 Kasım 2025",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2025/ALES-3/TSK/tsk_al3d23112025.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2025ales3-temel-soru-kitapcigi-ve-cevap-anahtarinin-yayimlanmasi-10" },
    ],
  },
  {
    id: "2025-2",
    year: 2025,
    session: 2,
    label: "2025 ALES/2",
    date: "9 Temmuz 2025",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2025/ALES-2/TSK/internetkitapcigi_als2d06072025.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2025ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2025-1",
    year: 2025,
    session: 1,
    label: "2025 ALES/1",
    date: "14 Nisan 2025",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2025/ALES-1/tsk_13042025.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2025ales1-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2024-3",
    year: 2024,
    session: 3,
    label: "2024 ALES/3",
    date: "18 Kasım 2024",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2024/ALES-3/tsk_m17112024.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2024ales3-temel-soru-kitapcigi-ve-cevap-anahtarinin-yayimlanmasi-10" },
    ],
  },
  {
    id: "2024-2",
    year: 2024,
    session: 2,
    label: "2024 ALES/2",
    date: "29 Temmuz 2024",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2024/ALES-2/tsk_28072024.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2024ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2024-1",
    year: 2024,
    session: 1,
    label: "2024 ALES/1",
    date: "21 Nisan 2024",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2024/ALES-1/tsk_21042024.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2024ales1-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2023-3",
    year: 2023,
    session: 3,
    label: "2023 ALES/3",
    date: "20 Kasım 2023",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2023/ALES-3/tsk19112023.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2023ales3-temel-soru-kitapcigi-ve-cevap-anahtarinin-yayimlanmasi-10" },
    ],
  },
  {
    id: "2023-2",
    year: 2023,
    session: 2,
    label: "2023 ALES/2",
    date: "20 Ağustos 2023",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2023/ALES-2/kitapcik20082023.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2023ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2023-1",
    year: 2023,
    session: 1,
    label: "2023 ALES/1",
    date: "17 Nisan 2023",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2023/ALES-1/tsk_16042023.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2023ales1-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2022-3",
    year: 2022,
    session: 3,
    label: "2022 ALES/3",
    date: "21 Kasım 2022",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2022/ALES-3/ales3_temelsorukitapcigi_20112022.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2022ales3-temel-soru-kitapcigi-ve-cevap-anahtarinin-yayimlanmasi-10" },
    ],
  },
  {
    id: "2022-2",
    year: 2022,
    session: 2,
    label: "2022 ALES/2",
    date: "21 Ağustos 2022",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2022/ALES-2/ales_2022_internet_kitapcigi.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2022ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2022-1",
    year: 2022,
    session: 1,
    label: "2022 ALES/1",
    date: "20 Nisan 2022",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2022/ALES-1/internetkitapcik_17042022.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2022ales1-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2021-3",
    year: 2021,
    session: 3,
    label: "2021 ALES/3",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-3/CS/ALES3_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-3/CS/ALES3_sorular.pdf#page=37" },
    ],
  },
  {
    id: "2021-3-yuzde10",
    year: 2021,
    session: 3,
    label: "2021 ALES/3",
    date: "20 Kasım 2021",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-3/ales3_tsk_yuzde10_21112021.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2021ales3-temel-soru-kitapcigi-ve-cevap-anahtarinin-yayinlanmasi-10" },
    ],
  },
  {
    id: "2021-2",
    year: 2021,
    session: 2,
    label: "2021 ALES/2",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-2/CS/ALES2_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-2/CS/ALES2_sorular.pdf#page=37" },
    ],
  },
  {
    id: "2021-2-yuzde10",
    year: 2021,
    session: 2,
    label: "2021 ALES/2",
    date: "22 Eylül 2021",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-2/ales2_internet_kitapcigi_19092021.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2021ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2021-1",
    year: 2021,
    session: 1,
    label: "2021 ALES/1",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-1/CS/ALES1_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-1/CS/ALES1_sorular.pdf#page=36" },
    ],
  },
  {
    id: "2021-1-yuzde10",
    year: 2021,
    session: 1,
    label: "2021 ALES/1",
    date: "6 Mayıs 2021",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-1/internetkitapcik03052021.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2021ales1-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2020-2",
    year: 2020,
    session: 2,
    label: "2020 ALES/2",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2020/ALES-2/CS/ALES2_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2020/ALES-2/CS/ALES2_sorular.pdf#page=37" },
    ],
  },
  {
    id: "2020-2-yuzde10",
    year: 2020,
    session: 2,
    label: "2020 ALES/2",
    date: "25 Şubat 2021",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2020/ALES-2/internetkitapcik_22022021.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2020ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2020-1",
    year: 2020,
    session: 1,
    label: "2020 ALES/1",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2020/ALES-1/CS/ALES1_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2020/ALES-1/CS/ALES1_sorular.pdf#page=36" },
    ],
  },
  {
    id: "2020-1-yuzde10",
    year: 2020,
    session: 1,
    label: "2020 ALES/1",
    date: "20 Ağustos 2020",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2020/ALES-1/internetkitapcik17082020.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2020ales1-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2019-3",
    year: 2019,
    session: 3,
    label: "2019 ALES/3",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-3/CS/ALES3_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-3/CS/ALES3_sorular.pdf#page=36" },
    ],
  },
  {
    id: "2019-3-yuzde10",
    year: 2019,
    session: 3,
    label: "2019 ALES/3",
    date: "21 Kasım 2019",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-3/intkitapcik18112019.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2019ales3-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2019-2",
    year: 2019,
    session: 2,
    label: "2019 ALES/2",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-2/CS/ALES2_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-2/CS/ALES2_sorular.pdf#page=36" },
    ],
  },
  {
    id: "2019-2-yuzde10",
    year: 2019,
    session: 2,
    label: "2019 ALES/2",
    date: "26 Eylül 2019",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-2/%C4%B0nternetkitapcigi_24092019.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2019ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2019-1",
    year: 2019,
    session: 1,
    label: "2019 ALES/1",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-1/CS/ALES1_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-1/CS/ALES1_sorular.pdf#page=36" },
    ],
  },
  {
    id: "2019-1-yuzde10",
    year: 2019,
    session: 1,
    label: "2019 ALES/1",
    date: "10 Mayıs 2019",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2019/ALES-1/Internetkitapcik07052019.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2019ales1-temel-soru-kitapcigi-ve-cevap-anahtari-yayimlandi" },
    ],
  },
  {
    id: "2018-3",
    year: 2018,
    session: 3,
    label: "2018 ALES/3",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALES-3/ALES3-12112019.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALES-3/ALES3-12112019.pdf#page=37" },
    ],
  },
  {
    id: "2018-3-yuzde10",
    year: 2018,
    session: 3,
    label: "2018 ALES/3",
    date: "22 Kasım 2018",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALESSONBAHAR/internetkitapcik_20112018.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2018ales3sonbahar-donemi-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2018-2",
    year: 2018,
    session: 2,
    label: "2018 ALES/2",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALES-2/ALES2-12112019.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALES-2/ALES2-12112019.pdf#page=36" },
    ],
  },
  {
    id: "2018-2-yuzde10",
    year: 2018,
    session: 2,
    label: "2018 ALES/2",
    date: "4 Ekim 2018",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALES-2/%C4%B0nternetkitapcigi_02102018.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2018ales2-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2018-1",
    year: 2018,
    session: 1,
    label: "2018 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALESILKBAHAR/CS/ALESILKBAHAR24072018.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALESILKBAHAR/CS/ALESILKBAHAR24072018.pdf#page=35" },
    ],
  },
  {
    id: "2018-1-yuzde10",
    year: 2018,
    session: 1,
    label: "2018 ALES (İlkbahar)",
    date: "11 Mayıs 2018",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2018/ALESILKBAHAR/InternetKitapcigi08052018.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2018ales-ilkbahar-donemi-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2017-2",
    year: 2017,
    session: 2,
    label: "2017 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2017/ALESSONBAHAR/2017_ALES_Sonbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2017/ALESSONBAHAR/2017_ALES_Sonbahar_Soru_Kitapciklari.pdf#page=34" },
    ],
  },
  {
    id: "2017-2-yuzde10",
    year: 2017,
    session: 2,
    label: "2017 ALES (Sonbahar)",
    date: "24 Kasım 2017",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2017/ALESSONBAHAR/Internetkitapcigi21112017.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2017ales-sonbahar-donemi-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2017-1",
    year: 2017,
    session: 1,
    label: "2017 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2017/ALESILKBAHAR/2017_ALES_Ilkbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2017/ALESILKBAHAR/2017_ALES_Ilkbahar_Soru_Kitapciklari.pdf#page=51" },
    ],
  },
  {
    id: "2017-1-yuzde10",
    year: 2017,
    session: 1,
    label: "2017 ALES (İlkbahar)",
    date: "12 Mayıs 2017",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2017/ALESILKBAHAR/InternetKitapcigi09052017.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/temel-soru-kitapcigi-10" },
    ],
  },
  {
    id: "2016-2",
    year: 2016,
    session: 2,
    label: "2016 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2016/ALESSONBAHAR/2016_ALES_Sonbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2016/ALESSONBAHAR/2016_ALES_Sonbahar_Soru_Kitapciklari.pdf#page=53" },
    ],
  },
  {
    id: "2016-2-yuzde10",
    year: 2016,
    session: 2,
    label: "2016 ALES (Sonbahar)",
    date: "22 Aralık 2016",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2016/ALESSONBAHAR/ALESinternetkitapcik19122016.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2016ales-sonbahar-donemi-temel-soru-kitapcigi-ve-cevap-anahtari-10" },
    ],
  },
  {
    id: "2016-1",
    year: 2016,
    session: 1,
    label: "2016 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2016/ALESILKBAHAR/2016_ALES_Ilkbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2016/ALESILKBAHAR/2016_ALES_Ilkbahar_Soru_Kitapciklari.pdf#page=49" },
    ],
  },
  {
    id: "2016-1-yuzde10",
    year: 2016,
    session: 1,
    label: "2016 ALES (İlkbahar)",
    date: "6 Haziran 2016",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2016/ALESILKBAHAR/InternetSoruKitap.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2016ales-ilkbahar-donemitemel-soru-kitapciginin-goruntulenmesi" },
    ],
  },
  {
    id: "2015-2",
    year: 2015,
    session: 2,
    label: "2015 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2015/ALESSONBAHAR/2015_ALES_Sonbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2015/ALESSONBAHAR/2015_ALES_Sonbahar_Soru_Kitapciklari.pdf#page=52" },
    ],
  },
  {
    id: "2015-2-yuzde10",
    year: 2015,
    session: 2,
    label: "2015 ALES (Sonbahar)",
    date: "27 Kasım 2015",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2015/ALESSONBAHAR/2015_ALESSonbaharInternetkitapcigi24112015.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/2015ales-sonbahar-donemi-temel-soru-kitapcigi-10" },
    ],
  },
  {
    id: "2015-1",
    year: 2015,
    session: 1,
    label: "2015 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2015/ALESILKBAHAR/2015_ALES_Ilkbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2015/ALESILKBAHAR/2015_ALES_Ilkbahar_Soru_Kitapciklari.pdf#page=49" },
    ],
  },
  {
    id: "2014-2",
    year: 2014,
    session: 2,
    label: "2014 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2014/alessonbahar/2014_ALES_Sonbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2014/alessonbahar/2014_ALES_Sonbahar_Soru_Kitapciklari.pdf#page=52" },
    ],
  },
  {
    id: "2014-2-yuzde10",
    year: 2014,
    session: 2,
    label: "2014 ALES (Sonbahar)",
    date: "6 Aralık 2014",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2014/Alessonbahar/2014-ALES-Sonbaharkitap03122014.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/temel-soru-kitapcigi-10-20260508133318837" },
    ],
  },
  {
    id: "2014-1",
    year: 2014,
    session: 1,
    label: "2014 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2014/ALESILKBAHAR/2014_ALES_Ilkbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2014/ALESILKBAHAR/2014_ALES_Ilkbahar_Soru_Kitapciklari.pdf#page=55" },
    ],
  },
  {
    id: "2014-1-yuzde10",
    year: 2014,
    session: 1,
    label: "2014 ALES (İlkbahar)",
    date: "20 Mayıs 2014",
    kind: "yuzde10",
    links: [
      { label: "Kitapçık PDF", url: "https://dokuman.osym.gov.tr/pdfdokuman/2014/ALESILKBAHAR/2014ALESilkbahar11052014.pdf" },
      { label: "ÖSYM duyurusu", url: "https://www.osym.gov.tr/temel-soru-kitapcigi" },
    ],
  },
  {
    id: "2013-2",
    year: 2013,
    session: 2,
    label: "2013 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2013/ALESSONBAHAR/2013_ALES_Sonbahar_Soru_Kitapciklari.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/2013/ALESSONBAHAR/2013_ALES_Sonbahar_Soru_Kitapciklari.pdf#page=64" },
    ],
  },
  {
    id: "2013-1",
    year: 2013,
    session: 1,
    label: "2013 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2213.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2213.pdf#page=61" },
    ],
  },
  {
    id: "2012-2",
    year: 2012,
    session: 2,
    label: "2012 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2230.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2230.pdf#page=60" },
    ],
  },
  {
    id: "2012-1",
    year: 2012,
    session: 1,
    label: "2012 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2220.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2220.pdf#page=63" },
    ],
  },
  {
    id: "2011-2",
    year: 2011,
    session: 2,
    label: "2011 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2240.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2240.pdf#page=63" },
    ],
  },
  {
    id: "2011-1",
    year: 2011,
    session: 1,
    label: "2011 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2236.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2236.pdf#page=67" },
    ],
  },
  {
    id: "2010-2",
    year: 2010,
    session: 2,
    label: "2010 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2010/ALES/19_12_2010_ales_sorular.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2010/ALES/19_12_2010_ales_sorular.pdf#page=55" },
    ],
  },
  {
    id: "2010-1",
    year: 2010,
    session: 1,
    label: "2010 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2246.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2246.pdf#page=47" },
    ],
  },
  {
    id: "2009-2",
    year: 2009,
    session: 2,
    label: "2009 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2262.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2262.pdf#page=47" },
    ],
  },
  {
    id: "2009-1",
    year: 2009,
    session: 1,
    label: "2009 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Soru kitapçığı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2257.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/web/eskidosyalar/2257.pdf#page=47" },
    ],
  },
  {
    id: "2008-2",
    year: 2008,
    session: 2,
    label: "2008 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Sözel", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2008ALESSONBAHAR/ales2008sonbaharsozeltesti.pdf" },
      { label: "Sayısal", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2008ALESSONBAHAR/ales2008sonbaharsayisaltesti.pdf" },
      { label: "Cevap anahtarı", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2008ALESSONBAHAR/ales2008sonbaharcevapanah.pdf" },
    ],
  },
  {
    id: "2008-1",
    year: 2008,
    session: 1,
    label: "2008 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Sözel", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2008/ALES2008ILKBAHAR/SOZEL/ales2008ilkbaharsozel.pdf" },
      { label: "Sayısal 1", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2008/ALES2008ILKBAHAR/SAYISAL/ales2008ilkbaharsayisal1.pdf" },
      { label: "Sayısal 2", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2008/ALES2008ILKBAHAR/SAYISAL/ales2008ilkbaharsayisal2.pdf" },
      { label: "Sözel cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2008/ALES2008ILKBAHAR/SOZEL/ales2008ilkbaharsozelcevapanah.pdf" },
      { label: "Sayısal cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2008/ALES2008ILKBAHAR/SAYISAL/ales2008ilkbaharsayisalcevapanah.pdf" },
    ],
  },
  {
    id: "2007-2",
    year: 2007,
    session: 2,
    label: "2007 ALES (Sonbahar)",
    kind: "tam",
    links: [
      { label: "Sözel", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007KASIM/SOZEL/ales2007kasimsozel.pdf" },
      { label: "Sayısal 1", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007KASIM/SAYISAL/ales2007kasimsayisal1.pdf" },
      { label: "Sayısal 2", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007KASIM/SAYISAL/ales2007kasimsayisal2.pdf" },
      { label: "Sözel cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007KASIM/SOZEL/ales2007kasimsozelcevapanah.pdf" },
      { label: "Sayısal cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007KASIM/SAYISAL/ales2007kasimsayisalcevapanah.pdf" },
    ],
  },
  {
    id: "2007-1",
    year: 2007,
    session: 1,
    label: "2007 ALES (İlkbahar)",
    kind: "tam",
    links: [
      { label: "Sözel", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007NISAN/SOZEL/ales2007nisansozel.pdf" },
      { label: "Sayısal 1", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007NISAN/SAYISAL/ales2007nisansayisal1.pdf" },
      { label: "Sayısal 2", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007NISAN/SAYISAL/ales2007nisansayisal2.pdf" },
      { label: "Sözel cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007NISAN/SOZEL/ales2007nisansozelcevapanah.pdf" },
      { label: "Sayısal cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/ALES2007NISAN/SAYISAL/ales2007nisansayisalcevapanah.pdf" },
    ],
  },
  {
    id: "2006-2",
    year: 2006,
    session: 2,
    label: "2006 LES Aralık",
    kind: "tam",
    links: [
      { label: "Sözel", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2006LESARALIK/SOZEL/les2006araliksozel.pdf" },
      { label: "Sayısal", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2006LESARALIK/SAYISAL/les2006araliksayisal.pdf" },
      { label: "Sözel cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2006LESARALIK/SOZEL/les2006araliksozelcevapanah.pdf" },
      { label: "Sayısal cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2006LESARALIK/SAYISAL/les2006araliksayisalcevapanah.pdf" },
    ],
  },
  {
    id: "2006-1",
    year: 2006,
    session: 1,
    label: "2006 LES Mayıs",
    kind: "tam",
    links: [
      { label: "Sözel", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2006LES/SOZEL/les2006mayissozel.pdf" },
      { label: "Sayısal", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2006LES/SAYISAL/les2006mayissayisal.pdf" },
      { label: "Sözel cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2006LES/SOZEL/les2006mayissozelcevapanah.pdf" },
      { label: "Sayısal cevap", url: "https://dokuman.osym.gov.tr/pdfdokuman/arsiv/2006LES/SAYISAL/les2006mayissayisalcevapanah.pdf" },
    ],
  },
];

export function officialExamById(id: string): OfficialExam | undefined {
  return officialExams.find((exam) => exam.id === id);
}

export const officialCounts = {
  total: officialExams.length,
  tam: officialExams.filter((e) => e.kind === "tam").length,
  yuzde10: officialExams.filter((e) => e.kind === "yuzde10").length,
};
