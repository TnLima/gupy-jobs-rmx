//botao remoto
let result = false;
const toggleContainer = document.querySelector("toggleContainer"),
    toggle = document.querySelector(".toggleRemoto");

toggle.addEventListener("click", () => {
    
    if (result == false) {
        result = true;
    } else if (result == true){ 
        result = false;
    }
    
    console.log(result);
})

toggle.addEventListener("click", () => toggle.classList.toggle("active"));
//tutorial:  https://www.youtube.com/watch?v=TyITCYwsWHs

function customSearch() {

    const api = `https://cors-everywhere.onrender.com/https://portal.api.gupy.io/api/v1/jobs?`;
    let jobSearch = document.getElementById("barraBusca").value;
    let jobName = "&jobName=" + jobSearch;
    const type = "&type=vacancy_type_effective";
    const isRemoteWork = "&isRemoteWork="+result;
    const limit = "&limit=100";

    // console.log("HELLO");

    const fetchGupy = async () => {

        document.getElementById("loading").style.display = "block";

        const APIResponse = await fetch(

            // `https://cors-everywhere.onrender.com/https://portal.api.gupy.io/api/v1/jobs?&jobName=financeiro&limit=300&type=vacancy_type_effective`


            `${api}${limit}${jobName}${isRemoteWork}${type}`
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
      <div class="cards">
          
        <div class="title">
        <div class="info-company">
        <img src="${element["careerPageLogo"]}" alt="${element["careerPageName"]
                }" >
        
        <h1 class="job-company">${element["careerPageName"]}</h1>
          
        </div>
          
          <h3>${element["name"]}</h3>

        </div>

        <div class="location">
          <span>${element["city"]}</span>
          <span>/</span>
          <span>${element["state"]}</span>
        </div>

        <span>Vaga publicada em: ${new Date(
                    element["publishedDate"]
                ).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}</span>
      
      <div class="remote-work">
      <span class="tooltip">Trabalho remoto:  ${element["isRemoteWork"] === true
                    ? `<i class="ph-house"></i> <span class="tooltiptext">Sim
        </span>`
                    : `<i class="ph-buildings"></i> <span class="tooltiptext">Não
        </span>`
                }</span>
      </div>
      
      <div class="gupy">
      <span class="tooltip">Tem Selo Gupy: ${element["badges"]["friendlyBadge"] === true
                    ? `<i class="ph-circle-wavy-check"></i>
      
      <span class="tooltiptext">Empresas com alta taxa de retorno e atividade nas vagas nos últimos 3 meses</span>`
                    : `<i class="ph-circle-wavy-warning"></i> 
      
      <span class="tooltiptext">Sem informações</span>`
                }
      </span>
      </div>

        <a class="textoGrande" href="${element["careerPageUrl"]}" target="_blank">
        Ver vaga
        <i class="ph-arrow-square-out-fill"></i>
        </a>
      </div>
    `;
            
        });     
        
        function card2html() {

            document.getElementById("cards-container").innerHTML = "";

            for (let i = 0; i < jobCards.length; i++) {
                document.getElementById("cards-container").innerHTML += jobCards[i];
            }
            
        }

        card2html();

    };
    renderGupy();
}