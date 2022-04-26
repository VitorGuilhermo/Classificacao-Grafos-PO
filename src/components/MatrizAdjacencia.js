import React from 'react';
import { FcOk, FcHighPriority, FcInspection } from "react-icons/fc";

class MatrizAdjacencia extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nomesVertices: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],

            simples: false,
            regular: false,
            completo: false,
            classificado: false,
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
        return this.grauEmissaoIgualMA(matriz) && this.grauRecepcaoIgualMA(matriz);
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
        debugger;
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

    renderClassificacao = () => {
        let saida = 
            <div className=" d-grid gap col-6 mx-auto mt-5 py-2 px-5 border border-secondary rounded">
                <h5 className="d-flex justify-content-center align-items-center">
                    <FcInspection/>&nbsp;
                    Resultados
                </h5>
                <p> - Simples: {this.state.simples ? <FcOk/> : <FcHighPriority/>}</p>
                <p> - Regular: {this.state.regular ? <FcOk/> : <FcHighPriority/>}</p>
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

                    <div className="d-grid gap col-6 mx-auto mt-5">
                        <button className="btn btn-primary" type="button" onClick={() => this.processarClassificacao()}>Processar Classificação</button>
                    </div>

                    {this.state.classificado ? this.renderClassificacao() : null}
                </>
                
        }
    
        return saida;
    }
}
   
export default MatrizAdjacencia;