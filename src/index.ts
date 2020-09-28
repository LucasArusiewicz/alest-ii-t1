import { Caso, Processador, Processo, Arvore } from './schema'

const args = process.argv

if (args.length !== 4) {
  throw new Error('Argumentos inválidos de inicialização.\nExemplo: node . casoTeste.txt MIN')
}

if (args[3] !== 'MIN' && args[3] !== 'MAX') {
  throw new Error('Política de escolha inválida.\nArgumentos válidos: MIN, MAX')
}

const caso = new Caso(args[2])
const processadores = Processador.pool(caso.numProc)
const arvore = new Arvore(args[3] === 'MIN')
Arvore.populaArvore(arvore, caso)

let ticksTotal = 0
let tarefasPendentes = arvore.getPrioridade()
while (tarefasPendentes.length || processadores.some(cpu => !cpu.estaLivre())) {
  // Entrada de tarefas
  processadores.forEach(cpu => {
    if (cpu.estaLivre()) {
      const no = tarefasPendentes.shift()
      if (no) {
        arvore.del(no)
        cpu.executar(new Processo(no))
      }
    }
  })

  // Execução das tarefas
  processadores.forEach(cpu => {
    const processoFinalizado = cpu.tick()
    if (processoFinalizado) {
      tarefasPendentes = arvore.getPrioridade()
    }
  })
  ticksTotal++
}

console.log({ caso: caso.nome, proc: caso.numProc, tarefas: caso.tarefas.length, ticksTotal })
