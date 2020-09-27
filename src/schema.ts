import fs from 'fs'

export class Tarefa {
  nome: string;
  tempo: number;

  constructor (text:string) {
    const info = text.trim().split('_')
    this.nome = info[0]
    this.tempo = parseInt(info[1])
  }
}

export class Caso {
  nome: string;
  numProc: number;
  tarefas: Array<Tarefa[]>;

  constructor (fileName:string) {
    const text = fs.readFileSync(`./src/casos/${fileName}`, 'utf8')
    const linhas = text.split('\n').filter(linha => linha.length)

    this.nome = fileName.split('.')[0]
    this.numProc = parseInt(linhas.shift()?.substr(7) || '')
    this.tarefas = []

    for (const linha of linhas) {
      if (!linha.length) continue

      const info = linha.split('->')
      this.tarefas.push([new Tarefa(info[0]), new Tarefa(info[1])])
    }
  }
}

export class Processo {
  nome: string;
  ticks: number;

  constructor (nome: string, ticks: number) {
    this.nome = nome
    this.ticks = ticks
  }

  toString (): string {
    return `${this.nome}_${this.ticks}`
  }
}

export class Processador {
  static numCores = 0;
  id: number;
  ticks: number;
  processo: Processo | null;

  constructor () {
    this.id = Processador.novoId()
    this.ticks = 0
    this.processo = null
  }

  static novoId (): number {
    return ++this.numCores
  }

  executar (processo: Processo): void {
    if (!this.estaLivre()) {
      throw new Error('Processador Ocupado!')
    }

    this.processo = processo
  }

  tick (): void {
    if (this.estaLivre()) return

    this.ticks++

    if (this.ticks === this.processo?.ticks) {
      console.log(`${this.processo.toString()} finalizado!`)
      this.processo = null
      this.ticks = 0
    }
  }

  estaLivre (): boolean {
    return !this.processo
  }

  ticksRestantes (): number {
    if (!this.processo) return 0
    return this.processo.ticks - this.ticks
  }
}
