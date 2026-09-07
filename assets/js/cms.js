/* CMS desacoplado: deliberadamente inativo até validação de URL, CORS e campos.
 * Contrato futuro: adaptar a resposta editorial a cards antes de ativar o piloto.
 * O HTML é o fallback permanente. Nenhuma requisição ou mutação nesta etapa.
 */
window.CMS = Object.freeze({
    enabled: false,
    endpoints: Object.freeze({
        projetos: null,
        oportunidades: null,
        fomento: null,
        publicacoes: null,
        parceiros: null,
        iniciativas: null
    }),
    async get(tipo) {
        if (!Object.prototype.hasOwnProperty.call(this.endpoints, tipo)) return null;
        return null;
    }
});
