import { Caso, Processador, Processo } from './schema';
import { inspect } from 'util';

const processadores: Processador[] = new Array(10).fill(null).map(() => new Processador())

// let a = new Processo('teste', 30)
// processadores[4].executar(a)


// for (let i = 0; i < 50; i++) {
//   processadores.forEach(cpu => {
//     cpu.tick()
//   });
//   console.log(processadores)
// }

console.log(processadores)

// let caso = new Caso('caso100.txt')
// caso = new Caso('caso200.txt')
// caso = new Caso('caso500.txt')
// caso = new Caso('caso1000.txt')
// caso = new Caso('caso2000.txt')
// caso = new Caso('caso5000.txt')
// caso = new Caso('caso10000.txt')
// console.dir(inspect(caso, {showHidden: false, depth: null}))
