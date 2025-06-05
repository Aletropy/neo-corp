function initTabs() {
    document.querySelector('.tab-content.active').style.display = 'block';

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.dataset.tab;

            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });

            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });

            document.getElementById(tabId).style.display = 'block';
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });

    document.querySelectorAll(".campaign-card").forEach(element => element.addEventListener('click', () => {
    const campainIdRaw = element.dataset.campain;
    if(!campainIdRaw)
    {
        console.warn("Campaign id for campain card not set. What fuck happend?"); 
        return;
    }
    const campainId = parseInt(campainIdRaw);
    if(isNaN(campainId))
    {
        console.warn("Campaigng id is not an id? What fuck happend²");
        return;
    }

    window.location.href = `/campain/${campainId}`;
    }))
}

document.addEventListener('DOMContentLoaded', initTabs);

function initCardHover() {
    document.querySelectorAll('.neon-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}
initCardHover();