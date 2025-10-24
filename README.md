# Yılan Oyunu – Base & Farcaster Entegrasyonlu

React ve Vite ile geliştirilen bu proje, yılan oyununu Base ağı cüzdan imzalama akışı ve Farcaster paylaşım linkiyle birlikte sunar. Oyun, Base App çatısına entegre edilebilecek şekilde komponent tabanlıdır.

## Gereksinimler
- Node.js 18+
- pnpm veya npm/yarn
- MetaMask (veya `window.ethereum` sunan başka bir cüzdan)

## Hızlı Başlangıç
1. Depoyu klonlayın ve dizine girin.
2. Gerekirse ortam değişkenlerini ayarlamak için `cp .env.example .env` komutunu çalıştırın.
3. Bağımlılıkları yükleyin:
   ```bash
   pnpm install
   ```
   > Alternatif olarak `npm install` veya `yarn install` komutlarını kullanabilirsiniz.
4. Geliştirme sunucusunu başlatın:
   ```bash
   pnpm dev
   ```
   > `npm run dev` veya `yarn dev` eşdeğeridir. Terminalde port bilgisi görüntülendikten sonra tarayıcıda uygulamayı açabilirsiniz.

## Yerelde Oyunu Başlatma Adımları
Aşağıdaki rehber, “bu talimatları izleyerek oyunu yerelde başlatabilirsiniz” cümlesinde atıfta bulunulan sürecin ayrıntılandırılmış hâlidir:

1. **Depoyu klonla**
   ```bash
   git clone <REPO_URL>
   cd never-fly-alone
   ```
   > Eğer bu projeyi Base App içerisine alt modül olarak ekleyecekseniz, `git submodule add <REPO_URL> packages/snake-game` gibi bir yapı da tercih edebilirsiniz.

2. **Ortam değişkenlerini hazırla**
   ```bash
   cp .env.example .env
   ```
   > Varsayılan ayarlar Base ana ağının herkese açık RPC uç noktasını kullanır. Kendi sağlayıcınızı tercih ediyorsanız `.env` dosyasındaki `VITE_BASE_RPC_URL` değerini güncelleyin.

3. **Bağımlılıkları yükle**
   ```bash
   pnpm install
   ```
   - Eğer kurumsal proxy 403 hatası veriyorsa, aynı komutu özel bir kayıt defteriyle deneyebilirsiniz:
     ```bash
     pnpm install --registry=https://registry.npmmirror.com
     ```
   - pnpm bulunmuyorsa `npm install` komutu da yeterlidir.

4. **Geliştirme sunucusunu çalıştır**
   ```bash
   pnpm dev
   ```
   - Terminalde genellikle `Local:   http://localhost:3000/` satırını görürsünüz.
   - Farklı bir port belirtilirse tarayıcıda o adresi açın.

5. **Tarayıcıda oyunu başlat**
   - Tarayıcıda açılan sayfada “Başlat” butonuna tıklayın veya `Space` tuşuna basın.
   - Yön tuşları / WASD ile yılanı hareket ettirin.

6. **Cüzdan ve Farcaster testleri (isteğe bağlı)**
   - Sağdaki panelden “Cüzdan Bağla” butonuyla MetaMask’i bağlayın.
   - Base ağına otomatik geçiş isteğini onaylayın.
   - Bir oyun turu tamamladıktan sonra “Skoru İmzala” ve “Warpcast’te Paylaş” adımlarını deneyerek Base + Farcaster entegrasyonunu test edin.

> Kurulum sırasında hata alırsanız terminaldeki mesajı inceleyin. Proxy kaynaklı 403 hataları için VPN veya farklı bir npm aynası kullanmak genellikle sorunu çözer.

## Oyunu Çalıştırma
- Varsayılan olarak uygulama [http://localhost:3000](http://localhost:3000) adresinde açılır. Terminal çıktısında farklı bir port yazıyorsa onu kullanın.
- İlk açılışta yılan durur; “Başlat” butonuna basarak veya `Space` tuşuna basarak oyunu başlatabilirsiniz.
- Cüzdan bağlantısı için MetaMask uzantınızın açık olduğundan ve Base ağına geçişe izin verdiğinizden emin olun.
- Base Mainnet için özel bir RPC kullanmak istiyorsanız `.env` dosyasına `VITE_BASE_RPC_URL` tanımlayabilirsiniz.

## Üretim Derlemesi
```bash
pnpm build
pnpm preview
```

`preview` komutu üretim çıktısını yerel olarak doğrulamak için kullanılır.

## Base Ağı Ayarları
Varsayılan olarak herkese açık Base RPC uç noktası kullanılır. Daha güvenilir bir sağlayıcı için `.env` dosyası oluşturup aşağıdaki anahtarı ekleyin:

```bash
cp .env.example .env
```

`.env` dosyasına örnek içerik:
```env
VITE_BASE_RPC_URL=https://mainnet.base.org
```

MetaMask üzerinde Base ağını manuel eklemeniz gerekiyorsa:
- **Chain ID:** `8453`
- **Currency Symbol:** `ETH`
- **RPC URL:** `https://mainnet.base.org`
- **Block Explorer:** `https://basescan.org`

## Farcaster Paylaşımı
Oyun içindeki “Warpcast'te Paylaş” butonu, skorunuzu Farcaster'da paylaşmak üzere Warpcast oluşturma ekranını yeni sekmede açar. Gerekirse paylaşım metnini özelleştirebilirsiniz.

## Base App / Farcaster Entegrasyon Notları
- `src/components/SnakeGame.tsx` ve `src/components/IntegrationPanel.tsx` bileşenlerini Base App projenizde uygun rota ya da frame içerisine taşıyabilirsiniz.
- Cüzdan bağlantısı `wagmi` üzerinden yönetilir; Base App içinde mevcut wagmi konfigürasyonu varsa `src/wagmiConfig.ts` içeriğini ona göre düzenleyin.
- Farcaster Frames içerisinde kullanmak isterseniz, `IntegrationPanel` içinde yer alan paylaşım fonksiyonunu Frame aksiyonlarına uyarlayabilirsiniz.

## Test
Projede henüz otomatik testler bulunmuyor. Geliştirme sürecinde `pnpm lint` komutuyla kod kalitesini kontrol edebilirsiniz.
