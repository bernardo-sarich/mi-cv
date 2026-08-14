## 1. Assets

- [x] 1.1 Copy `Bernardo_Sarich_CV_EN.pdf` and `Bernardo_Sarich_CV_ES.pdf` from `C:\Users\Bernardo\Downloads\` into `client/public/cv/`.

## 2. Download behavior

- [x] 2.1 In `client/src/components/sections/Hero.jsx`, wire the existing "Download CV" `Button` to download the PDF matching `lang` from `useLang()` (`es` → `/cv/Bernardo_Sarich_CV_ES.pdf`, `en` → `/cv/Bernardo_Sarich_CV_EN.pdf`), using an `<a download>`-style trigger so the file downloads instead of navigating.

## 3. Verification

- [x] 3.1 Run `npm run lint` and `npm run build` in `client/` and confirm both succeed.
