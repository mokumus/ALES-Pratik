# ALES Pratik

Geçmiş ALES sınavlarından derlenen sorularla çalışmak için tarayıcıda çalışan, Türkçe arayüzlü bir
soru pratiği uygulaması. Kurulum, sunucu veya veritabanı gerektirmez: tüm ilerleme kullanıcının
tarayıcısında (`localStorage`) tutulur.

**Canlı örnek:** GitHub Pages'e yayınladıktan sonra `https://<kullanıcı-adı>.github.io/ALES-Pratik/`
adresinden açılır.

---

## Özellikler

- **Sorunun kaynağı her zaman görünür.** Her soruda sınav dönemi (örn. `2026 ALES/1 · İlkbahar`),
  bölüm (Sayısal/Sözel), konu, orijinal soru numarası ve zorluk etiketi bulunur.
- **Cevabı göster** — doğru cevap, seçim yapılmadan da görüntülenebilir.
- **Çözümü göster** — adım adım çözüm, ayrı bir tuşla açılır. İki düğme birbirinden bağımsızdır.
- **Gerçek sınav hissi** — seçenek işaretlendiğinde doğru cevap hemen açıklanmaz; böylece soru
  üzerinde düşünmeye devam edersin.
- **Filtreler** — sınav dönemi, bölüm, konu ve durum (çözülen / çözülmeyen / yanlış yapılan) +
  metin araması.
- **Test modları** — tüm sorular, çözülmemişler, yanlışlarım ve 10 soruluk rastgele hızlı test.
- **İstatistikler** — toplam başarı, bölüm, sınav ve konu bazında doğruluk oranları.
- **Karanlık / aydınlık tema**, mobil uyumlu düzen, klavye kısayolları.
- **Veri güdümlü** — yeni soru eklemek için tek bir JSON dosyası düzenlenir; kod değişmez.

### Klavye kısayolları (çalışma ekranı)

| Tuş | İşlev |
| --- | --- |
| `A`–`E` | Seçenek işaretle |
| `Enter` | Cevabı göster |
| `S` | Çözümü göster |
| `←` / `→` | Önceki / sonraki soru |

---

## Hızlı başlangıç

Gereksinim: Node.js 20 veya üzeri.

```bash
npm install
npm run dev        # http://localhost:5173
```

Diğer komutlar:

```bash
npm run build      # üretim derlemesi (dist/)
npm run preview    # derlenmiş sürümü yerelde aç
npm run validate   # soru bankası JSON doğrulaması
npm run check      # tip kontrolü + JSON doğrulaması
```

---

## Soru ekleme / genişletme

Tüm sorular **`src/data/questions.json`** dosyasında tutulur. Yeni bir soru eklemek için dosyaya
aynı yapıda bir kayıt ekleyip `npm run validate` çalıştırmak yeterlidir.

```json
{
  "id": "2026-2-say-31",
  "year": 2026,
  "session": 2,
  "period": "Sonbahar",
  "section": "sayisal",
  "topic": "Sayı Problemleri",
  "no": 31,
  "difficulty": "orta",
  "official": false,
  "stem": "Soru metni. Paragraflar \\n\\n ile ayrılır.",
  "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği", "E seçeneği"],
  "answer": 2,
  "solution": "Adım adım çözüm. Paragraflar \\n\\n ile ayrılır."
}
```

| Alan | Açıklama |
| --- | --- |
| `id` | Benzersiz kimlik. Öneri: `yıl-dönem-bölüm-sıra` (`2026-2-say-31`). |
| `year` / `session` / `period` | Sınav bilgisi. `session` 1 veya 2; `period` `İlkbahar` / `Sonbahar`. |
| `section` | `sayisal` veya `sozel`. |
| `topic` | Konu adı. Filtre listesi bu alandan otomatik üretilir. |
| `no` | Sorunun orijinal sınavdaki numarası (sayısal 1–50, sözel 51–100). |
| `difficulty` | `kolay`, `orta`, `zor`. |
| `official` | `true` ise soru resmî kaynaktan alınmıştır; arayüzde “Örnek” etiketi görünmez. |
| `stem` | Soru metni. Düz metin; `\n\n` ile paragraf ayrılır. |
| `options` | Tam olarak **5** seçenek (A–E). |
| `answer` | Doğru seçeneğin indeksi: `0` = A … `4` = E. |
| `solution` | Çözüm metni. `\n\n` ile paragraflara ayrılır. |

