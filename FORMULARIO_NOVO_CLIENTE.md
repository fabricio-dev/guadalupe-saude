# 📋 Formulário de Coleta de Informações - Novo Cliente

**Data:** ___/___/______  
**Responsável pelo Preenchimento:** _________________________________

---

## 🏥 DADOS DA EMPRESA

| Campo | Informação |
|-------|-----------|
| **Nome Completo da Empresa** | |
| **Nome Fantasia** | |
| **CNPJ** | |
| **Website** | |
| **Endereço Completo** | |
| **Telefone Principal** | |
| **Email Principal** | |

---

## 👤 CONTATOS TÉCNICOS

### Pessoa de Contato Principal
| Campo | Informação |
|-------|-----------|
| **Nome** | |
| **Cargo** | |
| **Email** | |
| **WhatsApp** | |
| **Horário de Disponibilidade** | |

### Pessoa de Contato Secundária (Backup)
| Campo | Informação |
|-------|-----------|
| **Nome** | |
| **Cargo** | |
| **Email** | |
| **WhatsApp** | |

---

## 🎨 IDENTIDADE VISUAL

### Logotipos
- [ ] **Logo Principal** (enviar arquivo PNG transparente, 512x512px)
- [ ] **Logo Horizontal** (se disponível)
- [ ] **Logo Vertical** (se disponível)
- [ ] **Ícone/Favicon** (quadrado, 512x512px)

### Cores da Marca
| Elemento | Cor (HEX) | Exemplo |
|----------|-----------|---------|
| **Cor Primária** | #______ | |
| **Cor Secundária** | #______ | |
| **Cor de Destaque** | #______ | |
| **Cor de Texto** | #______ | (geralmente escuro) |
| **Cor de Fundo** | #______ | (geralmente claro) |

**📎 Anexar:** Manual de identidade visual (se disponível)

---

## 📱 WHATSAPP BUSINESS API

> ⚠️ **IMPORTANTE:** Todas essas informações são obtidas no Meta Business Suite  
> Acesse: https://business.facebook.com/

### Conta e Números
| Campo | Informação |
|-------|-----------|
| **Número do WhatsApp Business** | **+55** ( __ ) _____ - ____ |
| **Business Account ID** | |
| **Phone Number ID** | |
| **Access Token** | |

**⚠️ O Access Token precisa ser:**
- [ ] Token de **longa duração** (permanent)
- [ ] Com permissões: `whatsapp_business_messaging`, `whatsapp_business_management`

### Templates Aprovados pela Meta

**Você já possui templates aprovados pela Meta?**
- [ ] Sim → Preencher tabela abaixo
- [ ] Não → Precisaremos criar e aprovar (prazo: 3-5 dias úteis)

#### Template 1: Ativação/Boas-vindas
| Campo | Informação |
|-------|-----------|
| **Nome do Template** | |
| **Categoria** | [ ] Marketing [ ] Transacional |
| **Idioma** | [ ] Português (BR) |
| **Texto Completo** | |
| **Parâmetros (variáveis)** | {{1}} = ___________<br>{{2}} = ___________<br>{{3}} = ___________ |
| **Botões (se houver)** | |

#### Template 2: Renovação
| Campo | Informação |
|-------|-----------|
| **Nome do Template** | |
| **Categoria** | [ ] Marketing [ ] Transacional |
| **Texto Completo** | |
| **Parâmetros** | |

#### Template 3: Lembrete D-7 (7 dias antes do vencimento)
| Campo | Informação |
|-------|-----------|
| **Nome do Template** | |
| **Categoria** | [ ] Marketing [ ] Transacional |
| **Texto Completo** | |
| **Parâmetros** | |

#### Template 4: Lembrete D-0 (dia do vencimento)
| Campo | Informação |
|-------|-----------|
| **Nome do Template** | |
| **Categoria** | [ ] Marketing [ ] Transacional |
| **Texto Completo** | |
| **Parâmetros** | |

#### Template 5: Lembrete D+30 (30 dias após vencimento)
| Campo | Informação |
|-------|-----------|
| **Nome do Template** | |
| **Categoria** | [ ] Marketing [ ] Transacional |
| **Texto Completo** | |
| **Parâmetros** | |

---

