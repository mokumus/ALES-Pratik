export type Section = "sayisal" | "sozel";

export type Difficulty = "kolay" | "orta" | "zor";

export interface Question {
  /** Benzersiz kimlik: "2026-1-say-01" */
  id: string;
  /** Sınavın yapıldığı yıl */
  year: number;
  /** Aynı yıl içindeki dönem numarası (ALES/1, ALES/2) */
  session: 1 | 2;
  /** Sınavın yapıldığı dönem */
  period: "İlkbahar" | "Sonbahar";
  /** Sorunun yer aldığı bölüm */
  section: Section;
  /** Konu adı (filtrelerde kullanılır) */
  topic: string;
  /** Sorunun orijinal sınavdaki numarası */
  no: number;
  difficulty: Difficulty;
  /**
   * true: soru resmî sınavdan alınmıştır.
   * false: ALES formatına göre hazırlanmış özgün alıştırma sorusudur.
   */
  official: boolean;
  stem: string;
  options: string[];
  /** Doğru cevabın options dizisindeki indeksi (0 = A) */
  answer: number;
  solution: string;
}

export interface ExamInfo {
  key: string;
  label: string;
  shortLabel: string;
  year: number;
  session: 1 | 2;
  period: string;
  total: number;
  sayisal: number;
  sozel: number;
}
