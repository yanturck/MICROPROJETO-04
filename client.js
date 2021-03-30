const PROTO_PATH = "./cardapio.proto";
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).cardapio;

const client = new protoDescriptor.ServicoCardapio('127.0.0.1:50051',
                                    grpc.credentials.createInsecure());

console.log("Bem-vido ao sFood!\n[V] para visualizar o cardapio\n[P] para Listar os Pedidos\n[A+IndiceProduto] para Adicionar um Pedido\nExemplo: A4 (para add o BROTINHO)\n[B+IndiceProduto] para Buscar Produto\n[E+IndicePedido] para Excluir um Pedido\n[F] para finalizar.\n");

rl.addListener("line", line => {
    const comando = line.toUpperCase();

    if (comando === 'V') { // Visualizar Cardapio
        var cardapio = '';
        client.ListarItens({}, function(err, response) {
            if (err != null) {
                console.log("\nOcorreu um erro! :*(\n");
                return;
            }else {
                for (var i = 0; i < response.cardapio.length; i++){
                    var item = (i+1) + '.' + response.cardapio[i].nome + ' - R$ ' + response.cardapio[i].preco + '\n';
                    cardapio = cardapio + item;
                }
                console.log("\n>>>> O cardapio do dia é:\n" + cardapio + '\n');
            }
        });
    } else if (comando == 'P') { // Visualizar Pedidos
        var pedidos = '';
        var total = 0;
        client.ListarPedidos({}, function(err, response){
            if (err != null) {
                console.log("\nOcorreu um erro! :*(\n");
                return;
            }else {
                for (var i = 0; i < response.pedidos.length; i++){
                    var item = (i+1) + '.' + response.pedidos[i].nome + ' - R$ ' + response.pedidos[i].preco + '\n';
                    pedidos = pedidos + item;
                    total = total + response.pedidos[i].preco;
                }
                console.log('\n>>>> Os seus pedidos são:\n' +  pedidos + '\nValor total: ' + total + '\n');
            }
        });
    }else if (comando[0] == 'A') { // Realizar Pedido [A + Indice do Pedido]
        const posicao = parseInt(comando.slice(1));
        client.RealizarPedido({posicao}, function(err, response){
            if (err != null) {
                console.log("\nOcorreu um erro! :*(\n");
                return;
            } else if (response.nome === 'erro' && response.preco === 0) {
                console.log('\nDesculpe! :*(\nItem não existe!\n');
            }else{
                console.log('\nPedido: ' + response.nome + ' no valor de R$ ' + response.preco + ' foi adicionado! :)\nMais alguma coisa? S2\n');
            }
        });
    }else if (comando[0] == 'E') { // Excluir Pedido [E + Indice do Pedido]
        const posicao = parseInt(comando.slice(1));
        client.ExcluirPedido({posicao}, function(err, response){
            if (err != null) {
                console.log("\nOcorreu um erro! :*(");
                return;
            }else if (response.nome === 'erro' && response.preco === 0) {
                console.log('\nDesculpe! :*(\nPedido não existe!\n');
            }else {
                console.log('\nPedido: ' + response.nome + ' no valor de R$ ' + response.preco + ' foi excluido com sucesso! :\\\n');
            }
        });
    }else if (comando[0] == 'B') { // Buscar Item
        const posicao = parseInt(comando.slice(1));
        client.ConsultarItem({posicao}, function(err, response){
            if (err != null) {
                console.log("Ocorreu um erro! :*(");
                return;
            }else if (response.nome === 'erro' && response.preco === 0) {
                console.log('\nDesculpe! :*(\nItem não existe!\n');
            }else {
                console.log('\nItem encontrado: ' + response.nome + ' no valor de R$ ' + response.preco + '\n');
            }
        });
    }else if (comando == 'F') { // Finalizar Comprar
        console.log('Ainda preciso trabalhar nisso!:\\');
    }else if (comando == 'C') { // Cancelar Compra ou Processo
        console.log('Ainda preciso trabalhar nisso!:\\');
    }
});