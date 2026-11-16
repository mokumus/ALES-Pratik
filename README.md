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
- **Her sorunun kendi adresi var.** Çalışma ekranında gezinirken adres çubuğu o soruyu gösterir
  (`#/calis?q=2026-1-say-30`); bağlantıyı kaydedip sonra doğrudan aynı soruya dönebilirsin.
- **Kitapçık bağlantısı** — resmî sorularda, sorunun alındığı ÖSYM temel soru kitapçığına (PDF) link
  verilir; tüm kitapçıklara **Resmî Sınavlar** sayfasından ulaşılır.
- **Resmî sınav arşivi** — ÖSYM'nin yayımladığı 67 ALES kitapçığı (35 tam sınav + 32 %10 kitapçık)
  doğrudan ÖSYM'nin doküman sunucusuna bağlanır. 2019–2021 tam sınavlarında **optik form** vardır:
  işaretlemelerini girersin, resmî cevap anahtarıyla karşılaştırılıp net hesaplanır (4 yanlış 1 doğruyu
  götürür); sonuç tarayıcıda saklanır.
- **Karanlık / aydınlık tema**, mobil uyumlu düzen, klavye kısayolları.
- **Matematik dizgisi** — kesirler, kökler ve üslü ifadeler kitapçıktaki gibi üst üste dizilir (KaTeX).
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
npm run check      # tip kontrolü + JSON doğrulaması + KaTeX derleme kontrolü
npm run check:tex  # tüm $...$ ifadelerini KaTeX ile derler
npm run math       # düz metin matematiği TeX'e çevirir (-- --dry: rapor)
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

Resmî bir soru eklerken `official: true` yapın; isterseniz kitapçıktaki sayfa numarasını da verin:

```json
{
  "id": "2026-1-say-30",
  "official": true,
  "pdfPage": 11,
  "...": "diğer alanlar aynı"
}
```

Bu durumda soru kartında “Resmî” etiketi ve doğrudan kitapçığın o sayfasına giden bağlantı görünür
(`...tsk_als10052026.pdf#page=11`).

### Matematik yazımı

Kesir, kök, üs gibi ifadeler KaTeX ile dizilir. Soru metninde, seçeneklerde ve çözümde:

- `$...$` → satır içi matematik: `$\frac{1}{2}$`, `$x^2 + 3x$`
- `$$...$$` → ayrı satır (blok) matematik: `$$\frac{-3x-1}{4} + \frac{2x+2}{3} = 1$$`

```json
"stem": "$$\\frac{-3x-1}{4} + \\frac{2x+2}{3} + \\frac{x-3}{2} = 1$$\n\neşitliğini sağlayan $x$ kaçtır?"
```

Kesirler satır içinde `\dfrac` ile tam boy, blok matematikte `\frac` ile dizilir; birimler
`\mathrm{cm}^{2}` gibi dik yazılır. Dolar işareti kullanılmayan metin olduğu gibi yazılır. Mevcut
sorulardaki düz metin matematik (`2^x`, `√48`, `·`, Unicode üst simgeler) `node
scripts/convert-math.mjs` ile toplu olarak TeX'e çevrilmiştir; betik `$` içeren alanlara dokunmaz.
Liste görünümünde matematik düz metne indirgenir (`mathToPlain`).

| Alan | Açıklama |
| --- | --- |
| `id` | Benzersiz kimlik. Öneri: `yıl-dönem-bölüm-sıra` (`2026-2-say-31`). |
| `year` / `session` / `period` | Sınav bilgisi. `session` 1 veya 2; `period` `İlkbahar` / `Sonbahar`. |
| `section` | `sayisal` veya `sozel`. |
| `topic` | Konu adı. Filtre listesi bu alandan otomatik üretilir. |
| `no` | Sorunun orijinal sınavdaki numarası (sayısal 1–50, sözel 51–100). |
| `difficulty` | `kolay`, `orta`, `zor`. |
| `official` | `true` ise soru resmî kaynaktan alınmıştır; arayüzde “Resmî” etiketi görünür ve kitapçık bağlantısı çıkar. `false` ise “Örnek” etiketi görünür. |
| `pdfPage` | İsteğe bağlı. Sorunun resmî kitapçıktaki sayfa numarası; yalnızca `official: true` ile kullanılabilir. |
| `stem` | Soru metni. Düz metin; `\n\n` ile paragraf ayrılır. |
| `options` | Tam olarak **5** seçenek (A–E). |
| `answer` | Doğru seçeneğin indeksi: `0` = A … `4` = E. |
| `solution` | Çözüm metni. `\n\n` ile paragraflara ayrılır. |

