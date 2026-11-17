import type { Question } from "../types";

export interface Booklet {
  /** ÖSYM'nin resmî temel soru kitapçığı PDF adresi */
  url: string;
  /** Bağlantının ekran okuyucu/ipucu metni */
  label: string;
}

/**
 * Sınav dönemine ait resmî ÖSYM temel soru kitapçığı PDF'leri.
 * Anahtar biçimi: "<yıl>-<dönem>" (örn. "2026-1").
 *
 * Yeni bir dönem eklerken yalnızca buraya bir kayıt eklemek yeterlidir;
 * soru kartlarındaki "Kitapçık PDF" bağlantısı otomatik görünür.
 * PDF'ler ÖSYM'nin kendi sunucusunda barındırılır, projede kopyalanmaz.
 */
export const BOOKLETS: Record<string, Booklet> = {
  "2026-1": {
    url: "https://dokuman.osym.gov.tr/pdfdokuman/2026/ALES-1/tsk_als10052026.pdf",
    label: "2026 ALES/1 Temel Soru Kitapçığı (ÖSYM)",
  },
  "2025-2": {
    url: "https://dokuman.osym.gov.tr/pdfdokuman/2025/ALES-2/TSK/internetkitapcigi_als2d06072025.pdf",
    label: "2025 ALES/2 Temel Soru Kitapçığı (ÖSYM)",
  },
  "2025-1": {
    url: "https://dokuman.osym.gov.tr/pdfdokuman/2025/ALES-1/tsk_13042025.pdf",
    label: "2025 ALES/1 Temel Soru Kitapçığı (ÖSYM)",
  },
  "2021-1": {
    url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-1/CS/ALES1_sorular.pdf",
    label: "2021 ALES/1 Soru Kitapçığı (ÖSYM)",
  },
  "2021-2": {
    url: "https://dokuman.osym.gov.tr/pdfdokuman/2021/ALES-2/CS/ALES2_sorular.pdf",
    label: "2021 ALES/2 Soru Kitapçığı (ÖSYM)",
  },
};

export function bookletOf(question: Question): Booklet | undefined {
  return BOOKLETS[`${question.year}-${question.session}`];
}

/**
 * Sorunun kitapçık bağlantısı.
 *
 * Bankada yalnızca resmî sorular (official: true) bulunur. `pdfPage` varsa
 * bağlantı doğrudan o sayfayı açar.
 */
export function bookletUrlFor(question: Question): string | undefined {
  if (!question.official) return undefined;
  const booklet = bookletOf(question);
  if (!booklet) return undefined;
  return question.pdfPage ? `${booklet.url}#page=${question.pdfPage}` : booklet.url;
}
