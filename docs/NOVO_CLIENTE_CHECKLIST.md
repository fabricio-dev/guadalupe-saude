# 📋 Checklist: Adaptação do Projeto para Novo Cliente

## 📞 1. INFORMAÇÕES A SOLICITAR DO CLIENTE

### 🏥 Dados da Empresa
- [ ] **Nome da Empresa/Clínica**
  - Usado em: Templates WhatsApp, emails, interface
- [ ] **Logo da Empresa**
  - Formatos: PNG (transparente), SVG
  - Tamanhos: 512x512px (ícone), versões horizontal/vertical
- [ ] **Cores da Marca**
  - Primária (hex)
  - Secundária (hex)
  - Tons de destaque
- [ ] **Domínio**
  - Ex: `sistema.novaempresa.com.br`

---

### 📱 WhatsApp Business API
- [ ] **Número do WhatsApp Business**
  - Formato: `5511912345678` (com DDI)
  - Deve estar verificado na Meta
- [ ] **WhatsApp Business Account ID**
  - Obtido no Meta Business Suite
- [ ] **Phone Number ID**
  - Obtido no painel do WhatsApp Cloud API
- [ ] **Access Token (Permanente)**
  - Token de longa duração da Meta
- [ ] **Templates Aprovados pela Meta**
  - Nome exato de cada template
  - Parâmetros de cada template
  - Categoria (Marketing, Transacional, etc.)

---

### 🗄️ Banco de Dados
- [ ] **Dados de Conexão PostgreSQL**
  - Host/IP
  - Porta (padrão: 5432)
  - Nome do Database
  - Usuário
  - Senha
- [ ] **Preferência de Hosting**
  - Supabase? Neon? RDS? VPS própria?

---

### 🔐 Autenticação
- [ ] **Métodos de Login Desejados**
  - Email/Senha? Google? Facebook?
- [ ] **Políticas de Senha**
  - Requisitos mínimos
  - Expiração
  - Histórico

---

### 💰 Regras de Negócio
- [ ] **Nome do Produto/Serviço**
  - Ex: "Convênio", "Cartão", "Plano"
- [ ] **Ciclo de Renovação**
  - Anual? Mensal? Outro?
- [ ] **Prazos de Lembrete**
  - D-7, D-0, D+30? Outros?
- [ ] **Valores/Planos**
  - Estrutura de preços
  - Descontos para renovação antecipada
- [ ] **Documentos Obrigatórios**
  - RG, CPF, Comprovante? Outros?

---

### 🌐 Deploy e Infraestrutura
- [ ] **Onde será hospedado?**
  - Vercel? VPS própria? AWS? Azure?
- [ ] **Domínio e DNS**
  - Acesso ao painel de DNS
- [ ] **Certificado SSL**
  - Let's Encrypt? Outro?
- [ ] **Backup**
  - Frequência desejada
  - Retenção (quantos dias/meses)

---

## 🔧 2. ALTERAÇÕES NO CÓDIGO

### 📄 Arquivos de Configuração

#### `.env` (Copiar de `exemplo.env.md` e ajustar)
```env
# ===========================
# 🔧 CONFIGURAÇÕES GERAIS
# ===========================
DATABASE_URL="postgresql://user:password@host:5432/dbname"
BETTER_AUTH_SECRET="gerar_novo_secret_com_crypto"
BETTER_AUTH_URL="https://sistema.novocliente.com.br"
CRON_SECRET="gerar_novo_secret_para_cron"

# ===========================
# 📱 WHATSAPP
# ===========================
WHATSAPP_ENABLED="true"
WHATSAPP_ENV="prod"
WHATSAPP_ACCESS_TOKEN="token_fornecido_pelo_cliente"
WHATSAPP_PHONE_NUMBER_ID="id_fornecido_pelo_cliente"
WHATSAPP_BUSINESS_ACCOUNT_ID="account_id_do_cliente"
WHATSAPP_API_URL="https://graph.facebook.com/v21.0"
WHATSAPP_OFFICIAL_NUMBER="5511999999999"  # Número do cliente (LIMPO)
WHATSAPP_TEST_PHONE="5511987654321"

# ===========================
# 📧 EMAIL (se usar)
# ===========================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="contato@novocliente.com.br"
SMTP_PASSWORD="senha_app_gmail"
EMAIL_FROM="Sistema Nova Clínica <contato@novocliente.com.br>"

# ===========================
# 🗂️ STORAGE (se usar)
# ===========================
AWS_ACCESS_KEY_ID="key_do_cliente"
AWS_SECRET_ACCESS_KEY="secret_do_cliente"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="novocliente-documents"
```

---

### 🎨 Branding e Interface

