export const systemClassMenu = `
<style>
                        @font-face {
                        font-family: 'FontAwesome';
                        src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.eot');
                        src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.eot?#iefix')
                                format('embedded-opentype'),
                            url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.woff')
                                format('woff'),
                            url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.ttf')
                                format('truetype'),
                            url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.svg?#fontawesomeregular')
                                format('svg');
                        font-weight: normal;
                        font-style: normal;
                    }
                    .systemclass_menu {
                        list-style: none;
                            margin: 0px;
    padding: 0px;
        outline: none;
                    }
                    .systemclass_menu-hidden {
                        display: none;
                    }
                    .systemclass_menu-collapse {
                        overflow: hidden;
                        transition: height 0.3s ease-out;
                    }
                    .systemclass_menu-item-group-list {
                        margin: 0;
                        padding: 0;
                    }
                    .systemclass_menu-item-group-title {
                        color: #999;
                        line-height: 1.5;
                        
                        border-bottom: 1px solid #dedede;
                    }
                    
                    .systemclass_menu-item-selected {
                        background-color: #eaf8fe;
                        transform: translateZ(0);
                    }
                    .systemclass_menu-submenu-selected {
                        background-color: #eaf8fe;
                    }
                    .systemclass_menu > li.systemclass_menu-submenu {
                        padding: 0;
                    }
                    
                    .systemclass_menu-item,
                    .systemclass_menu-submenu-title {
                        margin: 0;
                        position: relative;
                        display: block;
                        padding: 0px;
                        white-space: nowrap;
                    }
                    .systemclass_menu-item.systemclass_menu-item-disabled,
                    .systemclass_menu-submenu-title.systemclass_menu-item-disabled,
                    .systemclass_menu-item.systemclass_menu-submenu-disabled,
                    .systemclass_menu-submenu-title.systemclass_menu-submenu-disabled {
                        color: #777 !important;
                    }
                    .systemclass_menu > .systemclass_menu-item-divider {
                        height: 1px;
                        margin: 1px 0;
                        overflow: hidden;
                        padding: 0;
                        line-height: 0;
                        background-color: #e5e5e5;
                    }
                    .systemclass_menu-submenu-popup {
                        position: absolute;
                    }
                    .systemclass_menu-submenu-popup .submenu-title-wrapper {
                        padding-right: 20px;
                    }
                    
                    .systemclass_menu .systemclass_menu-submenu-title .anticon,
                    .systemclass_menu .systemclass_menu-item .anticon {
                        width: 14px;
                        height: 14px;
                        
                        top: -1px;
                    }
                    .systemclass_menu-horizontal {
                        border: none;
                        box-shadow: none;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .systemclass_menu-horizontal > .systemclass_menu-item,
                    .systemclass_menu-horizontal
                        > .systemclass_menu-submenu
                        > .systemclass_menu-submenu-title {
                        
                    }
                    .systemclass_menu-horizontal > .systemclass_menu-submenu,
                    .systemclass_menu-horizontal > .systemclass_menu-item {
                        
                        display: inline-block;
                        vertical-align: bottom;
                    }
                    
                    .systemclass_menu-horizontal:after {
                        content: ' ';
                        display: block;
                        height: 0;
                        clear: both;
                    }
                    
                    .systemclass_menu-vertical .systemclass_menu-submenu-arrow,
                    .systemclass_menu-vertical-left
                        .systemclass_menu-submenu-arrow,
                    .systemclass_menu-vertical-right
                        .systemclass_menu-submenu-arrow,
                    .systemclass_menu-inline .systemclass_menu-submenu-arrow {
                        display: inline-block;
                        font: normal normal normal 14px/1 FontAwesome;
                        font-size: inherit;
                        vertical-align: baseline;
                        text-align: center;
                        text-transform: none;
                        text-rendering: auto;
                        position: absolute;
                        right: 16px;
                        line-height: 1.5em;
                    }
                    .systemclass_menu-vertical
                        .systemclass_menu-submenu-arrow:before,
                    .systemclass_menu-vertical-left
                        .systemclass_menu-submenu-arrow:before,
                    .systemclass_menu-vertical-right
                        .systemclass_menu-submenu-arrow:before,
                    .systemclass_menu-inline
                        .systemclass_menu-submenu-arrow:before {
                        content: '\f0da';
                    }
                    .systemclass_menu-inline .systemclass_menu-submenu-arrow {
                        transform: rotate(90deg);
                        transition: transform 0.3s;
                    }
                    .systemclass_menu-inline
                        .systemclass_menu-submenu-open
                        > .systemclass_menu-submenu-title
                        .systemclass_menu-submenu-arrow {
                        transform: rotate(-90deg);
                    }

                    .systemclass_menu-sub.systemclass_menu-inline {
                        padding: 0;
                        border: none;
                        border-radius: 0;
                        box-shadow: none;
                    }
                    .systemclass_menu-sub.systemclass_menu-inline
                        > .systemclass_menu-item,
                    .systemclass_menu-sub.systemclass_menu-inline
                        > .systemclass_menu-submenu
                        > .systemclass_menu-submenu-title {
                        
                        padding: 0;
                    }
                    .systemclass_menu-open-slide-up-enter,
                    .systemclass_menu-open-slide-up-appear {
                        animation-duration: 0.3s;
                        animation-fill-mode: both;
                        transform-origin: 0 0;
                        opacity: 0;
                        animation-timing-function: cubic-bezier(
                            0.08,
                            0.82,
                            0.17,
                            1
                        );
                        animation-play-state: paused;
                    }
                    .systemclass_menu-open-slide-up-leave {
                        animation-duration: 0.3s;
                        animation-fill-mode: both;
                        transform-origin: 0 0;
                        opacity: 1;
                        animation-timing-function: cubic-bezier(
                            0.6,
                            0.04,
                            0.98,
                            0.34
                        );
                        animation-play-state: paused;
                    }
                    .systemclass_menu-open-slide-up-enter.systemclass_menu-open-slide-up-enter-active,
                    .systemclass_menu-open-slide-up-appear.systemclass_menu-open-slide-up-appear-active {
                        animation-name: systemclassMenuOpenSlideUpIn;
                        animation-play-state: running;
                    }
                    .systemclass_menu-open-slide-up-leave.systemclass_menu-open-slide-up-leave-active {
                        animation-name: systemclassMenuOpenSlideUpOut;
                        animation-play-state: running;
                    }
                    @keyframes systemclassMenuOpenSlideUpIn {
                        0% {
                            opacity: 0;
                            transform-origin: 0% 0%;
                            transform: scaleY(0);
                        }
                        100% {
                            opacity: 1;
                            transform-origin: 0% 0%;
                            transform: scaleY(1);
                        }
                    }
                    @keyframes systemclassMenuOpenSlideUpOut {
                        0% {
                            opacity: 1;
                            transform-origin: 0% 0%;
                            transform: scaleY(1);
                        }
                        100% {
                            opacity: 0;
                            transform-origin: 0% 0%;
                            transform: scaleY(0);
                        }
                    }
                    .systemclass_menu-open-zoom-enter,
                    .systemclass_menu-open-zoom-appear {
                        opacity: 0;
                        animation-duration: 0.3s;
                        animation-fill-mode: both;
                        transform-origin: 0 0;
                        animation-timing-function: cubic-bezier(
                            0.08,
                            0.82,
                            0.17,
                            1
                        );
                        animation-play-state: paused;
                    }
                    .systemclass_menu-open-zoom-leave {
                        animation-duration: 0.3s;
                        animation-fill-mode: both;
                        transform-origin: 0 0;
                        animation-timing-function: cubic-bezier(
                            0.6,
                            0.04,
                            0.98,
                            0.34
                        );
                        animation-play-state: paused;
                    }
                    .systemclass_menu-open-zoom-enter.systemclass_menu-open-zoom-enter-active,
                    .systemclass_menu-open-zoom-appear.systemclass_menu-open-zoom-appear-active {
                        animation-name: systemclassMenuOpenZoomIn;
                        animation-play-state: running;
                    }
                    .systemclass_menu-open-zoom-leave.systemclass_menu-open-zoom-leave-active {
                        animation-name: systemclassMenuOpenZoomOut;
                        animation-play-state: running;
                    }
                    @keyframes systemclassMenuOpenZoomIn {
                        0% {
                            opacity: 0;
                            transform: scale(0, 0);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1, 1);
                        }
                    }
                    @keyframes systemclassMenuOpenZoomOut {
                        0% {
                            transform: scale(1, 1);
                        }
                        100% {
                            opacity: 0;
                            transform: scale(0, 0);
                        }
                    }
                    </style>
`
export const systemClassGallery = `
<style>
.image-gallery-icon {
  color: #fff;
  transition: all .2s ease-out;
  appearance: none;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  outline: none;
  position: absolute;
  z-index: 4;
  filter: drop-shadow(0 2px 2px #1a1a1a); }
  @media (min-width: 768px) {
    .image-gallery-icon:hover {
      color: #337ab7; }
      .image-gallery-icon:hover .image-gallery-svg {
        transform: scale(1.1); } }
  .image-gallery-icon:focus {
    outline: 2px solid #337ab7; }

.image-gallery-using-mouse .image-gallery-icon:focus {
  outline: none; }

.image-gallery-fullscreen-button,
.image-gallery-play-button {
  bottom: 0;
  padding: 20px; }
  .image-gallery-fullscreen-button .image-gallery-svg,
  .image-gallery-play-button .image-gallery-svg {
    height: 36px;
    width: 36px; }
  @media (max-width: 768px) {
    .image-gallery-fullscreen-button,
    .image-gallery-play-button {
      padding: 15px; }
      .image-gallery-fullscreen-button .image-gallery-svg,
      .image-gallery-play-button .image-gallery-svg {
        height: 24px;
        width: 24px; } }
  @media (max-width: 480px) {
    .image-gallery-fullscreen-button,
    .image-gallery-play-button {
      padding: 10px; }
      .image-gallery-fullscreen-button .image-gallery-svg,
      .image-gallery-play-button .image-gallery-svg {
        height: 16px;
        width: 16px; } }

.image-gallery-fullscreen-button {
  right: 0; }

.image-gallery-play-button {
  left: 0; }

.image-gallery-left-nav,
.image-gallery-right-nav {
  padding: 50px 10px;
  top: 50%;
  transform: translateY(-50%); }
  .image-gallery-left-nav .image-gallery-svg,
  .image-gallery-right-nav .image-gallery-svg {
    height: 120px;
    width: 60px; }
  @media (max-width: 768px) {
    .image-gallery-left-nav .image-gallery-svg,
    .image-gallery-right-nav .image-gallery-svg {
      height: 72px;
      width: 36px; } }
  @media (max-width: 480px) {
    .image-gallery-left-nav .image-gallery-svg,
    .image-gallery-right-nav .image-gallery-svg {
      height: 48px;
      width: 24px; } }
  .image-gallery-left-nav[disabled],
  .image-gallery-right-nav[disabled] {
    cursor: disabled;
    opacity: .6;
    pointer-events: none; }

.image-gallery-left-nav {
  left: 0; }

.image-gallery-right-nav {
  right: 0; }

.image-gallery {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  position: relative; }
  .image-gallery.fullscreen-modal {
    background: #000;
    bottom: 0;
    height: 100%;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 5; }
    .image-gallery.fullscreen-modal .image-gallery-content {
      top: 50%;
      transform: translateY(-50%); }

.image-gallery-content {
  position: relative;
  line-height: 0;
  top: 0; }
  .image-gallery-content.fullscreen {
    background: #000; }
  .image-gallery-content .image-gallery-slide .image-gallery-image {
    max-height: calc(100vh - 80px); }
  .image-gallery-content.left .image-gallery-slide .image-gallery-image, .image-gallery-content.right .image-gallery-slide .image-gallery-image {
    max-height: 100vh; }

.image-gallery-slide-wrapper {
  position: relative; }
  .image-gallery-slide-wrapper.left, .image-gallery-slide-wrapper.right {
    display: inline-block;
    width: calc(100% - 110px); }
    @media (max-width: 768px) {
      .image-gallery-slide-wrapper.left, .image-gallery-slide-wrapper.right {
        width: calc(100% - 87px); } }
  .image-gallery-slide-wrapper.image-gallery-rtl {
    direction: rtl; }

.image-gallery-slides {
  line-height: 0;
  overflow: hidden;
  position: relative;
  white-space: nowrap;
  text-align: center; }

.image-gallery-slide {
  left: 0;
  position: absolute;
  top: 0;
  width: 100%; }
  .image-gallery-slide.center {
    position: relative; }
  .image-gallery-slide .image-gallery-image {
    width: 100%;
    object-fit: contain; }
  .image-gallery-slide .image-gallery-description {
    background: rgba(0, 0, 0, 0.4);
    bottom: 70px;
    color: #fff;
    left: 0;
    line-height: 1;
    padding: 10px 20px;
    position: absolute;
    white-space: normal; }
    @media (max-width: 768px) {
      .image-gallery-slide .image-gallery-description {
        bottom: 45px;
        font-size: .8em;
        padding: 8px 15px; } }

.image-gallery-bullets {
  bottom: 20px;
  left: 0;
  margin: 0 auto;
  position: absolute;
  right: 0;
  width: 80%;
  z-index: 4; }
  .image-gallery-bullets .image-gallery-bullets-container {
    margin: 0;
    padding: 0;
    text-align: center; }
  .image-gallery-bullets .image-gallery-bullet {
    appearance: none;
    background-color: transparent;
    border: 1px solid #fff;
    border-radius: 50%;
    box-shadow: 0 1px 0 #1a1a1a;
    cursor: pointer;
    display: inline-block;
    margin: 0 5px;
    outline: none;
    padding: 5px;
    transition: background .2s ease-out; }
    @media (max-width: 768px) {
      .image-gallery-bullets .image-gallery-bullet {
        margin: 0 3px;
        padding: 3px; } }
    @media (max-width: 480px) {
      .image-gallery-bullets .image-gallery-bullet {
        padding: 2.7px; } }
    .image-gallery-bullets .image-gallery-bullet:focus, .image-gallery-bullets .image-gallery-bullet:hover {
      background: #337ab7;
      transform: scale(1.1); }
    .image-gallery-bullets .image-gallery-bullet.active {
      background: #fff; }

.image-gallery-thumbnails-wrapper {
  position: relative; }
  .image-gallery-thumbnails-wrapper.thumbnails-wrapper-rtl {
    direction: rtl; }
  .image-gallery-thumbnails-wrapper.left, .image-gallery-thumbnails-wrapper.right {
    display: inline-block;
    vertical-align: top;
    width: 100px; }
    @media (max-width: 768px) {
      .image-gallery-thumbnails-wrapper.left, .image-gallery-thumbnails-wrapper.right {
        width: 81px; } }
    .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails, .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails {
      height: 100%;
      width: 100%;
      left: 0;
      padding: 0;
      position: absolute;
      top: 0; }
      .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails .image-gallery-thumbnail, .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails .image-gallery-thumbnail {
        display: block;
        margin-right: 0;
        padding: 0; }
        .image-gallery-thumbnails-wrapper.left .image-gallery-thumbnails .image-gallery-thumbnail + .image-gallery-thumbnail, .image-gallery-thumbnails-wrapper.right .image-gallery-thumbnails .image-gallery-thumbnail + .image-gallery-thumbnail {
          margin-left: 0;
          margin-top: 2px; }
  .image-gallery-thumbnails-wrapper.left, .image-gallery-thumbnails-wrapper.right {
    margin: 0 5px; }
    @media (max-width: 768px) {
      .image-gallery-thumbnails-wrapper.left, .image-gallery-thumbnails-wrapper.right {
        margin: 0 3px; } }

.image-gallery-thumbnails {
  overflow: hidden;
  padding: 5px 0; }
  @media (max-width: 768px) {
    .image-gallery-thumbnails {
      padding: 3px 0; } }
  .image-gallery-thumbnails .image-gallery-thumbnails-container {
    cursor: pointer;
    text-align: center;
    transition: transform .45s ease-out;
    white-space: nowrap; }

.image-gallery-thumbnail {
  display: inline-block;
  border: 4px solid transparent;
  transition: border .3s ease-out;
  width: 100px;
  background: transparent;
  padding: 0; }
  @media (max-width: 768px) {
    .image-gallery-thumbnail {
      border: 3px solid transparent;
      width: 81px; } }
  .image-gallery-thumbnail + .image-gallery-thumbnail {
    margin-left: 2px; }
  .image-gallery-thumbnail .image-gallery-thumbnail-inner {
    position: relative; }
  .image-gallery-thumbnail .image-gallery-thumbnail-image {
    vertical-align: middle;
    width: 100%;
    line-height: 0; }
  .image-gallery-thumbnail.active, .image-gallery-thumbnail:hover, .image-gallery-thumbnail:focus {
    outline: none;
    border: 4px solid #337ab7; }
    @media (max-width: 768px) {
      .image-gallery-thumbnail.active, .image-gallery-thumbnail:hover, .image-gallery-thumbnail:focus {
        border: 3px solid #337ab7; } }

.image-gallery-thumbnail-label {
  box-sizing: border-box;
  color: white;
  font-size: 1em;
  left: 0;
  line-height: 1em;
  padding: 5%;
  position: absolute;
  top: 50%;
  text-shadow: 1px 1px 0 black;
  transform: translateY(-50%);
  white-space: normal;
  width: 100%; }
  @media (max-width: 768px) {
    .image-gallery-thumbnail-label {
      font-size: .8em;
      line-height: .8em; } }

.image-gallery-index {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  line-height: 1;
  padding: 10px 20px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 4; }
  @media (max-width: 768px) {
    .image-gallery-index {
      font-size: .8em;
      padding: 5px 10px; } }

</style>

`
