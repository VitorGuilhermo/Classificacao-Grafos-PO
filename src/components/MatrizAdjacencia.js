import React from 'react';
import { FcOk, FcHighPriority, FcInspection } from "react-icons/fc";

class MatrizAdjacencia extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nomesVertices: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

            simples: false,
            regular: false,
            completo: false,
            classificado: false,

            //AGM
            gerarAGM: false,
            ordem: "min",
            arestasClassificadas: [],
            arestasSelecionadas: [],
            matrizComponentes: [],
            custo: 0,
        };
    }

    renderColunas = () => {
        let cols = [];

        cols.push(<th scope="col">MA</th>);

        for (let i = 0; i < this.props.quantidadeVertices; i++) {
            cols.push(
                <th scope="col" key={"col"+i}>{this.state.nomesVertices[i]}</th>
            );
        }

        return cols;
    }

    atualizaMatriz = (valor, linha, coluna) => {
        let mat = this.props.matriz;
        mat[linha][coluna] = valor;

        this.setState({ 
            matriz: mat
        });
    }

    renderLinha = (nomeVertice, l) => {
        let linha = "";
        let tds = [];

        for (let i = 0; i < this.props.quantidadeVertices; i++) {
            tds.push(
                <td className="p-0" key={"l"+l+"-i"+i}>
                    <input className="form-control rounded-0" type="text" value={this.props.matriz[l][parseInt(i)]} onChange={ (e) => this.atualizaMatriz(e.target.value, l, i)} ></input>
                </td>
            );
        }

        linha =
            <tr>
                <th scope="row">{nomeVertice}</th>
                {tds}            
            </tr>

        return linha;
    }

    renderLinhas = () => {
        let rows = [];

        for (let i = 0; i < this.props.quantidadeVertices; i++) {
            rows.push(
                this.renderLinha(this.state.nomesVertices[i], i)
            );
        }

        return rows;
    }

    //=============== Processar Classificação ===============
    existeLacoMA = (mat) => {
        for(let i = 0, j = 0; i < mat.length && j < mat[i].length; i++, j++)
            if(parseInt(mat[i][j]) !== 0)
                return true;
        return false;
    }

    simplesMA = (ma) => {
        return !this.existeLacoMA(ma);
    }

    grauEmissaoIgualMA = (mat) => {
        let cont = 0, cont2;
        for(let i = 0; i < mat[0].length; i++)
            if(parseInt(mat[0][i]) > 0)
                cont++;
        for(let i = 1; i < mat.length; i++){
            cont2 = 0;
            for(let j = 0; j < mat[i].length; j++)
                if(parseInt(mat[i][j]) > 0)
                    cont2++;
            if(cont2 !== cont)
                return false;
        }
        return true;
    }

    grauRecepcaoIgualMA = (mat) => {
        let cont = 0, cont2;
        for(let i = 0; i < mat.length; i++)
            if(parseInt(mat[i][0]) > 0)
                cont++;
        for(let i = 1; i < mat[0].length; i++){
            cont2 = 0;
            for(let j = 0; j < mat.length; j++)
                if(parseInt(mat[j][i]) > 0)
                    cont2++;
            if(cont2 !== cont)
                return false;
        }
        return true;
    }

    regularMA = (matriz) => {
        var result = '';
        if( this.grauEmissaoIgualMA(matriz)) 
            result = result + 'Emissão';
        
        if( this.grauRecepcaoIgualMA(matriz))
        result = result + ' Recepção';   
        return result;
    }

    completoMA = (mat) => {
        for(let lin = 0; lin < mat.length; lin++){
            for(let col = 0; col < mat[lin].length; col++)
                if((parseInt(mat[lin][col]) > 0  && lin === col) || (parseInt(mat[lin][col]) === 0 && lin !== col))
                    return false;
        }
        return true;
    }

    processarClassificacao = () => {
        //funcoes
        let ehSimples = this.simplesMA(this.props.matriz);
        let ehRegular = this.regularMA(this.props.matriz);
        let ehCompleto = this.completoMA(this.props.matriz);

        this.setState({
            simples: ehSimples,
            regular: ehRegular,
            completo: ehCompleto,
            classificado: true,
        });
    }

    gerarAGMKruskal = () => {
        this.setState({
            gerarAGM: true,
        });

        this.algoritimoKruskal();
    }

    // Algoritmo Kruskal: Árvore Geradora Mínima
    algoritimoKruskal = () => {    
        let ordem = this.state.ordem;
        let mat = this.props.matriz;
        // let mat = [
        //     [0,1,0,4,0,0,0],
        //     [1,0,2,6,4,0,0],
        //     [0,2,0,0,5,6,0],
        //     [4,6,0,0,3,0,4],
        //     [0,4,5,3,0,8,7],
        //     [0,0,6,0,8,0,3],
        //     [0,0,0,4,7,3,0]
        // ];

        let matrizComponentes = [];
        let arestasClassificadas = [];
        let arestasSelecionadas = [];
       
        //gera estrutura das arestras classificadas
        let k = 0;
        for(let i=0; i<mat.length; i++) {
            // matrizComponentes.push([]);
            for(let j = k; j < mat[i].length; j++) {
                let valorAresta = parseInt(mat[i][j]);
                let aresta = this.state.nomesVertices[i] + "," + this.state.nomesVertices[j];
                if(valorAresta > 0)
                    arestasClassificadas.push({aresta: aresta, valor: valorAresta, c1: i+1, c2: j+1});                
            }
            k++;
        }

        if(ordem === 'min'){
            arestasClassificadas.sort(function (a, b) {
                if (a.valor > b.valor) {
                    return 1;
                }
                if (a.valor < b.valor) {
                    return -1;
                }
                return 0;
            });
        }
        else{
            arestasClassificadas.sort(function (a, b) {
                if (a.valor < b.valor) {
                    return 1;
                }
                if (a.valor > b.valor) {
                    return -1;
                }
                return 0;
            }); 
        }
        let vertices = this.state.nomesVertices;

        //gera matriz componentes
        let indexMatComp = 0;
        let vetMat = [];
        for(let i = 0; i < mat[0].length; i++)
            vetMat.push(this.state.nomesVertices[i]); 

        let soma = 0;
        for(let i = 0; i < arestasClassificadas.length; i++){           
            if(!arestasSelecionadas.includes(arestasClassificadas[i].aresta) &&
                vetMat[arestasClassificadas[i].c1 - 1] !==  vetMat[arestasClassificadas[i].c2 - 1]   
            ){
                arestasSelecionadas.push(arestasClassificadas[i].aresta);
                let aux = vetMat[arestasClassificadas[i].c2 - 1];
                for(let j = 0; j < vetMat.length; j++){
                    if(vetMat[j] === aux) {                         
                        vetMat[j] = vetMat[arestasClassificadas[i].c1 - 1];
                    }
                }
                soma = soma + arestasClassificadas[i].valor;
                matrizComponentes.push([arestasClassificadas[i].aresta].concat(vetMat));   
            }
        }

        this.setState({
            arestasClassificadas: arestasClassificadas,
            arestasSelecionadas: arestasSelecionadas,
            matrizComponentes: matrizComponentes,
            custo: soma,
        });
    }

    verificarColunas = (arestasSelecionadas, le, ld) => {
        let leB = true, ldB = true;
        for(let i = 0; i < arestasSelecionadas.length; i++){
            let leAux = arestasSelecionadas[i].charAt(0);
            let ldAux = arestasSelecionadas[i].charAt(2);
            if(le === leAux)
                leB = false;
            if(ld === ldAux)
                ldB = false;
        }    
        return leB || ldB;
    }


    renderArestasClassificadas = () => {
        let cols = [];
        this.state.arestasClassificadas.forEach((aresta) => {
            cols.push(<td>{aresta.aresta}</td>);
        })

        const saida = 
            <>
                <label>Arestas Classificadas</label>
                <table class="table table-bordered text-center">
                    <tbody>
                        <tr>
                            {cols}
                        </tr>
                    </tbody>
                </table>
            </>
        
        return saida;
    }

    renderArestasSelecionadas = () => {
        let cols = [];
        this.state.arestasSelecionadas.forEach((aresta) => {
            cols.push(<td>{aresta}</td>);
        })

        const saida = 
            <>
                <label>Arestas Selecionadas</label>
                <table class="table table-bordered text-center">
                    <tbody>
                        <tr>
                            {cols}
                        </tr>
                    </tbody>
                </table>
            </>
        
        return saida;
    }

    renderLinhaMatrizComponentes = (linha) => {
        let saida = "";
        let tds = [];

        for (let i = 0; i < linha.length; i++) {
            tds.push(
                <td>
                    {linha[i]}
                </td>
            );
        }

        saida =
            <tr>
                {tds}            
            </tr>

        return saida;
    }

    renderMatrizComponentes = () => {
        let cabecalho = [];
        cabecalho.push(<th>Aresta</th>);
        for (let i = 0; i < this.props.quantidadeVertices; i++) {
            cabecalho.push(<th>{this.state.nomesVertices[i]}</th>);
        }

        let linhas = [];
        for(let i = 0; i < this.state.matrizComponentes.length; i++) {
            linhas.push(this.renderLinhaMatrizComponentes(this.state.matrizComponentes[i]));
        }

        const saida = 
            <>
                <label>Componentes</label>
                <table className="table table-bordered text-center">
                    <thead className="table-dark">
                        <tr>
                            {cabecalho}
                        </tr>
                    </thead>
                    <tbody>
                        {linhas}
                    </tbody>
                </table>
            </>

        return saida;
    }

    renderAGM = () => {
        let saida = 
            <div className="my-5">
                {this.renderArestasClassificadas()}

                {this.renderMatrizComponentes()}

                {this.renderArestasSelecionadas()}

                <p>Custo: {this.state.custo}</p>
            </div>

        return saida;
    }

    renderClassificacao = () => {
        let saida = 
            <div className=" d-grid gap col-6 mx-auto mt-5 py-2 px-5 border border-secondary rounded">
                <h5 className="d-flex justify-content-center align-items-center">
                    <FcInspection/>&nbsp;
                    Resultados
                </h5>
                <p> - Simples: {this.state.simples ? <FcOk/> : <FcHighPriority/>}</p>
                <p> - Regular: {this.state.regular !== "" ? <><FcOk/> {this.state.regular}</> : <FcHighPriority/>}</p>
                <p> - Completo: {this.state.completo ? <FcOk/> : <FcHighPriority/>}</p>
            </div> 
            

        return saida;
    }


    render() {
        let saida = "";
        if(this.props.matriz.length > 0) {
            saida =
                <>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {this.renderColunas()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderLinhas()}
                        </tbody>
                    </table>

                    <div className="d-grid col-6 mx-auto gap-2">
                        <button className="btn btn-primary" type="button" onClick={() => this.processarClassificacao()}>Processar Classificação</button>
                        
                    </div>

                    <div className="d-grid col-6 mx-auto gap-2">
                        <hr/>
                    </div>
                    <div className="d-grid gap-2 col-6 mx-auto mt-4">
                        <div className="row justify-content-between">
                            <div className="col-6">
                                <select className="form-select" value={this.state.ordem} onChange={(e) => this.setState({ ordem: e.target.value })}>
                                    <option value="min">Min</option>
                                    <option value="max">Max</option>
                                </select>
                            </div>
                            <div className="col-6 text-end">
                                <button className="btn btn-primary px-5" type="button" onClick={() => {this.gerarAGMKruskal()} }>Gerar AGM</button>
                            </div>
                        </div>
                    </div>
                    

                    {this.state.classificado ? this.renderClassificacao() : null}

                    {this.state.gerarAGM ? this.renderAGM() : null}
                </>
                
        }
    
        return saida;
    }
}
   
export default MatrizAdjacencia;