//importando todas as dependências
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";
import bcrypt from "bcrypt";
//Importando todos os Bancos de Dados
import Usuarios from "./usuarios.js";
import Receita from "./receita.js";
import Despesas from "./despesas.js";
import Receitas from "./receita.js";
import Metas from "./metas.js";
import TipoDespesa from "./tipoDespesa.js";

//configurando o express
const app = express();

//liberando acesso para todas as origens
app.use(cors());

//consegue entender arquivos no formato JSON
app.use(express.json());

//configura o acesso automatico dos arquivos sem ser necessario a escrita manual
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"public")));

//Bloco Usuarios(Inicio):
//Verifica se o usuario e senha enviados pelo o front existem no banco de dados 
app.post("/logar", async (req, res) =>{
    //Pega os dados enviados pelo o front-end no body
    const { login, senha, tipo } = req.body;
    console.log("Verificação de usuario");
    try{
        let showUsuario;
        //Procura o usuario no metodo que o cliente escolheu fazer login
        switch(tipo){
            case "nome":
                showUsuario = await Usuarios.findOne({
                    where: {
                        nome: login
                    }
                });
            break;
            case "email":
                showUsuario = await Usuarios.findOne({
                    where: {
                        email: login
                    }
                });
            break;
            case "numero":
                showUsuario = await Usuarios.findOne({
                    where: {
                        numero: login
                    }
                });
            break;
        }
        //Faz verificação se o usuario foi encontrado e se a senha é a mesma
        if(showUsuario != null){
            //Faz a comparação para se a senha digitada pelo o usuario passar pelos os mesmos caminhos que a senha do banco fez, o resultado será o mesmo que a senha salva ou não
            const senhasIguais = await bcrypt.compare(senhaDigitada, showUsuario.senha)
            if(senhasIguais){
                //Retorna true para o front
                res.json({ encontrou: true, usuario: showUsuario });
            }else{
                //Retorna false para o front
                res.json({ encontrou: false});
            }
        }else{
            //Retorna false para o front
            res.json({ encontrou: false});
            console.log(showUsuario.senha + " " + showUsuario);
        }
    } catch (error){
        //Se algum erro impedir a continuação do codigo;
        res.send("Erro: " + error);
        console.log("Erro: " + error);
    }
});

//Cria um novo usuario
app.post("/usuarios", async (req, res) =>{
    //pega a senha digitade pelo o usuario
    const senhaDigitada = req.body.senha;
    //embaralha a senha antes de ser cadastrada para mais segurança
    const senhaHash = await bcrypt.hash(senhaDigitada, 10);
    try{
        //Montagem do objeto que será criado no banco de dados
        await Usuarios.create(
            {
                nome: req.body.nome,
                numero: req.body.numero,
                email: req.body.email,
                senha: senhaHash,
            }
        );
        res.status(201).json({ msg: "Usuario criado com sucesso"});
    } catch (error){
        //Se o nome, email ou numero ja existir irá dar este erro
        if (error.name === "SequelizeUniqueConstraintError") {
            //Pega o campo que deu erro
              const campo = error.errors[0].path;

            return res.status(400).json({
                erro: `O campo ${campo} já está cadastrado`, msg: 'Erro'
            });
        }
    }
});
//Bloco Usuario(Fim)


//Bloco Receitas(Inicio)
//Pega todas as receitas do usuario
app.get("/receitas/:id", async (req, res) =>{
    try{
        //Procura o usuario que possui o id igual enviado pelo o front-end
        const receitaUsuario = await Receita.findAll({
            where: {
                //pega o id enviado e faz a verificação
                idUsuario: req.params.id
            }
        });
        //envia o resultado do que foi encontrado
        res.json({ receitas: receitaUsuario });
    } catch(error){
        //se der algum a mensagem mais qual foi o erro que será enviado
        res.json({ receitas: 'error', erro: error});
    }
});