Yeni bir sınav dönemi eklendiğinde (örn. 2026 ALES/2) ana sayfadaki “Sınav dönemleri”, filtreler ve
konu listeleri kendiliğinden güncellenir. O dönemin kitapçık PDF adresini
`src/data/booklets.ts` dosyasına ekleyin; bağlantılar otomatik görünür.

### Resmî sınav arşivi

`src/data/officialExams.ts`, ÖSYM'nin yayımladığı tüm ALES kitapçıklarını (2006'dan bugüne) tutar:
her kayıtta yıl, dönem, tür (`tam` / `yuzde10`) ve doğrudan `dokuman.osym.gov.tr` adresine giden
bağlantılar bulunur. Cevap anahtarı aynı PDF'in sonunda yayımlanan 2019–2021 tam sınavlarında
`answers` alanı doludur (50 sayısal + 50 sözel harf); optik form yalnızca bu sınavlarda görünür.

Bağlantılar ÖSYM'nin duyuru sayfalarından derlenmiştir; uygulama PDF'leri barındırmaz veya
kopyalamaz. Yeni bir sınav yayımlandığında `officialExams.ts` içine aynı yapıda bir kayıt eklemek
yeterlidir.

### İçerik ve telif notu

Depodaki 101 sorunun 100'ü, 2025–2026 ALES sınavlarının kapsamına ve zorluk düzeyine göre **özgün
olarak yazılmış alıştırma sorularıdır**; `official: false` olarak işaretlenmiş ve arayüzde “Örnek”
etiketiyle gösterilir. 1 soru ise 2026 ALES/1 kitapçığından alınmıştır ve `official: true` olarak
işaretlidir.

Kitapçık bağlantısı ilkesi: PDF bağlantısı yalnızca gerçekten o kitapçıkta yer alan sorularda
gösterilir. Örnek sorularda bağlantı verilmez, çünkü o sorular ÖSYM kitapçıklarında bulunmaz; bu tür
bir bağlantı kullanıcıyı yanıltır. Tüm sınav kitapçıklarına **Resmî Sınavlar** sayfasından
erişilebilir. PDF'ler projede barındırılmaz, doğrudan ÖSYM'nin sunucusundan açılır; resmî soruların
telif koşullarını kontrol etmek yayıncının sorumluluğundadır. Uygulama ÖSYM ile bağlantılı değildir.

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
├─ scripts/convert-math.mjs    # düz metin → TeX dönüştürücü
├─ scripts/check-tex.mjs       # KaTeX derleme kontrolü
└─ src/
   ├─ main.tsx / App.tsx      # giriş noktası ve sayfa yönlendirmesi
   ├─ styles.css              # tema değişkenleri ve tüm bileşen stilleri
   ├─ types.ts                # Question tipi (soru şeması)
   ├─ data/
   │  ├─ questions.json       # ← soru bankası (tek düzenlenecek dosya)
   │  ├─ booklets.ts          # sınav dönemi → resmî kitapçık PDF adresi
   │  ├─ officialExams.ts     # 67 ÖSYM kitapçığı + cevap anahtarları
   │  └─ index.ts             # sınav/konu türetimi, arama, düz metin yardımcıları
   ├─ lib/
   │  ├─ router.ts            # hash tabanlı yönlendirme (#/calis, #/sorular, #/resmi)
   │  └─ store.ts             # localStorage ilerleme, optik form sonuçları, tema
   ├─ components/
   │  ├─ Layout.tsx           # üst menü, tema düğmesi, alt bilgi
   │  ├─ MetaChips.tsx        # sınav/bölüm/konu etiketleri + kitapçık bağlantısı
   │  ├─ MathText.tsx         # $...$ / $$...$$ matematik dizgisi (KaTeX)
   │  └─ QuestionView.tsx     # soru kartı, seçenekler, cevap + çözüm panelleri
   └─ pages/
      ├─ Home.tsx             # tanıtım, sınav dönemleri, konular, arşiv çağrısı
      ├─ Practice.tsx         # çalışma ekranı, test modları, adres güncellemesi
      ├─ Bank.tsx             # filtrelenebilir soru listesi
      └─ Official.tsx         # resmî arşiv ve optik form
```

## Teknoloji

React 19 + TypeScript + Vite + KaTeX. Çalışma zamanında sunucu veya veritabanı yoktur; yazı tipleri
sistem yazı tiplerinden seçilir, matematik yazı tipleri ise KaTeX ile birlikte gelir ve yalnızca
ihtiyaç duyulduğunda indirilir.
