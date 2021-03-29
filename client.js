const PROTO_PATH = "./cardapio.proto";

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

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).cardapio;

const client = new protoDescriptor.ServicoCardapio('127.0.0.1:50051',
                                    grpc.credentials.createInsecure());

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
client.ListarItens({}, function(err, response) {
    if (err != null) {
        console.log("Ocorreu um erro invocando o procedimento ListarCarros");
        return;
    }
    console.log(" >>>>> O cardapio do dia é: " + JSON.stringify(response.cardapio) );
    client.RealizarPedido(0, function(err, response){
        if (err != null) {
            console.log("Ocorreu um erro invocando o procedimento Realizar Pedido!:(");
            return;
        }
        console.log('Pedido ' + response.nome + ' no valor de ' + response.preco + ' adicionado!:)');
        client.RealizarPedido(2, function(err, response){
            if (err != null) {
                console.log("Ocorreu um erro invocando o procedimento Realizar Pedido!:(");
                return;
            }
            console.log('Pedido ' + response.nome + ' no valor de ' + response.preco + ' adicionado!:)');
            client.ListarPedidos({}, function(err, response){
                if (err != null) {
                    console.log("Ocorreu um erro invocando o procedimento Listar Pedidos");
                    return;
                }
                console.log(" >>>>> Os seus pedidos são: " + JSON.stringify(response.pedidos) );
            });
        });
    });
});