#### `src/lib/constants.ts` (ou criar se não existir)
```typescript
export const APP_CONFIG = {
  appName: "Sistema Nova Clínica",
  clinicName: "Nova Clínica Médica",
  
  // Produto
  productName: "Convênio Médico", // ou "Cartão", "Plano", etc.
  renewalCycleDays: 365, // ou 30, 180, etc.
  
  // Contatos
  supportPhone: "5511999999999",
  supportEmail: "suporte@novocliente.com.br",
  supportWhatsApp: "5511999999999",
  
  // URLs
  website: "https://novocliente.com.br",
  privacyPolicyUrl: "https://novocliente.com.br/privacidade",
  termsOfServiceUrl: "https://novocliente.com.br/termos",
  
  // Funcionalidades
  features: {
    enableEarlyRenewal: true,
    enableWhatsAppNotifications: true,
    enableEmailNotifications: false,
    requireDocumentUpload: true,
  },
};
```

#### `tailwind.config.ts`
```typescript
// Atualizar cores da marca
theme: {
  extend: {
    colors: {
      // ⚠️ ALTERAR PARA AS CORES DO NOVO CLIENTE
      primary: {
        50: '#...', // Gerar escala da cor primária
        100: '#...',
        // ... até 950
      },
      secondary: {
        // Cor secundária do cliente
      },
    },
  },
},
```

#### `public/` (Assets)
- [ ] Substituir `favicon.ico`
- [ ] Substituir `logo.png` / `logo.svg`
- [ ] Substituir `og-image.png` (Open Graph para redes sociais)
- [ ] Atualizar `manifest.json` com nome e cores do cliente

#### `src/app/layout.tsx` (Metadata)
```typescript
export const metadata: Metadata = {
  title: "Sistema Nova Clínica",
  description: "Gestão de convênios médicos",
  // Atualizar outros metadados
};
```

---

### 📱 Templates do WhatsApp

#### `src/lib/whatsapp/templates.ts`
```typescript
// ⚠️ ATUALIZAR COM OS TEMPLATES APROVADOS PELO NOVO CLIENTE

export function getTemplateConfig(type, params): TemplateConfig {
  switch (type) {
    case "activation":
      return {
        name: "novo_template_ativacao", // ← Nome aprovado pela Meta
        parameters: [firstName, date, clinic],
      };
    
    case "renewal_reminder_d7":
      return {
        name: "novo_template_d7", // ← Nome aprovado pela Meta
        parameters: [firstName, date, whatsapp],
      };
    
    // ... outros templates
  }
}
```

#### `WHATSAPP_TEMPLATES.md`
- [ ] Documentar todos os novos templates
- [ ] Incluir textos exatos aprovados pela Meta
- [ ] Mapear parâmetros de cada template

---

### 🗄️ Schema do Banco

#### `src/db/schema.ts`

**Opcional: Ajustar nomes de tabelas/campos**
```typescript
// Se o cliente usar terminologia diferente:
export const patientsTable = pgTable("patients", { // ou "clients", "members"
  // ...
  expirationDate: timestamp("expiration_date"), // ou "renewal_date", "valid_until"
  // ...
});
```

**⚠️ Importante:** Se mudar nomes, precisa atualizar:
- Todas as queries Drizzle
- Migrations
- Actions
- Cron jobs

---

### 🔄 Regras de Negócio do Cron

#### `src/cron/whatsapp-renewal-cron.ts`

```typescript
// ⚠️ AJUSTAR PRAZOS SE NECESSÁRIO

async function getEligiblePatientsForD7() {
  const targetDateSP = dayjs()
    .tz("America/Sao_Paulo") // ← Ajustar timezone se cliente for de outra região
    .add(7, "days") // ← Cliente quer D-7? D-10? D-15?
    .startOf("day");
  // ...
}

// Se cliente quiser D-15, D-5, D+60, criar novas funções
```

#### `src/db/schema.ts` (Enum de notificações)
```typescript
export const notificationTypeEnum = pgEnum("notification_type", [
  "ACTIVATION",
  "RENEWAL",
  "RENEWAL_D_7", // ← Ajustar conforme prazos do cliente
  "RENEWAL_D_0",
  "RENEWAL_D_30",
  // Adicionar novos tipos se necessário: RENEWAL_D_15, RENEWAL_D_60, etc.
]);
```

---

### 📧 Textos e Mensagens

**Buscar por:**
- `"LASAC"` → Substituir por nome do cliente
- `"Mais Saúde"` → Substituir por nome do sistema
- `"convênio"` → Substituir por termo usado pelo cliente
- `"cartão"` → Substituir se usar outro termo

**Arquivos a revisar:**
```bash
src/app/(protected)/**/*
src/components/**/*
src/actions/**/*
src/lib/whatsapp/templates.ts
public/**/*
```

---

## 🚀 3. DEPLOY E CONFIGURAÇÃO

### Banco de Dados
```bash
# 1. Criar novo banco PostgreSQL
# 2. Atualizar DATABASE_URL no .env
# 3. Rodar migrations
npm run db:push

# 4. Popular dados iniciais (se houver)
npm run db:seed
```

