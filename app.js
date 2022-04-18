const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const header = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const cdInner = $('.cd-inner')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const player = $('.player')
const progress = $('#progress')
const volume = $('#volume')
const repeatBtn = $('.btn-repeat')
const radBtn = $('.btn-random')
const playList = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
        name: "Ghé qua",
        singer: 'DICK',
        path: './asset/album/New folder/1.mp3',
        image: './asset/album/1.jpg'
        },
        {
        name: "Gặp may",
        singer: 'WREN EVANS',
        path: './asset/album/New folder/2.mp3',
        image: './asset/album/2.jpg'
        },
        {
        name: "Gặp Kéo Ánh Nắng",
        singer: 'Lil Wuyn ft Kwzzzy n\' Ricky Star',
        path: './asset/album/New folder/3.mp3',
        image: './asset/album/3.jpg'
        },
        {
        name: "U Là Trời",
        singer: 'Gill',
        path: './asset/album/New folder/4.mp3',
        image: './asset/album/4.jpg'
        },
        {
        name: "Def Jam Exclusive Cypher",
        singer: ' Obito, Right & Seachains',
        path: './asset/album/New folder/5.mp3',
        image: './asset/album/5.jpg'
        },
        {
        name: "Fashion Tán Gái",
        singer: 'Wren Evans ft Low G',
        path: './asset/album/New folder/6.mp3',
        image: './asset/album/6.jpg'
        },
        {
        name: "Cuốn Cho Anh Một Điếu Nữa Đi",
        singer: 'MCK (ft. Wxrdie)',
        path: './asset/album/New folder/7.mp3',
        image: './asset/album/7.jpg'
        },
        {
        name: "Mây Lang Thang",
        singer: 'Tùng TeA & PC  ft. New$oulZ',
        path: './asset/album/New folder/8.mp3',
        image: './asset/album/8.jpg'
        },
        {
        name: "Già Cùng Nhau Là Được",
        singer: 'TeA ft. PC ( Prod. VoVanDuc. )',
        path: './asset/album/New folder/9.mp3',
        image: './asset/album/9.jpg'
        }

    ],

    render: function() {
        const htmls = this.songs.map((song, index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}"  data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
        

        //xử lý sự kiện khi kéo trang thì cd sẽ thu nhỏ lại
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop


            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 + 'px'
            cd.style.opacity = newCdWidth > 0 ? newCdWidth / cdWidth : 0
        }
        
        //xử lý cd quay/dừng

        //add keyFrames cho cdThumb(hoặc có thể dùng classlist add class keyFrames)
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        // mới vào sẽ không quay
        cdThumbAnimate.pause()

        //Play/Pause button
        playBtn.onclick = function() {
            //khi đang play bấm vào sẽ pause và ngược lại thông qua biến isPlaying
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()

            }
        }

            //sự kiện khi nhạc play
            audio.onplay = function() {
            _this.isPlaying = true;
            cdThumbAnimate.play() //cho chạy animate
            cd.classList.add('active')
            cdInner.classList.add('active')
            player.classList.add('playing')
            }

            //sự kiện khi nhạc pause
            audio.onpause = function() {
            _this.isPlaying = false;
            cdThumbAnimate.pause()
            cd.classList.remove('active')
            player.classList.remove('playing')
            }


            //lắng nghe sự kiện thay đổi thời gian thì thanh bar sẽ chạy
            audio.ontimeupdate = function() {
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                    //update thanh bar nhạc
                    progress.value = progressPercent
                }

                //xử lý khi hết bài sẽ tự động qua bài mới
                if(audio.currentTime == audio.duration) {
                    if(_this.isRepeat) {
                        _this.repeatSong()
                    }else if(_this.isRandom) {
                        _this.randomSong()
                    } else {
                        _this.nextSong()
                    }
                    _this.render()
                    setTimeout(function() {audio.play()}, 2000)
                }
            }


            //tua nhạc
            progress.onchange = function(e) {
                //seektime là thời gian dựa trên việc kéo thanh bar nhạc
                const seekTime = e.target.value/100 * audio.duration
                audio.currentTime = seekTime
            }

            //xử lý âm thanh
            volume.onchange = function(e) {

                // vì max value bằng 1
                const seekVolume = e.target.value/100
                audio.volume = seekVolume
            }

            // next bài

            nextBtn.onclick = function() {
                if(_this.isRandom) {
                    _this.randomSong()
                } else {
                    _this.nextSong();
                }
                _this.render()
                setTimeout(function() {audio.play()}, 2000)
            }

            // prev bài
            prevBtn.onclick = function() {
                if(_this.isRandom) {
                    _this.randomSong()
                } else {
                    _this.preSong();
                }
                _this.render()
                setTimeout(function() {audio.play()}, 2000)
            }

            // repeat Bài
            repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat
                repeatBtn.classList.toggle('active', _this.isRepeat)
            }

            //radom Bài
            radBtn.onclick = function() {
                _this.isRandom = !_this.isRandom
                radBtn.classList.toggle('active', _this.isRandom)
            }

            // Lắng nghe hành vi click vào playList
            playList.onclick = function(e) {
                //songNode trả về thẻ <class = song> không chứa <class = active> gần nhất với phần tử được click vào, nếu không có thì sẽ trả về Null
                const songNode = e.target.closest('.song:not(.active)')
                console.log(songNode)
                //xử lý khi click vào song
                if(e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                    _this.currentIndex = Number(songNode.dataset.index) // gán currentIndex = với Atrribute dataset
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    
                }
            }


      
        },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },


    loadCurrentSong: function() {
        header.textContent = this.currentSong.name,
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    preSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex) // chạy đến khi nào ko thỏa điều kiện nữa => newIndex >< currentIndex

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    repeatSong : function() {
        this.currentIndex += 0
        this.loadCurrentSong()
    },

    start: function() {
       
        this.render()

        this.defineProperties()

        this.loadCurrentSong()

        this.handleEvents()

     },


    
}

app.start()

console.log(audio)