Yeni bir sınav dönemi eklendiğinde (örn. 2026 ALES/2) ana sayfadaki “Sınav dönemleri”, filtreler ve
istatistikler kendiliğinden güncellenir.

### İçerik ve telif notu

Depodaki 48 soru, 2025–2026 ALES sınavlarının kapsamına ve zorluk düzeyine göre **özgün olarak
yazılmış alıştırma sorularıdır**; resmî ÖSYM kitapçıklarından birebir alınmamıştır. Bu yüzden
`official: false` olarak işaretlenmiş ve arayüzde “Örnek” etiketiyle gösterilir. Resmî soruları
eklemek isterseniz aynı şemayla `official: true` olarak ekleyebilirsiniz — ÖSYM sorularının telif
koşullarını kontrol etmek yayıncının sorumluluğundadır.

---

## Yayınlama

Statik bir site olduğu için iki seçenek de ücretsizdir. **GitHub Pages önerilir**: ek hesap veya
ödemeli plan gerekmez.

### 1) GitHub Pages (önerilen)

Depo `.github/workflows/deploy.yml` dosyasıyla hazır gelir; her `main` push'unda site otomatik
derlenip yayınlanır.

1. GitHub'da yeni bir depo açın (örn. `ALES-Pratik`).
2. Bu klasörü depoya gönderin:

   ```bash
   git init
   git add .
   git commit -m "ALES Pratik: ilk sürüm"
   git branch -M main
   git remote add origin https://github.com/<kullanıcı-adı>/ALES-Pratik.git
   git push -u origin main
   ```

3. Depoda **Settings → Pages → Build and deployment → Source** ayarını **GitHub Actions** yapın.
4. Actions sekmesinde “GitHub Pages'e yayınla” iş akışı bitince site şu adreste yayında olur:
   `https://<kullanıcı-adı>.github.io/ALES-Pratik/`

Alt yol (`/ALES-Pratik/`) sorun çıkarmaz: `vite.config.ts` içinde `base: "./"` ve uygulamada hash
tabanlı yönlendirme (`#/calis`) kullanılır; sunucu tarafı yeniden yazma kuralı gerekmez.

> Özel alan adı kullanacaksanız `public/CNAME` dosyasına alan adını ekleyin.

### 2) Firebase Hosting (alternatif)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # mevcut proje, public dizini: dist, SPA rewrites: No
npm run build
firebase deploy --only hosting
```

`firebase.json` bu proje için hazır (yayın dizini `dist`). Yayın adresi
`https://<proje-id>.web.app` biçiminde olur.

---

## Proje yapısı

```
ALES-Pratik/
├─ index.html                 # tema başlatma betiği, meta etiketleri
├─ vite.config.ts             # base: "./" → alt dizinde yayınlanabilir
├─ firebase.json              # alternatif Firebase Hosting yapılandırması
├─ .github/workflows/deploy.yml
├─ scripts/validate-questions.mjs
└─ src/
   ├─ main.tsx / App.tsx      # giriş noktası ve sayfa yönlendirmesi
   ├─ styles.css              # tema değişkenleri ve tüm bileşen stilleri
   ├─ types.ts                # Question tipi (soru şeması)
   ├─ data/
   │  ├─ questions.json       # ← soru bankası (tek düzenlenecek dosya)
   │  └─ index.ts             # sınav/konu türetimi, arama
   ├─ lib/
   │  ├─ router.ts            # hash tabanlı yönlendirme (#/calis, #/sorular…)
   │  └─ store.ts             # localStorage ilerleme + tema
   ├─ components/
   │  ├─ Layout.tsx           # üst menü, tema düğmesi, alt bilgi
   │  ├─ MetaChips.tsx        # sınav/bölüm/konu etiketleri
   │  └─ QuestionView.tsx     # soru kartı, seçenekler, cevap + çözüm panelleri
   └─ pages/
      ├─ Home.tsx             # tanıtım, sınav dönemleri
      ├─ Practice.tsx         # çalışma ekranı, test modları
      ├─ Bank.tsx             # filtrelenebilir soru listesi
      └─ Stats.tsx            # istatistikler
```

## Teknoloji

React 19 + TypeScript + Vite. Ek çalışma zamanı bağımlılığı yoktur; yazı tipleri sistem
yazı tiplerinden seçilir, bu yüzden ilk açılış hızlıdır ve çevrimdışı da çalışır.
