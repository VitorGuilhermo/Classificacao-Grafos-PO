import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { FcOk, FcHighPriority, FcInspection } from "react-icons/fc";


class ListaAdjacencia extends React.Component {
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

    handleChange = (l, i, e) => {
        let formValues = this.props.lista;
        formValues[l][i][e.target.name] = e.target.value;
        this.setState({ lista: formValues });
    }

    addFormFields = (index) => {
        let formValues = this.props.lista;
        formValues[index] = [...this.props.lista[index], { vertice: "", aresta: "0" }];

        this.setState(({
            lista: formValues
        }))
    }

    //=============== Processar Classificação ===============
    existemArestasMultiplasLista = (lista) => {
        for(let i = 0; i < lista.length; i++){
            for(let j = 1; j < lista[i].length; j++){
                let id = lista[i][j].vertice;
                for(let k = j+1; k < lista[i].length; k++)
                    if(lista[i][k].vertice === id)
                        return true;
            }
        }
        return false;
    }

    existeLacoLista = (lista) => {
        for(let i = 0; i < lista.length; i++){
            let id = lista[i][0].vertice;
            for(let j = 1; j < lista[i].length; j++)
                if(lista[i][j].vertice === id)
                    return true;
        }
        return false;
    }

    simplesLista = (lista) => {
        return !this.existeLacoLista(lista) && !this.existemArestasMultiplasLista(lista);
    }

    grauEmissaoIgualLista = (lista) => {  
        for(let i = 1; i < lista.length; i++)
            if(lista[i].length - 1 !== lista[0].length - 1)
                return false;
        return true;
    }

    grauRecepcaoIgualLista = (lista) => {
        let cont = 0, cont2 = 0, id = lista[0][0].vertice;
        for(let i = 0; i < lista.length; i++)
            for(let j = 1; j < lista[i].length; j++)
                if(lista[i][j].vertice === id)
                    cont++;
        for(let i = 1; i < lista.length; i++){
            id = lista[i][0].vertice;
            cont2 = 0;
            for(let j = 0; j < lista.length; j++)
                for(let k = 1; k < lista[j].length; k++)
                    if(lista[j][k].vertice === id)
                        cont2++;
            if(cont2 !== cont)
                return false;
        }
        return true;
    }

    regularLista = (lista) => {
        var result = '';
        if(this.grauRecepcaoIgualLista(lista))
            result += 'Recepção ';
        if(this.grauEmissaoIgualLista(lista))
            result += 'Emissão';
        return result;
    }

    completoLista = (lista) => {
        if(!this.simplesLista(lista))
            return false;
        for(let i = 0; i < lista.length; i++)
            if(lista[i].length - 1 !== this.props.quantidadeVertices - 1)
                return false;
        return true;
    }

    processarClassificacao = () => {
        let lista = this.props.lista;
        debugger;
        for(let i = 0; i < lista.length; i++)
             for(let j = 0; j < lista[i].length; j++) // REMOVE CAIXINHAS DE LISTA VAZIA E LETRAS QUE NÃO SÃO VERTICES 
                 if(lista[i][j].vertice === '' || lista[i][j].length > 1 || lista[i][j].vertice.charCodeAt(0) - 'A'.charCodeAt(0) >= this.props.quantidadeVertices)
                     lista[i].splice(j);
        //Adiciona cabeça da lista (identificação do vértice)
        for(let i = 0; i < lista.length; i++)
            lista[i].unshift({vertice: this.state.nomesVertices[i]});        
        
        let ehSimples = this.simplesLista(lista);
        let ehRegular = this.regularLista(lista);
        let ehCompleto = this.completoLista(lista);
        
        //Remove cabeça da lista pra n bugar interface
        for(let i = 0; i < lista.length; i++)
            lista[i].shift();

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
                <p> - Regular: {this.state.regular !== "" ? <><FcOk/> {this.state.regular}</> : <FcHighPriority/>}</p>
                <p> - Completo: {this.state.completo ? <FcOk/> : <FcHighPriority/>}</p>
            </div> 
            

        return saida;
    }


    renderLinhas = () => {        
        let rows = [];

        for (let i = 0; i < this.props.quantidadeVertices; i++) {
            rows.push(
                <li className="list-group-item " key={i}>
                    <div className="d-flex justify-content-start align-items-center">
                        <div className="">
                            <span>
                                {this.state.nomesVertices[i]}
                                <FaArrowRight/>
                            </span>
                        </div>

                        {
                            (this.props.lista.length > 0) 
                            ?
                            this.props.lista[i].map((element, index) => (
                                <div className="d-flex justify-content-start align-items-center" key={"formData"+i+index}>
                                    <span className="d-flex border border-2 border-secondary rounded">
                                        <div className="">
                                            <input type="text" className="form-control rounded-0 border-secondary" style={{ minWidth: 50, maxWidth: 90 }} placeholder="Vértice" 
                                                name="vertice" value={element.vertice || ""} onChange={e => this.handleChange(i, index, e)} />
                                        </div>
                                        <div className="">
                                            <input type="text" className="form-control rounded-0 border-secondary" style={{ minWidth: 30, maxWidth: 50 }} placeholder="Arestra" 
                                                name="aresta" value={element.aresta || ""} onChange={e => this.handleChange(i, index, e)} />
                                        </div>
                                    </span>
                                    <span><FaArrowRight/></span>
                                </div>
                            ))
                            :
                            null
                        }

                        <button type="button" className="btn btn-secondary" onClick={() => this.addFormFields(i)}>+</button>
                    </div>


                </li>
            );
        }

        return rows;
    }

    render() {
        let saida = "";
        if (this.props.lista.length > 0) {
            saida =
                <div className="container">
                    <ul className="list-group list-group-flush">
                        {this.renderLinhas()}
                    </ul>

                    <div className="d-grid gap col-6 mx-auto mt-5">
                        <button className="btn btn-primary" type="button" onClick={() => this.processarClassificacao()}>Processar Classificação</button>
                    </div>

                    {this.state.classificado ? this.renderClassificacao() : null}
                </div>
        }

        return saida;
    }
}

export default ListaAdjacencia;