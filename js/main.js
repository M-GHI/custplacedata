  const shopsData = {
    "brasserie-le-sud": {
        kpis: {
            tauxConversion: 2.3,
            trafic: 6300,
            panierMoyen: 34.5
        },
        chartData: {
            labels: ['Qualité de la cuisine', 'Service', 'Accueil', 'Accessibilité et réservation'],
            datasets: [{
                label: 'Répartition des avis',
                data: [3, 2, 1, 1],
                backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444'],
                hoverOffset: 10
            }]
        },
        insights: [
            {
                title: "📝 Analyse de verbatims",
                description: "42% des avis concernent la qualité de la cuisine. Moyenne globale : 4,5/5."
            },
            {
                title: "📊 Performances – semaine du 21 au 27 juillet 2025",
                description: `
                    - Note moyenne : 4,5/5\n
                    - Nouveaux avis : 6\n
                    - Taux de réponse : 83%\n\n
                    Commentaires : Très bien mangé, service à améliorer.
                `
            }
        ]
    }
};
      window.onload = function () {
    const shopSelector = document.getElementById("shopSelector");
    Object.keys(shopsData).forEach(shopKey => {
        const option = document.createElement("option");
        option.value = shopKey;
        option.textContent = shopKey.replace(/-/g, " ");
        shopSelector.appendChild(option);
    });

    shopSelector.addEventListener("change", (e) => {
        const shopKey = e.target.value;
        if (shopKey && shopsData[shopKey]) {
            displayDashboard(shopKey);
        }
    });
};


function displayDashboard(shopKey) {
    const data = shopsData[shopKey];
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("loading").style.display = "none";

    // KPIs

    document.getElementById("conversion-value").textContent = data.kpis.tauxConversion + " %";
    document.getElementById("traffic-value").textContent = data.kpis.trafic;

    // Insights
    const insightsContainer = document.getElementById("insights-container");
    insightsContainer.innerHTML = "";
    data.insights.forEach(insight => {
        const div = document.createElement("div");
        div.classList.add("insight-card");
        div.innerHTML = `<h4>${insight.title}</h4><p>${insight.description}</p>`;
        insightsContainer.appendChild(div);
    });

    // Chart.js update
    updateCharts(data.chartData);
}

// 📊 Création ou mise à jour des charts
let revenueChartInstance;
function updateCharts(chartData) {
    const ctx = document.getElementById("revenueChart").getContext("2d");
    if (revenueChartInstance) revenueChartInstance.destroy();
    revenueChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData.labels,
            datasets: chartData.datasets
        },
        options: {                maintainAspectRatio: true
            , aspectRatio: 4,
            responsive: true,
            plugins: {

                     legend: {
                    "display": true,
                    "position": "right",
                    "align": "start"
                }
            }
        }
    });
}


