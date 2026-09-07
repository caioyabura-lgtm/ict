# Atualização institucional — 7 de setembro de 2026

Atualização incremental da versão aprovada, reutilizando tipografia, componentes, animações, hero e experiência 3D.

## Arquivos

- Alterados: `index.html`, `assets/css/styles.css`, `assets/css/institutional.css` e `verify_portal.py`.
- Adicionados: `assets/js/cms.js`, `assets/images/cooperativa-oficial.png` e este relatório.
- Evidências atualizadas: `verification/results.json`, `verification/portal-1440.png`, `verification/portal-390.png`, `verification/model-before.png` e `verification/model-after.png`.
- Backup anterior às alterações: `backups/20260907-institucional/`, com HTML, assets e verificação original. Para rollback, restaurar o HTML e os assets dessa pasta; o CMS novo deixará de ser referenciado.

## Conteúdos e classificação

| Estado | Entrega |
| --- | --- |
| IMPLEMENTADO | Identidade da Cooperativa, logo oficial no header e footer, navegação, textos institucionais, valores, contato, CTAs externos e conteúdo local de fallback. Experiência 3D existente preservada. |
| VISUAL | Grade plural de iniciativas, arquitetura institucional, projetos, mural de inovação aberta, fomento e publicações. Novas frentes explicitamente identificadas como futuras. |
| DEMONSTRATIVO | Atlas SVG com seis pontos simbólicos, legenda, conexões e aviso de dados ilustrativos; cards de oportunidades sem chamadas reais. |
| PREVISTO | CMS WordPress, governança editorial, edição descentralizada e estrutura de dados do Atlas. |
| CONTRATÁVEL | Atlas operacional, georreferenciamento, filtros, dashboard, indicadores e gestão avançada, sujeitos a desenvolvimento e financiamento específicos. |

A trajetória existente foi preservada: 2008, 2022, 2023 e 2026. O NTE aparece como uma iniciativa entre outras possibilidades, com suas oito áreas e link interno “Conhecer a iniciativa”.

## WordPress e fallback

WordPress **apenas preparado, não conectado**. Nenhum endpoint utilizado. Os seis endpoints são `null` e `enabled` é `false`. A interface `CMS.get(tipo)` retorna `null`, sem requisições. Não há renderizador remoto nem ativação automática por preenchimento de URL.

O conteúdo de fallback está diretamente no HTML e não depende de CMS. Uma conexão futura exige validar URL, endpoint, CORS, estrutura dos campos, sanitização e comportamento de falha antes de implementar o piloto. O CMS não controla Three.js, navegação ou apresentação.

## Verificação

Verificação em Chrome com Playwright, em 1440, 1024, 768, 390 e 320 px: sem overflow horizontal, âncoras válidas, IDs únicos, menu responsivo e fechamento por Escape. Preferência por movimento reduzido respeitada; nenhum erro JavaScript de página.

O GLB carregou e a renderização mudou após interação com cursor, clique e roda. `assets/js/model.js` e o GLB são idênticos ao backup, incluindo câmera, iluminação, animação e zoom. `assets/js/main.js` permanece intacto.

Os três CTAs do Google Forms mantêm `target="_blank"` e `rel="noopener noreferrer"`. A abertura real foi verificada: “Cadastro na Rede de Pesquisadores”. Nenhum cadastro foi enviado.

Contato atualizado para **ICTSynapse@empreendedores.coop.br**, incluindo links mailto. Não foi enviado e-mail nem verificada a entrega da caixa postal.

Crédito preservado: **Desenvolvimento Web, Interação 3D e Experiência Digital — Caio Rodrigues**, com o link profissional solicitado.

A logo foi obtida do arquivo oficial utilizado pelo site da Cooperativa, sem redesenho: https://empreendedores.coop.br/wp-content/uploads/2023/09/logo-cooperativa-dos-empreendedores-oficial-285x95.png . Mantida a proporção original, com fundo branco e respiro para leitura.

O Atlas é exclusivamente conceitual. Não foram implementados banco de dados, geolocalização, georreferenciamento, dashboard, autenticação, busca, filtros operacionais ou integrações adicionais. Nenhuma publicação ou implantação remota foi realizada.
