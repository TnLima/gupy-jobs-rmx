//botao remoto
let result = false;

let nclass = "bg-dark"
const toggleContainer = document.querySelector("toggleContainer"),
    toggle = document.querySelector(".toggleRemoto");

toggle.addEventListener("click", () => {


    if (result == false) {
        result = true;
        document.getElementById("body").classList.add("bg-dark");
        document.getElementById("logo-container").classList.add("bg-lightdark");
        document.getElementById("label-remoto").classList.add("text-white");
        document.getElementById("git-logo").innerHTML = `<img src="images/github-white.svg" alt="">`


    } else if (result == true) {
        result = false;
        document.getElementById("body").classList.remove("bg-dark");
        document.getElementById("label-remoto").classList.remove("text-white");
        document.getElementById("logo-container").classList.remove("bg-lightdark");
        document.getElementById("git-logo").innerHTML = `<img src="images/github.svg" alt="">`
    }

    console.log(result);

})

//Evento da tecla enter na barra de busca
let input = document.getElementById("barraBusca");
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        customSearch();
    }
});

toggle.addEventListener("click", () => toggle.classList.toggle("active"));
//tutorial:  https://www.youtube.com/watch?v=TyITCYwsWHs

// Define a function to scroll by a percentage of the viewport height
function scrollByPercentage(percentage) {
    var scrollDistance = window.innerHeight * percentage;
    window.scrollBy({ top: scrollDistance, behavior: 'smooth' });
}

function customSearch() {

    const api = `https://cors-everywhere.onrender.com/https://portal.api.gupy.io/api/v1/jobs?`;
    let jobSearch = document.getElementById("barraBusca").value;
    let jobName = "&jobName=" + jobSearch;
    const type = "&type=vacancy_type_effective";
    const isRemoteWork = "&isRemoteWork=" + result;
    const limit = "&limit=100";

    //teste de api
    const testApi = "/demo-api.json"

    // console.log("HELLO");

    const fetchGupy = async () => {

        document.getElementById("loading").style.display = "block";

        const APIResponse = await fetch(

            // `https://cors-everywhere.onrender.com/https://portal.api.gupy.io/api/v1/jobs?&jobName=financeiro&limit=300&type=vacancy_type_effective`


            `${api}${limit}${jobName}${isRemoteWork}${type}`

            //testApi
        );

        document.getElementById("loading").style.display = "none";

        if (APIResponse.status === 200) {
            const data = await APIResponse.json();
            return data;
        } else {
            alert("Erro ao buscar dados");
        }
    };

    const renderGupy = async () => {
        const response = await fetchGupy();

        // Sort the jobs by published date in descending order
        const sortedJobs = response.data.sort((a, b) => {
            return new Date(b.publishedDate) - new Date(a.publishedDate);
        });

        // Create an array of job cards
        const jobCards = sortedJobs.map((element) => {
            return `
<a href="${element["jobUrl"]}" class="cards" target="_blank">

    <!--Informaçoes da empresa-->
    <div class="title">
        <div class="info-company">
            <img class="company-logo" src="${element["careerPageLogo"]}" alt="${element[" careerPageName"]}">
            <h1 class="job-company">${element["careerPageName"]}</h1>
        </div>
        <h3>${element["name"]}</h3>
    </div>

    <!--Cidade, estado-->
    <div class="location">
        <span>${element["city"]}</span>
        <span>/</span>
        <span>${element["state"]}</span>
    </div>

    <!--Data de publicação-->
    <span>                
        Vaga publicada em: ${new Date(
            element["publishedDate"]
        ).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })}
    </span>

    <!--Trabalho remoto-->
    <div class="remote-work">
        <span class="tooltip">Trabalho remoto: ${element["isRemoteWork"] === true
                    ? `<i class="ph-house"></i> <span class="tooltiptext">Sim
            </span>`
                    : `<i class="ph-buildings"></i> <span class="tooltiptext">Não
            </span>`
                }</span>
    </div>

    <!--Selo gupy-->
    <div class="gupy">
        <span class="tooltip">Tem Selo Gupy: ${element["badges"]["friendlyBadge"] === true
                    ? `<i class="ph-circle-wavy-check"></i>

            <span class="tooltiptext">Empresas com alta taxa de retorno e atividade nas vagas nos últimos 3
                meses</span>`
                    : `<i class="ph-circle-wavy-warning"></i>

            <span class="tooltiptext">Sem informações</span>`
                }
        </span>
    </div>
</a>
            `;

        });

        function card2html() {

            document.getElementById("cards-container").innerHTML = "";

            for (let i = 0; i < jobCards.length; i++) {
                document.getElementById("cards-container").innerHTML += jobCards[i];
                document.getElementById("searchMsg").innerHTML = ""

            }

            if (jobCards[0] == null) {
                document.getElementById("searchMsg").innerHTML = `
                <div class="">
                <div class="buscaNull" id="busca-null">Vaga não encontrada</div>
                </div> 
                `
            }

        }

        card2html();
        scrollByPercentage(0.4);

    };
    renderGupy();
}