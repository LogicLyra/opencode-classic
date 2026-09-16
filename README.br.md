<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Logo do OpenCode">
    </picture>
  </a>
</p>
<p align="center">O agente de programação com IA de código aberto.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> O OpenCode Classic é um fork não oficial focado em Linux que acompanha o upstream, usa o layout clássico do desktop por padrão e mantém o layout redesenhado disponível nas configurações. Seus lançamentos e atualizador são mantidos de forma independente em [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). As seções específicas do fork e os links de instalação de cada README traduzido são mantidos em sincronia com o inglês; o conteúdo mais profundo é herdado do upstream e pode estar atrasado.


<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### Traga sua configuração do OpenCode

O OpenCode Classic Desktop usa um perfil separado para o servidor integrado.
**Configurações > Importação de conversas** e o diálogo de primeiro início
oferecem **Somente conversas** e **Tudo (configuração completa)**. Para
**Somente conversas**, aplica-se o seguinte comportamento de mesclagem:
No primeiro início, ou em **Configurações > Importação de conversas**, escolha
**Verificar o banco de dados padrão do OpenCode** ou selecione um arquivo
`.db`. Feche o OpenCode primeiro, revise a origem, o destino e as contagens e
escolha **Importar conversas elegíveis**.

- A origem padrão é `$XDG_DATA_HOME/opencode/opencode.db`, normalmente
  `~/.local/share/opencode/opencode.db`. Escolha um arquivo para caminhos
  personalizados ou bancos de dados do canal de desenvolvimento. O destino é o
  banco de dados do servidor de desktop integrado ativo, no diretório
  `sidecar` do perfil de desktop do Classic. Este importador não oferece
  suporte a conexões remotas nem a servidores experimentais em segundo plano.
- O importador aceita esquemas SQLite e históricos de migração
  correspondentes. Ele não migra arquivos de origem nem importa armazenamento
  JSON legado. Se as verificações de compatibilidade falharem, use versões
  compatíveis e atualizadas do OpenCode e do Classic e faça a pré-visualização
  novamente.
- As conversas locais concluídas mantêm seus IDs, títulos, marcações de tempo,
  mensagens, partes, histórico v2, tarefas e caminhos de projeto originais. IDs
  de conversas já existentes são ignorados por completo; importar de novo não
  atualiza uma conversa já importada. A origem é somente leitura, incluindo seu
  histórico WAL, e cada importação é confirmada atomicamente.
- Conversas com prompts em fila, trabalho inacabado ou alocação explícita em
  espaço de trabalho são excluídas e contabilizadas. A importação nunca inicia
  um prompt nem executa um comando. Credenciais, estado das contas, permissões,
  comandos de projeto, propriedade de compartilhamentos, anexos externos,
  snapshots do Git e rascunhos do desktop não são copiados. Entre separadamente
  e mantenha as pastas dos seus projetos em seus caminhos originais. Snapshots
  históricos de desfazimento não estão disponíveis; os dados de anexos
  incorporados permanecem na transcrição, enquanto os arquivos externos devem
  continuar existindo.
- Abra a pasta do projeto original no Classic para ver as conversas
  importadas. É uma cópia única, não uma sincronização contínua entre
  aplicativos.

#### Tudo (configuração completa)

Feche primeiro o OpenCode e interrompa outros processos de escrita. Escolha
**Pré-visualizar a configuração padrão**, ou **Escolher pastas da
configuração** e selecione as pastas do OpenCode de **dados**,
**configuração** e **estado**. Normalmente ficam em
`~/.local/share/opencode`, `~/.config/opencode` e `~/.local/state/opencode`;
substituições XDG são respeitadas. Revise as contagens, reconheça que confia
na configuração, confirme no diálogo nativo e reinicie o Classic para ativar o
perfil preparado.

- Exige um perfil Linux integrado do Classic vazio. Conversas, provedores,
  configurações personalizadas, contas e projetos registrados existentes nunca
  são sobrescritos. Arquivos padrão de configuração/plugin gerados são
  reconhecidos como estado de inicialização.
- Copia todas as 19 tabelas do banco de dados do aplicativo, o `auth.json` dos
  provedores, contas na nuvem, credenciais de integrações, permissões,
  metadados de compartilhamento, arquivos de configuração (incluindo JSONC),
  agentes, skills, plugins, estado, planos, saída de ferramentas, arquivos de
  espaços de trabalho e snapshots. Prompts pendentes permanecem em fila; a
  importação não os executa.
- Caminhos de projetos externos permanecem inalterados na mesma máquina.
  Caminhos internos, padrões de permissão e chaves de snapshot são
  remapeados. Worktrees vinculados recebem metadados Git privados, e os
  alternates de objetos de snapshot são materializados para que as cópias não
  dependam dos repositórios de objetos originais.
- O SQLite lê uma cópia privada do banco/WAL de origem. O banco de origem, o
  WAL e os arquivos de memória compartilhada permanecem inalterados. O
  preparo usa permissões privadas e um registro durável de propriedade. A
  ativação ocorre antes do início do servidor integrado e recupera
  renomeações de diretórios interrompidas. O perfil original vazio/de
  inicialização é retido sob `.profile-import-retained-<operation-id>` no
  perfil de desktop do Classic para inspeção; não é excluído automaticamente.
