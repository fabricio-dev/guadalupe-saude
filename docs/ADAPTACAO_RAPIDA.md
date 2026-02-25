# ⚡ Guia Rápido: Adaptação para Novo Cliente

> **Tempo estimado:** 2-4 horas (dependendo da complexidade)

---

## 📋 ANTES DE COMEÇAR

```bash
# 1. Fazer backup do projeto
git clone https://github.com/seu-repo/mais-saude-lasac.git projeto-novo-cliente
cd projeto-novo-cliente

# 2. Criar nova branch
git checkout -b cliente/nome-do-cliente

# 3. Limpar histórico (opcional, se for entregar código)
rm -rf .git
git init
```

---

## 🎯 5 PASSOS ESSENCIAIS

### 1️⃣ COLETAR INFORMAÇÕES (30min)

**Enviar ao cliente:** `FORMULARIO_NOVO_CLIENTE.md`

**Informações críticas:**
- ✅ Nome da empresa + Logo
- ✅ WhatsApp Business (número + tokens + templates)
- ✅ Banco de dados (host, user, password)
- ✅ Domínio
- ✅ Regras de negócio (prazos de lembrete, valores)

---

### 2️⃣ CONFIGURAR AMBIENTE (20min)

```bash
# Copiar .env de exemplo
cp exemplo.env.md .env

# Editar .env com dados do cliente
nano .env
```

**Variáveis OBRIGATÓRIAS:**

```env
# Banco de dados
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Autenticação
BETTER_AUTH_SECRET="gerar_novo_secret"
BETTER_AUTH_URL="https://sistema.cliente.com.br"

# WhatsApp
WHATSAPP_ENABLED="true"
WHATSAPP_ACCESS_TOKEN="token_fornecido_pelo_cliente"
WHATSAPP_PHONE_NUMBER_ID="id_fornecido_pelo_cliente"
WHATSAPP_OFFICIAL_NUMBER="5511999999999"

# Cron
CRON_SECRET="gerar_outro_secret"
```

**Gerar secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 3️⃣ ATUALIZAR BRANDING (40min)

#### Logo e Assets
```bash
# Substituir arquivos em /public
public/
  ├── logo.png          # Logo do cliente
  ├── logo-horizontal.png
  ├── favicon.ico       # Ícone do cliente
  └── og-image.png      # Imagem para redes sociais
```

#### Cores (tailwind.config.ts)
```typescript
colors: {
  primary: {
    DEFAULT: '#123456',  // Cor primária do cliente
    // ... gerar escala completa em: uicolors.app
  },
}
```

#### Textos
```bash
# Opção 1: Script automatizado (recomendado)
node scripts/adapt-for-client.js

# Opção 2: Buscar e substituir manualmente
# - "LASAC" → Nome do Cliente
# - "Mais Saúde" → Nome do Sistema
# - "convênio" → Termo usado pelo cliente
```

---

### 4️⃣ CONFIGURAR WHATSAPP (30min)

**Arquivo:** `src/lib/whatsapp/templates.ts`

```typescript
// Atualizar nomes dos templates
case "activation":
  return {
    name: "nome_template_meta_do_cliente", // ← AJUSTAR
    parameters: [firstName, date, clinic],
  };

case "renewal_reminder_d7":
  return {
    name: "lembrete_cliente_7_dias", // ← AJUSTAR
    parameters: [firstName, date, whatsapp],
  };

// ... outros templates
```

**⚠️ IMPORTANTE:**
- Usar os nomes EXATOS aprovados pela Meta
- Verificar número de parâmetros de cada template
- Documentar em `WHATSAPP_TEMPLATES.md`

---

### 5️⃣ AJUSTAR REGRAS DE NEGÓCIO (20min)

**Arquivo:** `src/cron/whatsapp-renewal-cron.ts`

```typescript
// Se cliente quiser lembretes diferentes:
// Exemplo: D-10 ao invés de D-7

async function getEligiblePatientsForD10() {  // ← CRIAR NOVA
  const targetDateSP = dayjs()
    .tz("America/Sao_Paulo")
    .add(10, "days")  // ← AJUSTAR DIAS
    .startOf("day");
  // ... resto do código
}
```

**Adicionar no enum (src/db/schema.ts):**
```typescript
export const notificationTypeEnum = pgEnum("notification_type", [
  "RENEWAL_D_10",  // ← ADICIONAR
  // ... outros
]);
```

---

## 🚀 DEPLOY (40min)

### Preparar Banco de Dados

```bash
# 1. Instalar dependências
npm install

# 2. Criar estrutura do banco
npm run db:push

# 3. (Opcional) Popular dados iniciais
npm run db:seed
```

---

### Opção A: Deploy Vercel (MAIS FÁCIL)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add WHATSAPP_ACCESS_TOKEN
# ... etc

# 5. Redeployar
vercel --prod
```

**Configurar Cron (vercel.json):**
```json
{
  "crons": [{
    "path": "/api/cron/whatsapp-renewal",
    "schedule": "0 8 * * *"
  }]
}
```

---

### Opção B: Deploy VPS

```bash
# 1. Enviar código para VPS
scp -r . user@servidor:/home/user/projeto

