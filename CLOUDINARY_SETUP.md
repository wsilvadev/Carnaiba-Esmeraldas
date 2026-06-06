# Cloudinary — imagens das esmeraldas

Fotos ficam no **Cloudinary** (plano gratuito). Firestore guarda `url` e `publicId`; o site monta URLs otimizadas (`f_auto`, `q_auto`, largura máx.).

## 1. Criar conta e preset

1. [Cloudinary Console](https://cloudinary.com/console)
2. Anote o **Cloud name** (Dashboard)
3. **Settings** → **Upload** → **Add upload preset**
   - **Signing mode:** Unsigned
   - **Folder:** opcional (`carnaiba/gems` — o admin também envia por pasta)
   - **Allowed formats:** jpg, png, webp
   - Salve e copie o **Preset name**

## 2. Variáveis de ambiente

No `.env` (e no GitHub Secrets para produção):

```env
VITE_CLOUDINARY_CLOUD_NAME=seu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=seu_preset_unsigned
```

| Variável | Onde usa |
|----------|----------|
| `VITE_CLOUDINARY_CLOUD_NAME` | Site + admin (URLs otimizadas) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Só admin (upload) |

## 3. Estrutura no Firestore

```json
"imagens": [
  {
    "id": "main",
    "url": "https://res.cloudinary.com/.../carnaiba/gems/carnaiba-01/main.jpg",
    "publicId": "carnaiba/gems/carnaiba-01/main"
  }
]
```

Upload pelo admin preenche `url` e `publicId` automaticamente.

## 4. Upload pelo painel admin

```bash
npm run admin:dev
```

Nova pedra / Editar → escolher arquivo → **Publicar**. Arquivos vão para:

```
carnaiba/gems/{slug}/{id}
```

## 5. Plano gratuito

Limites generosos para catálogo pequeno/médio. Acompanhe em Cloudinary → **Dashboard** → Usage.

## 6. Firebase Storage

**Não é mais necessário** para fotos novas. Documentos antigos com `storagePath` ainda funcionam como fallback.

## 7. GitHub Secrets (produção)

Adicione `VITE_CLOUDINARY_CLOUD_NAME` (mesmo valor do `.env`).  
`VITE_CLOUDINARY_UPLOAD_PRESET` só no `.env` local — o site publicado não faz upload.
