const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const showError = document.getElementById('show-error');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';


document.getElementById('search').addEventListener('keyup', function (event) {
  if (event.key == 'Enter') {
    document.getElementById('search-btn').click();
  }
});

const loadingSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-none');
  document.getElementById('images-container').classList.toggle('d-none');
  document.getElementById('show-error').classList.toggle('d-none');
}


const getImages = (query) => {
  loadingSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(() => {
      imagesArea.style.display = 'none'
      showError.style.display = 'block';
      showError.innerHTML = '<h1 style ="text-align:center; color:red; margin-top: 50px">Sorry, Images are not Found..!</h1>';
    })
}

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  if (images == false) {
    imagesArea.style.display = 'none'
    showError.style.display = 'block';
    showError.innerHTML = '<h1 style ="margin:auto; color:red; margin-top: 50px">Sorry, Images are not Found..!</h1>';
  } else {
    //imagesArea.innerHTML= ''
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'img-item';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
    showError.style.display = 'none';
  }
  loadingSpinner()
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
  let item = sliders.indexOf(img);
  const imageCount = document.getElementById('pic-counter');
  if (item === -1) {
    sliders.push(img);
    imageCount.innerText = sliders.length;
  }
  if (item > -1) {
    sliders.splice(item, 1);
    imageCount.innerText = sliders.length;
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
    sliderContainer.appendChild(item)
  })

  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {

  const duration = document.getElementById('duration').value;
  if (duration < 0) {
    alert("Time can't be negative..!")
  }
  else{
    createSlider()
  }

})

document.getElementById('duration').addEventListener('keyup', function (event) {
  if (event.key == 'Enter') {
    sliderBtn.click();
  }
});