//Cria uma nova receita do usuario
app.post("/receitas", async (req, res) => {
    //Busca as informações enviadas pelo o front
    const { id, nomeReceita, diaHorario, valor } = req.body;
    try{
        //Cria a nova receita
        await Receita.create(
            {
                idUsuario: id,
                nomeReceita: nomeReceita,
                diaHorario: diaHorario,
                valor: valor,
            }
        );
        //Mensagem concluido a criação
        res.status(201).json({msg: "Receita adicionada com sucesso"});
    } catch(error){
        //Se o erro for por que algum dado repetiu em algum campo na qual o dado deve ser unico
        if(error.name === "SequelizeUniqueConstraintError") {
            const campo = error.errors[0].path;

            return res.status(400).json({
                erro: `O campo ${campo} ja está cadastrado`, msg: 'Erro'
            });
        //Se for algum outro tipo de erro
        }else{
            return res.json({
                erro: "Erro ao adicionar uma nova receita: " + error, msg: "Erro"
            })
        }
    }
});

//Deleta uma receita do usuario
app.delete("/receitas/:id", async (req, res) => {
    try{
        //Comando que deleta a receita
        await Receitas.destroy({
            //Verificação do id
            where: { id: req.params.id }
        });
        //Mensagem de sucesso
        res.json({ msg: "Receita deletada com sucesso"});
    }catch(error){
        //Mensagem de erro
        res.json({ msg: "Erro", erro: "Erro ao excluir a receita: " + error })
    }
})
//Bloco Receita(Fim)

//Bloco Despesa(Inicio)
//Pega todas as despesas do usuario
app.get("/despesa/:id", async (req, res) => {
    //Pega o id enviado pelo Front-end
    const id = req.params.id;
    try{
        //Busca o usuario e guarda em uma variavel
        const usuarioDespesa = await Despesas.findAll({
            where: {
                //Busca o usuario que tem o id igual ao enviado
                idUsuario: id
            }
        });
        //Envia as despesas para o fron-end
        res.json({ despesas: usuarioDespesa });
    }catch(error){
        //Envia que deu erro para o front-end
        res.json({ despesas: "error", erro: error})
    }
});

//Busca todas as depesas que são fixas
app.post("/despesaFixa", async (req, res) => {
    //Pega os dados enviados do front pelo o body
    const { id, fixa } = req.body;
    try{
        //Comando que procura as despesas
        const despesasFixas = await Despesas.findAll({
            where: {
                //Verificação se as despesas são o usuario escolhido e se são fixas
                idUsuario: id,
                fixa: fixa
            }
        });
        //Mensagem de sucesso
        res.json({ despesasFixas: despesasFixas });
    }catch(error){
        //Mensagem de erro
        res.json({ despesasFixas: "erro", erro: "Erro ao tentar buscar as despesas fixas: " + error});
    }
})

//Cria uma nova despesa
app.post("/despesa", async (req, res) => {
    //busca os dados enviados pelo o front no body
    const { id, nome, tipo, diaHorario, valor, fixa, status } = req.body;
    try{
        //Comando que cria a nova despesa
        await Despesas.create(
            {
                //dados que serão utilizados:
                idUsuario: id,
                nomeDespesa: nome,
                tipo: tipo,
                diaHorario: diaHorario,
                valor: valor,
                fixa: fixa,
                status: status,
            }
        );
        //Mensagem de sucesso
        res.status(201).json({ msg: "Despesa adicionada com sucesso"});
    }catch(error){
        //Se o erro for por que algum dado repetiu em algum campo na qual o dado deve ser unico
        if(error.name === "SequelizeUniqueConstraintError") {
            const campo = error.errors[0].path;

            return res.status(400).json({
                erro: `O campo ${campo} ja está cadastrado`, msg: 'Erro'
            });
        //Se for algum outro tipo de erro
        }else{
            return res.json({
                erro: "Erro ao adicionar uma nova despesa: " + error, msg: "Erro"
            })
        }
    }
})

//Delete uma despesa
app.delete("/despesa/:id", async (req, res) => {
    try{
        //Comando que deleta uma despesa
        await Despesas.destroy({
            //Procura o usuario pelo o id
            where: { id: req.params.id }
        });
        //Mensagem de sucesso
        res.json({ msg: "Despesa excluida com sucesso" })
    }catch(error){
        //Mensadem de erro
        res.json({ msg: "Erro", erro: "Erro ao tentar excluir a despesa: " + error})
    }
})
//Bloco Despesa(Fim)