- As credenciais continuam sendo arquivos locais protegidos. A configuração
  completa também preserva o comportamento executável: atualização de contas,
  instalação de dependências, plugins, conexões MCP, comandos de projeto,
  além de hooks/auxiliares do Git e permissões concedidas podem entrar em
  vigor durante o uso normal após a ativação. Importe somente uma configuração
  em que você confie. A rotação de tokens OAuth pode exigir um novo login
  quando os dois aplicativos são usados.
- Logs, caches e bloqueios de processos são regenerados. Programas do sistema,
  variáveis de ambiente do shell, preferências de janela/barra lateral do
  desktop do upstream e rascunhos do desktop não são copiados. Os arquivos de
  projetos externos já estão compartilhados em seus caminhos originais. Abra a
  pasta do projeto original para acessar suas conversas.
- Exige histórico de migração e esquema SQLite correspondentes. A
  configuração completa atualmente lê `opencode.db`; substituições de banco de
  dados/configuração/autenticação fornecidas pelo ambiente devem ser
  removidas antes do uso. Armazenamentos somente JSON legados, referências
  cíclicas ou não suportadas a objetos Git, nós de dispositivo e perfis acima
  de 50 GiB ou 500.000 itens de inventário são recusados com um motivo
  específico. Symlinks externos são copiados integralmente (materializados);
  links quebrados, sockets e fifos são ignorados e contabilizados no
  resumo. Arquivos de configuração de até 64 MB são suportados. É necessário
  espaço adicional em disco para o preparo.
- Feche o OpenCode antes de importar. A pré-visualização avisa quando uma
  instância em execução é detectada, as cópias de snapshot são repetidas
  automaticamente e uma origem escrita continuamente relata um erro dedicado
  de ocupação pedindo que você a feche.

A CLI autônoma do Classic continua usando as raízes XDG padrão do OpenCode,
salvo se você as substituir. Seu comando `uninstall` preserva dados,
credenciais, configuração, cache e estado por padrão, inclusive com `--force`.
Excluir essas raízes compartilhadas requer `--remove-shared-data`;
`--keep-data` e `--keep-config` substituem esse pedido para suas respectivas
raízes. Revise os caminhos com `uninstall --dry-run`. O próprio desinstalador
do upstream ainda pode excluir dados compartilhados da CLI. O fork se recusa a
abrir bancos de dados com migrações desconhecidas; atualize o Classic em vez de
editar ou excluir um registro de migrações.

### Instalação

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> O pacote npm `opencode-ai` e os pacotes existentes do Homebrew, Scoop, Chocolatey, AUR e Nix distribuem o OpenCode upstream, não o OpenCode Classic.

### App desktop (BETA)

As compilações de desktop do OpenCode Classic suportam apenas Linux e estão disponíveis na [página de lançamentos do fork](https://github.com/LogicLyra/opencode-classic/releases).

| Plataforma | Download                                             |
| ---------- | ---------------------------------------------------- |
| Linux x64  | `opencode-classic-desktop-linux-*` (`.deb` ou `.rpm`) |

O AppImage não é distribuído intencionalmente. O Ubuntu 24.04 e mais recentes podem forçar AppImages do Electron a desativar a sandbox do Chromium sob a política AppArmor padrão; os formatos deb e RPM instalados preservam a integração de sandbox esperada pela distribuição.

Mantenedores podem reproduzir a verificação completa de compilação, empacotamento, deb instalado e lançamento visual com o [runbook de QA de lançamento em VM Linux](docs/linux-vm-qa.md).

#### Diretório de instalação

O script de instalação respeita a seguinte ordem de prioridade para o caminho de instalação:

1. `$OPENCODE_INSTALL_DIR` - Diretório de instalação personalizado
2. `$XDG_BIN_DIR` - Caminho em conformidade com a XDG Base Directory Specification
3. `$HOME/bin` - Diretório binário padrão do usuário (se existir ou puder ser criado)
4. `$HOME/.opencode/bin` - Padrão de reserva

```bash
# Exemplos
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

O OpenCode inclui dois agents integrados, que você pode alternar com a tecla `Tab`.

- **build** - Padrão, agent com acesso total para trabalho de desenvolvimento
- **plan** - Agent somente leitura para análise e exploração de código
  - Nega edições de arquivos por padrão
  - Pede permissão antes de executar comandos bash
  - Ideal para explorar codebases desconhecidas ou planejar mudanças

Também há um subagent **general** para buscas complexas e tarefas em várias etapas.
Ele é usado internamente e pode ser invocado com `@general` nas mensagens.

Saiba mais sobre [agents](https://opencode.ai/docs/agents).

### Documentação

Para mais informações sobre como configurar o OpenCode, [**veja nossa documentação**](https://opencode.ai/docs).

### Contribuir

Se você tem interesse em contribuir com o OpenCode, leia os [contributing docs](./CONTRIBUTING.md) antes de enviar um pull request.

### Construindo com OpenCode

Se você estiver trabalhando em um projeto relacionado ao OpenCode e estiver usando "opencode" como parte do nome (por exemplo, "opencode-dashboard" ou "opencode-mobile"), adicione uma nota no README para deixar claro que não foi construído pela equipe do OpenCode e não é afiliado a nós de nenhuma forma.

---

**Junte-se à nossa comunidade** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
