import React from 'react';
import { FcOk, FcHighPriority, FcInspection } from "react-icons/fc";

class MatrizIncidencia extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nomesVertices: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
            digrafo: false,
            arestasAux: [],

            mensagem: "",

            simples: false,
            regular: false,
            completo: false,
            classificado: false,
        };
    }

    //=============== Gerar Matriz Incidencia  ===============
    renderColunas = () => {
        let cols = [];

        cols.push(<th scope="col">MI</th>);

        for (let i = 0; i < this.props.arestas.length; i++) {
            cols.push(
                <th scope="col" key={"col" + i}>{this.props.arestas[i]}</th>
            );
        }

        return cols;
    }

    atualizaMatriz = (valor, linha, coluna) => {
        let mat = this.props.matriz;
        mat[linha][coluna] = valor;  
        //Preenche automaticamente célula inversa 
        if(this.props.arestas[coluna][0] !== this.props.arestas[coluna][1])    {
            linha = this.state.nomesVertices.indexOf(this.props.arestas[coluna][1]);  
            let multiplicador = 1;
            if(this.state.digrafo)
                multiplicador = -1;      
            if(valor === '')
                valor = '0'
            mat[linha][coluna] = (parseInt(valor) * multiplicador).toString();
        }          
        
            
        this.setState({
            matriz: mat
        });
    }

    renderLinha = (nomeVertice, l) => {
        let linha = "";
        let tds = [];

        for (let i = 0; i < this.props.arestas.length; i++) {
            tds.push(
                <td className="p-0" key={"l" + l + "-i" + i}>
                    <input className="form-control rounded-0" type="text" value={this.props.matriz[l][parseInt(i)]} onChange={(e) => this.atualizaMatriz(e.target.value, l, i)} ></input>
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

    handleChange = (valor, index) => {
        index = parseInt(index);

        if (this.state.arestasAux === []) {
            let qtdeVertices = parseInt(this.props.quantidadeVertices);
            let aux = new Array(qtdeVertices);

            this.setState({
                arestasAux: aux,
            });
        }

        let arestasAux = this.state.arestasAux;
        arestasAux[index] = valor;

        this.setState({
            arestasAux: arestasAux,
        })

    }

    renderArestas = () => {
        let linhas = [];

        for (let i = 0; i < this.props.quantidadeVertices; i++) {
            linhas.push(
                <div className="row justify-content-center mb-1" key={"arestra-" + i}>
                    <div className="col-1 row align-items-center">
                        <span>{this.state.nomesVertices[i]}</span>
                    </div>
                    <div className="col-8">
                        <input type="text" className="form-control" placeholder="Exemplo: AA, AB, AC, AD"
                            value={this.state.arestasAux[i]} onChange={(e) => this.handleChange(e.target.value, i)} />
                    </div>
                </div>
            );
        }

        let saida =
            <div className="container">
                {linhas}
            </div>

        return saida;
    }

    renderMatriz = () => {
        let saida = ""
        saida =
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

        return saida;
    }

    gerarMatriz = () => {
        if (this.state.arestasAux.length === 0) {
            this.setState({
                mensagem: "Não é possível gerar um grafo sem arestas.",
            });
            return;
        }
        else {
            this.setState({
                mensagem: "",
            });
        }

        //gera arestas
        let arestas = this.props.arestas;
        for (let i = 0; i < this.props.quantidadeVertices; i++) {            
            let aux = '';
            if(this.state.arestasAux[i])
                aux = this.state.arestasAux[i].split(",");

            for (let j = 0; j < aux.length; j++) {
                arestas.push(aux[j].trim());
            }
        }
        //gera matriz incidente
        let qtdeVertices = parseInt(this.props.quantidadeVertices);
        let matrix = new Array(qtdeVertices);

        for (let i = 0; i < qtdeVertices; i++) {
            matrix[i] = new Array(qtdeVertices);
        }

        for (let lin = 0; lin < qtdeVertices; lin++) {
            for (let col = 0; col < this.props.arestas.length; col++)
                matrix[lin][col] = "0";
        }


        //atualiza states
        this.setState({
            gerarArestas: false,
            arestasAux: [],
        });

        this.props.handleGerarArestas();
        this.props.handleGerarMI(matrix);
    }
    //=============== Fim Gerar Matriz Incidencia  ===============

    //=============== Processar Classificação ===============
    existemArestasMultiplasMI = (arestas) => {
        for (let i = 0; i < arestas.length; i++) {
            let aresta = arestas[i];
            for (let j = i + 1; j < arestas.length; j++)
                if (aresta === arestas[j])
                    return true;
        }
        return false;
    }
    existeLacoMI = (arestas) => {
        for (let i = 0; i < arestas.length; i++)
            if (arestas[i][0] === arestas[i][1])
                return true;
        return false;
    }
    simplesMI = (imi) => {
        return !this.existeLacoMI(imi) && !this.existemArestasMultiplasMI(imi);
    }
    
    grauEmissaoIgualMI = (matriz) => {  
        let cont = 0, cont2;
        for(let col = 0; col < matriz[0].length; col++)
            if(parseInt(matriz[0][col]) > 0)
                    cont++;
        for(let lin = 1; lin < matriz.length; lin++){
            cont2 = 0;
            for(let col = 0; col < matriz[lin].length; col++)
                if(parseInt(matriz[lin][col]) > 0)
                    cont2++;
            if(cont2 !== cont)
                return false;
        }
        return true;
    }

    grauRecepcaoIgualMI = (matriz) => {
        let cont = 0, cont2;
        for(let col = 0; col < matriz[0].length; col++)
            if(parseInt(matriz[0][col]) < 0)
                    cont++;
        for(let lin = 1; lin < matriz.length; lin++){
            cont2 = 0;
            for(let col = 0; col < matriz[lin].length; col++)
                if(parseInt(matriz[lin][col]) < 0)
                    cont2++;
            if(cont2 !== cont)
                return false;
        }
        return true;    
    }

    regularMI = (matriz) => {
        return this.grauEmissaoIgualMI(matriz) && this.grauRecepcaoIgualMI(matriz);
    }

    completoMI = (mat) => { 
        if(!this.simplesMI(this.props.arestas)) 
            return false;      
        for(let lin = 0; lin < mat.length; lin++){
            let cont = 0;
            for(let col = 0; col < mat[lin].length; col++)
                if(parseInt(mat[lin][col]) > 0)
                    cont++;
            if(cont !== this.props.quantidadeVertices - 1)
                return false;            
        }
        return true;
    }

    processarClassificacao = () => {
        //funcoes
        let ehSimples = this.simplesMI(this.props.arestas);
        let ehRegular = this.regularMI(this.props.matriz);
        let ehCompleto = this.completoMI(this.props.matriz);

        this.setState({
            simples: ehSimples,
            regular: ehRegular,
            completo: ehCompleto,
            classificado: true,
        });
    }

    renderClassificacao = () => {
        let saida =
            <div className=" d-grid gap col-6 mx-auto mt-5 py-2 px-5 border border-secondary rounded">
                <h5 className="d-flex justify-content-center align-items-center">
                    <FcInspection />&nbsp;
                    Resultados
                </h5>
                <p> - Simples: {this.state.simples ? <FcOk /> : <FcHighPriority />}</p>
                <p> - Regular: {this.state.regular ? <FcOk /> : <FcHighPriority />}</p>
                <p> - Completo: {this.state.completo ? <FcOk /> : <FcHighPriority />}</p>
            </div>

        return saida;
    }
    //=============== Fim Processar Classificação ===============


    render() {
        let saida = "";
        if (this.props.gerarArestas) {
            saida =
                <>
                   
                    {this.renderArestas()}

                    {
                        (this.state.mensagem === "")
                            ?
                            null
                            :
                            <div className="d-grid gap col-6 mx-auto mt-5 alert alert-danger" role="alert">
                                {this.state.mensagem}
                            </div>
                    }

                    <div className="d-grid gap col-6 mx-auto mt-5">
                        <button className="btn btn-primary" type="button" onClick={() => this.gerarMatriz()}>Gerar Matriz</button>
                    </div>


                </>
        }
        else if (this.props.arestas.length > 0) {
            saida =
                <>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" value={this.state.digrafo}
                            checked={this.state.digrafo === true}
                            onChange={(e) => {this.setState({digrafo: !this.state.digrafo})}} 
                        />
                        <label class="form-check-label" for="flexSwitchCheckDefault">Dígrafo</label>
                    </div>


                    {this.renderMatriz()}

                    <div className="d-grid gap col-6 mx-auto mt-5">
                        <button className="btn btn-primary" type="button" onClick={() => this.processarClassificacao()}>Processar Classificação</button>
                    </div>

                    {this.state.classificado ? this.renderClassificacao() : null}
                </>
        }

        return saida;
    }
}

export default MatrizIncidencia;