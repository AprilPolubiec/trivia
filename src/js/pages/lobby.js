export default function Lobby({ id }) {
  const el = document.createElement("div");
  el.innerText = "chillin in da lobs of " + id;
  console.log(el);
  return el;
}
