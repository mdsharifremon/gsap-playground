import gsap from "gsap";


    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cart = document.getElementById('cart');
    const count = document.getElementById('count');

    // Simulate a server request;

    let cartCount = 0;
    function fakeRequest(id) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(id == "journal") {
            reject(new Error("Out of stock"));
          } else {
            cartCount++
            resolve({count: cartCount});
          }
        }, 1000);
      });
    }

const addButtons = document.querySelectorAll('.add');
addButtons.forEach(button => {
  button.addEventListener('click', async (e) => {
    clearTimeout(button.timer);
    button.classList.remove('added', 'error');
    // Button Functionality
    e.target.disabled = true;
    button.textContent = "Adding..."

    // Simulate a network request
    try {
        const data = await fakeRequest(button.dataset.id)
        show(button, "Added", 'added') // call the show to write the text and add classlist

        if(reduce.matches){
            setCount(data.count)
        }
        else{
            const imgElement = button.closest('.card').querySelector('img')
            flyToCart(imgElement, data.count)
        }


        
    } catch (error) {
            show(button, error.message, "error")
    }

    e.target.disabled = false;
    
  });

})


function show(btn, text, state) {
    btn.textContent = text;
    btn.classList.add(state);
    btn.timer = setTimeout(() =>{
        btn.textContent = "Add to cart";
        btn.classList.remove(state)
    }, 1500)
}

function setCount(number) {
    count.textContent = number;
}


function flyToCart(img, count) {

    const imgSize = 56;
    const imgRect = img.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    // get StartX and StartY
    const startX = imgRect.left + imgRect.width / 2;
    const startY = imgRect.top + imgRect.height / 2;

    console.log("StartX: ", startX, "StartY: ", startY);

    // Create a ghost image element
    const ghostImg  = document.createElement('img');
    ghostImg.src = img.src;
    ghostImg.alt = "";
    ghostImg.classList.add('ghost');

    // Style the ghost image
    ghostImg.style.width = imgSize  + "px";
    ghostImg.style.left = startX - imgSize / 2 + "px";
    ghostImg.style.top = startY - imgSize / 2 + "px";

    // Append the ghost image to the body
    document.body.appendChild(ghostImg);  

    // Animate the ghost image to the cart
    gsap.to(ghostImg, {
        // react to cart icon center
    x: cartRect.left + cartRect.width / 2 - startX,
    y: cartRect.top + cartRect.height / 2 - startY,
    scale: 0.2,
    duration: 1,
    ease: "power2.in",
    onComplete: () => { 
        ghostImg.remove(); // remove the cloned element
        setCount(count) // update the count
    }
    })

}
