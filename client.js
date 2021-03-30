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

    if (comando === 'V') {
        var cardapio = '';
        client.ListarItens({}, function(err, response) {
            if (err != null) {
                console.log("Ocorreu um erro invocando o procedimento ListarCarros");
                return;
            }else {
                for (var i = 0; i < response.cardapio.length; i++){
                    var item = (i+1) + '.' + response.cardapio[i].nome + ' - R$ ' + response.cardapio[i].preco + '\n';
                    cardapio = cardapio + item;
                }
                console.log(" >>>> O cardapio do dia é:\n" + cardapio);
            }
        });
    } else if (comando == 'P') {
        var pedidos = '';
        var total = 0;
        client.ListarPedidos({}, function(err, response){
            if (err != null) {
                console.log("Ocorreu um erro invocando o procedimento Listar Pedidos");
                return;
            }else {
                for (var i = 0; i < response.pedidos.length; i++){
                    var item = (i+1) + '.' + response.pedidos[i].nome + ' - R$ ' + response.pedidos[i].preco + '\n';
                    pedidos = pedidos + item;
                    total = total + response.pedidos[i].preco;
                }
                console.log(' >>>> Os seus pedidos são:\n' +  pedidos + '\nValor total: ' + total);
            }
        });
    }else if (comando[0] == 'A') {
        const posicao = parseInt(comando.slice(1));
        client.RealizarPedido(posicao, function(err, response){
            if (err != null) {
                console.log("Ocorreu um erro invocando o procedimento Realizar Pedido!:(");
                return;
            }
            //console.log('Pedido ' + response.item.nome + ' no valor de R$ ' + response.item.preco + ' foi adicionado!:)');
            console.log(JSON.stringify(response));
        });
    }else if (comando == 'E') {
        client.ExcluirPedido(0, function(err, response){
            if (err != null) {
                console.log("Ocorreu um erro invocando o procedimento Excluir Pedido!:(");
                return;
            }
            console.log('Pedido excluido com sucesso!');
        });

    }else if (comando == 'B') {
        client.ConsultarItem(0, function(err, response){
            if (err != null) {
                console.log("Ocorreu um erro invocando o procedimento Consultar Item!");
                return;
            }
            console.log('Item encontrado: ' + JSON.stringify(response));
        });
    }else if (comando == 'F') {
        console.log('Ainda preciso trabalhar nisso!:\\');
    }else if (comando == 'C') {
        console.log('Ainda preciso trabalhar nisso!:\\');
    }
});

// client.CadastrarItem({item: 'Pizza', preco:25.00}, function(err, response){
//     if (err != null) {
//         console.log("Ocorreu um erro invocando o procedimento CadastraItem");
//         return;
//     }
//     console.log('Registrado com sucesso!');
//     client.CadastrarItem({item: 'Hamburguer', preco:15.00}, function(err, response){
//         if (err != null) {
//             console.log("Ocorreu um erro invocando o procedimento CadastraItem");
//             return;
//         }
//         console.log('Registrado com sucesso!');
//     });
// });
// client.ListarItens({}, function(err, response) {
//     if (err != null) {
//         console.log("Ocorreu um erro invocando o procedimento ListarCarros");
//         return;
//     }
//     console.log(" >>>>> O cardapio do dia é: " + JSON.stringify(response.cardapio) );
//     client.RealizarPedido(0, function(err, response){
//         if (err != null) {
//             console.log("Ocorreu um erro invocando o procedimento Realizar Pedido!:(");
//             return;
//         }
//         console.log('Pedido ' + response.nome + ' no valor de ' + response.preco + ' adicionado!:)');
//         client.RealizarPedido(2, function(err, response){
//             if (err != null) {
//                 console.log("Ocorreu um erro invocando o procedimento Realizar Pedido!:(");
//                 return;
//             }
//             console.log('Pedido ' + response.nome + ' no valor de ' + response.preco + ' adicionado!:)');
//             client.ListarPedidos({}, function(err, response){
//                 if (err != null) {
//                     console.log("Ocorreu um erro invocando o procedimento Listar Pedidos");
//                     return;
//                 }
//                 console.log(" >>>>> Os seus pedidos são: " + JSON.stringify(response.pedidos) );
//             });
//         });
//     });
// });