//Bloco Metas(Inicio)
//Mostra todas as metas do usuario
app.get("/metas/:id", async (req, res) => {
    //Busca o id enviado pelo o front
    const id = req.params.id;
    try{
        //Comando que busca o usuario e guarda ele em uma variavel
        const usuarioMetas = await Metas.findAll({
            where: {
                //Busca as metas que possui o id do usuario
                idUsuario: id
            }
        });
        //Envia todas as metas do usuario
        res.json({ metas: usuarioMetas });
    }catch(error){
        //Envia erro, ser algum erro
        res.json({ metas: 'error', erro: error});
    }
});

//Cria uma nova meta
app.post("/metas", async (req, res) => {
    //Busca todos os dados enviados pelo o front
    const { id, nome, tipo, objetivo1, objetivo2, tempo, situacaoAtual } = req.body;
    try{
        //Comando que cria uma nova meta
        await Metas.create(
            {
                //Dados utilizados:
                idUsuario: id,
                tipo: tipo,
                nomeMeta: nome,
                objetivo1: objetivo1,
                objetivo2: objetivo2,
                tempo: tempo,
                situacaoAtual: situacaoAtual,
            }
        );
        //Mensagem de sucesso
        res.status(201).json({ msg:"Meta criado com sucesso" });
    }catch(error){
        //Se o erro for por que algum dado repetiu em algum campo na qual o dado deve ser unico
        if(error.name === "SequelizeUniqueConstraintError") {
            const campo = error.errors[0].path;

            return res.status(400).json({
                erro: `O campo ${campo} ja está cadastrado`, msg: 'Erro'
            });
        //Se for algum outro tipo de erro
        }else{
            return res.json({
                erro: "Erro ao criar uma nova meta: " + error, msg: "Erro"
            })
        }
    }
})

//Deleta uma meta
app.delete("/metas/:id", async (req, res) => {
    try{
        //Comando que deleta a meta
        await Metas.destroy({
            //Verificação para achar a meta desejada
            where: { id: req.params.id }
        })
        //Mensagem de sucesso
        res.json({ msg:"Meta excluida com sucesso "})
    }catch (error){
        //Mensagem de erro
        res.json({ msg: "erro", erro: "Erro ao deletar a meta: " + error})
    }
});
//Bloco Metas(Fim)

//Bloco tipoDespesa(Inicio)
app.post("/tipoDespesa", async (req, res) => {
    const { id, nome, diaHorario } = req.body;
    try{
        await TipoDespesa.create(
            {
                idUsuario: id,
                nome: nome,
                diaHorario: diaHorario
            }
        );
        res.json({ msg: "Categoria de despesa criado com sucesso" });
    } catch(error){
        //Se o erro for por que algum dado repetiu em algum campo na qual o dado deve ser unico
        if(error.name === "SequelizeUniqueConstraintError") {
            const campo = error.errors[0].path;

            return res.status(400).json({
                erro: `O campo ${campo} ja está cadastrado`, msg: 'Erro'
            });
        //Se for algum outro tipo de erro
        }else{
            return res.json({
                erro: "Erro ao criar uma nova categoria: " + error, msg: "Erro"
            })
        }
    }
});

app.get("/tipoDespesa/:id", async (req, res) => {
    try{
        const tipoDespesaUsuario = await TipoDespesa.findAll({
            where: {
                idUsuario: req.params.id
            }
        });
        res.json({ tipoDespesa: tipoDespesaUsuario });
    }catch (error){
        res.json({ tipoDespesa: "Erro", erro: error});
    }
});

app.delete("/tipoDespesa/:id", async (req, res) => {
    try{
        await TipoDespesa.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({ msg: "Categoria de Despesa deletado com sucesso"})
    } catch (error){
        res.json({ msg: "Erro", erro: "Erro ao tentar excluir a categoria de despesa: " + error});
    }
})
//Bloco tipo Despesa(Fim)

//Verifica todos os usuarios que possuem no banco de dados;
app.get("/todos", async (req, res) =>{
    try{
        //Busca todos os usuarios do banco de dados
        const showUsuario = await Usuarios.findAll();
        res.send(showUsuario);
    } catch (error){
        res.send("Erro: " + error);
    }
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});