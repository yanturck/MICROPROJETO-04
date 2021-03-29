const PROTO_PATH = "./cardapio.proto";

const grpc = require('grpc');

const protoLoader = require('@grpc/proto-loader');

// carregamento do arquivo proto e geração das definições
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

// carregamento do código do serviço
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).cardapio;

// criação de um objeto cliente que se conecta ao serviço no
// endereço 127.0.0.1, na porta 50051 e sem segurança
const client = new protoDescriptor.ServicoCardapio('127.0.0.1:50051',
                                    grpc.credentials.createInsecure());

client.CadastrarItem({item: 'Pizza', preco:25.00}, function(err, response){
    if (err != null) {
        console.log("Ocorreu um erro invocando o procedimento CadastraItem");
        return;
    }
    console.log('Registrado com sucesso!');
    client.CadastrarItem({item: 'Hamburguer', preco:15.00}, function(err, response){
        if (err != null) {
            console.log("Ocorreu um erro invocando o procedimento CadastraItem");
            return;
        }
        console.log('Registrado com sucesso!');
    });
    client.ListarItens({}, function(err, response){
        const listCar = response.cardapio;

        console.log(listCar);
    });
});
client.ListarItens({}, function(err, response) {
    if (err != null) {
        console.log("Ocorreu um erro invocando o procedimento ListarCarros");
        return;
    }

    console.log(" >>>>> O cardapio do dia é: " + JSON.stringify(response.cardapio) );
});