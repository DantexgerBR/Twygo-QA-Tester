// Fixture: ignora SIGTERM (simula um processo que nao morre limpo do kill()).
// Tem uma rede de seguranca (auto-exit em 1.5s) pra nao deixar um processo orfao rodando pra sempre.
process.on('SIGTERM', () => {});
setTimeout(() => process.exit(0), 1500); // mantem o processo vivo (e o event loop) ate o auto-exit
