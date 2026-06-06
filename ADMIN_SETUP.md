# Painel Admin — Carnaíba Esmeraldas

Painel **separado** do site público. Roda só na sua máquina (ou em hosting privado). **Não** entra no deploy do Firebase Hosting do site.

## 1. Ativar autenticação no Firebase

1. [Firebase Console](https://console.firebase.google.com/) → **carnaiba-esmeraldas**
2. **Authentication** → **Sign-in method** → **E-mail/senha** → Ativar
3. **Users** → **Add user** → crie o e-mail e senha do administrador

## 2. Autorizar o administrador

No **Firestore**, crie a coleção `admins` com um documento cujo **ID** é o **UID** do usuário (copie em Authentication → Users → coluna User UID):

```
Coleção: admins
Documento ID: {UID do usuário}
Campos:
  email: "seu@email.com"
  createdAt: (timestamp, opcional)
```

Sem esse documento, o login funciona mas o painel recusa o acesso.

## 3. Publicar regras de segurança

```bash
firebase deploy --only firestore:rules
```

- Site público: **leitura** de gems
- Escrita no Firestore: **somente** usuários em `admins/{uid}`

## 4. Variáveis de ambiente

O painel usa o `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Preencha `VITE_FIREBASE_*` e `VITE_CLOUDINARY_*` (veja [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)).

## 5. Rodar o painel (local)

```bash
npm run admin:dev
```

Abre em **http://localhost:5174** — porta diferente do site (`5173`).

## 6. O que você pode fazer no painel

| Ação | Onde |
|------|------|
| Cadastrar pedra | Nova pedra |
| Fotos | Upload → **Cloudinary** (`carnaiba/gems/{slug}/…`) |
| Descrições | Campos em português + traduções opcionais |
| YouTube | Cole o link (vídeo não listado) |
| Marcar vendida | Lista → “Marcar vendida” ou checkbox no formulário |
| Editar | Lista → Editar |

## 7. Segurança

- O painel **não** é publicado com o site (`firebase.json` só faz deploy de `dist/` do site)
- Acesso protegido por **Firebase Auth** + documento em `admins`
- Use senha forte; não compartilhe o `.env`
- Para novo admin: crie usuário no Auth + documento em `admins/{novo-uid}`

## 8. Build opcional (hosting privado)

Se quiser hospedar o painel em URL separada (ex.: só VPN ou Firebase Hosting com outro site):

```bash
npm run admin:build
# saída em admin/dist/
```

Não inclua `admin/dist` no deploy do site público.