## 🗄️ BANCO DE DADOS

**Onde será hospedado o banco de dados?**
- [ ] Cliente fornecerá (preencher abaixo)
- [ ] Contratar novo serviço (sugiro: Supabase, Neon, Railway)

### Dados de Conexão (se cliente fornecer)
| Campo | Informação |
|-------|-----------|
| **Provedor** | [ ] AWS RDS [ ] PostgreSQL próprio [ ] Supabase [ ] Outro: ______ |
| **Host/IP** | |
| **Porta** | (padrão: 5432) |
| **Nome do Banco** | |
| **Usuário** | |
| **Senha** | |
| **SSL Habilitado?** | [ ] Sim [ ] Não |

---

## 🌐 HOSPEDAGEM E DOMÍNIO

### Domínio
| Campo | Informação |
|-------|-----------|
| **Domínio Principal** | www.________________________.com.br |
| **Subdomínio Desejado** | sistema._______________________.com.br<br>ou<br>app._______________________.com.br |
| **Acesso ao Painel DNS** | [ ] Sim, vou fornecer [ ] Não, vocês gerenciam |
| **Provedor de DNS** | [ ] Registro.br [ ] Cloudflare [ ] GoDaddy [ ] Outro: ______ |

### Hospedagem da Aplicação
**Onde será hospedado o sistema?**
- [ ] **Vercel** (recomendado, grátis até certo limite)
- [ ] **VPS própria** (preencher abaixo)
- [ ] **AWS / Azure / Google Cloud**
- [ ] **Outro:** ___________________

#### Se VPS Própria:
| Campo | Informação |
|-------|-----------|
| **IP do Servidor** | |
| **Sistema Operacional** | [ ] Ubuntu [ ] Debian [ ] CentOS [ ] Outro: ______ |
| **Acesso SSH** | Usuário: __________ / Porta: ______ |
| **Node.js Instalado?** | [ ] Sim (versão: _____) [ ] Não |
| **Nginx/Apache Instalado?** | [ ] Sim [ ] Não |

---

## 💼 REGRAS DE NEGÓCIO

### Produto/Serviço
| Campo | Informação |
|-------|-----------|
| **Nome do Produto** | [ ] Convênio [ ] Cartão [ ] Plano [ ] Outro: _____________ |
| **Ciclo de Renovação** | [ ] Mensal [ ] Trimestral [ ] Semestral [ ] Anual [ ] Outro: ____ dias |
| **Permite Renovação Antecipada?** | [ ] Sim [ ] Não |
| **Desconto para Renovação Antecipada?** | [ ] Sim: ___% [ ] Não |

### Lembretes de Vencimento
**Quando enviar lembretes automáticos por WhatsApp?**
- [ ] **D-15** (15 dias antes do vencimento)
- [ ] **D-10** (10 dias antes)
- [ ] **D-7** (7 dias antes) ✅ Recomendado
- [ ] **D-5** (5 dias antes)
- [ ] **D-3** (3 dias antes)
- [ ] **D-0** (no dia do vencimento) ✅ Recomendado
- [ ] **D+7** (7 dias após vencimento)
- [ ] **D+15** (15 dias após)
- [ ] **D+30** (30 dias após) ✅ Recomendado
- [ ] **Outro:** _______________

### Documentos Obrigatórios para Cadastro
- [ ] RG
- [ ] CPF
- [ ] Comprovante de Residência
- [ ] Foto 3x4
- [ ] Outro: ___________________

### Valores e Planos
| Tipo de Plano | Valor Mensal | Valor Anual | Observações |
|---------------|--------------|-------------|-------------|
| **Plano 1:** _______ | R$ _______ | R$ _______ | |
| **Plano 2:** _______ | R$ _______ | R$ _______ | |
| **Plano 3:** _______ | R$ _______ | R$ _______ | |

---

## 👥 USUÁRIOS DO SISTEMA

### Perfis de Acesso Necessários
- [ ] **Administrador** (acesso total)
  - Quantidade inicial: ___ usuários
- [ ] **Atendente** (cadastro de pacientes, renovações)
  - Quantidade inicial: ___ usuários
- [ ] **Gerente** (relatórios, visualização)
  - Quantidade inicial: ___ usuários
