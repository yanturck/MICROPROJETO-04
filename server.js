var PROTO_PATH = './cardapio.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).cardapio;

const servicoCardapio = protoDescriptor.ServicoCardapio;

var itensCardapio = [];

function listarItens(call, callback) {
    // console.log("O cardapio do dia é:\n");
    callback(null, {cardapio: itensCardapio});
}
function consultaItem(call, callback) {
    // console.log("Busca concluida: " + call.request.posicao);
    const posicao = call.request.posicao;
    callback(null, intensCardapio[posicao]);
}
function cadastraItem(call, callback) {
    const cardapio = {
        item: call.request.item,
        preco: call.request.preco
    }
    // console.log("O item " + JSON.stringify(cardapio));
    intensCardapio.push(cardapio);
    callback(null, {});
}

const server = new grpc.Server();

server.addService(servicoCardapio.service,
                        {
                            ListaItens: listarItens,
                            ConsultaItem: consultaItem,
                            CadastraItem: cadastraItem,
                        });

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});