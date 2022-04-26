import React from "react";
import "./styles.css";
import { FcRadarPlot } from "react-icons/fc";

import MatrizAdjacencia from "./components/MatrizAdjacencia";
import ListaAdjacencia from "./components/ListaAdjacencia";
import MatrizIncidencia from "./components/MatrizIncidencia";


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      representacaoGrafo: "matrizAdjacencia",
      quantidadeVertices: "1",

      matrizAdjacencia: [],

      matrizIncidencia: [],
      arestasMI: [],
      gerarArestas: false,

      listaAdjacencia: [],

    };
  }

  gerarMatriz = () => {
    if (this.state.quantidadeVertices != null && this.state.quantidadeVertices !== "") {
      if(this.state.representacaoGrafo === "matrizAdjacencia") {
        let qtdeVertices = parseInt(this.state.quantidadeVertices);
        let matrix = new Array(qtdeVertices);

        for (let i = 0; i < qtdeVertices; i++) {
          matrix[i] = new Array(qtdeVertices);
        }

        for (let lin = 0; lin < qtdeVertices; lin++) {
          for (let col = 0; col < qtdeVertices; col++)
            matrix[lin][col] = "0";
        }

        this.setState({
          matrizAdjacencia: matrix,
        });
      }
      else if(this.state.representacaoGrafo === "listaAdjacencia") {
        let qtdeVertices = parseInt(this.state.quantidadeVertices);
        let lista = new Array(qtdeVertices);

        for (let i = 0; i < qtdeVertices; i++) {
          lista[i] = [{
            vertice: "",
            aresta: "0"
          }];
        }

        this.setState({
          listaAdjacencia: lista,
        });
      }
      else if(this.state.representacaoGrafo === "matrizIncidencia") {
        this.setState({
          gerarArestas: true,
          arestasMI: [],
        });

      }
    }
  }

  handleGerarArestas = () => {
    this.setState({
      gerarArestas: false
    });
  }

  handleGerarMI = (matriz) => {
    this.setState({
      matrizIncidencia: matriz
    });
  }

  render = () => {
    let saida = (
      <div>
        <nav className="navbar py-4">
          <div className="container-fluid d-flex align-items-center">
            <h1 className="d-flex justify-content-center align-items-center navbar-brand mb-0 fs-1 text-center w-100">
              <FcRadarPlot/> &nbsp;
              <span>Classificação de Grafos</span>
            </h1>
          </div>
        </nav>

        <div className="container">

          <div className="row mb-5">
            <div className="col-6">
              <label className="form-label">Representação grafo</label>
              <select className="form-select" value={this.state.representacaoGrafo} onChange={(e) => this.setState({ representacaoGrafo: e.target.value })}>
                <option value="matrizAdjacencia">Matriz de Adjacência</option>
                <option value="matrizIncidencia">Matriz de Incidência</option>
                <option value="listaAdjacencia">Lista de Adjacência</option>
              </select>
            </div>

            <div className="col-6">
              <label className="form-label">Quantidade de Vértices</label>
              <div className="input-group">
                <input type="number" className="form-control" min="1" max="10" value={this.state.quantidadeVertices}
                  onChange={(e) => this.setState({ quantidadeVertices: e.target.value, matrizAdjacencia: [], matrizIncidencia: [], listaAdjacencia: [] })}/>
                <button className="btn btn-primary" type="button" onClick={() => this.gerarMatriz()}>Gerar
                  {this.state.representacaoGrafo === "listaAdjacencia" ? " Lista" : (this.state.representacaoGrafo === "matrizAdjacencia") ? " Matriz" : " Arestas"}</button>
              </div>
            </div>
          </div>

          <hr/>

          <div className="mt-5">
            {(this.state.representacaoGrafo === "matrizAdjacencia" && this.state.matrizAdjacencia.length > 0) ? <MatrizAdjacencia quantidadeVertices={this.state.quantidadeVertices} matriz={this.state.matrizAdjacencia} /> : null}
            {(this.state.representacaoGrafo === "listaAdjacencia" && this.state.listaAdjacencia.length > 0) ? <ListaAdjacencia quantidadeVertices={this.state.quantidadeVertices} lista={this.state.listaAdjacencia} /> : null}
            {(this.state.representacaoGrafo === "matrizIncidencia" && this.state.quantidadeVertices > 0) ? <MatrizIncidencia quantidadeVertices={this.state.quantidadeVertices} arestas={this.state.arestasMI} 
              matriz={this.state.matrizIncidencia} gerarArestas={this.state.gerarArestas} handleGerarArestas={this.handleGerarArestas} handleGerarMI={this.handleGerarMI} /> : null}
          </div>

        </div>
      </div>
    );

    return saida;
  };
}

export default App;
