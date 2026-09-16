export const dict = {
  "profileImport.mode": "Modo de importação",
  "profileImport.chats": "Somente conversas",
  "profileImport.everything": "Tudo (configuração completa)",
  "profileImport.description":
    "Copia sua configuração compatível do OpenCode para um perfil do Classic desktop vazio: conversas, credenciais de provedores, contas na nuvem, permissões, configuração global, agentes, skills, plugins, planos, snapshots e arquivos de espaços de trabalho. A origem permanece inalterada. A pré-visualização não executa comandos importados nem contata provedores.",
  "profileImport.boundaries":
    "Feche primeiro o OpenCode e pare de editar seus arquivos. As pastas de projetos fora do armazenamento do OpenCode permanecem em seus caminhos originais. Variáveis de ambiente, ferramentas instaladas no sistema e preferências de janela do desktop upstream não são copiadas. Registros, caches e bloqueios de processo são regenerados. Provedores OAuth podem exigir um novo login. Pastas personalizadas são selecionadas nesta ordem: dados, configuração e depois estado.",
  "profileImport.detect": "Pré-visualizar a configuração padrão",
  "profileImport.browse": "Escolher pastas da configuração",
  "profileImport.busy":
    "Validando ou preparando a configuração completa. Mantenha o Classic aberto até isso terminar.",
  "profileImport.cancelled":
    "Nenhuma origem compatível foi encontrada, ou a seleção de pastas foi cancelada.",
  "profileImport.staged":
    "A configuração está preparada e verificada. Reinicie o Classic para ativá-la antes que o servidor dele inicie. Não adicione dados ao Classic antes de reiniciar; a ativação verifica novamente que o destino está vazio.",
  "profileImport.activated":
    "A configuração completa foi ativada com sucesso. Suas pastas de projetos permanecem disponíveis em seus caminhos originais; os espaços de trabalho internos importados têm cópias independentes.",
  "profileImport.data": "Pasta de dados de origem",
  "profileImport.config": "Pasta de configuração de origem",
  "profileImport.state": "Pasta de estado de origem",
  "profileImport.providers": "Credenciais de provedores salvas",
  "profileImport.accounts": "Contas na nuvem",
  "profileImport.workspaces": "Espaços de trabalho",
  "profileImport.files": "Arquivos e links",
  "profileImport.bytes": "Tamanho da cópia (bytes)",
  "profileImport.plugins": "Plugins configurados",
  "profileImport.mcp": "Entradas MCP",
  "profileImport.commands": "Comandos de projeto",
  "profileImport.permissions": "Registros de permissão",
  "profileImport.pending": "Prompts pendentes",
  "profileImport.git": "Checkouts do Git",
  "profileImport.consent":
    "Fechei o OpenCode e confio nesta configuração completa, incluindo credenciais, atualização de contas, dependências, plugins, servidores MCP, comandos de projeto, hooks do Git e permissões existentes. Estes podem ser executados durante o uso normal após a ativação. Os prompts pendentes permanecem na fila até serem retomados.",
  "profileImport.confirm": "Preparar a configuração completa",
  "profileImport.restart": "Reiniciar e ativar a configuração",
  "profileImport.error.unavailable":
    "A importação completa requer o servidor Linux desktop integrado e configuração baseada em arquivos. Configurações ou sobrescritas de autenticação fornecidas pelo ambiente devem ser removidas antes de importar.",
  "profileImport.error.nonempty":
    "O Classic já contém dados de configuração. A importação completa não os sobrescreve. Use Somente conversas para mesclar conversas compatíveis, ou comece com um perfil do Classic vazio.",
  "profileImport.error.incompatible":
    "O esquema do banco de dados de origem não corresponde a esta versão do Classic. A importação completa requer uma configuração SQLite compatível; nenhuma migração da origem foi tentada.",
  "profileImport.error.invalid":
    "Não foi possível validar a configuração. Verifique as permissões de arquivo, a integridade do banco de dados e a sintaxe da configuração. O perfil do Classic em execução não foi substituído.",
  "profileImport.error.changed":
    "A origem mudou ou esta pré-visualização expirou. Feche o OpenCode e outros processos de escrita e faça a pré-visualização novamente.",
  "profileImport.error.busy":
    "Outra importação, um bloqueio de arquivo ativo ou uma ativação pendente impede esta operação. Feche o OpenCode e reinicie o Classic antes de tentar novamente.",
  "profileImport.liveWarning":
    "O OpenCode parece estar em execução agora. O banco de dados dele muda continuamente, então a preparação pode falhar. Feche o OpenCode (todas as janelas) e pare os servidores dele antes de confirmar, para uma importação confiável.",
  "profileImport.detail.count": "Itens afetados: {{count}}",
  "profileImport.materialized": "Links externos copiados",
  "profileImport.skipped": "Arquivos de execução ignorados",
  "profileImport.error.source-busy":
    "A origem está sendo gravada continuamente (provavelmente há uma instância do OpenCode em execução). Feche o OpenCode e os servidores dele e faça a pré-visualização e a confirmação novamente.",
  "profileImport.error.links":
    "A configuração contém um link que não pode ser copiado: um ciclo de symlinks ou um link dentro de metadados do Git onde as cópias devem permanecer exatas.",
  "profileImport.error.git-objects":
    "Os metadados do Git da configuração usam um layout não suportado (entradas alternates, ponteiros de worktree ou repositórios de objetos que não podem ser privatizados com segurança).",
  "profileImport.error.special-files":
    "A configuração contém nós de dispositivo ou outros arquivos especiais que não podem ser copiados com segurança.",
  "profileImport.error.limit":
    "A configuração excede o limite de importação (50 GiB ou 500.000 itens). Remova arquivos de backup grandes ou restrinja as pastas e faça a pré-visualização novamente.",
  "profileImport.error.oversized-file":
    "Um arquivo de configuração ou metadados excede o limite de leitura dele (64 MB para configurações, 16 MB para metadados do Git). Divida ou reduza o arquivo e faça a pré-visualização novamente.",
  "profileImport.error.unsupported":
    "Esta configuração contém links não suportados, alternates de objetos do Git cíclicos, arquivos especiais ou excede o limite de importação (50 GiB / 500.000 itens). Symlinks externos devem ser materializados antes da importação; os arquivos de origem não foram alterados.",
  "profileImport.error.space":
    "Não há espaço livre em disco suficiente para preparar esta configuração. Libere espaço e faça a pré-visualização novamente.",
  "chatImport.tab": "Importação de conversas",
  "chatImport.title": "Importar conversas do OpenCode",
  "chatImport.description":
    "O OpenCode Classic Desktop mantém um banco de dados de conversas separado. Pré-visualize e copie conversas locais compatíveis do OpenCode sem alterar a origem nem substituir as conversas existentes do Classic. Você pode voltar aqui pelas configurações a qualquer momento.",
  "chatImport.scope":
    "Feche o OpenCode antes de importar. Isto copia conversas locais concluídas e o histórico delas. Conversas em fila, em andamento e de espaços de trabalho são excluídas. Credenciais, permissões, comandos de projeto, arquivos externos e snapshots de desfazer não são importados. Entre separadamente e mantenha as pastas dos seus projetos em seus caminhos originais.",
  "chatImport.localOnly":
    "Selecione o servidor desktop local integrado para importar conversas. Conexões remotas e de servidor em segundo plano não são suportadas por este importador.",
  "chatImport.detect": "Verificar o banco de dados padrão do OpenCode",
  "chatImport.browse": "Escolher arquivo de banco de dados",
  "chatImport.confirm": "Importar conversas elegíveis",
  "chatImport.busy":
    "Verificando ou importando conversas. Aguarde antes de fechar o app.",
  "chatImport.noSource":
    "Nenhum banco de dados foi encontrado ou selecionado. Escolha seu arquivo .db do OpenCode para continuar.",
  "chatImport.complete":
    "Importação concluída. Abra a pasta do projeto original para encontrar as conversas dele. Repetir uma importação ignora IDs de conversa já presentes no Classic.",
  "chatImport.source": "Banco de dados de origem",
  "chatImport.destination": "Banco de dados do Classic",
  "chatImport.total": "Conversas na origem",
  "chatImport.eligible": "Prontas para importar",
  "chatImport.existing": "Já presentes",
  "chatImport.excluded": "Excluídas (em fila, em andamento ou espaço de trabalho)",
  "chatImport.imported": "Importadas",
  "chatImport.error.unavailable":
    "A importação está disponível apenas para o servidor desktop Linux integrado depois que ele termina de iniciar.",
  "chatImport.error.incompatible":
    "Os bancos de dados têm esquemas diferentes ou não suportados. Use versões compatíveis e atualizadas do OpenCode e do Classic e faça a pré-visualização novamente. Armazenamento JSON legado não é suportado; a origem não foi migrada.",
  "chatImport.error.invalid":
    "Não foi possível ler ou validar o banco de dados. Verifique o arquivo selecionado, as permissões e o espaço em disco disponível. Uma importação não confirmada é revertida; faça a pré-visualização novamente antes de tentar de novo.",
  "chatImport.error.sameFile":
    "Origem e destino são o mesmo banco de dados. Não é necessária nenhuma cópia.",
  "chatImport.error.conflict":
    "IDs de projeto ou de mensagem em conflito impediram esta importação. Nenhuma importação parcial foi confirmada. As conversas existentes do Classic foram preservadas.",
  "chatImport.error.busy":
    "O banco de dados está ocupado ou a operação demorou demais. Feche o OpenCode, aguarde outras importações terminarem e faça a pré-visualização novamente. Uma nova tentativa ignora conversas já confirmadas.",
  "chatImport.error.expired":
    "Esta pré-visualização expirou ou a origem dela mudou. Faça a pré-visualização do banco de dados novamente antes de importar.",
}