# SSH no servidor
ssh user@servidor
cd /home/user/projeto

# 2. Instalar dependências
npm install

# 3. Build
npm run build

# 4. Configurar PM2
npm i -g pm2
pm2 start npm --name "sistema-cliente" -- start
pm2 save
pm2 startup

# 5. Configurar Nginx
sudo nano /etc/nginx/sites-available/sistema-cliente
# ... configuração proxy reverso ...

sudo nginx -t
sudo systemctl reload nginx

# 6. Configurar cron
crontab -e
# Adicionar: 0 8 * * * /caminho/projeto/run-cron.sh
```

---

## ✅ TESTES (30min)

### Checklist de Testes

```bash
# 1. Rodar em DEV
npm run dev
```

- [ ] **Login funciona**
  - Criar usuário admin
  - Fazer login/logout

- [ ] **Cadastro de paciente**
  - Preencher formulário
  - Upload de documentos
  - Verificar se salvou no banco

- [ ] **Ativação de convênio**
  - Ativar paciente
  - Verificar se WhatsApp foi enviado
  - Confirmar recebimento no celular

- [ ] **Cron manual**
  ```bash
  # Testar cron localmente
  npm run dev
  # Acessar: http://localhost:3000/api/cron/whatsapp-renewal?secret=SEU_CRON_SECRET
  ```

- [ ] **Renovação**
  - Renovar paciente existente
  - Verificar se notificações antigas foram deletadas
  - Confirmar novo ciclo iniciado

- [ ] **Visual/Branding**
  - Logo aparecendo
  - Cores corretas
  - Nome da empresa em todos os lugares

---

## 📊 ENTREGA AO CLIENTE

### Documentos a Fornecer

```bash
# 1. Criar pasta de entrega
mkdir entrega-cliente
cd entrega-cliente

# 2. Copiar documentação relevante
cp ../README.md .
cp ../MANUAL_DO_USUARIO.md .
cp ../FAQ.md .

# 3. Criar documento de credenciais
nano CREDENCIAIS.txt
```

**CREDENCIAIS.txt:**
```
SISTEMA [NOME DO CLIENTE]
========================

🌐 Acesso ao Sistema
URL: https://sistema.cliente.com.br
Usuário Admin: admin@cliente.com.br
Senha: [senha_temporaria_123]
⚠️ Trocar senha no primeiro acesso!

📱 WhatsApp Configurado
Número: +55 (11) 99999-9999
Status: ✅ Integrado e funcionando

🗄️ Banco de Dados
Provider: [Supabase/Neon/AWS]
Backup: Diário (retenção: 30 dias)

🔄 Cron Jobs
Horário: 08:00 (horário de Brasília)
Frequência: Diária
Lembretes: D-7, D-0, D+30

📞 Suporte Técnico
Email: suporte@seuservico.com
WhatsApp: +55 (11) 98888-8888
Horário: Seg-Sex, 9h-18h
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

### ❌ WhatsApp não envia

```bash
# Verificar:
1. WHATSAPP_ENABLED=true no .env
2. Token e Phone Number ID corretos
3. Templates aprovados pela Meta
4. Número formatado corretamente (sem espaços/parênteses)

# Testar manualmente:
curl -X POST "https://graph.facebook.com/v21.0/PHONE_ID/messages" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messaging_product":"whatsapp","to":"5511999999999","type":"template","template":{"name":"seu_template","language":{"code":"pt_BR"}}}'
```

---

### ❌ Erro de banco de dados

```bash
# Verificar conexão
npx drizzle-kit studio

# Recriar schema
npm run db:push

# Verificar migrations
npm run db:migrate
```

---

### ❌ Cron não roda

```bash
# Verificar logs
tail -f logs/cron-whatsapp.log

# Testar manualmente
./run-cron.sh

# Verificar crontab
crontab -l

# Verificar timezone do servidor
timedatectl
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para informações detalhadas, consulte:
- 📋 `NOVO_CLIENTE_CHECKLIST.md` - Lista completa de alterações
- 📝 `FORMULARIO_NOVO_CLIENTE.md` - Formulário para cliente
- 🔧 `scripts/adapt-for-client.js` - Script de automação

---

## ⏱️ RESUMO DE TEMPO

| Etapa | Tempo Estimado |
|-------|----------------|
| Coleta de informações | 30 min |
| Configuração de ambiente | 20 min |
| Branding (logo, cores) | 40 min |
| WhatsApp templates | 30 min |
| Regras de negócio | 20 min |
| Deploy | 40 min |
| Testes | 30 min |
| Documentação | 20 min |
| **TOTAL** | **≈ 3h30min** |

---

## 🎯 DICA PROFISSIONAL

**Para próximos clientes:**

1. ✅ Criar template do projeto "limpo" (sem dados específicos)
2. ✅ Documentar todas as customizações em comentários `// [CLIENTE]:`
3. ✅ Usar variáveis de ambiente para TUDO
4. ✅ Manter changelog de alterações por cliente

---

**Última atualização:** Janeiro/2026  
**Versão:** 1.0  
**Autor:** [Seu Nome/Empresa]



