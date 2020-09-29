import fs from 'fs'

export class Caso {
  nome: string;
  numProc: number;
  tarefas: Array<string>;

  constructor (fileName:string) {
    const text = fs.readFileSync(`./src/casos/${fileName}`, 'utf8')
    const linhas = text.split('\n')

    this.nome = fileName.split('.')[0]
    this.numProc = parseInt(linhas.shift()?.substr(7) || '')
    this.tarefas = []

    for (const linha of linhas) {
      if (!linha.length) continue
      this.tarefas.push(linha)
    }
  }
}

export class No {
  pai: No | null;
  valor: string;
  filhos: {[key: string]: No};
  constructor (valor?: string, pai?: No | null) {
    this.pai = pai || null
    this.valor = valor || '*'
    this.filhos = {}
  }

  addFilho (no: No): void {
    this.filhos[no.valor] = no
  }

  delFilho (no: No): void {
    delete this.filhos[no.valor]
  }

  pesquisaNoFilho (no: No): No | null {
    return this.filhos[no.valor]
  }
}

export class Arvore {
  raiz: No;
  indice: {[key: string]: No};
  fnPoliticaPrioridade: (a: No, b: No) => number;
  constructor (prioridadeMin?: boolean) {
    this.raiz = new No()
    this.indice = {}

    // Caso a política seja priorizar as menores tarefas
    if (prioridadeMin) {
      this.fnPoliticaPrioridade = (a: No, b: No) => {
        const [nomeA, tempoA] = a.valor.split('_')
        const [nomeB, tempoB] = b.valor.split('_')
        if (parseInt(tempoA) < parseInt(tempoB)) {
          return -1
        }
        if (parseInt(tempoA) > parseInt(tempoB)) {
          return 1
        }

        return nomeA.localeCompare(nomeB)
      }
    } else {
      this.fnPoliticaPrioridade = (a: No, b: No) => {
        const [nomeA, tempoA] = a.valor.split('_')
        const [nomeB, tempoB] = b.valor.split('_')
        if (parseInt(tempoA) > parseInt(tempoB)) {
          return -1
        }
        if (parseInt(tempoA) < parseInt(tempoB)) {
          return 1
        }

        return nomeB.localeCompare(nomeA)
      }
    }
  }

  static populaArvore (arvore: Arvore, caso: Caso): void {
    caso.tarefas.forEach(linha => {
      const [pai, filho] = linha.split(' -> ')
      arvore.add(new No(filho), new No(pai))
    })
  }

  add (filho: No, pai: No): void {
    // Pesquisa se Nós já existem na Árvore
    let refPai = this.pesquisaNo(pai)
    let refFilho = this.pesquisaNo(filho)

    // Caso Pai não exista, adiciona  Nó na raiz
    if (!refPai) {
      refPai = pai
      this.raiz.addFilho(refPai)
      refPai.pai = this.raiz
      this.addIndice(refPai)
    }

    // Caso filho não exista, pega referência do Nó recebido por parâmetro
    if (!refFilho) {
      refFilho = filho
    }

    // Caso filho já exista na raiz, remove referência da raiz
    if (this.raiz.pesquisaNoFilho(refFilho)) {
      this.raiz.delFilho(refFilho)
    }

    // Atualiza pai e filho
    refPai.addFilho(refFilho)
    refFilho.pai = refPai

    // Adiciona Índice
    this.addIndice(refFilho)
  }

  del (no: No | null): void {
    if (!no) return
    if (!no.pai) return

    // Armazena referência do Pai do Nó a ser removido
    const pai = no.pai

    // Remove Nó
    pai.delFilho(no)

    // Remove do Índice
    this.delIndice(no)

    // Atualiza referências de Pai e Filhos
    for (const key in no.filhos) {
      if (Object.prototype.hasOwnProperty.call(no.filhos, key)) {
        const filho = no.filhos[key]
        filho.pai = pai
        pai.addFilho(filho)
      }
    }
  }

  getPrioridade (): No[] {
    // Monta lista de referências a partir dos filhos da raiz e
    // ordena por critério selecionado
    return Object.keys(this.raiz.filhos)
      .map(key => this.raiz.filhos[key])
      .sort(this.fnPoliticaPrioridade)
  }

  addIndice (no: No): void {
    this.indice[no.valor] = no
  }

  delIndice (no: No): void {
    delete this.indice[no.valor]
  }

  pesquisaNo (no: No): No | null {
    return this.indice[no.valor]
  }
}

export class Processo {
  nome: string;
  ticks: number;
  no: No;

  constructor (no: No) {
    const [nome, ticks] = no.valor.split('_')
    this.nome = nome
    this.ticks = parseInt(ticks)
    this.no = no
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

  static pool (quantidade: number): Processador[] {
    return new Array(quantidade).fill(null).map(() => new Processador())
  }

  executar (processo: Processo): void {
    this.processo = processo
    // console.log(`[CPU${this.id}]${this.processo.toString()} iniciou!`)
  }

  tick (): Processo | null {
    if (this.estaLivre()) return null
    this.ticks++

    // Caso Processo tenha finalizado,
    // reseta informações do Processador e retorna
    // informações do Processo
    if (this.ticks === this.processo?.ticks) {
      // console.log(`[CPU${this.id}]${this.processo.toString()} finalizado!`)
      const aux = this.processo
      this.processo = null
      this.ticks = 0
      return aux
    }
    return null
  }

  estaLivre (): boolean {
    return !this.processo
  }
}
