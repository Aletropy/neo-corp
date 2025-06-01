const origins = [
    {
        title: "Acadêmico",
        description: `Você era um pesquisador ou professor universitário. De forma proposital
ou não, seus estudos tocaram em assuntos misteriosos e chamaram a
atenção da Ordo Realitas.`
        , pericias: ["Ciências", "Investigação"],
        poder: "Saber é Poder"
    },
    {
        title: "Agente de Saúde",
        description: `Você era um profissional da saúde como um enfermeiro, farmacêutico, médico,
psicólogo ou socorrista, treinado no atendimento e cuidado de pessoas. Você pode
ter sido surpreendido por um evento paranormal durante o trabalho ou mesmo
cuidado de um agente da Ordem em uma emergência, que ficou surpreso com
o quão bem você lidou com a situação.`
        , pericias: ["Intuição", "Medicina"],
        poder: "Técnica Medicinal"
    },
    {
        title: "Amnésico",
        description: `Você perdeu a maior parte da memória. Sabe apenas o próprio nome, ou
nem isso. Sua amnésia pode ser resultado de um trauma paranormal ou
mesmo de um ritual. Talvez você tenha sido vítima de cultistas? Talvez
você tenha sido um cultista? Seja como for, hoje a Ordem é a
única família que conhece. Quem sabe, cumprindo missões,
você descubra algo sobre seu passado.`
        , pericias: ["Duas a escolha do mestre"],
        poder: "Vislumbres do Passado"
    },
    {
        title: "Artista",
        description: `Você era um ator, músico, escritor, dançarino, influenciador...
Seu trabalho pode ter sido inspirado por uma experiência
paranormal do passado e o que o público acha que é pura
criatividade, a Ordem sabe que tem um lado mais sombrio.`
        , pericias: ["Artes", "Enganação"],
        poder: "Magnum Opus"
    },
    {
        title: "Atleta",
        description: `Você competia em um esporte individual ou por equipe, como
natação ou futebol. Seu alto desempenho pode ser fruto de alguma
influência paranormal que nem mesmo você conhecia ou você pode ter
se envolvido em algum evento paranormal em uma de suas competições.`
        , pericias: ["Acrobacia", "Atletismo"],
        poder: "110%"
    },
    {
        title: "Chef",
        description: `Você é um cozinheiro amador ou profissional. Talvez trabalhasse em
um restaurante, talvez simplesmente gostasse de cozinhar para a
família e amigos. Como sua comida fez com que você se en-
volvesse com o paranormal? Ninguém sabe. Mas os outros
agentes adoram quando você vai para a missão!`
        , pericias: ["Fortitude", "Profissão"],
        poder: "Ingrediente Secreto"
    },
    {
        title: "Criminoso",
        description: `Você vivia uma vida fora da lei, seja como mero batedor de
carteiras, seja como membro de uma facção criminosa. Em
algum momento, você se envolveu em um assunto da Ordem. Talvez tenha roubado um item amaldiçoado? A
organização, por sua vez, achou melhor recrutar seus
talentos do que ter você como um estorvo.`
        , pericias: ["Crime", "Furtividade"],
        poder: "O Crime Compensa"
    },
    {
        title: "Cultista Arrependido",
        description: `Você fez parte de um culto paranormal. Talvez fossem
ignorantes iludidos, que acreditavam estar contatando
entidades benevolentes. Talvez soubessem exatamente
o que estavam fazendo. Seja como for, algo abriu seus
olhos e agora você luta pelo lado certo — embora
carregue para sempre traços de sua vida pregressa.
Outros membros da Ordem podem desconfiar de sua
conversão e você sabe que precisará se esforçar para
conquistar a confiança de todos.`
        , pericias: ["Ocultismo", "Religião"],
        poder: "Traços do Outro Lado"
    },
    {
        title: "Desgarrado",
        description: `Você não vivia de acordo com as normas da socieda-
de. Podia ser um eremita, uma pessoa em situação
de rua ou simplesmente alguém que descobriu o
paranormal e abandonou sua rotina — sabendo o
quão frágil era a existência humana, não conseguia
simplesmente continuar indo para o trabalho todo
o dia. De qualquer forma, a vida sem os confortos
modernos o deixou mais forte.`
        , pericias: ["Fortitude", "Sobrevivência"],
        poder: "Calejado"
    },
    {
        title: "Engenheiro",
        description: `Enquanto os acadêmicos estão preocupados com
teorias, você colocar a mão na massa, seja como en-
genheiro profissional, seja como inventor de garagem.
Provavelmente você criou algum dispositivo paranor-
mal que chamou a atenção da Ordem.`
        , pericias: ["Profissão", "Tecnologia"],
        poder: "Ferramentas Favoritas."
    },
    {
        title: "Executivo",
        description: `Você possuía um trabalho de escritório em uma
grande empresa, banco ou corporação. Era um admi-
nistrador, advogado, contador ou de qualquer outra
profissão que lida com papelada e burocracia. Sua
vida era bastante normal, até que você descobriu
algo que não devia. Talvez o sucesso da empresa
residisse em um ritual? Talvez toda a corporação
fosse fachada para um culto e o presidente, um líder
cultista envolvido com entidades paranormais? Após
essa descoberta, você foi recrutado pela Ordem e
trocou seu trabalho de escritório por missões de
campo — hoje, sua vida é tudo, menos normal.`
        , pericias: ["Diplomacia", "Profissão"],
        poder: "Processo Otimizado"
    },
    {
        title: "Investigador",
        description: `Você era um investigador do governo, como um pe-
rito forense ou policial federal, ou privado, como
um detetive particular. Pode ter tido contato com o
paranormal em algum caso ou ter sido recrutado pela
Ordem por suas habilidades de resolução de mistérios.`
        , pericias: ["Investigação", "Percepção"],
        poder: "Faro para Pistas"
    },
    {
        title: "Lutador",
        description: `Você pratica uma arte marcial ou esporte de luta, ou
cresceu em um bairro perigoso onde aprendeu briga
de rua. Já quebrou muitos ossos, tanto seus quanto
dos outros. Pode ter conhecido a Ordem após um
torneio secreto envolvendo entidades do Outro Lado
ou ter sido recrutado pela sua capacidade de luta.`
        , pericias: ["Luta", "Reflexos"],
        poder: "Mão Pesada"
    },
    {
        title: "Magnata",
        description: `Você possui muito dinheiro ou patrimônio. Pode ser
o herdeiro de uma família antiga ligada ao oculto, ter
criado e vendido uma empresa e decidido usar sua
riqueza para uma causa maior, ou ter ganho uma
loteria após inadvertidamente escolher números
amaldiçoados que formavam um ritual.`
        , pericias: ["Diplomacia", "Pilotagem"],
        poder: "Patrocinador da Ordem"
    },
    {
        title: "Mercenário",
        description: `Você é um soldado de aluguel, que trabalha sozinho
ou como parte de alguma organização que vende
serviços militares. Escoltas e assassinatos fizeram
parte de sua rotina por tempo o suficiente para você
se envolver em alguma situação com o paranormal.`
        , pericias: ["Iniciativa", "Intimidação"],
        poder: "Posição de Combate"
    },
    {
        title: "Militar",
        description: `Você serviu em uma força militar, como o exército ou
a marinha. Passou muito tempo treinando com armas
de fogo, até se tornar um perito no uso delas. Acos-
tumado a obedecer ordens e partir em missões, está
em casa na Ordo Realitas. O inimigo é diferente, mas
um tiro bem dado continua resolvendo o problema.`
        , pericias: ["Pontaria", "Tática"],
        poder: "Para Bellum."
    },
    {
        title: "Operário",
        description: `Pedreiro, industriário, operador de máquinas em
uma fábrica… Você passou uma parte de sua vida
em um emprego braçal, desempenhando atividades
práticas que lhe deram uma visão pragmática do
mundo. Sua rotina mundana, entretanto, foi con-
frontada de alguma forma pelo paranormal, e você
não consegue mais esquecer tudo que viu sobre os
mistérios do mundo.`
        , pericias: ["Fortitude", "Profissão"],
        poder: "Ferramenta de Trabalho"
    },
    {
        title: "Policial",
        description: `Você fez parte de uma força de segurança pública,
civil ou militar. Em alguma patrulha ou chamado se
deparou com um caso paranormal e sobreviveu para
contar a história.`
        , pericias: ["Percepção", "Pontaria"],
        poder: "Patrulha"
    },
    {
        title: "Religioso",
        description: `Você é devoto ou sacerdote de uma fé. Independen-
temente da religião que pratica, se dedica a auxiliar
as pessoas com problemas espirituais. A partir disso,
teve contato com o paranormal, o que fez com que
fosse convocado pela Ordem.`
        , pericias: ["Religião", "Vontade"],
        poder: "Acalentar"
    },
    {
        title: "Servidor Público",
        description: `Você possuía carreira em um órgão do governo, lidan-
do com burocracia e atendendo pessoas. Sua rotina
foi quebrada quando você viu que o prefeito era um
cultista ou que a câmara de vereadores se reunia à
noite para realizar rituais. Quando os próprios repre-
sentantes do povo estão dispostos a sacrificá-lo para
entidades malignas, onde reside nossa esperança?
Hoje, você sabe a resposta para essa pergunta: na
Ordo Realitas.`
        , pericias: ["Intuição", "Vontade"],
        poder: "Espírito Cívico"
    },
    {
        title: "Teórico da Conspiração",
        description: `A humanidade nunca pisou na lua. Reptilianos ocu-
pam importantes cargos públicos. A Terra é plana...
E secretamente governada pelos Illuminati. Você sabe
isso tudo, pois investigou a fundo esses importantes
assuntos. Quando sua pesquisa esbarrou no para-
normal, você foi recrutado. Na Ordem, sua loucura
determinação será usada para um bom propósito.`
        , pericias: ["Investigação", "Ocultismo"],
        poder: "Eu Já Sabia"
    },
    {
        title: "T.I.",
        description: `Programador, engenheiro de software ou simples-
mente “o cara da T.I.”, você tem treinamento e ex-
periência para lidar com sistemas informatizados.
Seu talento (ou curiosidade exagerada) chamou a
atenção da Ordem.`
        , pericias: ["Investigação", "Tecnologia"],
        poder: "Motor de Busca"
    },
    {
        title: "Trabalhador Rural",
        description: `Você trabalhava no campo ou em áreas isoladas,
como fazendeiro, pescador, biólogo, veterinário...
Você se acostumou com o convívio com a natureza
e os animais e talvez tenha ouvido uma ou outra
história de fantasmas ao redor da fogueira. Em algum
momento da sua vida, porém, descobriu que muitas
dessas histórias são verdadeiras.`
        , pericias: ["Adestramento", "Sobrevivência"],
        poder: "Desbravador"
    },
    {
        title: "Trambiqueiro",
        description: `Uma vida digna exige muito trabalho, então é melhor
nem tentar. Você vivia de pequenos golpes, jogatina
ilegal e falcatruas. Certo dia, enganou a pessoa errada;
no dia seguinte, se viu servindo à Ordem. Pelo menos
agora tem a chance de usar sua lábia para o bem.`
        , pericias: ["Crime", "Enganação"],
        poder: "Impostor"
    },
    {
        title: "Universitário",
        description: `Você era aluno de uma faculdade. Em sua rotina de
estudos, provas e festas, acabou descobrindo algo —
talvez um livro amaldiçoado na antiga biblioteca do
campus? Por seu achado, foi convocado pela Ordem.
Agora, estuda com mais afinco: nesse novo curso,
ouviu dizer que as provas podem ser mortais.`
        , pericias: ["Atualidades", "Investigação"],
        poder: "Dedicação"
    },
    {
        title: "Vítima",
        description: `Em algum momento de sua vida — infância, juventude
ou início da vida adulta — você encontrou o paranor-
mal... E a experiência não foi nada boa. Você viu os
espíritos dos mortos, foi atacado por uma entidade
ou mesmo foi sequestrado para ser sacrificado em um
ritual impedido no último momento. A experiência
foi traumática, mas você não se abateu; em vez dis-
so, decidiu lutar para impedir que outros inocentes
passem pelo mesmo. E, já tendo sendo vítima do
paranormal, se tornou habilidoso em evitar perigos.`
        , pericias: ["Reflexos", "Vontade"],
        poder: "Cicatrizes Psicológicas"
    },
]

