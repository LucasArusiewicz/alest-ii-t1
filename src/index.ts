import { Caso, Processador, Processo, Arvore } from './schema'

const args = process.argv

if (args.length !== 4) {
  throw new Error('Argumentos inválidos de inicialização.\nExemplo: node . casoTeste.txt MIN')
}

if (args[3] !== 'MIN' && args[3] !== 'MAX') {
  throw new Error('Política de escolha inválida.\nArgumentos válidos: MIN, MAX')
}

console.time('Leitura do Arquivo')
const caso = new Caso(args[2])
console.timeEnd('Leitura do Arquivo')
const processadores = Processador.pool(caso.numProc)

console.time('Montagem da Árvore')
const arvore = new Arvore(args[3] === 'MIN')
Arvore.populaArvore(arvore, caso)
console.timeEnd('Montagem da Árvore')

console.time('Cálculo de Tempo de Execução das Tarefas')
let ticksTotal = 0
let tarefasPendentes = arvore.getPrioridade()
while (tarefasPendentes.length || processadores.some(cpu => !cpu.estaLivre())) {
  // Para cada Processador ocioso, buscar tarefa
  processadores.forEach(cpu => {
    if (cpu.estaLivre()) {
      const no = tarefasPendentes.shift()
      if (no) {
        // Remover Tarefa da Árvore
        arvore.del(no)

        // Iniciar tarefa
        cpu.executar(new Processo(no))
      }
    }
  })

  // Para cada Processador, executar tick
  processadores.forEach(cpu => {
    const processoFinalizado = cpu.tick()

    // Caso Processo tenha finalizado, atualizar lista de tarefas
    if (processoFinalizado) {
      tarefasPendentes = arvore.getPrioridade()
    }
  })
  ticksTotal++
}
console.timeEnd('Cálculo de Tempo de Execução das Tarefas')

console.log({ caso: caso.nome, proc: caso.numProc, tarefas: caso.tarefas.length, ticksTotal })
