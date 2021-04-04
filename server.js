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

var itensCardapio = [{nome: 'PIZZA', preco: 25.00},
                    {nome: 'BROTINHO', preco: 10.00},
                    {nome: 'COXINHA', preco: 4.50},
                    {nome: 'HAMBURGUER', preco: 8.00},
                    {nome: 'LASANHA', preco: 6.00},
                    {nome: 'PASTEL', preco: 3.00},
                    {nome: 'MISTO', preco: 4.00},
                    {nome: 'BOLO DE CHOCOLATE', preco: 19.00},
                    {nome: 'PIZZA DE BRIGADEIRO', preco: 20.00},
                    {nome: 'PUDIM', preco: 15.00},
                    {nome: 'SORVETE', preco: 5.00},
                    {nome: 'AGUA', preco: 1.00},
                    {nome: 'Refrigerante 1L', preco: 2.00}];
var itensPedidos = [];
const senha = '123456';

/* =========================== FUNCOES PARA O CARDAPIO =========================== */
function listarItens(call, callback) {
    callback(null, {cardapio: itensCardapio});
}
function consultaItem(call, callback) {
    const posicao = call.request.posicao - 1;

    if (posicao >= itensCardapio.length || posicao === -1){ // Verificando se a posição existe no CARDAPIO
        callback(null, {nome: 'erro', preco: 0});
    }else {
        const item = itensCardapio[posicao];
        callback(null, {nome: item.nome, preco: item.preco});
    }
}
function cadastraItem(call, callback) {
    const cardapio = {
        nome: call.request.nome,
        preco: call.request.preco
    }
    itensCardapio.push(cardapio);
    callback(null, {});
}
function excluirItem(call, callback){
    const posicao = call.request.posicao - 1;

    if(posicao >= itensCardapio.length || posicao === -1){ // Verificando se existe a posicao no CARDAPIO
        callback(null, {nome: 'erro', preco: 'erro'});
    }else {
        const excluido = itensCardapio.splice(posicao,1);
        callback(null, {nome: excluido[0].nome, preco: excluido[0].preco});
    }
}
/* =========================== FUNCOES PARA OS PEDIDOS =========================== */
function realizarPedido(call, callback){
    const posicao = call.request.posicao - 1;
    
    if (posicao >= itensCardapio.length || posicao === -1) { // Verificando se existe a posicao no CARDAPIO
        callback(null, {nome: 'erro', preco: 0});
    }else {
        const pedido = itensCardapio[posicao];
        itensPedidos.push(pedido);
        callback(null, {nome: pedido.nome, preco: pedido.preco});
    }
}
function listarPedidos(call, callback){
    callback(null, {pedidos: itensPedidos});
}
function excluirPedido(call, callback){
    const posicao = call.request.posicao -1;

    if(posicao >= itensPedidos.length || posicao === -1){ // Verificando se existe a posicao no PEDIDOS
        callback(null, {nome: 'erro', preco: 0});
    }else {
        const excluido = itensPedidos.splice(posicao,1);
        callback(null, {nome: excluido[0].nome, preco: excluido[0].preco});
    }
}
function finalizarCompra(call, callback){
    callback(null, {pedidos: itensPedidos});
    itensPedidos = [];
}
/* =========================== CONTROLE DO ADIMINISTRATIVO =========================== */
function admin(call, callback){
    var tentaSenha = call.request.senha;
    if (tentaSenha === senha) {
        callback(null, {acess: true});
    }else {
        callback(null, {acess: false});
    }
}
/* =========================== FUNCAO GERAL =========================== */
function cancelar(call, callback){
    callback(null, {});
    itensPedidos = [];
}

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
                            ADMIN: admin,
                            Cancelar: cancelar,
                        });

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});