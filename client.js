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

const menu = "Bem-vido ao sFood!\n[V] para visualizar o cardapio\n[P] para Listar os Pedidos\n[A+IndiceProduto] para Adicionar um Pedido\nExemplo: A4 (para add o BROTINHO)\n[B+IndiceProduto] para Buscar Produto\n[E+IndicePedido] para Excluir um Pedido\n[F] para Finalizar\n[X+Senha] para Acessar o menu Administrativo\nOu digite MENU a qualquer comento para ter acesso as opcões 00.\n"
const menuADM = "\nEstamos no menu do Administador,\nagora vc pode adicionar [ADD+NomeItem+Preco]\nExemplo: ADD+Pastel+3.0\nou deletar [DEL+IndiceItem] um item do cardapio.\n[V] para visualizar o cardapio\n[S]Para cancelar.\n";
var admin = false;

console.log(menu);
if (admin === false){
    rl.addListener("line", line => {
        const comando = line.toUpperCase();
        
        if (comando == 'MENU'){
            console.log(menu);
        }else if (comando === 'V') { // Visualizar Cardapio
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
            var pedidos = '';
            var total = 0;
            client.FinalizarCompra({}, function(err, response){
                if (err != null) {
                    console.log("\nOcorreu um erro! :*(\n");
                    return;
                }else {
                    for (var i = 0; i < response.pedidos.length; i++){
                        var item = (i+1) + '.' + response.pedidos[i].nome + ' - R$ ' + response.pedidos[i].preco + '\n';
                        pedidos = pedidos + item;
                        total = total + response.pedidos[i].preco;
                    }
                    console.log('\nOK! Compra finalizada! B)\n');
                    console.log('\n>>>> Os seus pedidos são:\n' +  pedidos + '\nValor total: ' + total + '\n');
                    rl.close();
                }
            });
        }else if (comando == 'C') { // Cancelar Compra ou Processo
            client.Cancelar({}, function(err, response){
                if (err != null) {
                    console.log("\nOcorreu um erro! :*(\n");
                    return;
                }
                console.log('\nCompra cancelada! :*(\n');
                rl.close();
            });
        }else if (comando[0] == 'X') {
            var senha = comando.slice(1);
            client.ADMIN({senha}, function(err, response){
                if (err != null) {
                    console.log("\nOcorreu um erro! :*(\n");
                    return;
                }else if (response.acess === true){
                    console.log('\nSenha correta! :D\nRedirecionando para o menu ADMIN!\n');
                    console.log(menuADM);
                    admin = true;
                }else {
                    console.log('\nSenha Incorreta! :|\nTente novamente.');
                }
            });
        }else {
            console.log('\nDesculpa! :\\\nComando não aceito!\n');
        }
    });
}else if (admin === true) {
    rl.addListener("line", line => {
        const aux = line.toUpperCase();
        const comando = aux.slice(0,3);
    
        if (comando == 'MENU') {
            console.log(menuADM);
        }else if (comando === 'V') { // Visualizar Cardapio
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
        }else if (comando == 'ADD') {
            const item = aux.split('+');
            client.CadastrarItem({nome: item[1], preco: parseInt(item[2])}, function(err, response){
                if (err != null) {
                    console.log("\nOcorreu um erro! :*(\n");
                }
                console.log('\nItem Cadastrado! :D\n');
            });
        }else if (comando == 'DEL') {
            const posicao = parseInt(comando.slice(3));
            client.ExcluirItem({posicao}, function(err, response){
                if (err != null) {
                    console.log("\nOcorreu um erro! :*(");
                    return;
                }else if (response.nome === 'erro' && response.preco === 0) {
                    console.log('\nDesculpe! :*(\nPedido não existe!\n');
                }else {
                    console.log('\nItem: ' + response.nome + ' no valor de R$ ' + response.preco + ' foi excluido com sucesso! :\\\n');
                }
            });
        }else if (aux == 'S') {
            client.Cancelar({}, function(err, response){
                if (err != null) {
                    console.log("\nOcorreu um erro! :*(\n");
                    return;
                }
                console.log('\nCompra cancelada! :*(\n');
                admin = false;
                rl.close();
            });
        }else {
            console.log('\nDesculpa! :\\\nComando não aceito!\n');
        }
    });
}