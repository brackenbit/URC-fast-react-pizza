/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

export async function getAddress({ latitude, longitude }) {
    const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
    );
    if (!res.ok) throw Error("Failed getting address");

    const data = await res.json();
    return data;
}
