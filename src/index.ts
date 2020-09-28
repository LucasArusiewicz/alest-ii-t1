import { Caso, Processador, Processo, Arvore } from './schema'

const casoTeste = new Caso('casoTeste.txt')
const processadores = Processador.pool(casoTeste.numProc)
const arvore = new Arvore(false)
Arvore.populaArvore(arvore, casoTeste)

let tarefasExecutadas = 0
let tempoTotal = 0
let tarefasPendentes = arvore.getPrioridade()
while (tarefasPendentes.length || processadores.some(cpu => !cpu.estaLivre())) {
  processadores.forEach(cpu => {
    if (cpu.estaLivre()) {
      const no = tarefasPendentes.shift()
      if (no) {
        arvore.del(no)
        cpu.executar(new Processo(no))
      }
    }
  })

  processadores.forEach(cpu => {
    const processoFinalizado = cpu.tick()
    if (processoFinalizado) {
      tarefasPendentes = arvore.getPrioridade()
      tarefasExecutadas++
    }
  })
  tempoTotal++
}

console.log({ tarefasExecutadas, tempoTotal })