### Variáveis de Ambiente
```bash
# Gerar novos secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Usar para BETTER_AUTH_SECRET e CRON_SECRET
```

### Vercel (se usar)
```bash
# 1. Vincular ao projeto
vercel link

# 2. Adicionar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
# ... etc

# 3. Deploy
vercel --prod
```

### VPS (se usar)
- [ ] Transferir arquivos via Git/FTP
- [ ] Instalar Node.js (20+)
- [ ] Instalar dependências: `npm install`
- [ ] Configurar `.env` de produção
- [ ] Build: `npm run build`
- [ ] Configurar PM2/systemd para manter app rodando
- [ ] Configurar Nginx como proxy reverso
- [ ] Configurar SSL (Let's Encrypt)
- [ ] Configurar cron: `crontab -e`

---

### Cron Job
```bash
# Editar run-cron.sh
PROJECT_DIR="/home/usuario/projeto-novo-cliente"

# Adicionar ao crontab
crontab -e

# Rodar diariamente às 8h
0 8 * * * /home/usuario/projeto-novo-cliente/run-cron.sh
```

---

## ✅ 4. CHECKLIST FINAL ANTES DE ENTREGAR

### Testes
- [ ] Cadastro de paciente
- [ ] Upload de documentos
- [ ] Ativação de convênio
- [ ] Envio de WhatsApp (ativação)
- [ ] Renovação de convênio
- [ ] Renovação antecipada
- [ ] Cron job manual: `./run-cron.sh`
- [ ] Lembretes D-7, D-0, D+30
- [ ] Login/Logout
- [ ] Diferentes perfis (admin, atendente)
- [ ] Exportação de relatórios

### Segurança
- [ ] `.env` não está versionado (está no `.gitignore`)
- [ ] Secrets fortes (32+ caracteres)
- [ ] SSL configurado (HTTPS)
- [ ] Backup do banco configurado
- [ ] CORS configurado corretamente
- [ ] Rate limiting em APIs sensíveis

### Documentação
- [ ] README atualizado com nome do cliente
- [ ] Credenciais documentadas (em local seguro)
- [ ] Manual de uso para o cliente
- [ ] Contatos de suporte técnico
- [ ] Plano de contingência

### Performance
- [ ] Índices criados no banco
- [ ] Imagens otimizadas
- [ ] Build de produção testado
- [ ] Lighthouse score > 90

---

## 📦 5. ENTREGA AO CLIENTE

### Documentos a Fornecer
1. **Manual do Administrador**
   - Como cadastrar usuários
   - Como gerenciar pacientes
   - Como gerar relatórios
   
2. **Credenciais**
   - URL do sistema
   - Usuário admin inicial
   - Senha (solicitar troca no primeiro acesso)
   
3. **Contatos de Suporte**
   - Email de suporte
   - WhatsApp técnico
   - Horário de atendimento
   
4. **SLA (se aplicável)**
   - Tempo de resposta
   - Disponibilidade garantida
   - Janelas de manutenção

---

## 🔄 6. MANUTENÇÃO CONTÍNUA

### Monitoramento
- [ ] Logs centralizados (Sentry, LogRocket)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Alertas de erro
- [ ] Monitoramento de banco (uso de disco, conexões)

### Backups
- [ ] Backup diário do banco
- [ ] Backup de uploads/documentos
- [ ] Teste de restore mensal

### Atualizações
- [ ] Dependências do npm (mensalmente)
- [ ] Patches de segurança (imediatamente)
- [ ] Next.js / React (trimestralmente)

---

## 🎯 RESUMO RÁPIDO

### ✅ O que SEMPRE precisa mudar:
1. ✅ **Variáveis de ambiente** (`.env`)
2. ✅ **Branding** (logo, cores, nome)
3. ✅ **Templates WhatsApp** (nomes e parâmetros)
4. ✅ **Banco de dados** (conexão e migrations)
5. ✅ **Secrets** (gerar novos)

### ⚠️ O que PODE precisar mudar:
1. ⚠️ **Regras de negócio** (prazos, valores)
2. ⚠️ **Nomes de campos** (terminologia)
3. ⚠️ **Funcionalidades** (adicionar/remover features)
4. ⚠️ **Integrações** (payment gateways, etc.)

### ✅ O que RARAMENTE muda:
1. ✅ Estrutura do Next.js
2. ✅ Componentes shadcn/ui
3. ✅ Lógica de autenticação (BetterAuth)
4. ✅ ORM (Drizzle)

---

## 📞 SUPORTE

Em caso de dúvidas durante a adaptação:
- Revisar documentação do projeto (`/docs`)
- Verificar comentários no código
- Consultar `.md` de referência
- Testar em ambiente DEV primeiro

---

**Última atualização:** Janeiro/2026
**Versão do Template:** 1.0



