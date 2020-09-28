import { Caso, Processador, Arvore } from './schema'

// let a = new Processo('teste', 30)
// processadores[4].executar(a)

// for (let i = 0; i < 50; i++) {
//   processadores.forEach(cpu => {
//     cpu.tick()
//   });
//   console.log(processadores)
// }

const casoTeste = new Caso('caso100.txt')
const processadores = Processador.pool(casoTeste.numProc)
const arvore = new Arvore(true)
Arvore.populaArvore(arvore, casoTeste)

let tarefasExecutadas = 0
let tempoTotal = 0
let tarefasPendentes = arvore.getPrioridade()
while (tarefasPendentes.length) {
  const t = tarefasPendentes[0]

  arvore.del(t)
  // console.log(t.valor)
  tarefasExecutadas++
  tempoTotal += parseInt(t.valor.split('_')[1])

  tarefasPendentes = arvore.getPrioridade()
  // console.log(tarefasPendentes)
}

console.log({ tarefasExecutadas, tempoTotal })

// console.log(processadores)
// console.log(arvore)
// console.log(arvore.getPrioridade())
// arvore.del(arvore.pesquisaValor('ab_70'))
// console.log(arvore.getPrioridade())
// arvore.del(arvore.pesquisaValor('bbn_214'))
// console.log(arvore.getPrioridade())
// arvore.del(arvore.pesquisaValor('lu_428'))
// console.log(arvore.getPrioridade())
// arvore.del(arvore.pesquisaValor('ac_475'))
// console.log(arvore.getPrioridade())
// arvore.del(arvore.pesquisaValor('evdpw_387'))
// console.log(arvore.getPrioridade())
// arvore.del(arvore.pesquisaValor('gh_225'))
// console.log(arvore.getPrioridade())
// arvore.del(arvore.pesquisaValor('evdpw_387'))
console.log('fim')

// let caso = new Caso('caso100.txt')
// caso = new Caso('caso200.txt')
// caso = new Caso('caso500.txt')
// caso = new Caso('caso1000.txt')
// caso = new Caso('caso2000.txt')
// caso = new Caso('caso5000.txt')
// caso = new Caso('caso10000.txt')
// console.dir(inspect(caso, {showHidden: false, depth: null}))
