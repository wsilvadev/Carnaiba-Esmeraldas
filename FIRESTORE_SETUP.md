# Firebase — Firestore e YouTube

## 1. Ativar serviços no Console

1. [Firebase Console](https://console.firebase.google.com/) → projeto `carnaiba-esmeraldas`
2. **Firestore Database** → Criar banco (modo produção)
3. **Authentication** → E-mail/senha (painel admin)
4. **Hosting** → já configurado

**Fotos:** use [Cloudinary](./CLOUDINARY_SETUP.md) — Firebase Storage **não é obrigatório**.

## 2. Variáveis de ambiente

Copie `.env.example` para `.env`:

```env
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=carnaiba-esmeraldas.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carnaiba-esmeraldas
VITE_FIREBASE_STORAGE_BUCKET=carnaiba-esmeraldas.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Cloudinary (imagens)
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

## 3. Publicar regras de segurança

```bash
firebase deploy --only firestore:rules
```

Leitura pública de `gems`; escrita só para admins autenticados.

## 4. Popular o Firestore

```bash
npm run seed:generate
```

Isso gera `firestore/gems.seed.json`. Importe no Console ou use o **painel admin** (`npm run admin:dev`).

- **ID do documento** = slug (`carnaiba-01`)
- Campos: `ordem`, `peso`, `precoBRL`, `disponivel`, `imagens`, `videos`, `traducoes`, etc.

### Vídeo (YouTube não listado)

```json
"videos": [
  { "youtubeId": "SEU_VIDEO_ID", "title": "Pedra na luz natural" }
]
```

### Imagem (Cloudinary)

```json
"imagens": [
  {
    "id": "main",
    "url": "https://res.cloudinary.com/.../carnaiba/gems/carnaiba-01/main.jpg",
    "publicId": "carnaiba/gems/carnaiba-01/main"
  }
]
```

Upload pelo admin preenche isso automaticamente. Sem foto, aparece o gradiente placeholder.

Documentos antigos com `storagePath` (Firebase Storage) ainda funcionam como fallback.

## 5. Traduções

```json
"traducoes": {
  "pt": { "nome": "...", "tipo": "...", "cor": "...", "claridade": "...", "desc": "..." },
  "en": { ... }
}
```

Se faltar no Firestore, o site usa `src/i18n/locales/` como fallback.

## 6. GitHub Actions

Secrets: `VITE_FIREBASE_*`, `VITE_GA_MEASUREMENT_ID`, `VITE_CLOUDINARY_CLOUD_NAME`.

## 7. Painel admin

Veja [ADMIN_SETUP.md](./ADMIN_SETUP.md) e [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md).
