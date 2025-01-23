function updateClock() {
    const hour = document.getElementById("hour");
    const minute = document.getElementById("minute");
    const second = document.getElementById("second");
    const ampm = document.getElementById("ampm");


    const now = new Date();
    const options = { timeZone: "America/New_York" };
    const formatter = new Intl.DateTimeFormat("en-US", {
        ...options,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    const formattedTime = formatter.formatToParts(now);
    hour.textContent = formattedTime.find((part) => part.type === "hour").value;
    minute.textContent = formattedTime.find((part) => part.type === "minute").value;
    second.textContent = formattedTime.find((part) => part.type === "second").value;
    ampm.textContent = formattedTime.find((part) => part.type === "dayPeriod").value.toUpperCase();
}

setInterval(updateClock, 1000);
updateClock();
setInterval(updateClock, 1000);
updateClock();