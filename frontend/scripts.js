function typeWriter(text, elementId, delay = 25) {
  let i = 0;
  const output = document.getElementById(elementId);
  output.innerHTML = "";
  const intervalId = setInterval(() => {
    for(let i=1;i<intervalId;i++)
      clearInterval(i);
    if (i < text.length) {
      output.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(intervalId);
    }
  }, delay);
}

function call() {
  //var ip = 'http://0.0.0.0:8000/query'
  
  var ip = "http://54.87.25.40:8000/query";
  var query = document.getElementById("query").value;
  fetch(ip, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then((response) => response.json())
    .then((response) =>(typeWriter(response.answers[0].answer,"response_text",25))
    );

  return false;
}
