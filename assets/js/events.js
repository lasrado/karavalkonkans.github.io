function getMonthAndDay(dateString) {
    const date = new Date(dateString);

    // Get 3-letter month, e.g. "Jul"
    const month = date.toLocaleDateString("en-US", { month: "short" });

    // Get day as 2-digit string, e.g. "09" or "21"
    const day = String(date.getDate()).padStart(2, "0");

    return { month, day };
}

function createEventHTML(event) {
    const {month, day} = getMonthAndDay(event.start_time);
    const eventLink = `https://www.facebook.com/events/${event.id}`;

    return `
    <div style="padding:16px 0;" class="centered-container">
    <span class="date" id="${event.id}">${month} <strong>${day}</strong></span>
    <header>
        <h2>${event.name}</h2>
    </header>
    <p>
        ${event.description.replace(/\n/g, "<br>")}
    </p>
    ${event.cover ? `<img style="width:100%" src="${event.cover.source}" width="300" alt="Event Image" />` : ""}
    <p style="text-align:center"><a href="${eventLink}" target="_blank" class="btn-facebook">View on Facebook</a></p>
    </div>
    <hr/>
    `;
}

function renderEvents(events) {
    const today = new Date();
    const upcomingEvents = events.filter(e => new Date(e.start_time) >= today);
    const pastEvents = events.filter(e => new Date(e.start_time) < today);

    const upcomingContainer = document.getElementById("events-upcoming");
    const pastContainer = document.getElementById("events-past");

    upcomingContainer.innerHTML = upcomingEvents.length
    ? upcomingEvents.map(createEventHTML).join("")
    : "<p>No upcoming events.</p>";

    pastContainer.innerHTML = pastEvents.length
    ? pastEvents.map(createEventHTML).join("")
    : "<p>No past events.</p>";
}

function setupTabs() {
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tabToShow = btn.getAttribute("data-tab");
            document.querySelectorAll(".tab-content").forEach(content => {
            content.style.display = content.id === `events-${tabToShow}` ? "block" : "none";
            });
        });
    });
}

function createFooterEventHTML(event) {
    const {month, day} = getMonthAndDay(event.start_time);
    const eventLink = `https://www.facebook.com/events/${event.id}`;
    return `
      <li>
          <span class="date">${month} <strong>${day}</strong></span>
          <h3><a href="events.html#${event.id}">${event.name}</a></h3>
          <p class="description">${event.description}</p>
      </li>
    `;
  }
  
  function renderFooterEvents(events) {
    const today = new Date();
    const upcomingEvents = events.filter(e => new Date(e.start_time) >= today);

    const upcomingContainer = document.getElementById("eventdates");
    upcomingContainer.innerHTML = upcomingEvents.length
      ? upcomingEvents.map(createFooterEventHTML).join(""): "No upcoming events.";
  }

  function fetchFooterEvents() {
          // Fetch events and initialize
    fetch("https://kkaapi.netlify.app/.netlify/functions/fetch-events")
    .then(res => res.json())
    .then(data => {
    renderFooterEvents(data.data);
    })
    .catch(() => {
    
    });
  }