function createOriginCard(cardInfo) {

    const fatherCard = document.createElement("div");
    fatherCard.classList.add("origin-card", "min-w-[300px]", "min-h-[280px]", "max-h-[280px]", "bg-gradient-to-b", "from-gray-800", "to-gray-900", "rounded-xl", "p-8", "mx-3", "border", "border-gray-600")

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("bg-gray-700", "rounded-lg", "p-4", "mb-4")

    let title = document.createElement("h3");
    title.classList.add("text-lg", "font-bold", "text-white", "text-center");
    title.textContent = cardInfo.title;
    titleDiv.appendChild(title);

    fatherCard.appendChild(titleDiv);

    const description = document.createElement("p");
    description.classList.add("text-gray-300", "text-sm", "mb-4", "overflow-y-auto");
    description.textContent = cardInfo.description;
    fatherCard.appendChild(description);
    
    return fatherCard;
}

function populateOrigins() {
    const slider = document.getElementById("originSlider");

    for (let origin of origins)
    {
        const card = createOriginCard(origin);
        card.addEventListener('click', () => {
            document.querySelectorAll('.origin-card').forEach(c => {
                c.classList.remove('selected');
            });            
            card.classList.add('selected');
            document.getElementById("origem-input")?.remove();

            const input = document.createElement("input");
            input.id = "origem-input"
            input.type = "hidden"
            input.value = origin.title
            input.name = "origem"

            document.getElementById("characterForm").appendChild(input);
        });
        slider.appendChild(card);
    }
}

window.addEventListener('DOMContentLoaded', () => populateOrigins());