- [ ] **Outro:** _______________
  - Quantidade inicial: ___ usuários

### Usuário Administrador Inicial
| Campo | Informação |
|-------|-----------|
| **Nome Completo** | |
| **Email** | |
| **Senha Temporária** | (será solicitada troca no primeiro acesso) |

---

## 📧 CONFIGURAÇÕES DE EMAIL (Opcional)

**O sistema deve enviar emails?**
- [ ] Sim → Preencher abaixo
- [ ] Não (só WhatsApp)

| Campo | Informação |
|-------|-----------|
| **Servidor SMTP** | [ ] Gmail [ ] Outlook [ ] SendGrid [ ] Outro: ______ |
| **Host SMTP** | smtp._________________.com |
| **Porta** | [ ] 587 (TLS) [ ] 465 (SSL) |
| **Email Remetente** | |
| **Senha / App Password** | |

---

## 🔐 AUTENTICAÇÃO

### Métodos de Login Desejados
- [ ] **Email + Senha** (padrão)
- [ ] **Google** (Sign in with Google)
- [ ] **Facebook** (Sign in with Facebook)
- [ ] **Outro:** _______________

### Políticas de Senha
| Configuração | Valor |
|--------------|-------|
| **Tamanho Mínimo** | [ ] 6 [ ] 8 [ ] 10 caracteres |
| **Requer Letra Maiúscula?** | [ ] Sim [ ] Não |
| **Requer Número?** | [ ] Sim [ ] Não |
| **Requer Caractere Especial?** | [ ] Sim [ ] Não |
| **Expiração de Senha?** | [ ] Sim: a cada ___ dias [ ] Não |

---

## 📊 INTEGRAÇÕES ADICIONAIS

**O sistema precisa integrar com:**
- [ ] **Payment Gateway** (qual? ________________)
- [ ] **CRM** (qual? ________________)
- [ ] **ERP** (qual? ________________)
- [ ] **Sistema de Agenda** (qual? ________________)
- [ ] **Google Analytics**
- [ ] **Facebook Pixel**
- [ ] **Outra:** _______________

---

## 📅 CRONOGRAMA

| Etapa | Prazo Desejado |
|-------|----------------|
| **Configuração Inicial** | ___/___/______ |
| **Testes Internos** | ___/___/______ |
| **Homologação** | ___/___/______ |
| **Go Live (Produção)** | ___/___/______ |

---

## 💰 ORÇAMENTO E FATURAMENTO

| Item | Informação |
|------|-----------|
| **Razão Social para NF** | |
| **CNPJ** | |
| **Endereço de Cobrança** | |
| **Email para NF** | |

---

## 📝 OBSERVAÇÕES E REQUISITOS ESPECIAIS

```
(Use este espaço para descrever qualquer necessidade específica, 
funcionalidade customizada ou observação importante)






```

---

## ✅ CHECKLIST DE ANEXOS

**Por favor, anexar os seguintes arquivos:**
- [ ] Logo (PNG transparente, 512x512px)
- [ ] Manual de Identidade Visual (PDF)
- [ ] Templates do WhatsApp (prints ou documento)
- [ ] Exemplos de documentos que serão digitalizados
- [ ] Prints de telas de sistema atual (se houver migração)
- [ ] Lista de parceiros/conveniados (Excel/CSV)
- [ ] Outros: ___________________

---

## 📩 ENVIO DO FORMULÁRIO

**Enviar formulário preenchido + anexos para:**
- **Email:** ___________________________________
- **WhatsApp:** ___________________________________
- **Prazo:** ___________________________________

---

## ⚠️ IMPORTANTE

1. ✅ Quanto mais detalhado o preenchimento, mais rápida será a implementação
2. ✅ Informações incompletas podem gerar atrasos no projeto
3. ✅ Dados sensíveis (senhas, tokens) devem ser enviados por canal seguro
4. ✅ Em caso de dúvida em algum campo, deixar em branco e marcar para discussão

---

**Preenchido por:** ________________________________  
**Data:** ___/___/______  
**Assinatura:** ________________________________

---

**Para uso interno:**
- [ ] Formulário recebido
- [ ] Informações validadas
- [ ] Projeto criado no sistema
- [ ] Cronograma acordado
- [ ] Desenvolvimento iniciado



