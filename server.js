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

var itensCardapio = [{nome: 'Pizza', preco: 25.00},
                    {nome: 'Coxinha', preco: 4.50},
                    {nome: 'Hamburguer', preco: 8.00},
                    {nome: 'Refrigerante 1L', preco: 2.00}];
var itensPedidos = [];
const senha = '123456';
var admin = false;

/* =========================== FUNCOES PARA O CARDAPIO =========================== */
function listarItens(call, callback) {
    callback(null, {cardapio: itensCardapio});
}
function consultaItem(call, callback) {
    const posicao = call.request.posicao;
    callback(null, intensCardapio[posicao]);
}
function cadastraItem(call, callback) {
    const cardapio = {
        item: call.request.item,
        preco: call.request.preco
    }
    itensCardapio.push(cardapio);
    callback(null, {});
}
function excluirItem(call, callback){
    const posicao = call.request.posicao - 1;

    if(posicao >= itensCardapio.length){
        //console.log('Item inexistente!:(\nDigite um item que esteja no cardapio.');
    }else {
        itensCardapio.splice(posicao,1);
        //console.log('Item apagado com sucesso!');
    }
}
/* =========================== FUNCOES PARA OS PEDIDOS =========================== */
function realizarPedido(call, callback){
    const posicao = call.request.posicao;
    const pedido = itensCardapio[posicao];
    itensPedidos.push(pedido);
    callback(null, pedido);
}
function listarPedidos(call, callback){
    callback(null, {pedidos: itensPedidos});
}
function excluirPedido(call, callback){
    const posicao = call.request.posicao;

    if(posicao >= itensPedidos.length){
        //console.log('Item inexistente!:(\nDigite um item que esteja no cardapio.');
    }else {
        itensPedidos.splice(posicao,1);
        //console.log('Item apagado com sucesso!');
    }
}
function finalizarCompra(call, callback){}
function cancelar(call, callback){}

const server = new grpc.Server();

server.addService(servicoCardapio.service,
                        {
                            ListarItens: listarItens,
                            ConsultarItem: consultaItem,
                            CadastrarItem: cadastraItem,
                            ExcluirItem: excluirItem,
                            RealizarPedido: realizarPedido,
                            ListarPedidos: listarPedidos,
                            ExcluirPedido: excluirPedido,
                            FinalizarCompra: finalizarCompra,
                            Cancelar: cancelar,
                        });

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});